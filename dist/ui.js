const transformControls = {
    rotDeg: 0,
    rotAxisX: 0,
    rotAxisY: 1,
    rotAxisZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    translateX: 0,
    translateY: 0,
    translateZ: 0,
};
const cameraControls = {
    camX: 0,
    camY: 0,
    camZ: 5,
    camFov: 45,
    camNear: 0.1,
    camFar: 1000,
};
function createTransformControlPanel() {
    const panel = document.getElementById("transform-controls");
    if (!panel) {
        throw new Error("Controls container with id 'transform-controls' was not found.");
    }
    panel.style.position = "fixed";
    panel.style.top = "12px";
    panel.style.left = "12px";
    panel.style.width = "320px";
    panel.style.padding = "10px";
    panel.style.border = "1px solid #999";
    panel.style.background = "rgba(255, 255, 255, 0.92)";
    panel.style.borderRadius = "8px";
    panel.style.fontFamily = "sans-serif";
    panel.style.zIndex = "10";
    const title = document.createElement("h3");
    title.textContent = "Transform Controls";
    title.style.margin = "0 0 10px 0";
    panel.appendChild(title);
    return panel;
}
function createCameraControlPanel() {
    let panel = document.getElementById("camera-controls");
    if (!panel) {
        panel = document.createElement("div");
        panel.id = "camera-controls";
        document.body.appendChild(panel);
    }
    const transformPanel = document.getElementById("transform-controls");
    const transformRect = transformPanel?.getBoundingClientRect();
    const top = transformRect ? transformRect.bottom + 12 : 12;
    const left = transformRect ? transformRect.left : 12;
    panel.innerHTML = "";
    panel.style.position = "fixed";
    panel.style.top = `${top}px`;
    panel.style.left = `${left}px`;
    panel.style.width = "320px";
    panel.style.padding = "10px";
    panel.style.border = "1px solid #999";
    panel.style.background = "rgba(255, 255, 255, 0.92)";
    panel.style.borderRadius = "8px";
    panel.style.fontFamily = "sans-serif";
    panel.style.zIndex = "10";
    const title = document.createElement("h3");
    title.textContent = "Camera Controls";
    title.style.margin = "0 0 10px 0";
    panel.appendChild(title);
    return panel;
}
function createMeshSelectPanel(config) {
    const panel = document.getElementById(config.mountId ?? "mesh-selector");
    if (!panel) {
        throw new Error("Mesh selector container with id 'mesh-selector' was not found.");
    }
    panel.innerHTML = "";
    panel.style.position = "fixed";
    panel.style.bottom = "12px";
    panel.style.left = "12px";
    panel.style.width = "220px";
    panel.style.padding = "10px";
    panel.style.border = "1px solid #999";
    panel.style.background = "rgba(255, 255, 255, 0.92)";
    panel.style.borderRadius = "8px";
    panel.style.fontFamily = "sans-serif";
    panel.style.zIndex = "10";
    const treeRoot = document.createElement("ul");
    treeRoot.style.listStyle = "none";
    treeRoot.style.padding = "0";
    treeRoot.style.margin = "0";
    const sceneItem = document.createElement("li");
    sceneItem.textContent = "Scene";
    sceneItem.style.fontWeight = "700";
    sceneItem.style.marginBottom = "4px";
    const meshList = document.createElement("ul");
    meshList.style.listStyle = "none";
    meshList.style.margin = "0";
    meshList.style.paddingLeft = "14px";
    const rowByValue = new Map();
    const setSelected = (value) => {
        rowByValue.forEach((row, key) => {
            if (key === value) {
                row.style.background = "#d1d5db";
                row.style.color = "#111";
            }
            else {
                row.style.background = "transparent";
                row.style.color = "#222";
            }
        });
    };
    config.options.forEach((option) => {
        const item = document.createElement("li");
        const row = document.createElement("div");
        row.textContent = option.label;
        row.style.padding = "4px 6px";
        row.style.borderRadius = "4px";
        row.style.cursor = "pointer";
        row.style.userSelect = "none";
        row.style.color = "#222";
        row.addEventListener("click", () => {
            setSelected(option.value);
            config.onChange?.(option.value);
        });
        rowByValue.set(option.value, row);
        item.appendChild(row);
        meshList.appendChild(item);
    });
    sceneItem.appendChild(meshList);
    treeRoot.appendChild(sceneItem);
    panel.appendChild(treeRoot);
    if (config.selectedValue !== undefined) {
        setSelected(config.selectedValue);
    }
    return panel;
}
function addSlider(parent, config, state) {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "8px";
    const label = document.createElement("label");
    label.style.display = "flex";
    label.style.justifyContent = "space-between";
    label.style.marginBottom = "2px";
    const caption = document.createElement("span");
    caption.textContent = config.label;
    const value = document.createElement("span");
    value.textContent = Number(state[config.key]).toFixed(2);
    label.appendChild(caption);
    label.appendChild(value);
    const input = document.createElement("input");
    input.type = "range";
    input.min = String(config.min);
    input.max = String(config.max);
    input.step = String(config.step);
    input.value = String(state[config.key]);
    input.style.width = "100%";
    input.addEventListener("input", () => {
        state[config.key] = Number(input.value);
        value.textContent = Number(state[config.key]).toFixed(2);
    });
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    parent.appendChild(wrapper);
}
function addTransformSliders(parent, configs) {
    configs.forEach((config) => addSlider(parent, config, transformControls));
}
function addCameraSliders(parent, configs) {
    configs.forEach((config) => addSlider(parent, config, cameraControls));
}
export { transformControls, cameraControls, createTransformControlPanel, createCameraControlPanel, createMeshSelectPanel, addTransformSliders, addCameraSliders };
