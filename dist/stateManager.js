import { getCameraState as getCameraFromModule, setCameraState as setCameraInModule } from "./camera.js";
import { getMeshTransformState as getMeshTransformFromModule, setMeshTransformState as setMeshTransformInModule } from "./transform.js";
export const uiState = {
    selectedMesh: null,
};
const lightingState = {
    lightDirection: { x: 0.4, y: 0.8, z: 0.6 },
    ambientStrength: 0.15,
};
const renderState = {
    drawWireframe: true,
};
export function setUIState(selectedMesh) {
    uiState.selectedMesh = selectedMesh;
}
export function getUIState() {
    return uiState;
}
export function setCameraState(newState) {
    setCameraInModule(newState);
}
export function getCameraState() {
    return getCameraFromModule();
}
export function setMeshTransformState(meshName, newState) {
    setMeshTransformInModule(meshName, newState);
}
export function getMeshTransformState(meshName) {
    return getMeshTransformFromModule(meshName);
}
export function setLightingState(newState) {
    lightingState.lightDirection = { ...newState.lightDirection };
    lightingState.ambientStrength = newState.ambientStrength;
}
export function getLightingState() {
    return lightingState;
}
export function setRenderState(newState) {
    renderState.drawWireframe = newState.drawWireframe;
}
export function getRenderState() {
    return renderState;
}
