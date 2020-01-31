export class Color4 {
    r: number;
    g: number;
    b: number;
    a: number;

    public static YELLOW: Color4 = new Color4(255, 255, 0, 255)

    constructor(valR: number, valG: number, valB: number, valA: number) {
        this.r = valR;
        this.g = valG;
        this.b = valB;
        this.a = valA;
    }

    public toString(): string {
        return `{R:${this.r} G:${this.g} B:${this.b} A:${this.a}}`;
    }
}

export class Vector2 {
    x: number;
    y: number;

    constructor(valX: number, valY: number) {
        this.x = valX;
        this.y = valY;
    }

    public toString(): string {
        return `{X: ${this.x} Y:${this.y}}`;
    }
    public add(otherVector: Vector2): Vector2 {
        return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
    }
    public subtract(otherVector: Vector2): Vector2 {
        return new Vector2(this.x - otherVector.x, this.y - otherVector.y);
    }
    public negate(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }
    public scale(scale: number): Vector2 {
        return new Vector2(this.x * scale, this.y * scale);
    }
    public equals(otherVector: Vector2): boolean {
        return this.x === otherVector.x && this.y === otherVector.y;
    }
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    public lengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }
    public normalize(): void {
        const len = this.length();
        if (len === 0) {
            return;
        }
        const num = 1.0 / len;
        this.x *= num;
        this.y *= num;
    }
    static Zero(): Vector2 {
        return new Vector2(0, 0);
    }
    static Copy(source: Vector2): Vector2 {
        return new Vector2(source.x, source.y);
    }
    static Normalize(vector: Vector2): Vector2 {
        const newVector = Vector2.Copy(vector);
        newVector.normalize();
        return newVector;
    }
    static Minimize(left: Vector2, right: Vector2): Vector2 {
        const x = left.x < right.x ? left.x : right.x;
        const y = left.y < right.y ? left.y : right.y;
        return new Vector2(x, y);
    }
    static Maximize(left: Vector2, right: Vector2): Vector2 {
        const x = left.x > right.x ? left.x : right.x;
        const y = left.y > right.y ? left.y : right.y;
        return new Vector2(x, y);
    }
    static Transform(vector: Vector2, transformation: Matrix): Vector2 {
        const x = vector.x * transformation.m[0] + vector.y * transformation.m[4];
        const y = vector.x * transformation.m[1] + vector.y * transformation.m[5];
        return new Vector2(x, y);
    }
    static Distance(value1: Vector2, value2: Vector2): number {
        return Math.sqrt(Vector2.DistanceSquared(value1, value2));
    }
    static DistanceSquared(value1: Vector2, value2: Vector2): number {
        const x = value1.x - value2.x;
        const y = value1.y - value2.y;
        return x * x + y * y;
    }
}

export class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(valX: number, valY: number, valZ: number) {
        this.x = valX;
        this.y = valY;
        this.z = valZ;
    }

    public toString(): string {
        return `{X: ${this.x} Y:${this.y} Z:${this.z}}`;
    }
    public add(otherVector: Vector3): Vector3 {
        return new Vector3(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
    }
    public subtract(otherVector: Vector3): Vector3 {
        return new Vector3(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
    }
    public negate(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }
    public scale(scale: number): Vector3 {
        return new Vector3(this.x * scale, this.y * scale, this.z * scale);
    }
    public equals(otherVector: Vector3): boolean {
        return this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z;
    }
    public multiply(otherVector: Vector3): Vector3 {
        return new Vector3(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z);
    }
    public divide(otherVector: Vector3): Vector3 {
        return new Vector3(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z);
    }
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    public lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    public normalize(): void {
        const len = this.length();
        if (len === 0) {
            return;
        }
        const num = 1.0 / len;
        this.x *= num;
        this.y *= num;
        this.z *= num;
    }

    static FromArray(array: number[], offset: number): Vector3 {
        if (!offset) {
            offset = 0;
        }
        return new Vector3(array[offset], array[offset + 1], array[offset + 2]);
    }
    static Zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }
    static Up(): Vector3 {
        return new Vector3(0, 1.0, 0);
    }
    static Copy(source: Vector3): Vector3 {
        return new Vector3(source.x, source.y, source.z);
    }
    static TransformCoordinates(vector: Vector3, transformation: Matrix): Vector3 {
        if (!vector) {
            debugger
        }
        const x =
            vector.x * transformation.m[0] +
            vector.y * transformation.m[4] +
            vector.z * transformation.m[8] +
            transformation.m[12];
        const y =
            vector.x * transformation.m[1] +
            vector.y * transformation.m[5] +
            vector.z * transformation.m[9] +
            transformation.m[13];
        const z =
            vector.x * transformation.m[2] +
            vector.y * transformation.m[6] +
            vector.z * transformation.m[10] +
            transformation.m[14];
        const w =
            vector.x * transformation.m[3] +
            vector.y * transformation.m[7] +
            vector.z * transformation.m[11] +
            transformation.m[15];
        return new Vector3(x / w, y / w, z / w);
    }
    static TransformNormal(vector: Vector3, transformation: Matrix): Vector3 {
        const x = vector.x * transformation.m[0] + vector.y * transformation.m[4] + vector.z * transformation.m[8];
        const y = vector.x * transformation.m[1] + vector.y * transformation.m[5] + vector.z * transformation.m[9];
        const z = vector.x * transformation.m[2] + vector.y * transformation.m[6] + vector.z * transformation.m[10];
        return new Vector3(x, y, z);
    }
    static Dot(left: Vector3, right: Vector3): number {
        return left.x * right.x + left.y * right.y + left.z * right.z;
    }
    static Cross(left: Vector3, right: Vector3) {
        const x = left.y * right.z - left.z * right.y;
        const y = left.z * right.x - left.x * right.z;
        const z = left.x * right.y - left.y * right.x;
        return new Vector3(x, y, z);
    }
    static Normalize(vector: Vector3): Vector3 {
        const newVector = Vector3.Copy(vector);
        newVector.normalize();
        return newVector;
    }
    static Distance(value1: Vector3, value2: Vector3): number {
        return Math.sqrt(Vector3.DistanceSquared(value1, value2));
    }
    static DistanceSquared(value1: Vector3, value2: Vector3): number {
        const x = value1.x - value2.x;
        const y = value1.y - value2.y;
        const z = value1.z - value2.z;
        return x * x + y * y + z * z;
    }
}

export class Matrix {
    m: any[];

    constructor() {
        this.m = [];
    }

    public isIdentity(): boolean {
        if (this.m[0] != 1.0 || this.m[5] != 1.0 || this.m[10] != 1.0 || this.m[15] != 1.0) {
            return false;
        }
        if (
            this.m[12] != 0.0 ||
            this.m[13] != 0.0 ||
            this.m[14] != 0.0 ||
            this.m[4] != 0.0 ||
            this.m[6] != 0.0 ||
            this.m[7] != 0.0 ||
            this.m[8] != 0.0 ||
            this.m[9] != 0.0 ||
            this.m[11] != 0.0 ||
            this.m[12] != 0.0 ||
            this.m[13] != 0.0 ||
            this.m[14] != 0.0
        ) {
            return false;
        }
        return true;
    }
    public determinant(): number {
        const temp1 = this.m[10] * this.m[15] - this.m[11] * this.m[14];
        const temp2 = this.m[9] * this.m[15] - this.m[11] * this.m[13];
        const temp3 = this.m[9] * this.m[14] - this.m[10] * this.m[13];
        const temp4 = this.m[8] * this.m[15] - this.m[11] * this.m[12];
        const temp5 = this.m[8] * this.m[14] - this.m[10] * this.m[12];
        const temp6 = this.m[8] * this.m[13] - this.m[9] * this.m[12];
        return (
            this.m[0] * (this.m[5] * temp1 - this.m[6] * temp2 + this.m[7] * temp3) -
            this.m[1] * (this.m[4] * temp1 - this.m[6] * temp4 + this.m[7] * temp5) +
            this.m[2] * (this.m[4] * temp2 - this.m[5] * temp4 + this.m[7] * temp6) -
            this.m[3] * (this.m[4] * temp3 - this.m[5] * temp5 + this.m[6] * temp6)
        );
    }
    public toArray(): any[] {
        return this.m;
    }
    public invert(): void {
        const l1 = this.m[0];
        const l2 = this.m[1];
        const l3 = this.m[2];
        const l4 = this.m[3];
        const l5 = this.m[4];
        const l6 = this.m[5];
        const l7 = this.m[6];
        const l8 = this.m[7];
        const l9 = this.m[8];
        const l10 = this.m[9];
        const l11 = this.m[10];
        const l12 = this.m[11];
        const l13 = this.m[12];
        const l14 = this.m[13];
        const l15 = this.m[14];
        const l16 = this.m[15];
        const l17 = l11 * l16 - l12 * l15;
        const l18 = l10 * l16 - l12 * l14;
        const l19 = l10 * l15 - l11 * l14;
        const l20 = l9 * l16 - l12 * l13;
        const l21 = l9 * l15 - l11 * l13;
        const l22 = l9 * l14 - l10 * l13;
        const l23 = l6 * l17 - l7 * l18 + l8 * l19;
        const l24 = -(l5 * l17 - l7 * l20 + l8 * l21);
        const l25 = l5 * l18 - l6 * l20 + l8 * l22;
        const l26 = -(l5 * l19 - l6 * l21 + l7 * l22);
        const l27 = 1.0 / (l1 * l23 + l2 * l24 + l3 * l25 + l4 * l26);
        const l28 = l7 * l16 - l8 * l15;
        const l29 = l6 * l16 - l8 * l14;
        const l30 = l6 * l15 - l7 * l14;
        const l31 = l5 * l16 - l8 * l13;
        const l32 = l5 * l15 - l7 * l13;
        const l33 = l5 * l14 - l6 * l13;
        const l34 = l7 * l12 - l8 * l11;
        const l35 = l6 * l12 - l8 * l10;
        const l36 = l6 * l11 - l7 * l10;
        const l37 = l5 * l12 - l8 * l9;
        const l38 = l5 * l11 - l7 * l9;
        const l39 = l5 * l10 - l6 * l9;
        this.m[0] = l23 * l27;
        this.m[4] = l24 * l27;
        this.m[8] = l25 * l27;
        this.m[12] = l26 * l27;
        this.m[1] = -(l2 * l17 - l3 * l18 + l4 * l19) * l27;
        this.m[5] = (l1 * l17 - l3 * l20 + l4 * l21) * l27;
        this.m[9] = -(l1 * l18 - l2 * l20 + l4 * l22) * l27;
        this.m[13] = (l1 * l19 - l2 * l21 + l3 * l22) * l27;
        this.m[2] = (l2 * l28 - l3 * l29 + l4 * l30) * l27;
        this.m[6] = -(l1 * l28 - l3 * l31 + l4 * l32) * l27;
        this.m[10] = (l1 * l29 - l2 * l31 + l4 * l33) * l27;
        this.m[14] = -(l1 * l30 - l2 * l32 + l3 * l33) * l27;
        this.m[3] = -(l2 * l34 - l3 * l35 + l4 * l36) * l27;
        this.m[7] = (l1 * l34 - l3 * l37 + l4 * l38) * l27;
        this.m[11] = -(l1 * l35 - l2 * l37 + l4 * l39) * l27;
        this.m[15] = (l1 * l36 - l2 * l38 + l3 * l39) * l27;
    }
    public multiply(other: Matrix): Matrix {
        const result = new Matrix();
        result.m[0] =
            this.m[0] * other.m[0] + this.m[1] * other.m[4] + this.m[2] * other.m[8] + this.m[3] * other.m[12];
        result.m[1] =
            this.m[0] * other.m[1] + this.m[1] * other.m[5] + this.m[2] * other.m[9] + this.m[3] * other.m[13];
        result.m[2] =
            this.m[0] * other.m[2] + this.m[1] * other.m[6] + this.m[2] * other.m[10] + this.m[3] * other.m[14];
        result.m[3] =
            this.m[0] * other.m[3] + this.m[1] * other.m[7] + this.m[2] * other.m[11] + this.m[3] * other.m[15];
        result.m[4] =
            this.m[4] * other.m[0] + this.m[5] * other.m[4] + this.m[6] * other.m[8] + this.m[7] * other.m[12];
        result.m[5] =
            this.m[4] * other.m[1] + this.m[5] * other.m[5] + this.m[6] * other.m[9] + this.m[7] * other.m[13];
        result.m[6] =
            this.m[4] * other.m[2] + this.m[5] * other.m[6] + this.m[6] * other.m[10] + this.m[7] * other.m[14];
        result.m[7] =
            this.m[4] * other.m[3] + this.m[5] * other.m[7] + this.m[6] * other.m[11] + this.m[7] * other.m[15];
        result.m[8] =
            this.m[8] * other.m[0] + this.m[9] * other.m[4] + this.m[10] * other.m[8] + this.m[11] * other.m[12];
        result.m[9] =
            this.m[8] * other.m[1] + this.m[9] * other.m[5] + this.m[10] * other.m[9] + this.m[11] * other.m[13];
        result.m[10] =
            this.m[8] * other.m[2] + this.m[9] * other.m[6] + this.m[10] * other.m[10] + this.m[11] * other.m[14];
        result.m[11] =
            this.m[8] * other.m[3] + this.m[9] * other.m[7] + this.m[10] * other.m[11] + this.m[11] * other.m[15];
        result.m[12] =
            this.m[12] * other.m[0] + this.m[13] * other.m[4] + this.m[14] * other.m[8] + this.m[15] * other.m[12];
        result.m[13] =
            this.m[12] * other.m[1] + this.m[13] * other.m[5] + this.m[14] * other.m[9] + this.m[15] * other.m[13];
        result.m[14] =
            this.m[12] * other.m[2] + this.m[13] * other.m[6] + this.m[14] * other.m[10] + this.m[15] * other.m[14];
        result.m[15] =
            this.m[12] * other.m[3] + this.m[13] * other.m[7] + this.m[14] * other.m[11] + this.m[15] * other.m[15];
        return result;
    }
    public equals(value: Matrix): boolean {
        return (
            this.m[0] === value.m[0] &&
            this.m[1] === value.m[1] &&
            this.m[2] === value.m[2] &&
            this.m[3] === value.m[3] &&
            this.m[4] === value.m[4] &&
            this.m[5] === value.m[5] &&
            this.m[6] === value.m[6] &&
            this.m[7] === value.m[7] &&
            this.m[8] === value.m[8] &&
            this.m[9] === value.m[9] &&
            this.m[10] === value.m[10] &&
            this.m[11] === value.m[11] &&
            this.m[12] === value.m[12] &&
            this.m[13] === value.m[13] &&
            this.m[14] === value.m[14] &&
            this.m[15] === value.m[15]
        );
    }
    static FromValues(
        initialM11: number,
        initialM12: number,
        initialM13: number,
        initialM14: number,
        initialM21: number,
        initialM22: number,
        initialM23: number,
        initialM24: number,
        initialM31: number,
        initialM32: number,
        initialM33: number,
        initialM34: number,
        initialM41: number,
        initialM42: number,
        initialM43: number,
        initialM44: number,
    ): Matrix {
        const result = new Matrix();
        result.m[0] = initialM11;
        result.m[1] = initialM12;
        result.m[2] = initialM13;
        result.m[3] = initialM14;
        result.m[4] = initialM21;
        result.m[5] = initialM22;
        result.m[6] = initialM23;
        result.m[7] = initialM24;
        result.m[8] = initialM31;
        result.m[9] = initialM32;
        result.m[10] = initialM33;
        result.m[11] = initialM34;
        result.m[12] = initialM41;
        result.m[13] = initialM42;
        result.m[14] = initialM43;
        result.m[15] = initialM44;
        return result;
    }
    static Identity(): Matrix {
        return Matrix.FromValues(1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0);
    }
    static Zero(): Matrix {
        return Matrix.FromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static Copy(source: Matrix): Matrix {
        return Matrix.FromValues(
            source.m[0],
            source.m[1],
            source.m[2],
            source.m[3],
            source.m[4],
            source.m[5],
            source.m[6],
            source.m[7],
            source.m[8],
            source.m[9],
            source.m[10],
            source.m[11],
            source.m[12],
            source.m[13],
            source.m[14],
            source.m[15],
        );
    }
    static RotationX(angle: number): Matrix {
        const result = Matrix.Zero();
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        result.m[0] = 1.0;
        result.m[15] = 1.0;
        result.m[5] = c;
        result.m[10] = c;
        result.m[9] = -s;
        result.m[6] = s;
        return result;
    }
    static RotationY(angle: number): Matrix {
        const result = Matrix.Zero();
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        result.m[5] = 1.0;
        result.m[15] = 1.0;
        result.m[0] = c;
        result.m[2] = -s;
        result.m[8] = s;
        result.m[10] = c;
        return result;
    }
    static RotationZ(angle: number): Matrix {
        const result = Matrix.Zero();
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        result.m[10] = 1.0;
        result.m[15] = 1.0;
        result.m[0] = c;
        result.m[1] = s;
        result.m[4] = -s;
        result.m[5] = c;
        return result;
    }
    static RotationAxis(axis: Vector3, angle: number): Matrix {
        const s = Math.sin(-angle);
        const c = Math.cos(-angle);
        const c1 = 1 - c;
        axis.normalize();
        const result = Matrix.Zero();
        result.m[0] = axis.x * axis.x * c1 + c;
        result.m[1] = axis.x * axis.y * c1 - axis.z * s;
        result.m[2] = axis.x * axis.z * c1 + axis.y * s;
        result.m[3] = 0.0;
        result.m[4] = axis.y * axis.x * c1 + axis.z * s;
        result.m[5] = axis.y * axis.y * c1 + c;
        result.m[6] = axis.y * axis.z * c1 - axis.x * s;
        result.m[7] = 0.0;
        result.m[8] = axis.z * axis.x * c1 - axis.y * s;
        result.m[9] = axis.z * axis.y * c1 + axis.x * s;
        result.m[10] = axis.z * axis.z * c1 + c;
        result.m[11] = 0.0;
        result.m[15] = 1.0;
        return result;
    }
    static RotationYawPitchRoll(yaw: number, pitch: number, roll: number): Matrix {
        return Matrix.RotationZ(roll)
            .multiply(Matrix.RotationX(pitch))
            .multiply(Matrix.RotationY(yaw));
    }
    static Scaling(x: number, y: number, z: number): Matrix {
        const result = Matrix.Zero();
        result.m[0] = x;
        result.m[5] = y;
        result.m[10] = z;
        result.m[15] = 1.0;
        return result;
    }
    static Translation(x: number, y: number, z: number): Matrix {
        const result = Matrix.Identity();
        result.m[12] = x;
        result.m[13] = y;
        result.m[14] = z;
        return result;
    }
    static LookAtLH(eye: Vector3, target: Vector3, up: Vector3): Matrix {
        const zAxis = target.subtract(eye);
        zAxis.normalize();
        const xAxis = Vector3.Cross(up, zAxis);
        xAxis.normalize();
        const yAxis = Vector3.Cross(zAxis, xAxis);
        yAxis.normalize();
        const ex = -Vector3.Dot(xAxis, eye);
        const ey = -Vector3.Dot(yAxis, eye);
        const ez = -Vector3.Dot(zAxis, eye);
        return Matrix.FromValues(
            xAxis.x,
            yAxis.x,
            zAxis.x,
            0,
            xAxis.y,
            yAxis.y,
            zAxis.y,
            0,
            xAxis.z,
            yAxis.z,
            zAxis.z,
            0,
            ex,
            ey,
            ez,
            1,
        );
    }
    static PerspectiveLH(width: number, height: number, znear: number, zfar: number): Matrix {
        const matrix = Matrix.Zero();
        matrix.m[0] = (2.0 * znear) / width;
        matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
        matrix.m[5] = (2.0 * znear) / height;
        matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
        matrix.m[10] = -zfar / (znear - zfar);
        matrix.m[8] = matrix.m[9] = 0.0;
        matrix.m[11] = 1.0;
        matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
        matrix.m[14] = (znear * zfar) / (znear - zfar);
        return matrix;
    }
    static PerspectiveFovLH(fov: number, aspect: number, znear: number, zfar: number): Matrix {
        const matrix = Matrix.Zero();
        const tan = 1.0 / Math.tan(fov * 0.5);
        matrix.m[0] = tan / aspect;
        matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
        matrix.m[5] = tan;
        matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
        matrix.m[8] = matrix.m[9] = 0.0;
        matrix.m[10] = -zfar / (znear - zfar);
        matrix.m[11] = 1.0;
        matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
        matrix.m[14] = (znear * zfar) / (znear - zfar);
        return matrix;
    }
    static Transpose(matrix: Matrix): Matrix {
        const result = new Matrix();
        result.m[0] = matrix.m[0];
        result.m[1] = matrix.m[4];
        result.m[2] = matrix.m[8];
        result.m[3] = matrix.m[12];
        result.m[4] = matrix.m[1];
        result.m[5] = matrix.m[5];
        result.m[6] = matrix.m[9];
        result.m[7] = matrix.m[13];
        result.m[8] = matrix.m[2];
        result.m[9] = matrix.m[6];
        result.m[10] = matrix.m[10];
        result.m[11] = matrix.m[14];
        result.m[12] = matrix.m[3];
        result.m[13] = matrix.m[7];
        result.m[14] = matrix.m[11];
        result.m[15] = matrix.m[15];
        return result;
    }
}
