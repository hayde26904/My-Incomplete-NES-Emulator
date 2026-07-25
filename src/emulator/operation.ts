import { CPU } from './cpu';
import { addrModes } from './cpu';
import { Memory } from './memory';
import * as opMethods from './operationMethods';
import { operationMethod } from './operationMethods';
import { RAM } from './ram';
import { immediate } from './addrModeHandlers';

//value is immediate value and pointer gets the value from the address
export enum argTypes {
    none,
    value,
    reference,
}

export interface Operation {
    name: string;
    method: operationMethod;
    opCodes: Array<number>;
    addrModes: Array<number>;
    argTypes: Array<number>;
    cycles: Array<number>;
}

export const ops: Array<Operation> = [
    {
        name: "brk",
        method: opMethods.brk,
        opCodes: [0x00],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [1]

    },

    {
        name: "lda",
        method: opMethods.lda,
        opCodes: [0xA9, 0xA5, 0xB5, 0xAD, 0xBD, 0xB9, 0xA1, 0xB1],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,3,4,4,4,4,6,5]
    },

    {
        name: "sta",
        method: opMethods.sta,
        opCodes: [0x85, 0x95, 0x8D, 0x9D, 0x99, 0x81, 0x91],
        addrModes: [addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.value, argTypes.value, argTypes.value, argTypes.value, argTypes.value, argTypes.value],
        cycles: [3,4,4,5,5,6,6]
    },

    {
        name: "ldx",
        method: opMethods.ldx,
        opCodes: [0xA2, 0xA6, 0xB6, 0xAE, 0xBE],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_Y, addrModes.ABSOLUTE, addrModes.ABSOLUTE_Y],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,3,4,4,4]
    },

    {
        name: "stx",
        method: opMethods.stx,
        opCodes: [0x86, 0x96, 0x8E],
        addrModes: [addrModes.ZEROPAGE, addrModes.ZEROPAGE_Y, addrModes.ABSOLUTE],
        argTypes: [argTypes.value, argTypes.value, argTypes.value],
        cycles: [3,4,4]
    },

    {
        name: "ldy",
        method: opMethods.ldy,
        opCodes: [0xA0, 0xA4, 0xB4, 0xAC, 0xBC],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,3,4,4,4]
    },

    {
        name: "sty",
        method: opMethods.sty,
        opCodes: [0x84, 0x94, 0x8C],
        addrModes: [addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE],
        argTypes: [argTypes.value, argTypes.value, argTypes.value],
        cycles: [3,4,4]
    },

    {
        name: "tax",
        method: opMethods.tax,
        opCodes: [0xAA],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [2]
    },

    {
        name: "txa",
        method: opMethods.txa,
        opCodes: [0x8A],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [2]
    },

    {
        name: "tay",
        method: opMethods.tay,
        opCodes: [0xA8],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [2]
    },

    {
        name: "tya",
        method: opMethods.tya,
        opCodes: [0x98],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [2]
    },

    {
        name: "tsx",
        method: opMethods.tsx,
        opCodes: [0xBA],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [2]
    },

    {
        name: "txs",
        method: opMethods.txs,
        opCodes: [0x9A],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [2]
    },

    {
        name: "jmp",
        method: opMethods.jmp,
        opCodes: [0x4C, 0x6C],
        addrModes: [addrModes.ABSOLUTE, addrModes.INDIRECT],
        argTypes: [argTypes.value, argTypes.reference],
        cycles: [3,5]
    },

    {
        name: "jsr",
        method: opMethods.jsr,
        opCodes: [0x20],
        addrModes: [addrModes.ABSOLUTE],
        argTypes: [argTypes.value],
        cycles: [6]
    },

    {
        name: "rts",
        method: opMethods.rts,
        opCodes: [0x60],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [6]
    },

    {
        name: "rti",
        method: opMethods.rti,
        opCodes: [0x40],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [6]
    },

    {
        name: "inc",
        method: opMethods.inc,
        opCodes: [0xE6, 0xF6, 0xEE, 0xFE],
        addrModes: [addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X],
        argTypes: [argTypes.value, argTypes.value, argTypes.value, argTypes.value],
        cycles: [5,6,6,7]
    },

    {
        name: "dec",
        method: opMethods.dec,
        opCodes: [0xC6, 0xD6, 0xCE, 0xDE],
        addrModes: [addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X],
        argTypes: [argTypes.value, argTypes.value, argTypes.value, argTypes.value],
        cycles: [5,6,6,7]
    },

    {
        name: "inx",
        method: opMethods.inx,
        opCodes: [0xE8],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [2]
    },

    {
        name: "dex",
        method: opMethods.dex,
        opCodes: [0xCA],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [2]
    },

    {
        name: "iny",
        method: opMethods.iny,
        opCodes: [0xC8],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [2]
    },

    {
        name: "dey",
        method: opMethods.dey,
        opCodes: [0x88],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [2]
    },

    {
        name: "sec",
        method: opMethods.sec,
        opCodes: [0x38],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [2]
    },

    {
        name: "clc",
        method: opMethods.clc,
        opCodes: [0x18],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [2]
    },

    {
        name: "adc",
        method: opMethods.adc,
        opCodes: [0x69, 0x65, 0x75, 0x6D, 0x7D, 0x79, 0x61, 0x71],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,3,4,4,4,4,6,5]

    },

    {
        name: "sbc",
        method: opMethods.sbc,
        opCodes: [0xE9, 0xE5, 0xF5, 0xED, 0xFD, 0xF9, 0xE1, 0xF1],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,3,4,4,4,4,6,5]
    },

    {
        name: "cmp",
        method: opMethods.cmp,
        opCodes: [0xC9, 0xC5, 0xD5, 0xCD, 0xDD, 0xD9, 0xC1, 0xD1],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,3,4,4,4,4,6,5]
    },

    {
        name: "cpx",
        method: opMethods.cpx,
        opCodes: [0xE0, 0xE4, 0xEC],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ABSOLUTE],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference],
        cycles: [2,3,4]
    },

    {
        name: "cpy",
        method: opMethods.cpy,
        opCodes: [0xC0, 0xC4, 0xCC],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ABSOLUTE],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference],
        cycles: [2,3,4]
    },

    {
        name: "bit",
        method: opMethods.bit,
        opCodes: [0x24, 0x2C],
        addrModes: [addrModes.ZEROPAGE, addrModes.ABSOLUTE],
        argTypes: [argTypes.reference, argTypes.reference],
        cycles: [3,4]
    },

    {
        name: "beq",
        method: opMethods.beq,
        opCodes: [0xF0],
        addrModes: [addrModes.RELATIVE],
        argTypes: [argTypes.value],
        cycles: [2]
    },

    {
        name: "bne",
        method: opMethods.bne,
        opCodes: [0xD0],
        addrModes: [addrModes.RELATIVE],
        argTypes: [argTypes.value],
        cycles: [2]
    },

    {
        name: "bcc",
        method: opMethods.bcc,
        opCodes: [0x90],
        addrModes: [addrModes.RELATIVE],
        argTypes: [argTypes.value],
        cycles: [2]
    },

    {
        name: "bcs",
        method: opMethods.bcs,
        opCodes: [0xB0],
        addrModes: [addrModes.RELATIVE],
        argTypes: [argTypes.value],
        cycles: [2]
    },

    {
        name: "bmi",
        method: opMethods.bmi,
        opCodes: [0x30],
        addrModes: [addrModes.RELATIVE],
        argTypes: [argTypes.value],
        cycles: [2]
    },

    {
        name: "bpl",
        method: opMethods.bpl,
        opCodes: [0x10],
        addrModes: [addrModes.RELATIVE],
        argTypes: [argTypes.value],
        cycles: [2]
    },

    {
        name: "and",
        method: opMethods.and,
        opCodes: [0x29, 0x25, 0x35, 0x2D, 0x3D, 0x39, 0x21, 0x31],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,3,4,4,4,4,6,5]
    },

    {
        name: "ora",
        method: opMethods.ora,
        opCodes: [0x09, 0x05, 0x15, 0x0D, 0x1D, 0x19, 0x01, 0x11],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,3,4,4,4,4,6,5]
    },

    {
        name: "eor",
        method: opMethods.eor,
        opCodes: [0x49, 0x45, 0x55, 0x4D, 0x5D, 0x59, 0x41, 0x51],
        addrModes: [addrModes.IMMEDIATE, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X, addrModes.ABSOLUTE_Y, addrModes.INDIRECT_X, addrModes.INDIRECT_Y],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,3,4,4,4,4,6,5]
    },

    {
        name: "pha",
        method: opMethods.pha,
        opCodes: [0x48],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [3]
    },

    {
        name: "pla",
        method: opMethods.pla,
        opCodes: [0x68],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [4]
    },

    {
        name: "php",
        method: opMethods.php,
        opCodes: [0x08],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [3]
    },

    {
        name: "plp",
        method: opMethods.plp,
        opCodes: [0x28],
        addrModes: [addrModes.IMPLICIT],
        argTypes: [null],
        cycles: [4]
    },

    {
        name: "asl",
        method: opMethods.asl,
        opCodes: [0x0A, 0x06, 0x16, 0x0E, 0x1E],
        addrModes: [addrModes.ACCUMULATOR, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,5,6,6,7]
    },

    {
        name: "lsr",
        method: opMethods.lsr,
        opCodes: [0x4A, 0x46, 0x56, 0x4E, 0x5E],
        addrModes: [addrModes.ACCUMULATOR, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,5,6,6,7]
    },

    {
        name: "ror",
        method: opMethods.ror,
        opCodes: [0x6A, 0x66, 0x76, 0x6E, 0x7E],
        addrModes: [addrModes.ACCUMULATOR, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,5,6,6,7]
    },

    {
        name: "rol",
        method: opMethods.rol,
        opCodes: [0x2A, 0x26, 0x36, 0x2E, 0x3E],
        addrModes: [addrModes.ACCUMULATOR, addrModes.ZEROPAGE, addrModes.ZEROPAGE_X, addrModes.ABSOLUTE, addrModes.ABSOLUTE_X],
        argTypes: [argTypes.value, argTypes.reference, argTypes.reference, argTypes.reference, argTypes.reference],
        cycles: [2,5,6,6,7]
    }

];

export const opcodeMap: Map<number, { name: string, method: operationMethod, addrMode: number, argType: number, cycles: number }> = new Map();

ops.forEach(op => {
    op.opCodes.forEach((opcode, index) => {
        opcodeMap.set(opcode, {
            name: op.name,
            method: op.method,
            addrMode: op.addrModes[index],
            argType: op.argTypes[index],
            cycles: op.cycles[index]
        });
    });
});