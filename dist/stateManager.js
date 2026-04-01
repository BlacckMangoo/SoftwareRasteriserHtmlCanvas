// UI shouldnt know about the renderer 
//renderer shouldnt know about the UI
// we maintain a global state object that the UI can modify and the renderer can read from.
// THE UI Writes new state to the global state object, and the renderer reads from it every frame to render the scene accordingly.
//Globals 
//cam
const defaultCameraState = {
    position: {
        x: 0,
        y: 0,
        z: 5,
    },
    fov: 60,
    near: 0.1,
    far: 100,
};
export const cameraState = {
    position: { ...defaultCameraState.position },
    fov: defaultCameraState.fov,
    near: defaultCameraState.near,
    far: defaultCameraState.far,
};
export function setCameraState(newState) {
    Object.assign(cameraState, newState);
}
export function getCameraState() {
    return cameraState;
}
export function resetCameraState() {
    cameraState.position = { ...defaultCameraState.position };
    cameraState.fov = defaultCameraState.fov;
    cameraState.near = defaultCameraState.near;
    cameraState.far = defaultCameraState.far;
}
//UI state 
export const uiState = {
    selectedMesh: null,
};
export function setUIState(newState) {
    Object.assign(uiState, newState);
}
export function getUIState() {
    return uiState;
}
function createDefaultTransform() {
    return {
        position: { x: 0, y: 0, z: 0 },
        rotationAxis: { x: 0, y: 1, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        rotationAngle: 0
    };
}
export const meshes = {};
export function ensureMeshStates(meshNames) {
    meshNames.forEach((meshName) => {
        if (!meshes[meshName]) {
            meshes[meshName] = createDefaultTransform();
        }
    });
}
export function syncMeshStates(meshNames) {
    const active = new Set(meshNames);
    Object.keys(meshes).forEach((meshName) => {
        if (!active.has(meshName)) {
            delete meshes[meshName];
        }
    });
    ensureMeshStates(meshNames);
}
export function setMeshTransformState(meshName, newState) {
    if (!meshes[meshName]) {
        meshes[meshName] = createDefaultTransform();
    }
    Object.assign(meshes[meshName], newState);
}
export function getMeshTransformState(meshName) {
    if (!meshes[meshName]) {
        meshes[meshName] = createDefaultTransform();
    }
    return meshes[meshName];
}
