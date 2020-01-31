import { Color4, Vector2, Vector3, Matrix } from './math'
import { Scene as BabylonScene, Mesh as BabylonMesh } from './Babylon'

export class Camera {
    Position: Vector3
    Target: Vector3

    constructor() {
        this.Position = Vector3.Zero()
        this.Target = Vector3.Zero()
    }
}

export interface Face {
    A: number
    B: number
    C: number
}

export class Mesh {
    name: string
    Vertices: Vector3[]
    Rotation: Vector3
    Position: Vector3
    Faces: Face[]

    constructor(name: string, verticesCount: number, facesCount: number) {
        this.name = name
        this.Vertices = new Array(verticesCount)
        this.Rotation = Vector3.Zero()
        this.Position = Vector3.Zero()
        this.Faces = new Array(facesCount)
    }
}

export class Device {
    private workingCanvas: HTMLCanvasElement
    private workingWidth: number
    private workingHeight: number
    private workingContext: CanvasRenderingContext2D
    private backbuffer: ImageData
    private depthbuffer: number[];

    constructor(canvas: HTMLCanvasElement) {
        this.workingCanvas = canvas
        this.workingWidth = canvas.width
        this.workingHeight = canvas.height
        this.workingContext = this.workingCanvas.getContext('2d')
        this.depthbuffer = new Array(this.workingWidth * this.workingHeight);
    }

    clear() {
        this.workingContext.clearRect(0, 0, this.workingWidth, this.workingHeight)
        this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight)

        // Clearing depth buffer
        for (var i = 0; i < this.depthbuffer.length; i++) {
            // Max possible value
            this.depthbuffer[i] = 10000000;
        }
    }

    present() {
        this.workingContext.putImageData(this.backbuffer, 0, 0)
    }

    putPixel(x: number, y: number, z: number, color: Color4) {
        const backbufferdata = this.backbuffer.data

        // we use 4 since there are 4 values per pixel
        // we get the row of the pixel by multiplying y and width
        // to ge the index we get the column (x) + row
        const index = ((x >> 0) + (y >> 0) * this.workingWidth)
        var index4: number = index * 4;

        if (this.depthbuffer[index] < z) {
            return; // Discard
        }

        this.depthbuffer[index] = z;

        backbufferdata[index4] = color.r * 255
        backbufferdata[index4 + 1] = color.g * 255
        backbufferdata[index4 + 2] = color.b * 255
        backbufferdata[index4 + 3] = color.a * 255
    }

    // Project takes some 3D coordinates and transform them
    // in 2D coordinates using the transformation matrix
    public project(coord: Vector3, transMat: Matrix): Vector3 {
        // transforming the coordinates
        var point = Vector3.TransformCoordinates(coord, transMat);
        // The transformed coordinates will be based on coordinate system
        // starting on the center of the screen. But drawing on screen normally starts
        // from top left. We then need to transform them again to have x:0, y:0 on top left.
        var x = point.x * this.workingWidth + this.workingWidth / 2.0;
        var y = -point.y * this.workingHeight + this.workingHeight / 2.0;
        return (new Vector3(x, y, point.z));
    }

    // drawPoint calls putPixel but does the clipping operation before
    public drawPoint(point: Vector3, color: Color4 = Color4.YELLOW): void {
        // Clipping what's visible on screen
        if (point.x >= 0 && point.y >= 0 && point.x < this.workingWidth && point.y < this.workingHeight) {
            // Drawing a yellow point
            this.putPixel(point.x, point.y, point.z, color);
        }
    }

    /*
    public _drawLine(point0: Vector2, point1: Vector2): void {
        var dist = point1.subtract(point0).length()

        // If the distance between the 2 points is less than 2 pixels
        // We're exiting
        if (dist < 2) return

        // Find the middle point between first & second point
        var middlePoint = point0.add(point1.subtract(point0).scale(0.5))
        // We draw this point on screen
        this.drawPoint(middlePoint)
        // Recursive algorithm launched between first & middle point
        // and between middle & second point
        this._drawLine(point0, middlePoint)
        this._drawLine(middlePoint, point1)
    }

    public drawBLine(point0: Vector2, point1: Vector2): void {
        let x0 = point0.x >> 0
        let y0 = point0.y >> 0
        const x1 = point1.x >> 0
        const y1 = point1.y >> 0
        const dx = Math.abs(x1 - x0)
        const dy = Math.abs(y1 - y0)
        const sx = x0 < x1 ? 1 : -1
        const sy = y0 < y1 ? 1 : -1
        let err = dx - dy

        while (true) {
            this.drawPoint(new Vector2(x0, y0))

            if (x0 == x1 && y0 == y1) break
            const e2 = 2 * err
            if (e2 > -dy) {
                err -= dy
                x0 += sx
            }
            if (e2 < dx) {
                err += dx
                y0 += sy
            }
        }
    }
    */

    render(camera: Camera, meshes: Mesh[]) {
        const viewMatrix = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up())
        const projectionMatrix = Matrix.PerspectiveFovLH(0.78, this.workingWidth / this.workingHeight, 0.01, 1.0)

        for (let index = 0; index < meshes.length; index++) {
            const cMesh = meshes[index]

            const worldMatrix = Matrix.RotationYawPitchRoll(
                cMesh.Rotation.y,
                cMesh.Rotation.x,
                cMesh.Rotation.z,
            ).multiply(Matrix.Translation(cMesh.Position.x, cMesh.Position.y, cMesh.Position.z))

            const transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix)

            /* draw vertices ---------------------
            for (let indexVertices = 0; indexVertices < cMesh.Vertices.length; indexVertices++) {
                const projectedPoint = this.project(cMesh.Vertices[indexVertices], transformMatrix)

                this.drawPoint(projectedPoint)
            }
            */

            for (let indexFaces = 0; indexFaces < cMesh.Faces.length; indexFaces++) {
                const currentFace = cMesh.Faces[indexFaces]
                const vertexA = cMesh.Vertices[currentFace.A]
                const vertexB = cMesh.Vertices[currentFace.B]
                const vertexC = cMesh.Vertices[currentFace.C]

                const pixelA = this.project(vertexA, transformMatrix)
                const pixelB = this.project(vertexB, transformMatrix)
                const pixelC = this.project(vertexC, transformMatrix)

                /* draw wireframe -----------------
                this.drawBLine(pixelA, pixelB)
                this.drawBLine(pixelB, pixelC)
                this.drawBLine(pixelC, pixelA)
                */

                // draw face
                const color: number = 0.25 + ((indexFaces % cMesh.Faces.length) / cMesh.Faces.length) * 0.75;
                this.drawTriangle(pixelA, pixelB, pixelC, new Color4(color, color, color, 1));
            }
        }
    }

    // Clamping values to keep them between 0 and 1
    public clamp(value: number, min: number = 0, max: number = 1): number {
        return Math.max(min, Math.min(value, max));
    }

    // Interpolating the value between 2 vertices
    // min is the starting point, max the ending point
    // and gradient the % between the 2 points
    public interpolate(min: number, max: number, gradient: number) {
        return min + (max - min) * this.clamp(gradient);
    }

    // drawing line between 2 points from left to right
    // papb -> pcpd
    // pa, pb, pc, pd must then be sorted before
    public processScanLine(y: number, pa: Vector3, pb: Vector3,
                           pc: Vector3, pd: Vector3, color: Color4): void {
        // Thanks to current Y, we can compute the gradient to compute others values like
        // the starting X (sx) and ending X (ex) to draw between
        // if pa.Y == pb.Y or pc.Y == pd.Y, gradient is forced to 1
        var gradient1 = pa.y != pb.y ? (y - pa.y) / (pb.y - pa.y) : 1;
        var gradient2 = pc.y != pd.y ? (y - pc.y) / (pd.y - pc.y) : 1;

        var sx = this.interpolate(pa.x, pb.x, gradient1) >> 0;
        var ex = this.interpolate(pc.x, pd.x, gradient2) >> 0;

        /*
        // drawing a line from left (sx) to right (ex) 
        for (var x = sx; x < ex; x++) {
            this.drawPoint(new Vector2(x, y), color);
        }
        */

        // starting Z & ending Z
        var z1: number = this.interpolate(pa.z, pb.z, gradient1);
        var z2: number = this.interpolate(pc.z, pd.z, gradient2);

        // drawing a line from left (sx) to right (ex) 
        for (var x = sx; x < ex; x++) {
            var gradient: number = (x - sx) / (ex - sx); // normalisation pour dessiner de gauche à droite

            var z = this.interpolate(z1, z2, gradient);

            this.drawPoint(new Vector3(x, y, z), color);
        }
    }

    public drawTriangle(p1: Vector3, p2: Vector3, 
                        p3: Vector3, color: Color4): void {
        // Sorting the points in order to always have this order on screen p1, p2 & p3
        // with p1 always up (thus having the Y the lowest possible to be near the top screen)
        // then p2 between p1 & p3
        if (p1.y > p2.y) {
            var temp = p2;
            p2 = p1;
            p1 = temp;
        }

        if (p2.y > p3.y) {
            var temp = p2;
            p2 = p3;
            p3 = temp;
        }

        if (p1.y > p2.y) {
            var temp = p2;
            p2 = p1;
            p1 = temp;
        }

        // inverse slopes
        var dP1P2: number; var dP1P3: number;

        // http://en.wikipedia.org/wiki/Slope
        // Computing slopes
        if (p2.y - p1.y > 0)
            dP1P2 = (p2.x - p1.x) / (p2.y - p1.y);
        else
            dP1P2 = 0;

        if (p3.y - p1.y > 0)
            dP1P3 = (p3.x - p1.x) / (p3.y - p1.y);
        else
            dP1P3 = 0;

        // First case where triangles are like that:
        // P1
        // -
        // -- 
        // - -
        // -  -
        // -   - P2
        // -  -
        // - -
        // -
        // P3
        if (dP1P2 > dP1P3) {
            for (var y = p1.y >> 0; y <= p3.y >> 0; y++)
            {
                if (y < p2.y) {
                    this.processScanLine(y, p1, p3, p1, p2, color);
                }
                else {
                    this.processScanLine(y, p1, p3, p2, p3, color);
                }
            }
        }
        // First case where triangles are like that:
        //       P1
        //        -
        //       -- 
        //      - -
        //     -  -
        // P2 -   - 
        //     -  -
        //      - -
        //        -
        //       P3
        else {
            for (var y = p1.y >> 0; y <= p3.y >> 0; y++)
            {
                if (y < p2.y) {
                    this.processScanLine(y, p1, p2, p1, p3, color);
                }
                else {
                    this.processScanLine(y, p2, p3, p1, p3, color);
                }
            }
        }
    }

    public CreateMeshesFromJSON(jsonObject: BabylonScene): Mesh[] {
        return jsonObject.meshes.map((meshInfo: BabylonMesh) => {
            const {
                name,
                position,
                positions,
                indices,
                uvs,
            } = meshInfo

            const verticesCount = positions.length / 3
            const facesCount = indices.length / 3
            const mesh = new Mesh(name, verticesCount, facesCount)

            // Filling the Vertices array of our mesh first
            for (let index = 0; index < verticesCount; index++) {
                const x = positions[index * 3]
                const y = positions[index * 3 + 1]
                const z = positions[index * 3 + 2]
                mesh.Vertices[index] = new Vector3(x, y, z)
            }

            // Then filling the Faces array
            for (let index = 0; index < facesCount; index++) {
                const a = indices[index * 3]
                const b = indices[index * 3 + 1]
                const c = indices[index * 3 + 2]
                mesh.Faces[index] = {
                    A: a,
                    B: b,
                    C: c,
                }
            }

            // Getting the position you've set in Blender
            const [posX, posY, posZ] = position
            mesh.Position = new Vector3(posX, posY, posZ)

            return mesh
        })
    }
}
