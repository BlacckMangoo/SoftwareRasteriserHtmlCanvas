
interface Point {
    x: number;
    y: number;
    z: number;
    u? : number;
    v? : number;
}

interface Mesh {
    name    : string;
    vertices: Point[];
    triangleIndicesData: Array<[number, number, number]>;
    uvData?: Array<[number, number]>;
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
    { x: -0.5, y: 0.5, z: 0 },
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
    name : "quad",
    vertices: quadVertexData,
    triangleIndicesData: [
        [0, 1, 2],
        [0, 2, 3]
    ],
    uvData: [
        [0, 1],
        [0, 0],
        [1, 0],
        [1, 1]
    ]
};

const cubeMESH: Mesh = {
    name : "cube",
    vertices: cubeVertexData,
    triangleIndicesData: [
        [0, 1, 2],
        [0, 2, 3],
        [4, 6, 5],
        [4, 7, 6],
        [8, 9, 10],
        [8, 10, 11],
        [12, 14, 13],
        [12, 15, 14],
        [16, 17, 18],
        [16, 18, 19],
        [20, 22, 21],
        [20, 23, 22]
    ],
    uvData: [
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
        [0, 0]
    ]
};

const triangleMESH: Mesh = {
    name : "triangle",
    vertices: TriangleVertexData,
    triangleIndicesData: [
        [0, 1, 2]
    ],
    uvData: [
        [0, 1],
        [1, 1],
        [1, 0]  
    ]
};


export { cubeMESH, triangleMESH, quadMesh, Mesh, Point };