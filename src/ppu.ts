import { RAM } from "./ram";
import { ROM } from "./rom";
import * as reg from "./registers";
import { Util } from "./util";
import { CPU } from "./cpu";
import { Bus } from "./bus";

/*const colorMap = [
    "#7C7C7C", "#0000FC", "#0000BC", "#4428BC", "#940084", "#A80020", "#A81000", "#881400",
    "#503000", "#007800", "#006800", "#005800", "#004058", "#000000", "#000000", "#000000",
    "#BCBCBC", "#0078F8", "#0058F8", "#6844FC", "#D800CC", "#E40058", "#F83800", "#E45C10",
    "#AC7C00", "#00B800", "#00A800", "#00A844", "#008888", "#000000", "#000000", "#000000",
    "#F8F8F8", "#3CBCFC", "#6888FC", "#9878F8", "#F878F8", "#F85898", "#F87858", "#FCA044",
    "#F8B800", "#B8F818", "#58D854", "#58F898", "#00E8D8", "#787878", "#000000", "#000000",
    "#FCFCFC", "#A4E4FC", "#B8B8F8", "#D8B8F8", "#F8B8F8", "#F8A4C0", "#F0D0B0", "#FCE0A8",
    "#F8D878", "#D8F878", "#B8F8B8", "#B8F8D8", "#00FCFC", "#F8D8F8", "#000000", "#000000"
];*/

const colorMap = [
    [124, 124, 124], [0, 0, 252], [0, 0, 188], [68, 40, 188], [148, 0, 132], [168, 0, 32], [168, 16, 0], [136, 20, 0],
    [80, 48, 0], [0, 120, 0], [0, 104, 0], [0, 88, 0], [0, 64, 88], [0, 0, 0], [0, 0, 0], [0, 0, 0],
    [188, 188, 188], [0, 120, 248], [0, 88, 248], [104, 68, 252], [216, 0, 204], [228, 0, 88], [248, 56, 0], [228, 92, 16],
    [172, 124, 0], [0, 184, 0], [0, 168, 0], [0, 168, 68], [0, 136, 136], [0, 0, 0], [0, 0, 0], [0, 0, 0],
    [248, 248, 248], [60, 188, 252], [104, 136, 252], [152, 120, 248], [248, 120, 248], [248, 88, 152], [248, 120, 88], [252, 160, 68],
    [248, 184, 0], [184, 248, 24], [88, 216, 84], [88, 248, 152], [0, 232, 216], [120, 120, 120], [0, 0, 0], [0, 0, 0],
    [252, 252, 252], [164, 228, 252], [184, 184, 248], [216, 184, 248], [248, 184, 248], [248, 164, 192], [240, 208, 176], [252, 224, 168],
    [248, 216, 120], [216, 248, 120], [184, 248, 184], [184, 248, 216], [0, 252, 252], [248, 216, 248], [0, 0, 0], [0, 0, 0]
];

type MemoryWriteHandler = (value: number, address: number) => void;

interface MemoryRegion {
    start: number;
    end: number;
    ram: RAM;
    onWrite?: MemoryWriteHandler;
}

export class PPU {

    public cpu: CPU;

    public outputScaleX: number = 4;
    public outputScaleY: number = 4;

    private ctx: CanvasRenderingContext2D;
    private frameBuffer: ImageData;
    private bus: Bus;
    private NMIhandler: CallableFunction;
    private patternTables: Array<RAM> = [new RAM(0x1000), new RAM(0x1000)];
    private nameTables: Array<RAM> = [new RAM(0x3C0), new RAM(0x3C0), new RAM(0x3C0), new RAM(0x3C0)];
    private attrTables: Array<RAM> = [new RAM(0x40), new RAM(0x40), new RAM(0x40), new RAM(0x40)];
    private backgroundPalettes: RAM = new RAM(0x10);
    private spritePalettes: RAM = new RAM(0x10);
    private oam: RAM = new RAM(0xFF);

    // maps different RAM to different addresses
    private memoryRegions: MemoryRegion[] = [
        { start: 0x0000, end: 0x0FFF, ram: this.patternTables[0] },
        { start: 0x1000, end: 0x1FFF, ram: this.patternTables[1] },
        { start: 0x2000, end: 0x23BF, ram: this.nameTables[0] },
        { start: 0x23C0, end: 0x23FF, ram: this.attrTables[0] },
        { start: 0x2400, end: 0x27BF, ram: this.nameTables[1] },
        { start: 0x27C0, end: 0x27FF, ram: this.attrTables[1] },
        { start: 0x2800, end: 0x2BBF, ram: this.nameTables[2] },
        { start: 0x2BC0, end: 0x2BFF, ram: this.attrTables[2] },
        { start: 0x2C00, end: 0x2FBF, ram: this.nameTables[3] },
        { start: 0x2FC0, end: 0x2FFF, ram: this.attrTables[3] },
        { start: 0x3F00, end: 0x3F0F, ram: this.backgroundPalettes },
        { start: 0x3F10, end: 0x3F1F, ram: this.spritePalettes }
    ];

    private mirroringMode: number = 0; // 0 horizontal 1 verticle

    private writeAddr: number = null;

    private writeCounter: number = 0;
    private scrollX: number = 0;
    private scrollY: number = 0;

    private oamDma: number;
    private oamAddr: number;
    private oamDmaSet: boolean = false;

    private NMIenabled: boolean = false;
    private masterSlave: boolean = false;
    private spriteSizeMode: boolean = false;
    private backgroundAddr: boolean = false;
    private spriteAddr: boolean = false;
    private vramIncrement: boolean = false;
    private currentNametable: number = 0;

    private emphasizeBlue: boolean = false;
    private emphasizeGreen: boolean = false;
    private emphasizeRed: boolean = false;
    private showSprites: boolean = false;
    private showBackground: boolean = false;
    private showLeftSprites: boolean = false;
    private showLeftBackground: boolean = false;
    private greyscale: boolean = false;

    private inVblank: boolean = true;
    private spriteZeroHit: boolean = false;
    private spriteOverflow: boolean = false;

    private paletteBuffer = new Uint8Array(4);

    private cycle: number = 0;
    private scanline: number = 0;


    private testPalette: number[] = [
        0x12, 0x16, 0x27, 0x18
    ];

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.frameBuffer = this.ctx.createImageData(this.ctx.canvas.width, this.ctx.canvas.height);

    }

    public reset() {

        /*this.writeRegister(0, reg.PPUCTRL);
        this.writeRegister(0, reg.PPUMASK);
        this.writeRegister(0, reg.OAMADDR);
        this.writeRegister(0, reg.OAMDATA);
        this.writeRegister(0, reg.PPUSCROLL);
        this.writeRegister(0, reg.PPUADDR);
        this.writeRegister(0, reg.PPUDATA);*/

    }

    public setNMIhandler(callback: CallableFunction) {
        this.NMIhandler = callback;
    }

    public setBus(bus: Bus): void {
        this.bus = bus;
    }

    public setMirroringMode(mode: number) {
        this.mirroringMode = mode;
    }

    public loadCHR(rom: ROM) {

        let patternTable0 = this.patternTables[0];
        let patternTable1 = this.patternTables[1];

        for (let i = 0; i < patternTable0.getSize(); i++) {
            //both pattern tables are the same size, and they never won't be the same size, so it ok
            patternTable0.write(rom.read(i), i)
            patternTable1.write(rom.read(i + patternTable0.getSize()), i);
        }

    }

    private copySpritesFromOamDma() {
        //copy from OAM DMA address in CPU memory to OAM memory
        let oamDmaAddr = Util.bytesToAddr(this.oamAddr, this.oamDma);

        for (let addr = 0; addr < this.oam.getSize(); addr++) {
            this.oam.write(this.bus.read(oamDmaAddr + addr), addr);
        }
    }

    private writeToMem(value: number, address: number, runCallbacks: boolean = true) { // set runCallbacks to false when running in a callback to prevent unwanted recursion
        //console.log(`attempting data write of ${Util.hex(value)} to ${Util.hex(address)}`);
        const memoryRegion = this.memoryRegions[this.memoryRegions.findIndex((region) => (address % 0x3F20) >= region.start && (address % 0x3F20) <= region.end)]; //finds the correct ram object from a given memory address
        if (!memoryRegion) {
            //console.log(`Attempted write to invalid PPU memory address: ${Util.hex(address)}`);
            return;
        }
        memoryRegion.ram.write(value, address - memoryRegion.start); // converts the address to an index to index the ram object

        if (memoryRegion.onWrite && runCallbacks) {
            memoryRegion.onWrite(value, address);
        }
    }

    public tick() {
        this.cycle++;

        if (this.cycle > 340) {

            this.cycle = 0;
            this.scanline++;

            if (this.scanline === 240) { // VBLANK START
                this.draw(); // not accurate but works for now 
                this.NMI();
            }

            if (this.scanline > 261) { // VBLANK END
                this.spriteZeroHit = false;
                this.scanline = 0;
            }
        }

    }

    public NMI() {
        if (!this.NMIenabled) return;
        this.NMIhandler();
    }



    public debugDumpNametable(nametableIndex: number) {
        const bytes = [];
        for (let i = 0; i < 64; i++) {
            bytes.push(Util.hex(this.nameTables[nametableIndex].read(i)));
        }
        console.log(bytes.join(' '));
    }

    public readRegister(address: number) {
        switch (address) {
            case reg.PPUCTRL:

                return Util.boolsToBitmask([
                    this.NMIenabled,
                    this.masterSlave,
                    this.spriteSizeMode,
                    this.backgroundAddr,
                    this.spriteAddr,
                    this.vramIncrement,
                    Boolean(Util.getBit(this.currentNametable, 1)),
                    Boolean(Util.getBit(this.currentNametable, 0))
                ]);

            case reg.PPUSTATUS:

                this.writeCounter = 0; // reset latch

                return Util.boolsToBitmask([
                    this.inVblank,
                    this.spriteZeroHit,
                    this.spriteOverflow,
                    false,
                    false,
                    false,
                    false,
                    false
                ]);

            case reg.PPUMASK:

                return Util.boolsToBitmask([
                    this.emphasizeBlue,
                    this.emphasizeGreen,
                    this.emphasizeRed,
                    this.showSprites,
                    this.showBackground,
                    this.showLeftSprites,
                    this.showLeftBackground,
                    this.greyscale
                ]);

            case reg.OAMADDR:
                return this.oamAddr;
            case reg.OAMDATA:
                return this.oam.read(this.oamAddr);
            case reg.PPUDATA:
                return 0; // Not implemented yet
            case reg.PPUSCROLL:
                return 0; // Not readable
            default:
                //throw new Error(`Attempted read from invalid PPU register address: ${Util.hex(address)}`);
                return 0;
                break;
        }
    }



    public writeRegister(value: number, address: number) {

        //console.log(`attempting to write ${Util.hex(value)} to PPU reg ${Util.hex(address)}`);

        switch (address) {
            case reg.PPUCTRL:

                this.NMIenabled = Boolean(Util.getBit(value, 7));
                this.masterSlave = Boolean(Util.getBit(value, 6));
                this.spriteSizeMode = Boolean(Util.getBit(value, 5));
                this.backgroundAddr = Boolean(Util.getBit(value, 4));
                this.spriteAddr = Boolean(Util.getBit(value, 3));
                this.vramIncrement = Boolean(Util.getBit(value, 2));
                this.currentNametable = value & 3;

                break;

            case reg.PPUMASK:

                [
                    this.emphasizeBlue,
                    this.emphasizeGreen,
                    this.emphasizeRed,
                    this.showSprites,
                    this.showBackground,
                    this.showLeftSprites,
                    this.showLeftBackground,
                    this.greyscale
                ] = Util.bitmaskToBools(value);

                break;
            case reg.OAMDMA:
                this.oamDma = value;
                break;
            case reg.OAMADDR:
                this.oamAddr = value;
                break;
            case reg.OAMDATA:

                this.oam.write(value, this.oamAddr);
                break;
            case reg.PPUSCROLL:

                if (this.writeCounter === 0) {
                    this.scrollX = value;
                } else if (this.writeCounter === 1) {
                    this.scrollY = value;
                }

                this.writeCounter++;
                if (this.writeCounter > 1) this.writeCounter = 0;
                break;

            case reg.PPUADDR:

                if (this.writeCounter === 0) { // hi byte
                    this.writeAddr = 0; // reset it
                    this.writeAddr |= (value << 8);
                } else if (this.writeCounter === 1) { // lo byte
                    this.writeAddr |= value;
                }

                this.writeCounter++;
                if (this.writeCounter > 1) this.writeCounter = 0;

                break;

            case reg.PPUDATA:

                if (this.writeAddr !== null) {
                    this.writeToMem(value, this.writeAddr);
                    this.writeAddr += this.vramIncrement ? 32 : 1; // auto increment ppu write address while also accounting for the increment mode
                }

                break;

            default:
                //throw new Error(`Attempted write to invalid PPU register address: ${Util.hex(address)}`);
                break;
        }
    }

    private drawPixel(x: number, y: number, r: number, g: number, b: number, scaleOverrideX?: number, scaleOverrideY?: number) {
        const scaleX = scaleOverrideX | this.outputScaleX;
        const scaleY = scaleOverrideY | this.outputScaleY;
        for (let dx = 0; dx < scaleX; dx++) {
            for (let dy = 0; dy < scaleY; dy++) {
                let index = ((y * scaleY + dy) * this.ctx.canvas.width + (x * scaleX + dx)) * 4;
                this.frameBuffer.data[index] = r; // red
                this.frameBuffer.data[index + 1] = g; // green
                this.frameBuffer.data[index + 2] = b; // blue
                this.frameBuffer.data[index + 3] = 255; // alpha
            }
        }
    }

    private drawTile(tile: number, xPos: number, yPos: number, palette: Uint8Array, flipH: boolean, flipV: boolean, priority: boolean, patternTable: RAM, backgroundTransparent: boolean) {
        //pattern tables start at address 0 in PPU memory
        const chrIndex = tile * 16;

        for (let ri = 0; ri < 8; ri++) {
            const r = flipV ? 7 - ri : ri; // if the tile is flipped vertically, read the rows in reverse order
            const chrRow = patternTable.read(chrIndex + r);
            const attrRow = patternTable.read(chrIndex + r + 8);
            const x = xPos;
            const y = yPos + r;

            for (let bi = 0; bi < 8; bi++) {

                const b = flipH ? 7 - bi : bi; // if the tile is flipped horizontally, read the bits in reverse order
                const chrBit = (chrRow >> (7 - b)) & 1;
                const attrBit = (attrRow >> (7 - b)) & 1;

                const colorIndex = (attrBit << 1) | chrBit;
                const colorId = palette[colorIndex];
                const color = colorMap[colorId];
                // TRANSPARENCY
                if (!(colorIndex === 0 && backgroundTransparent)) this.drawPixel(x + b, y, color[0], color[1], color[2]) //this.ctx.fillRect(x + b, y, 1, 1);
            }

        }
    }

    private drawSprites() {
        for (let spriteIndex = 0; (spriteIndex + 4) < this.oam.getSize(); spriteIndex += 4) {

            const tileIndex = this.oam.read(spriteIndex + 1);
            const xPos = this.oam.read(spriteIndex + 3);
            const yPos = this.oam.read(spriteIndex);
            const attributes = this.oam.read(spriteIndex + 2);

            const paletteIndex = (attributes & 3) * 4; // each palette is 4 bytes long, so multiply the index by 4 to get the starting address of the palette in sprite palette memory
            const palette = new Uint8Array(4);
            palette[0] = this.spritePalettes.read(paletteIndex);
            palette[1] = this.spritePalettes.read(paletteIndex + 1);
            palette[2] = this.spritePalettes.read(paletteIndex + 2);
            palette[3] = this.spritePalettes.read(paletteIndex + 3);

            const flipH = Boolean(Util.getBit(attributes, 6));
            const flipV = Boolean(Util.getBit(attributes, 7));


            if (spriteIndex === 0) this.spriteZeroHit = true; // set sprite zero hit flag if the first sprite in OAM is being drawn, used for some games to do things like split the screen

            //if (tileIndex !== 0) console.log(`Drawing sprite $${Util.hex(tileIndex)} at X: ${Util.hex(xPos)} Y: ${Util.hex(yPos)}`);
            this.drawTile(tileIndex, xPos, yPos, palette, flipH, flipV, false, this.patternTables[this.spriteAddr ? 1 : 0], true);
        }
    }

    private drawBackground() {

        let nametable = this.nameTables[this.currentNametable];
        const debugAttr = [];

        for (let i = 0; i < nametable.getSize(); i++) {
            const tileIndex = nametable.read(i);
            const xPos = (i % 32) * 8;
            const yPos = Math.floor(i / 32) * 8;
            const attrX = Math.floor(i / 4) % 8; // each attr byte controls a 4x4 tile region
            const attrY = Math.floor(i / 128);
            const quadX = Math.floor(i / 2) % 2; // 0 or 1
            const quadY = Math.floor(i / 64) % 2;
            const attrIndex = (attrY * 8) + attrX;
            const quadIndex = (quadY << 1) | quadX;
            const attr = this.attrTables[this.currentNametable].read(attrIndex);
            const paletteIndex = ((attr >> (quadIndex * 2)) & 3) * 4; // each quadrant of the attribute byte is 2 bits that specifies the palette index for that quadrant, so shift the attribute byte to get the correct quadrant and then mask with 3 to get the last 2 bits for the palette index
            const palette = new Uint8Array(4);
            palette[0] = this.backgroundPalettes.read(0x00); // global background color
            palette[1] = this.backgroundPalettes.read(paletteIndex + 1);
            palette[2] = this.backgroundPalettes.read(paletteIndex + 2);
            palette[3] = this.backgroundPalettes.read(paletteIndex + 3);

            this.drawTile(tileIndex, xPos, yPos, palette, false, false, false, this.patternTables[this.backgroundAddr ? 1 : 0], false);
            debugAttr.push({ x: xPos, y: yPos, quadX, quadY, paletteIndex, attrX, attrY });
        }

        return debugAttr;
    }

    public draw() {

        this.copySpritesFromOamDma();

        const debugAttr = this.drawBackground();
        this.drawSprites();

        this.ctx.putImageData(this.frameBuffer, 0, 0);
        this.frameBuffer.data.fill(0);

        for (let c = 0; c < this.backgroundPalettes.getSize(); c++) {
            let colorRGB = colorMap[this.backgroundPalettes.read(c)];
            let color = '#' + Util.hex(colorRGB[0]) + Util.hex(colorRGB[1]) + Util.hex(colorRGB[2]);
            this.ctx.fillStyle = color;
            this.ctx.fillRect(c * 16, 0, 16, 16);
        }
        /*for (let i=0;i<debugAttr.length;i++){
            const obj = debugAttr[i];
            this.ctx.globalAlpha = 0.9;
            if (obj.quadX === 0 && obj.quadY === 0) this.ctx.fillStyle='red';
            if (obj.quadX === 1 && obj.quadY === 0) this.ctx.fillStyle='green';
            if (obj.quadX === 0 && obj.quadY === 1) this.ctx.fillStyle='yellow';
            if (obj.quadX === 1 && obj.quadY === 1) this.ctx.fillStyle='pink';
            this.ctx.fillStyle='#000';
            this.ctx.font='Arial 30px';
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(String(obj.paletteIndex/4), obj.x * this.outputScaleX, obj.y * this.outputScaleY);
        }*/

        /*for (let i = 0; i < this.nameTables[0].getSize(); i++) {
            const tileIndex = this.nameTables[0].read(i);
            const xPos = (i % 32) * 8;
            const yPos = Math.floor(i / 32) * 8;
            this.ctx.fillStyle = '#FFF';
            this.ctx.font = 'Arial 30px';
            this.ctx.fillText(Util.hex(tileIndex), xPos * this.outputScaleX, yPos * this.outputScaleY);
        }*/

    }

}