import { Vector3 } from './math';
import * as SoftEngine from './SoftEngine';

var canvas: HTMLCanvasElement;
var device: SoftEngine.Device;
var mesh: SoftEngine.Mesh;
var meshes: SoftEngine.Mesh[] = [];
var mera: SoftEngine.Camera;

document.addEventListener('DOMContentLoaded', init, false);

function init() {
    canvas = <HTMLCanvasElement>document.getElementById('frontBuffer');
    mera = new SoftEngine.Camera();
    device = new SoftEngine.Device(canvas);

    mera.Position = new Vector3(0, 0, 10);
    mera.Target = new Vector3(0, 0, 0);

    fetch('./monkey2.babylon')
        .then(response => response.json())
        .then(device.CreateMeshesFromJSON)
        .then(loadJSONCompleted);
}

function loadJSONCompleted(meshesLoaded: SoftEngine.Mesh[]) {
    meshes = meshesLoaded;
    // Calling the HTML5 rendering loop
    requestAnimationFrame(drawingLoop);
}

// Rendering loop handler
function drawingLoop() {
    device.clear();

    for (var i = 0; i < meshes.length; i++) {
        // rotating slightly the mesh during each frame rendered
        meshes[i].Rotation.y += 0.01;
    }

    // Doing the various matrix operations
    device.render(mera, meshes);
    // Flushing the back buffer into the front buffer
    device.present();

    // Calling the HTML5 rendering loop recursively
    requestAnimationFrame(drawingLoop);
}
