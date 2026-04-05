import type { Camera } from "./math.js";
import type { Mesh } from "./primitiveData.js";

export interface Scene {
	cam: Camera;
	meshes: Mesh[];
	addMesh: (mesh: Mesh) => Mesh;
	setCamera: (camera: Camera) => void;
}

export function createScene(camera: Camera): Scene {
	const scene: Scene = {
		cam: camera,
		meshes: [],
		addMesh: (mesh: Mesh): Mesh => {
			scene.meshes.push(mesh);
			return mesh;
		},
		setCamera: (nextCamera: Camera): void => {
			scene.cam = nextCamera;
		},
	};

	return scene;
}
