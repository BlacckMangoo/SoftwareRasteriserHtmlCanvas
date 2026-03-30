
interface Point {
    x: number;
    y: number;
    z: number;
}

interface Mesh {
    name    : string;
    vertices: Point[];
    triangleIndicesData: Array<[number, number, number]>;
}


const cubeVertexData : Point[] = [
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


const TriangleVertexData: Point[] = [
    { x: 0, y: 0.5, z: 0 },
    { x: -0.5, y: -0.5, z: 0 },
    { x: 0.5, y: -0.5, z: 0 }
];

const quadVertexData: Point[] = [
    { x: -0.5, y: 0.5, z: 0 },
    { x: -0.5, y: -0.5, z: 0 },
    { x: 0.5, y: -0.5, z: 0 },
    { x: 0.5, y: 0.5, z: 0 }
];

const quadMesh : Mesh = {
    name : "quadA",
    vertices: quadVertexData,
    triangleIndicesData: [
        [0, 1, 2],
        [0, 2, 3]
    ]
};

const cubeMESH: Mesh = {
    name : "cubeA",
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

const triangleMESH: Mesh = {
    name : "triangleA",
    vertices: TriangleVertexData,
    triangleIndicesData: [
        [0, 1, 2]
    ]
};


export { cubeMESH, triangleMESH, quadMesh, Mesh, Point };