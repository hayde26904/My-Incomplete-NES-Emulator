import { CPU } from "./cpu";
import { RAM } from "./ram";
import { Util } from "./util";
import { argTypes } from "./operation";
import { Bus } from "./bus";

//Handles every addressing mode and outputs the final value which is then used in the operation.

export type addrModeHandler = (bus : Bus, cpu : CPU, args : Uint8Array, argType : number) => number;

export function implicit(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number {
    return null;
}

export function immediate(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number {
    return args[0];
}

export function zeropage(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number {
    return args[0];
}

export function zeropageX(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number{
    return args[0] + cpu.getXreg();
}

export function zeropageY(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number{
    return args[0] + cpu.getYreg();
}

export function absolute(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number{
    return Util.bytesToAddr(args[0], args[1]);
}

export function absoluteX(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number {
    return Util.bytesToAddr(args[0], args[1]) + cpu.getXreg();
}

export function absoluteY(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number {
    return Util.bytesToAddr(args[0], args[1]) + cpu.getYreg();
}

export function accumulator(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number{
    return cpu.getAreg();
}

export function relative(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number {
    let isNegative = (args[0] & 0x80) === 0x80;
    //DO NOT TOUCH THESE NUMBERS THEY ARE MAGIC
    let offset = isNegative ? args[0] - 254 : args[0] + 2;
    return cpu.getPC() + offset;
}

export function indirect(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number {

    let addr = Util.bytesToAddr(args[0], args[1]);
    let lo = bus.read(addr);
    let hi = bus.read(addr + 1);
    return Util.bytesToAddr(lo, hi);

}

export function indirectX(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number {

    let zpAddr = (args[0] + cpu.getXreg()) & 0xFF;
    let lo = bus.read(zpAddr);
    let hi = bus.read((zpAddr + 1) & 0xFF);
    return Util.bytesToAddr(lo, hi);

}

export function indirectY(bus : Bus, cpu : CPU, args : Uint8Array, argType : number) : number {

    let zpAddr = args[0];
    let lo = bus.read(zpAddr);
    let hi = bus.read((zpAddr + 1) & 0xFF);
    return Util.bytesToAddr(lo, hi) + cpu.getYreg();
}