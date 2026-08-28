import { CPU } from "./cpu";
import { RAM } from "./ram";
import { Util } from "./util";
import { operandTypes } from "./operation";
import { Bus } from "./bus";

//Handles every addressing mode and outputs the final value which is then used in the operation.

export type addrModeHandler = (bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) => number;

export function implicit(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number {
    return null;
}

export function immediate(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number {
    return operands[0];
}

export function zeropage(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number {
    return operands[0] & 0xFF;
}

export function zeropageX(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number{
    return operands[0] + cpu.getXreg() & 0xFF;
}

export function zeropageY(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number{
    return operands[0] + cpu.getYreg() & 0xFF;
}

export function absolute(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number{
    return Util.bytesToAddr(operands[0], operands[1]);
}

export function absoluteX(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number {
    const base = Util.bytesToAddr(operands[0], operands[1]);
    const effective = (base + cpu.getXreg()) & 0xFFFF;
    cpu.pageCrossed = (base & 0xFF00) !== (effective & 0xFF00);
    return effective;
}

export function absoluteY(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number {
    const base = Util.bytesToAddr(operands[0], operands[1]);
    const effective = (base + cpu.getYreg()) & 0xFFFF;
    cpu.pageCrossed = (base & 0xFF00) !== (effective & 0xFF00);
    return effective;
}

export function accumulator(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number{
    return cpu.getAreg();
}

export function relative(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number {
    let isNegative = (operands[0] & 0x80) === 0x80;
    //DO NOT TOUCH THESE NUMBERS THEY ARE MAGIC
    let offset = isNegative ? operands[0] - 254 : operands[0] + 2;
    return cpu.getPC() + offset;
}

export function indirect(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number {

    let addr = Util.bytesToAddr(operands[0], operands[1]);
    let lo = bus.read(addr);
    //let hi = bus.read(addr + 1);
    let hi = bus.read((addr & 0xFF00) | ((addr + 1) & 0x00FF)); // famous bug apparently
    return Util.bytesToAddr(lo, hi);

}

export function indirectX(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number {

    let zpAddr = (operands[0] + cpu.getXreg()) & 0xFF;
    let lo = bus.read(zpAddr);
    let hi = bus.read((zpAddr + 1) & 0xFF);
    return Util.bytesToAddr(lo, hi);
    // no page-cross penalty here: the X-index is applied to the zero-page
    // pointer *before* dereferencing, and that addition always wraps within
    // zero page (masked by & 0xFF above), so the final effective address is
    // fully resolved with no conditional case to check.
}

export function indirectY(bus : Bus, cpu : CPU, operands : Uint8Array, operandType : number) : number {

    let zpAddr = operands[0];
    let lo = bus.read(zpAddr);
    let hi = bus.read((zpAddr + 1) & 0xFF);
    const base = Util.bytesToAddr(lo, hi);
    const effective = (base + cpu.getYreg()) & 0xFFFF;
    cpu.pageCrossed = (base & 0xFF00) !== (effective & 0xFF00);
    return effective;
}