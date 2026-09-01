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

interface MemoryRegion {
    start: number;
    end: number;
    getRAM: () => RAM;
}

enum RenderPriority {
    DEBUG=2,
    TOP=0,
    BOTTOM=1
}

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;

export class PPU {

    private frameBuffer: ImageData = new ImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
    private debugBuffer: ImageData = new ImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
    private topBuffer: ImageData = new ImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
    private bottomBuffer: ImageData = new ImageData(SCREEN_WIDTH, SCREEN_HEIGHT);

    private bus: Bus;
    private NMIhandler: CallableFunction;

    private patternTables: Array<RAM> = [new RAM(0x1000), new RAM(0x1000)];
    private nameTables: Array<RAM> = [new RAM(0x400), new RAM(0x400), new RAM(0x400), new RAM(0x400)];
    private nameTableArrangement: Array<number> = [0, 1, 2, 3]; // order of the name tables in memory, will be set based on the mirroring mode
    private backgroundPalettes: RAM = new RAM(0x10);
    private spritePalettes: RAM = new RAM(0x10);
    private oam: RAM = new RAM(0x100);

    // maps different RAM to different addresses
    private memoryRegions: MemoryRegion[] = [
        { start: 0x0000, end: 0x0FFF, getRAM: () => this.patternTables[0] },
        { start: 0x1000, end: 0x1FFF, getRAM: () => this.patternTables[1] },
        { start: 0x2000, end: 0x23FF, getRAM: () => this.nameTables[this.nameTableArrangement[0]] },
        { start: 0x2400, end: 0x27FF, getRAM: () => this.nameTables[this.nameTableArrangement[1]] },
        { start: 0x2800, end: 0x2BFF, getRAM: () => this.nameTables[this.nameTableArrangement[2]] },
        { start: 0x2C00, end: 0x2FFF, getRAM: () => this.nameTables[this.nameTableArrangement[3]] },
        { start: 0x3F00, end: 0x3F0F, getRAM: () => this.backgroundPalettes },
        { start: 0x3F10, end: 0x3F1F, getRAM: () => this.spritePalettes }
    ];

    private currentAddr: number = 0;
    private currentNametableIndex: number = 0;
    private writeCounter: number = 0;

    private tempScrollX: number = 0;
    private scrollX: number = 0;
    private scrollY: number = 0;

    private oamAddr: number = 0;

    private NMIenabled: boolean = false;
    private masterSlave: boolean = false;
    private spriteSizeMode: boolean = false;
    private backgroundPatternTable: number = 0;
    private spritePatternTable: number = 0;
    private vramIncrement: boolean = false;
    private baseNametableIndex: number = 0;

    private emphasizeBlue: boolean = false;
    private emphasizeGreen: boolean = false;
    private emphasizeRed: boolean = false;
    private showSprites: boolean = true;
    private showBackground: boolean = true;
    private showLeftSprites: boolean = false;
    private showLeftBackground: boolean = false;
    private greyscale: boolean = false;

    private inVblank: boolean = false;
    private spriteZeroHit: boolean = false;
    private spriteOverflow: boolean = false;

    private ppuDataBuffer: number = 0;

    private cycle: number = 0;
    private scanline: number = 0;

    constructor() {
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

    public setNametableArrangement(mode: number) {

        switch (mode) {
            case 0: // vertical
                this.nameTableArrangement = [0, 0, 1, 1];
                break;
            case 1: // horizontal
                this.nameTableArrangement = [0, 1, 0, 1];
                break;
        }

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

    public copySpritesFromOamDma(dmaAddr: number) {

        //copy from OAM DMA in CPU memory to OAM memory
        for (let i = 0; i <= this.oam.getSize(); i++) {
            this.oam.write(this.bus.read(dmaAddr + i), this.oamAddr + i);
        }

    }

    private getMemoryRegion(address: number): MemoryRegion {
        return this.memoryRegions.find((region) => (address % 0x3F20) >= region.start && (address % 0x3F20) <= region.end);
    }


    private writeToMem(value: number, address: number) {
        const memoryRegion = this.getMemoryRegion(address); //finds the correct ram object from a given memory address
        if (!memoryRegion) return;

        const ram = memoryRegion.getRAM();
        ram.write(value, address - memoryRegion.start); // converts the address to an index to index the ram object
    }

    private readFromMem(address: number): number {
        const memoryRegion = this.getMemoryRegion(address);
        if (!memoryRegion) {
            return;
        }

        const ram = memoryRegion.getRAM();
        return ram.read(address - memoryRegion.start);
    }

    public tick() {
        this.cycle++;

        if (this.scanline === this.oam.read(0) + 8 && this.cycle == this.oam.read(3) + 8) { // approximate
            this.spriteZeroHit = true;
            if (this.baseNametableIndex === 1) console.log("SPRITE ZERO HIT WITH NAMETABLE 1");
        }

        if (this.cycle === 257) {
            this.currentNametableIndex = this.baseNametableIndex;
        }

        if (this.cycle < 340) return;

        this.cycle = 0;
        this.scanline++;

        if (this.scanline <= 240) {

            this.drawScanline(this.scanline);

        } else if (this.scanline === 241) { // VBLANK START

            this.inVblank = true;

            if (this.NMIenabled) {
                this.NMI();
            }

        } else if (this.scanline > 261) { // VBLANK END
            this.inVblank = false;
            this.spriteZeroHit = false;
            this.scanline = 0;
        }

    }

    public NMI() {
        this.NMIhandler();
    }

    public readRegister(address: number) {
        switch (address) {
            case reg.PPUCTRL:

                return Util.boolsToBitmask([
                    this.NMIenabled,
                    this.masterSlave,
                    this.spriteSizeMode,
                    Boolean(this.backgroundPatternTable),
                    Boolean(this.spritePatternTable),
                    this.vramIncrement,
                    Boolean(Util.getBit(this.baseNametableIndex, 1)),
                    Boolean(Util.getBit(this.baseNametableIndex, 0))
                ]);

            case reg.PPUSTATUS:

                this.writeCounter = 0; // reset latch

                const mask = Util.boolsToBitmask([
                    this.inVblank,
                    this.spriteZeroHit,
                    this.spriteOverflow,
                    false,
                    false,
                    false,
                    false,
                    false
                ]);

                return mask;

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
                const value = this.ppuDataBuffer;
                this.ppuDataBuffer = this.readFromMem(this.currentAddr);
                this.currentAddr += this.vramIncrement ? 32 : 1; // auto increment ppu write address while also accounting for the increment mode
                return value;
            case reg.PPUSCROLL:
                return 0; // Not readable
            default:
                return 0;
                break;
        }
    }

    public writeRegister(value: number, address: number) {

        switch (address) {
            case reg.PPUCTRL:

                const tempIndex = this.baseNametableIndex;

                this.NMIenabled = Boolean(Util.getBit(value, 7));
                this.masterSlave = Boolean(Util.getBit(value, 6));
                this.spriteSizeMode = Boolean(Util.getBit(value, 5));
                this.backgroundPatternTable = Util.getBit(value, 4);
                this.spritePatternTable = Util.getBit(value, 3);
                this.vramIncrement = Boolean(Util.getBit(value, 2));
                this.baseNametableIndex = value & 3;

                /*if (this.baseNametableIndex !== tempIndex && !this.spriteZeroHit) {
                    this.drawPixel(this.cycle, this.scanline, 0, 255, 0, RenderPriority.DEBUG);
                    this.drawPixel(this.cycle + 1, this.scanline, 0, 255, 0, RenderPriority.DEBUG);
                    this.drawPixel(this.cycle, this.scanline + 1, 0, 255, 0, RenderPriority.DEBUG);
                    this.drawPixel(this.cycle + 1, this.scanline + 1, 0, 255, 0, RenderPriority.DEBUG);
                    console.log(`nametable changed ${this.scanline}`);
                }*/

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
                    this.currentAddr = 0; // reset it
                    this.currentAddr |= (value << 8);
                } else if (this.writeCounter === 1) { // lo byte
                    this.currentAddr |= value;
                }

                this.ppuDataBuffer = this.readFromMem(this.currentAddr); // read the value at the address into the buffer, so that the next read from PPUDATA will return this value

                this.writeCounter++;
                if (this.writeCounter > 1) this.writeCounter = 0;

                break;

            case reg.PPUDATA:

                this.writeToMem(value, this.currentAddr);
                this.currentAddr += this.vramIncrement ? 32 : 1; // auto increment ppu write address while also accounting for the increment mode

                break;

            default:
                //throw new Error(`Attempted write to invalid PPU register address: ${Util.hex(address)}`);
                break;
        }
    }

    private drawPixel(x: number, y: number, r: number, g: number, b: number, priority: RenderPriority = RenderPriority.TOP) {
        
        let destBuffer;

        switch (priority) {
            case RenderPriority.BOTTOM:
                destBuffer = this.bottomBuffer;
                break;
            case RenderPriority.TOP:
                destBuffer = this.topBuffer;
                break;
            case RenderPriority.DEBUG:
                destBuffer = this.debugBuffer;
                break;
        }

        const index = (y * destBuffer.width + x) * 4; // multiply by 4 because each pixel has 4 values (RGBA)
        destBuffer.data[index] = r; // red
        destBuffer.data[index + 1] = g; // green
        destBuffer.data[index + 2] = b; // blue
        destBuffer.data[index + 3] = 255; // alpha
    }

    private drawTile(tile: number, xPos: number, yPos: number, palette: Uint8Array, flipH: boolean, flipV: boolean, patternTable: RAM, backgroundTransparent: boolean, priority: number) {
        //pattern tables start at address 0 in PPU memory
        const chrIndex = tile * 16;

        const rowIncrement = flipV ? -1 : 1;
        const startRow = flipV ? 7 : 0;

        const bitIncrement = flipH ? -1 : 1;
        const startBit = flipH ? 7 : 0;

        for ( // very nice syntax right here
            let ri = startRow;
            flipV ? ri >= 0 : ri < 8;
            ri += rowIncrement
        ) {
            const r = flipV ? 7 - ri : ri; // if the tile is flipped vertically, read the rows in reverse order
            const chrRow = patternTable.read(chrIndex + r);
            const attrRow = patternTable.read(chrIndex + r + 8);

            for (
                let bi = startBit;
                flipH ? bi >= 0 : bi < 8;
                bi += bitIncrement
            ) {
                const b = flipH ? 7 - bi : bi; // if the tile is flipped horizontally, read the bits in reverse order
                const chrBit = (chrRow >> (7 - b)) & 1;
                const attrBit = (attrRow >> (7 - b)) & 1;

                const colorIndex = (attrBit << 1) | chrBit;
                const colorId = palette[colorIndex];
                const color = colorMap[colorId];

                const x = xPos + bi;
                const y = yPos + ri;

                const priorityOverride = (colorIndex === 0) ? 1 : priority; // if pixel is transparent, force it to bottom layer

                // TRANSPARENCY
                if (!(colorIndex === 0 && backgroundTransparent)) this.drawPixel(x, y, color[0], color[1], color[2], priorityOverride);
            }

        }
    }

    private drawSpritesScanline(scanline: number) {
        for (let spriteIndex = 0; (spriteIndex + 4) <= this.oam.getSize(); spriteIndex += 4) {

            const xPos = this.oam.read(spriteIndex + 3);
            const yPos = this.oam.read(spriteIndex);

            if (scanline === yPos + 8) continue; // skip sprites that are not on this scanline

            //if (!this.showLeftSprites && xPos === 0 && yPos === 0) continue;

            const tileIndex = this.oam.read(spriteIndex + 1);
            const attributes = this.oam.read(spriteIndex + 2);

            const paletteIndex = (attributes & 3) * 4; // each palette is 4 bytes long, so multiply the index by 4 to get the starting address of the palette in sprite palette memory
            const palette = new Uint8Array(4);
            palette[0] = this.spritePalettes.read(paletteIndex);
            palette[1] = this.spritePalettes.read(paletteIndex + 1);
            palette[2] = this.spritePalettes.read(paletteIndex + 2);
            palette[3] = this.spritePalettes.read(paletteIndex + 3);

            const flipH = Boolean(Util.getBit(attributes, 6));
            const flipV = Boolean(Util.getBit(attributes, 7));
            const priority = Util.getBit(attributes, 5);

            //if (tileIndex !== 0) console.log(`Drawing sprite $${Util.hex(tileIndex)} at X: ${Util.hex(xPos)} Y: ${Util.hex(yPos)}`);
            this.drawTile(tileIndex, xPos, yPos, palette, flipH, flipV, this.patternTables[this.spritePatternTable], true, priority);
        }
    }

    private drawBackgroundScanline(scanline: number) {
        if (scanline % 8 !== 7) return; // only draw the background on the last scanline of each row of tiles

        const rowIndex = Math.floor(scanline / 8);
        const nametable = this.nameTables[this.currentNametableIndex];
        const attrTableStartIndex = 0x3C0; // attribute table starts at 0x3C0 in nametable memory

        for (let i = 32 * rowIndex; i < 32 * (rowIndex + 1); i++) { // 32 tiles per row

            let xPos = (i % 32) * 8;
            let yPos = Math.floor(i / 32) * 8;

            //if (!this.showLeftBackground && xPos === 0 && yPos === 0) continue;

            xPos -= this.scrollX;
            yPos -= this.scrollY;

            const tileIndex = nametable.read(i);
            const attrX = Math.floor(i / 4) % 8; // each attr byte controls a 4x4 tile region
            const attrY = Math.floor(i / 128);
            const quadX = Math.floor(i / 2) % 2; // 0 or 1
            const quadY = Math.floor(i / 64) % 2;
            const attrIndex = attrTableStartIndex + (attrY * 8) + attrX;
            const quadIndex = (quadY << 1) | quadX;
            const attr = nametable.read(attrIndex);
            const paletteIndex = ((attr >> (quadIndex * 2)) & 3) * 4; // each quadrant of the attribute byte is 2 bits that specifies the palette index for that quadrant, so shift the attribute byte to get the correct quadrant and then mask with 3 to get the last 2 bits for the palette index
            const palette = new Uint8Array(4);
            palette[0] = this.backgroundPalettes.read(0); // universal background color
            palette[1] = this.backgroundPalettes.read(paletteIndex + 1);
            palette[2] = this.backgroundPalettes.read(paletteIndex + 2);
            palette[3] = this.backgroundPalettes.read(paletteIndex + 3);

            this.drawTile(tileIndex, xPos, yPos, palette, false, false, this.patternTables[this.backgroundPatternTable], false, 0);
        }

    }

    private drawScanline(scanline: number) {

        this.drawBackgroundScanline(scanline);
        this.drawSpritesScanline(scanline);

    }

    public getFrameBuffer() : ImageData {

        // combine the two layers
        for (let i = 0; i < this.frameBuffer.data.length; i += 4) {
            // if topBuffer pixel is transparent, draw bottomBuffer pixel
            let destBuffer = (this.topBuffer.data[i + 3] === 0) ? this.bottomBuffer : this.topBuffer;

            if (this.debugBuffer.data[i + 3] !== 0) destBuffer = this.debugBuffer;

            this.frameBuffer.data[i] = destBuffer.data[i];
            this.frameBuffer.data[i + 1] = destBuffer.data[i + 1];
            this.frameBuffer.data[i + 2] = destBuffer.data[i + 2];
            this.frameBuffer.data[i + 3] = destBuffer.data[i + 3];
        }

        return this.frameBuffer;
    }

    public clearFrameBuffer() {
        this.topBuffer.data.fill(0);
        this.bottomBuffer.data.fill(0);
    }
}