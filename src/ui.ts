interface SliderConfig {
    key: keyof TransformControls;
    label: string;
    min: number;
    max: number;
    step: number;
}

interface MeshSelectOption {
    label: string;
    value: number;
}

interface MeshSelectPanelConfig {
    options: MeshSelectOption[];
    selectedValue?: number;
    onChange?: (value: number) => void;
    mountId?: string;
    title?: string;
}


interface TransformControls {
    rotDeg: number;
    rotAxisX: number;
    rotAxisY: number;
    rotAxisZ: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    translateX: number;
    translateY: number;
    translateZ: number;
}

interface MeshListScene {
    meshes: Array<{ name?: string }>;
}

const controls: TransformControls = {
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

const sliderBindings: Partial<Record<keyof TransformControls, { input: HTMLInputElement; valueText: HTMLElement }>> = {};

function createTransformControlPanel(): HTMLElement {
    const panel = document.getElementById("transform-controls") as HTMLDivElement | null;
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

function createMeshSelectPanel(config: MeshSelectPanelConfig): HTMLElement {
    const panel = document.getElementById(config.mountId ?? "mesh-selector") as HTMLDivElement | null;
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

    const rowByValue = new Map<number, HTMLDivElement>();

    const setSelected = (value: number): void => {
        rowByValue.forEach((row, key) => {
            if (key === value) {
                row.style.background = "#d1d5db";
                row.style.color = "#111";
            } else {
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




function addSlider(parent: HTMLElement, config: SliderConfig): void {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "8px";

    const label = document.createElement("label");
    label.style.display = "flex";
    label.style.justifyContent = "space-between";
    label.style.marginBottom = "2px";

    const caption = document.createElement("span");
    caption.textContent = config.label;

    const value = document.createElement("span");
    value.textContent = controls[config.key].toFixed(2);

    label.appendChild(caption);
    label.appendChild(value);

    const input = document.createElement("input");
    input.type = "range";
    input.min = String(config.min);
    input.max = String(config.max);
    input.step = String(config.step);
    input.value = String(controls[config.key]);
    input.style.width = "100%";
    input.addEventListener("input", () => {
        controls[config.key] = Number(input.value);
        value.textContent = controls[config.key].toFixed(2);
    });

    sliderBindings[config.key] = {
        input,
        valueText: value,
    };

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    parent.appendChild(wrapper);
}

function syncControlsToUi(): void {
    (Object.keys(sliderBindings) as Array<keyof TransformControls>).forEach((key) => {
        const binding = sliderBindings[key];
        if (!binding) {
            return;
        }
        binding.input.value = String(controls[key]);
        binding.valueText.textContent = controls[key].toFixed(2);
    });
}



function addSliders(parent: HTMLElement, configs: SliderConfig[]): void {
    configs.forEach((config) => addSlider(parent, config));
}


export {
    controls,
    createTransformControlPanel,
    createMeshSelectPanel,
    syncControlsToUi,
    addSlider,
    addSliders
};