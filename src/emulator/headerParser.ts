import { ROM } from "./rom";

export enum NametableMirroringTypes {
    VERTICAL,
    HORIZONTAL
}

export interface RomInfo {
    prgRomSize: number;
    chrRomSize: number;
    nametableMirroring: number;
    battery: boolean;
    mapperNumber: number;
}

export function parseiNES1(rom : ROM) : RomInfo {
    let header = rom.getMemory().slice(4);

    return {
        prgRomSize: (header[0] * 16) * 1024,
        chrRomSize: (header[1] * 8) * 1024,
        nametableMirroring: header[3] & 1,
        battery: Boolean(header[3] & 2),
        mapperNumber: (header[3] & 0b11110000) >> 4
    }
}