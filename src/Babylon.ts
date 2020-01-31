export class Mesh {
    name: string
    position: number[]
    positions: number[]
    indices: number[]
    uvs: number
}

export class Scene {
    meshes: Mesh[]
}

