import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const MODELS_DIR = path.join(ROOT, "dist/assets/models");
const OUTPUT_FILE = path.join(ROOT, "src/loadedObj.ts");
function parseOBJ(name, text) {
    const vertices = [];
    const triangleIndicesData = [];
    for (const line of text.split("\n")) {
        const t = line.trim();
        if (!t)
            continue;
        const p = t.split(/\s+/);
        if (p[0] === "v") {
            vertices.push({ x: +p[1], y: +p[2], z: +p[3] });
        }
        if (p[0] === "f") {
            triangleIndicesData.push([
                Number(p[1].split("/")[0]) - 1,
                Number(p[2].split("/")[0]) - 1,
                Number(p[3].split("/")[0]) - 1
            ]);
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
function generate(meshes) {
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
fs.writeFileSync(OUTPUT_FILE, generate(meshes));
