import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import jpeg from "jpeg-js";
const ROOT = process.cwd();
const MODELS_DIR = path.join(ROOT, "dist/assets/models");
const OUTPUT_FILE = path.join(ROOT, "src/loadedObj.ts");
function resolveObjIndex(indexText, listLength) {
    if (!indexText) {
        return -1;
    }
    const parsed = Number(indexText);
    if (!Number.isFinite(parsed) || parsed === 0) {
        return -1;
    }
    if (parsed > 0) {
        return parsed - 1;
    }
    return listLength + parsed;
}
function parseFaceToken(faceToken, positionCount, uvCount) {
    const [positionPart, uvPart, thirdPart] = faceToken.split("/");
    const positionIndex = resolveObjIndex(positionPart, positionCount);
    let uvIndex = resolveObjIndex(uvPart, uvCount);
    // Some exports write UVs as v//uv. If vt is missing but third slot resolves to a valid vt index, use it.
    if (uvIndex < 0 && uvCount > 0) {
        uvIndex = resolveObjIndex(thirdPart, uvCount);
    }
    return { positionIndex, uvIndex };
}
function parseOBJ(name, text) {
    const rawPositions = [];
    const rawUvs = [];
    const vertices = [];
    const triangleIndicesData = [];
    const vertexMap = new Map();
    const getOrCreateVertexIndex = (positionIndex, uvIndex) => {
        if (positionIndex < 0 || positionIndex >= rawPositions.length) {
            throw new Error(`Invalid vertex index ${positionIndex + 1} in '${name}'`);
        }
        const key = `${positionIndex}/${uvIndex}`;
        const existing = vertexMap.get(key);
        if (existing !== undefined) {
            return existing;
        }
        const position = rawPositions[positionIndex];
        const uv = rawUvs[uvIndex] ?? { u: 0, v: 0 };
        const newIndex = vertices.length;
        vertices.push({
            pos: { x: position.x, y: position.y, z: position.z },
            u: uv.u,
            v: uv.v,
        });
        vertexMap.set(key, newIndex);
        return newIndex;
    };
    for (const line of text.split("\n")) {
        const t = line.trim();
        if (!t || t.startsWith("#"))
            continue;
        const p = t.split(/\s+/);
        if (p[0] === "v") {
            rawPositions.push({
                x: Number(p[1]),
                y: Number(p[2]),
                z: Number(p[3]),
            });
        }
        if (p[0] === "vt") {
            rawUvs.push({
                u: Number(p[1]),
                v: Number(p[2]),
            });
        }
        if (p[0] === "f") {
            const faceIndices = p.slice(1).map((faceToken) => {
                const { positionIndex, uvIndex } = parseFaceToken(faceToken, rawPositions.length, rawUvs.length);
                return getOrCreateVertexIndex(positionIndex, uvIndex);
            });
            if (faceIndices.length < 3) {
                continue;
            }
            // Triangulate n-gons using a fan around the first face vertex.
            for (let i = 1; i < faceIndices.length - 1; i++) {
                triangleIndicesData.push([
                    faceIndices[0],
                    faceIndices[i],
                    faceIndices[i + 1],
                ]);
            }
        }
    }
    return { name, vertices, triangleIndicesData };
}
function exportName(file) {
    const base = path.basename(file, ".obj").replace(/[^a-zA-Z0-9_]/g, "_");
    return /^\d/.test(base) ? `_${base}` : base;
}
function stringifyTS(obj) {
    return JSON.stringify(obj, null, 2)
        .replace(/"([^"]+)":/g, "$1:");
}
function generateObj(meshes) {
    return [
        `import type { Mesh } from "./primitiveData";`,
        "",
        ...meshes.map(m => `export const ${m.exportName}: Mesh = ${stringifyTS(m.mesh)};`),
        "",
        `export const allLoadedObjs: Mesh[] = [${meshes.map(m => m.exportName).join(", ")}];`,
        ""
    ].join("\n\n");
}
const meshes = fs.readdirSync(MODELS_DIR)
    .filter(f => f.endsWith(".obj"))
    .sort()
    .map(file => ({
    exportName: exportName(file),
    mesh: parseOBJ(file, fs.readFileSync(path.join(MODELS_DIR, file), "utf-8"))
}));
fs.writeFileSync(OUTPUT_FILE, generateObj(meshes));
// Textures 
const TEXTURES_DIR = path.join(ROOT, "dist/assets/textures");
const OUTPUT_TEXTURES_FILE = path.join(ROOT, "src/loadedTextures.ts");
// we take an HTML Image - > convert into a 1D array of RGBA values - > export as a TS file
// we are using UInt8clamped array , automatically clamps values to [0,255] perfect for RGBA data 
function imageToRGBATexture(fileName, targetWidth = 512, targetHeight = 512, strategy = "Nearest") {
    const filePath = path.join(TEXTURES_DIR, fileName);
    const fileData = fs.readFileSync(filePath);
    const extension = path.extname(fileName).toLowerCase();
    let imageData;
    if (extension === ".png") {
        const decodedPng = PNG.sync.read(fileData);
        imageData = new Uint8ClampedArray(decodedPng.data);
        imageData = downscaleTexture(imageData, decodedPng.width, decodedPng.height, targetWidth, targetHeight, strategy);
    }
    else if (extension === ".jpg" || extension === ".jpeg") {
        const decodedJpeg = jpeg.decode(fileData, { useTArray: true });
        imageData = new Uint8ClampedArray(decodedJpeg.data);
        imageData = downscaleTexture(imageData, decodedJpeg.width, decodedJpeg.height, targetWidth, targetHeight, strategy);
    }
    else {
        throw new Error(`Unsupported texture format: ${fileName}`);
    }
    return {
        width: targetWidth,
        height: targetHeight,
        data: Array.from(imageData)
    };
}
function downscaleTexture(texture, originalWidth, originalHeight, targetWidth, targetHeight, strat = "Nearest") {
    const downscaledData = new Uint8ClampedArray(targetWidth * targetHeight * 4);
    const xRatio = originalWidth / targetWidth;
    const yRatio = originalHeight / targetHeight;
    for (let y = 0; y < targetHeight; y++) {
        for (let x = 0; x < targetWidth; x++) {
            const srcX = Math.floor(x * xRatio);
            const srcY = Math.floor(y * yRatio);
            const srcIndex = (srcY * originalWidth + srcX) * 4;
            const dstIndex = (y * targetWidth + x) * 4;
            // Nearest-neighbor downscaling 
            if (strat === "Nearest") {
                downscaledData[dstIndex] = texture[srcIndex]; // R
                downscaledData[dstIndex + 1] = texture[srcIndex + 1]; // G
                downscaledData[dstIndex + 2] = texture[srcIndex + 2]; // B
                downscaledData[dstIndex + 3] = texture[srcIndex + 3]; // A
            }
            if (strat == "BiLinearFiltering") {
                // Bilinear filtering downscaling 
                const srcX2 = Math.min(srcX + 1, originalWidth - 1);
                const srcY2 = Math.min(srcY + 1, originalHeight - 1);
                const xLerp = (x * xRatio) - srcX;
                const yLerp = (y * yRatio) - srcY;
                for (let i = 0; i < 4; i++) {
                    // RGBA channels
                    const topLeft = texture[srcIndex + i];
                    const topRight = texture[(srcY * originalWidth + srcX2) * 4 + i];
                    const bottomLeft = texture[(srcY2 * originalWidth + srcX) * 4 + i];
                    const bottomRight = texture[(srcY2 * originalWidth + srcX2) * 4 + i];
                    const top = topLeft + (topRight - topLeft) * xLerp;
                    const bottom = bottomLeft + (bottomRight - bottomLeft) * xLerp;
                    downscaledData[dstIndex + i] = Math.round(top + (bottom - top) * yLerp);
                }
            }
        }
    }
    return downscaledData;
}
function generateTextureTS(textures) {
    return [
        `import type { TextureMap } from "./texture";`,
        "",
        `export const textures: TextureMap = {`,
        ...textures.map(t => `  ${t.exportName}: ${stringifyTS(t.texture)},`),
        `};`
    ].join("\n");
}
const textures = fs.readdirSync(TEXTURES_DIR)
    .filter(f => f.endsWith(".png") || f.endsWith(".jpg"))
    .sort()
    .map(file => ({
    exportName: exportName(file),
    texture: imageToRGBATexture(file, 512, 512, "Nearest")
}));
fs.writeFileSync(OUTPUT_TEXTURES_FILE, generateTextureTS(textures));
