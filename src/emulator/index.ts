import { CPU } from './cpu';
import { PPU } from './ppu';
import { ROM } from './rom';
import * as headerParser from "./headerParser";
import * as reg from "./registers";
import { Util } from './util';
import { Bus } from './bus';
import { Mapper } from './mapper';
import { mapperMap } from './mapperMap';
import { EmulatorEvent, OpExecutionInfo } from '../shared/debug-types';

const TARGET_FPS = 60

const CYCLES_PER_SECOND = 1789773;
const CYCLES_PER_FRAME = 29780;
const NMI_CYCLE = 27507

const NES_FRAME_TIME = 1000 / 60.098; // ~16.64ms per frame

const DEBUG_SERVER_URL = "ws://localhost:3000";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;

canvas.width = 1024;
canvas.height = 960;
//canvas.width = 255;
//canvas.height = 240;

//ctx.scale(4, 4);

let mapper: Mapper;
const cpu: CPU = new CPU();
const ppu: PPU = new PPU(ctx);

ppu.setNMIhandler(cpu.goToNMI.bind(cpu));

const bus: Bus = new Bus(cpu, ppu);
cpu.setBus(bus);
ppu.setBus(bus);

let currentPrgRom: ROM;


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


let debugServerConnected = false;

document.getElementById('connect-server-btn')?.addEventListener('click', () => {
  if (debugServerConnected) return;

  const socket = new WebSocket(DEBUG_SERVER_URL);

  socket.addEventListener("open", () => {
    debugServerConnected = true;
    pause();
  });

  socket.addEventListener("message", (event) => {
    const message = event.data;

    switch (message) {
      case "reset":



        break;
      case "step":

        executeNextOperation();

        const lastOpInfo: OpExecutionInfo = cpu.getLastOpInfo();

        // if connected to debug server
        if (socket !== null) {
          const event: EmulatorEvent = {
            event: "step",
            data: lastOpInfo
          }

          socket.send(JSON.stringify(event));
        }

        break;
    }

  });

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

  currentPrgRom = rom;
}


let lastFrameTime = performance.now();
let cpuPaused = false;
let breakpoint: number | null = null;

function pause() {
  cpuPaused = true
  document.getElementById('pause-btn')!.textContent = "Resume";
}

function resume() {
  if (debugServerConnected) return // Under no circumstances should emulation be unpaused while server connected. It will send messages at an extreme rate.
  cpuPaused = false;
  document.getElementById('pause-btn')!.textContent = "Pause";
}

pause();

let cycleCount = 0;

function loop() {

  const currentTime = performance.now();
  //const deltaTime = (currentTime - lastFrameTime) / (1000 / TARGET_FPS);
  const elapsedTime = currentTime - lastFrameTime;

  /*if (elapsedTime < NES_FRAME_TIME) { // skip frame if we haven't reached the target frame time yet
    requestAnimationFrame(loop);
    return;
  }*/

  while (cycleCount < CYCLES_PER_FRAME && !cpuPaused) {
    const cyclesExecuted = executeNextOperation();
    cycleCount += cyclesExecuted;
  }

  cycleCount = 0;

  //console.log(`FRAME END  PC: ${Util.hex(cpu.getPC())}`);
  //console.log(`NMI START  PC: ${Util.hex(cpu.getPC())}`);
  //console.log(`NMI END  PC: ${Util.hex(cpu.getPC())}`);

  lastFrameTime = currentTime;
  requestAnimationFrame(loop);

}

// wrapper for CPU function to include PPU ticks and breakpoint functionality
function executeNextOperation(log: boolean = false) {

  //console.log(`FRAME START  PC: ${Util.hex(cpu.getPC())}`);

  const cycles = cpu.executeNextOperation(log);

  for (let i = 0; i < cycles * 3; i++) {
    ppu.tick();
  }

  if (breakpoint !== null && cpu.getPC() === breakpoint) {
    console.log(`Hit breakpoint at ${Util.hex(breakpoint)}!`);
    pause();
  }

  return cycles;

}

document.addEventListener('keydown', (e) => {
  if (e.key === 'd') {
    ppu.debugDumpNametable(0);
  }
});