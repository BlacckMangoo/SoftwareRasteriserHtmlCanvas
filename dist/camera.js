export function createCam(ar = 1) {
    return {
        position: { x: 0, y: 0, z: 5 },
        lookAt: { x: 0, y: 0, z: 0 },
        up: { x: 0, y: 1, z: 0 },
        far: 100,
        near: 0.1,
        fov: 60,
        ar,
    };
}
export const cameraState = createCam();
export function setCameraState(newState) {
    cameraState.position = newState.position;
    cameraState.lookAt = newState.lookAt;
    cameraState.up = newState.up;
    cameraState.far = newState.far;
    cameraState.near = newState.near;
    cameraState.fov = newState.fov;
    cameraState.ar = newState.ar;
}
export function getCameraState() {
    return cameraState;
}
export function updateCameraLookAt(position) {
    const cameraForward = { x: 0, y: 0, z: -1 };
    return {
        x: position.x + cameraForward.x,
        y: position.y + cameraForward.y,
        z: position.z + cameraForward.z,
    };
}
