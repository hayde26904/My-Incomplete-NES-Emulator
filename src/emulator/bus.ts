import { CPU } from "./cpu";
import { Input } from "./input";
import { Mapper } from "./mapper";
import { PPU } from "./ppu";
import { RAM } from "./ram";
import * as reg from "./registers";
import { Util } from "./util";

export class Bus {
    private cpu : CPU;
    private ppu : PPU;
    private ram : RAM;
    private mapper : Mapper;
    private input : Input;

    constructor(cpu : CPU, ppu : PPU){
        this.cpu = cpu;
        this.ppu = ppu;
        this.ram = new RAM(0x800);
    }

    public setMapper(mapper : Mapper){
        this.mapper = mapper;
    }

    public setInput(input : Input){
        this.input = input;
    }

    public read(address : number) : number {
        if(address < 0x2000){

            return this.ram.read(address % 0x800); // mirroring every 2KB

        } else if(address < 0x4000){

            try {
                return this.ppu.readRegister(0x2000 + (address % 8)); // mirroring every 8 bytes
            } catch(err){
                throw new Error(`PC: ${Util.hex(this.cpu.getPC())}  error reading from PPU register: ${Util.hex(address)}`);
            }

        } else if(address === reg.JOY1) {

            return this.input.read();
            
        } else if(address >= 0x8000){ 

            return this.mapper.read(address);

        }

        return 0;
    }

    public write(value : number, address : number){
        if(address < 0x2000){

            this.ram.write(value, address % 0x800);

        } else if(address < 0x4000){

            try {
                this.ppu.writeRegister(value, 0x2000 + (address % 8));
            } catch(err){
                //console.log(err.stack);
                //throw new Error(`PC: ${Util.hex(this.cpu.getPC())}  error writing ${Util.hex(value)} to PPU register: ${Util.hex(address)}`);
            }

        } else if(address === reg.OAMDMA){ //OAM DMA

            this.ppu.copySpritesFromOamDma(value << 8); // value is the high byte of the address, so shift it left by 8 to get the full address

            this.cpu.addCycles(513); // 513 cycles for OAM DMA transfer

            if (this.cpu.getCycleCount() % 2 === 1) { // if the CPU is on an odd cycle, add one cycle to make it even
                this.cpu.addCycles(1);
            }
        
        } else if (address === reg.JOY1) { // JOY1

            this.input.write(value);

        } else if(address >= 0x4000 && address < 0x4018){

            this.ppu.writeRegister(value, address); // for now just pass it to the PPU
            
        } else if(address >= 0x8000){

            this.mapper.write(value, address);

        }
    }
}