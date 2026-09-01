import { ROM } from "./rom";

export enum NametableArrangementTypes {
    VERTICAL = 0,
    HORIZONTAL = 1
}

export interface RomInfo {
    prgRomSize: number;
    chrRomSize: number;
    nametableArrangement: number;
    battery: boolean;
    mapperNumber: number;
}

function parseiNES1(rom : ROM) : RomInfo {
    let header = rom.getMemory().slice(4);

    return {
        prgRomSize: (header[0] * 16) * 1024, // size of prg rom in 16 KB units
        chrRomSize: (header[1] * 8) * 1024, // size of chr rom in 8 KB units
        nametableArrangement: header[2] & 1, // arrangement of nametables 0 = V, 1 = H
        battery: Boolean(header[2] & 2), // game has battery backed RAM?
        mapperNumber: ((header[2] & 0b11110000) >> 4) + (header[2] & 0b11110000) // mapper number
    }
}

export function parseRomHeader(rom : ROM) : RomInfo {
    let header = rom.getMemory().slice(0, 16);

    if (header[0] !== 0x4E || header[1] !== 0x45 || header[2] !== 0x53 || header[3] !== 0x1A) {
        throw new Error("Invalid iNES header");
    }

    return parseiNES1(rom); // will work for now since iNES1 is backwards compatible with iNES2

}