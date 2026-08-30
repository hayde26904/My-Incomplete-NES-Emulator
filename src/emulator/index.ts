import { CPU, OpExecutionInfo, addrModes } from './cpu';
import { PPU } from './ppu';
import { ROM } from './rom';
import * as headerParser from "./headerParser";
import * as reg from "./registers";
import { Util } from './util';
import { Bus } from './bus';
import { Mapper } from './mapper';
import { mapperMap } from './mapperMap';
import { Input } from './input';

const SCALE = 3;

const CYCLES_PER_FRAME = 29780;

const NES_FRAME_TIME = 1000 / 60;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
canvas.width = 256 * SCALE;
canvas.height = 240 * SCALE;

const bufferCanvas = document.createElement('canvas') as HTMLCanvasElement; // needed for scaling the frame buffer
const bufferCtx = bufferCanvas.getContext('2d');
bufferCanvas.width = 256;
bufferCanvas.height = 240;

let mapper: Mapper;
const cpu: CPU = new CPU();
const ppu: PPU = new PPU();
const input: Input = new Input();

ppu.setNMIhandler(cpu.goToNMI.bind(cpu));

const bus: Bus = new Bus(cpu, ppu);
bus.setInput(input);

cpu.setBus(bus);
ppu.setBus(bus);


// debug buttons
document.getElementById('nmi-btn')?.addEventListener('click', ppu.NMI.bind(ppu));
document.getElementById('next-op-btn')?.addEventListener('click', executeNextOperation.bind(this, true, null));

document.getElementById('pause-btn')?.addEventListener('click', () => {
  if (cpuPaused) {
    resume();
  } else {
    pause();
  }
});

document.getElementById('log-var-btn')?.addEventListener('click', () => {
  const val = (document.getElementById('log-var-input') as HTMLInputElement).value;
  console.log(eval(val)); // eval is generally bad but this is just for debugging so its fine
});


const breakpointInput = document.getElementById('breakpoint-addr-input') as HTMLInputElement;
breakpointInput.addEventListener('change', () => {
  const value = breakpointInput.value;
  if (value) {
    breakpoint = parseInt(value, 16);
  } else {
    breakpoint = null;
  }
});

document.getElementById('romInput')?.addEventListener('change', (event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        const romData = new Uint8Array(e.target.result as ArrayBuffer);
        let testRom: ROM = new ROM(romData);
        loadProgram(testRom);
        loop();
      }
    };

    reader.readAsArrayBuffer(file);
  }
});

function loadProgram(rom: ROM) {

  const romInfo = headerParser.parseiNES1(rom);
  const romBytes = rom.getMemory().slice(16);
  const prg = new ROM(romBytes.slice(0, romInfo.prgRomSize));
  const chr = new ROM(romBytes.slice(romInfo.prgRomSize, romBytes.length - 1))

  console.log(romInfo);
  console.log(Util.Uint8ArrayToHex(prg.getMemory()));

  if (!mapperMap.has(romInfo.mapperNumber)) {
    throw new Error(`Mapper ${romInfo.mapperNumber} not supported`);
  }

  mapper = mapperMap.get(romInfo.mapperNumber);

  mapper.setPrgRom(prg);
  bus.setMapper(mapper);
  console.log(mapper);

  console.log(`Mirroring mode: ${romInfo.nametableMirroring === headerParser.NametableMirroringTypes.HORIZONTAL ? "Horizontal" : "Vertical"}`);

  ppu.setMirroringMode(romInfo.nametableMirroring);

  cpu.reset();
  ppu.reset();
  cpu.loadProgram(prg);
  ppu.loadCHR(chr);

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}


let lastFrameTime = performance.now();
let cpuPaused = false;
let breakpoint: number | null = null;

function pause() {
  cpuPaused = true
  document.getElementById('pause-btn')!.textContent = "Resume";
}

function resume() {
  cpuPaused = false;
  document.getElementById('pause-btn')!.textContent = "Pause";
}

function loop() {

  const currentTime = performance.now();
  //const deltaTime = (currentTime - lastFrameTime) / (1000 / TARGET_FPS);
  const elapsedTime = currentTime - lastFrameTime;

  if (elapsedTime < NES_FRAME_TIME) { // skip frame if we haven't reached the target frame time yet
    requestAnimationFrame(loop);
    return;
  }

  while (cpu.getCycleCount() < CYCLES_PER_FRAME && !cpuPaused) {
    const executedCycles = executeNextOperation();

    for (let i = 0; i < executedCycles * 3; i++) {
      ppu.tick();
    }

  }

  cpu.resetCycleCount();

  // DRAW FRAME

  ctx.imageSmoothingEnabled = false;
  bufferCtx.imageSmoothingEnabled = false;

  const frameBuffer = ppu.getFrameBuffer();
  bufferCtx.putImageData(frameBuffer, 0, 0); // draw to buffer canvas

  ctx.drawImage(bufferCanvas, 0, 0, canvas.width, canvas.height); // draw on main canvas and resize

  ppu.clearFrameBuffer(); // clear the frame buffer for the next frame

  //console.log(`FRAME END  PC: ${Util.hex(cpu.getPC())}`);
  //console.log(`NMI START  PC: ${Util.hex(cpu.getPC())}`);
  //console.log(`NMI END  PC: ${Util.hex(cpu.getPC())}`);

  lastFrameTime = currentTime;
  requestAnimationFrame(loop);

}

// wrapper for CPU function to include PPU ticks and breakpoint functionality
function executeNextOperation(debug: boolean = false) : number {

  const lastOpInfo = cpu.getLastOpInfo();
  //console.log(`FRAME START  PC: ${Util.hex(cpu.getPC())}`);
  const executedCycles = cpu.executeNextOperation(debug);

  if (breakpoint !== null && cpu.getPC() === breakpoint) {
    console.log(`Hit breakpoint at ${Util.hex(breakpoint)}!`);
    pause();
  }

  if (cpu.hitBrk) {
    console.log(`Hit BRK instruction at ${Util.hex(cpu.getPC())}!`);
    debug = true;
    const opInfo: OpExecutionInfo = lastOpInfo;
    const logMessage = 
    "[DEBUG] PC: " + Util.hex(opInfo.PC) + " | OpCode: " + Util.hex(opInfo.opCode) + " | A: " + Util.hex(opInfo.A) + " | X: " + Util.hex(opInfo.X) + " | Y: " + Util.hex(opInfo.Y) + " | SP: " + Util.hex(opInfo.SP) + " | N: " + opInfo.N + " | Z: " + opInfo.Z + " | C: " + opInfo.C + "\n" +
    (opInfo.opLog || "");
    console.log(logMessage);
    pause();
  }

  if (debug) {
    const opInfo: OpExecutionInfo = cpu.getLastOpInfo();
    const logMessage = 
    "[DEBUG] PC: " + Util.hex(opInfo.PC) + " | OpCode: " + Util.hex(opInfo.opCode) + " | A: " + Util.hex(opInfo.A) + " | X: " + Util.hex(opInfo.X) + " | Y: " + Util.hex(opInfo.Y) + " | SP: " + Util.hex(opInfo.SP) + " | N: " + opInfo.N + " | Z: " + opInfo.Z + " | C: " + opInfo.C + "\n" +
    (opInfo.opLog || "");
    console.log(logMessage);
  }

  return executedCycles;

}