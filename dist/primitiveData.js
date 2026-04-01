const cubeVertexData = [
    // front face (z = 0.5)
    { x: -0.5, y: -0.5, z: 0.5 },
    { x: 0.5, y: -0.5, z: 0.5 },
    { x: 0.5, y: 0.5, z: 0.5 },
    { x: -0.5, y: 0.5, z: 0.5 },
    // back face (z = -0.5)
    { x: -0.5, y: -0.5, z: -0.5 },
    { x: 0.5, y: -0.5, z: -0.5 },
    { x: 0.5, y: 0.5, z: -0.5 },
    { x: -0.5, y: 0.5, z: -0.5 },
    //side faces
    { x: -0.5, y: -0.5, z: 0.5 },
    { x: -0.5, y: 0.5, z: 0.5 },
    { x: -0.5, y: 0.5, z: -0.5 },
    { x: -0.5, y: -0.5, z: -0.5 },
    { x: 0.5, y: -0.5, z: 0.5 },
    { x: 0.5, y: 0.5, z: 0.5 },
    { x: 0.5, y: 0.5, z: -0.5 },
    { x: 0.5, y: -0.5, z: -0.5 },
    // top face
    { x: -0.5, y: 0.5, z: 0.5 },
    { x: 0.5, y: 0.5, z: 0.5 },
    { x: 0.5, y: 0.5, z: -0.5 },
    { x: -0.5, y: 0.5, z: -0.5 },
    // bottom face
    { x: -0.5, y: -0.5, z: 0.5 },
    { x: 0.5, y: -0.5, z: 0.5 },
    { x: 0.5, y: -0.5, z: -0.5 },
    { x: -0.5, y: -0.5, z: -0.5 },
];
const TriangleVertexData = [
    { x: 0, y: 0.5, z: 0 },
    { x: -0.5, y: -0.5, z: 0 },
    { x: 0.5, y: -0.5, z: 0 }
];
const quadVertexData = [
    { x: -0.5, y: 0.5, z: 0 },
    { x: -0.5, y: -0.5, z: 0 },
    { x: 0.5, y: -0.5, z: 0 },
    { x: 0.5, y: 0.5, z: 0 }
];
const quadMesh = {
    name: "quadA",
    vertices: quadVertexData,
    triangleIndicesData: [
        [0, 1, 2],
        [0, 2, 3]
    ]
};
const cubeMESH = {
    name: "cubeA",
    vertices: cubeVertexData,
    triangleIndicesData: [
        [0, 1, 2],
        [0, 2, 3],
        [4, 5, 6],
        [4, 6, 7],
        [0, 4, 7],
        [0, 7, 3],
        [1, 5, 6],
        [1, 6, 2],
        [3, 7, 6],
        [3, 6, 2],
        [0, 4, 5],
        [0, 5, 1]
    ]
};
const triangleMESH = {
    name: "triangleA",
    vertices: TriangleVertexData,
    triangleIndicesData: [
        [0, 1, 2]
    ]
};
export { cubeMESH, triangleMESH, quadMesh };
