import { CPU, addrModes } from "./cpu";
import { Memory } from "./memory";
import { RAM } from "./ram";
import { Util } from "./util";

export type operationInfo = { log: string };
export type operationMethod = (cpu: CPU, arg: number, addrMode?: number) => operationInfo;

export function brk(cpu: CPU, arg: number) : operationInfo {
    return { log: "" };
}

export function lda(cpu: CPU, arg: number) : operationInfo {
    cpu.setAreg(arg);
    return { log: `Loaded ${Util.hex(cpu.getAreg())} into A` };
}

export function ldx(cpu: CPU, arg: number) : operationInfo {
    cpu.setXreg(arg);
    return { log: `Loaded ${Util.hex(cpu.getXreg())} into X` };
}

export function ldy(cpu: CPU, arg: number) : operationInfo {
    cpu.setYreg(arg);
    return { log: `Loaded ${Util.hex(cpu.getYreg())} into Y` };
}

export function sta(cpu: CPU, arg: number) : operationInfo {
    cpu.writeToMem(cpu.getAreg(), arg);
    return { log: `Stored ${Util.hex(cpu.getAreg())} into memory at ${Util.hex(arg)}` };
}

export function stx(cpu: CPU, arg: number) : operationInfo {
    cpu.writeToMem(cpu.getXreg(), arg);
    return { log: `Stored ${Util.hex(cpu.getXreg())} into memory at ${Util.hex(arg)}` };
}

export function sty(cpu: CPU, arg: number) : operationInfo {
    cpu.writeToMem(cpu.getYreg(), arg);
    return { log: `Stored ${Util.hex(cpu.getYreg())} into memory at ${Util.hex(arg)}` };
}

export function tax(cpu: CPU, arg: number) : operationInfo {
    cpu.setXreg(cpu.getAreg());
    return { log: `Transfered A ${Util.hex(cpu.getAreg())} into X` };
}

export function txa(cpu: CPU, arg: number) : operationInfo {
    cpu.setAreg(cpu.getXreg());
    return { log: `Transfered X ${Util.hex(cpu.getXreg())} into A` };
}

export function tay(cpu: CPU, arg: number) : operationInfo {
    cpu.setYreg(cpu.getAreg());
    return { log: `Transfered A ${Util.hex(cpu.getAreg())} into Y` };
}

export function tya(cpu: CPU, arg: number) : operationInfo {
    cpu.setAreg(cpu.getYreg());
    return { log: `Transfered Y ${Util.hex(cpu.getYreg())} into A` };
}

export function txs(cpu: CPU, arg: number) : operationInfo {
    cpu.setSP(cpu.getXreg());
    return { log: `Stored X ${cpu.getXreg()} into stack pointer` };
}

export function tsx(cpu: CPU, arg: number) : operationInfo {
    cpu.setXreg(cpu.getSP());
    return { log: `Stored SP ${cpu.getSP()} into X` };
}

export function inc(cpu: CPU, arg: number) : operationInfo {
    const result = cpu.readFromMem(arg) + 1;
    cpu.writeToMem(result, arg);
    cpu.setFlags(result);
    return { log: `Incremented ${arg}` };
}

export function dec(cpu: CPU, arg: number) : operationInfo {
    const result = cpu.readFromMem(arg) - 1;
    cpu.writeToMem(result, arg);
    cpu.setFlags(result);
    return { log: `Decremented ${arg}` };
}

export function inx(cpu: CPU, arg: number) : operationInfo {
    let val = cpu.getXreg() + 1;
    cpu.setXreg(val);
    cpu.setFlags(val);
    return { log: `Incremented X` };
}

export function dex(cpu: CPU, arg: number) : operationInfo {
    let val = cpu.getXreg() - 1;
    cpu.setXreg(val);
    cpu.setFlags(val);
    return { log: `Decremented X` };
}

export function iny(cpu: CPU, arg: number) : operationInfo {
    let val = cpu.getYreg() + 1;
    cpu.setYreg(val);
    cpu.setFlags(val);
    return { log: `Incremented Y` };
}

export function dey(cpu: CPU, arg: number) : operationInfo {
    let val = cpu.getYreg() - 1;
    cpu.setYreg(val);
    cpu.setFlags(val);
    return { log: `Decremented Y` };
}

export function jmp(cpu: CPU, arg: number) : operationInfo {
    cpu.setPC(arg);
    return { log: `Jumped to ${Util.hex(arg)}` };
}

export function jsr(cpu: CPU, arg: number) : operationInfo {
    let from = cpu.getPC() - 1;
    let [lo, hi] = Util.addrToBytes(from);

    cpu.pushToStack(hi);
    cpu.pushToStack(lo);
    cpu.setPC(arg);
    return { log: `Jumped to subroutine ${Util.hex(arg)} from ${Util.hex(Util.bytesToAddr(lo, hi))}` };
}

export function rts(cpu: CPU, arg: number) : operationInfo {
    let lo = cpu.pullFromStack();
    let hi = cpu.pullFromStack();
    let returnAddr = Util.bytesToAddr(lo, hi) + 1;

    cpu.setPC(returnAddr);
    return { log: `Returned from subroutine to ${Util.hex(returnAddr)}` };
}

export function rti(cpu: CPU, arg: number) : operationInfo {

    let lo = cpu.pullFromStack();
    let hi = cpu.pullFromStack();
    let statusReg = cpu.pullFromStack();
    let returnAddr = Util.bytesToAddr(lo, hi);

    cpu.setStatusReg(statusReg);
    cpu.setPC(returnAddr);
    cpu.endNMI();
    return { log: `Returned from interrupt to ${Util.hex(returnAddr)}` };
}

export function sec(cpu: CPU, arg: number) : operationInfo {
    cpu.setCarry();
    return { log: `Set Carry` };
}

export function clc(cpu: CPU, arg: number) : operationInfo {
    cpu.clearCarry();
    return { log: `Cleared Carry` };
}

export function adc(cpu: CPU, arg: number) : operationInfo {
    let c = Number(cpu.getFlags().C);
    let a = cpu.getAreg();
    let result = a + arg + c;
    
    // Set carry if result overflows 8-bit
    if(result > 0xFF){
        cpu.setCarry();
    } else {
        cpu.clearCarry();
    }
    
    // Set overflow if signed overflow occurred
    if(((a & 0x80) === (arg & 0x80)) && ((a & 0x80) !== (result & 0x80))){
        cpu.setOverflow();
    } else {
        cpu.clearOverflow();
    }
    
    cpu.setAreg(result);
    return { log: `Added ${arg} to A` };
}

export function sbc(cpu: CPU, arg: number) : operationInfo {
    let c = Number(!cpu.getFlags().C);
    let a = cpu.getAreg();
    let result = a - arg - c;
    
    // Set carry if no borrow occurred (result >= 0)
    if(result >= 0){
        cpu.setCarry();
    } else {
        cpu.clearCarry();
    }
    
    // Set overflow if signed overflow occurred
    if(((a & 0x80) !== (arg & 0x80)) && ((a & 0x80) !== (result & 0x80))){
        cpu.setOverflow();
    } else {
        cpu.clearOverflow();
    }
    
    cpu.setAreg(result);
    return { log: `Subtracted ${arg} from A` };
}

export function cmp(cpu: CPU, arg: number) : operationInfo {
    let result = cpu.getAreg() - arg;
    cpu.setFlags(result);

    if(result < 0){
        cpu.clearCarry();
    } else {
        cpu.setCarry();
    }
    return { log: `Compared A (${Util.hex(cpu.getAreg())}) to ${Util.hex(arg)}` };
}

export function cpx(cpu: CPU, arg: number) : operationInfo {
    let result = cpu.getXreg() - arg;
    cpu.setFlags(result);

    if(result < 0){
        cpu.clearCarry();
    } else {
        cpu.setCarry();
    }
    return { log: `Compared X (${Util.hex(cpu.getAreg())}) to ${Util.hex(arg)}` };
}

export function cpy(cpu: CPU, arg: number) : operationInfo {
    let result = cpu.getYreg() - arg;
    cpu.setFlags(result);

    if(result < 0){
        cpu.clearCarry();
    } else {
        cpu.setCarry();
    }
    return { log: `Compared Y (${Util.hex(cpu.getYreg())}) to ${Util.hex(arg)}` };
}

export function bit(cpu: CPU, arg: number) : operationInfo {
    let result = cpu.getAreg() & arg;
    cpu.setFlags(result);
    if((arg & 0x80) === 0x80) cpu.setNegative(); else cpu.clearNegative();
    if((arg & 0x40) === 0x40) cpu.setOverflow(); else cpu.clearOverflow();
    return { log: `BIT with ${Util.hex(arg)}` };
}

export function beq(cpu: CPU, arg: number) : operationInfo {
    if(cpu.getFlags().Z){
        cpu.setPC(arg);
    }
    return { log: `Branch if equal (${Util.hex(arg)})` };
}

export function bne(cpu: CPU, arg: number) : operationInfo {
    if(!cpu.getFlags().Z){
        cpu.setPC(arg);
    }
    return { log: `Branch if not equal (${Util.hex(arg)})` };
}

export function bcc(cpu: CPU, arg: number) : operationInfo {
    if(!cpu.getFlags().C){
        cpu.setPC(arg);
    }
    return { log: `Branch if carry clear (${Util.hex(arg)})` };
}

export function bcs(cpu: CPU, arg: number) : operationInfo {
    if(cpu.getFlags().C){
        cpu.setPC(arg);
    }
    return { log: `Branch if carry set (${Util.hex(arg)})` };
}

export function bmi(cpu: CPU, arg: number) : operationInfo {
    if(cpu.getFlags().N){
        cpu.setPC(arg);
    }
    return { log: `Branch if negative (${Util.hex(arg)})` };
}

export function bpl(cpu: CPU, arg: number) : operationInfo {
    if(!cpu.getFlags().N){
        cpu.setPC(arg);
    }
    return { log: `Branch if not negative (${Util.hex(arg)})` };
}

export function and(cpu: CPU, arg: number) : operationInfo {
    const result = cpu.getAreg() & arg;
    cpu.setAreg(result);
    cpu.setFlags(result);
    return { log: `AND ${arg} with A` };
}

export function ora(cpu: CPU, arg: number) : operationInfo {
    const result = cpu.getAreg() | arg;
    cpu.setAreg(result);
    cpu.setFlags(result);
    return { log: `OR ${arg} with A` };
}

export function eor(cpu: CPU, arg: number) : operationInfo {
    const result = cpu.getAreg() ^ arg;
    cpu.setAreg(result);
    cpu.setFlags(result);
    return { log: `EOR ${arg} with A` };
}

export function pha(cpu: CPU, arg: number) : operationInfo {
    cpu.pushToStack(cpu.getAreg());
    return { log: `Pushed A to stack` };
}

export function pla(cpu: CPU, arg: number) : operationInfo {
    cpu.setAreg(cpu.pullFromStack());
    return { log: `Pulled A from stack` };
}

export function php(cpu: CPU, arg: number) : operationInfo {
    cpu.pushToStack(cpu.getStatusReg());
    return { log: `Pushed Status Reg to stack` };
}

export function plp(cpu: CPU, arg: number) : operationInfo {
    cpu.setStatusReg(cpu.pullFromStack());
    return { log: `Pulled Status Reg from stack` };
}

export function asl(cpu: CPU, arg: number, addrMode?: number) : operationInfo {
    let result = (arg << 1) & 0xFF;

    if (addrMode === addrModes.ACCUMULATOR) { // Accumulator mode
        cpu.setAreg(result);
    } else {
        cpu.writeToMem(result, arg);
    }

    cpu.setFlags(result);

    if((cpu.readFromMem(arg) & 0x80) === 0x80){
        cpu.setCarry();
    } else {
        cpu.clearCarry();
    }

    return { log: `ASL on A ${Util.hex(arg)}` };
}

export function lsr(cpu: CPU, arg: number, addrMode?: number) : operationInfo {
    let result = (arg >> 1) & 0xFF;

    if (addrMode === addrModes.ACCUMULATOR) { // Accumulator mode
        cpu.setAreg(result);
    } else {
        cpu.writeToMem(result, arg);
    }

    cpu.setFlags(result);

    if((cpu.readFromMem(arg) & 0x01) === 0x01){
        cpu.setCarry();
    } else {
        cpu.clearCarry();
    }

    return { log: `LSR on A ${Util.hex(arg)}` };
}

export function ror(cpu: CPU, arg: number, addrMode?: number) : operationInfo {
    let c = Number(cpu.getFlags().C);
    let result = ((arg >> 1) & 0xFF) | ((c << 7) & 0x80);

    if (addrMode === addrModes.ACCUMULATOR) { // Accumulator mode
        cpu.setAreg(result);
    } else {
        cpu.writeToMem(result, arg);
    }

    cpu.setFlags(result);

    if((result & 0x01) === 0x01){
        cpu.setCarry();
    } else {
        cpu.clearCarry();
    }

    return { log: `ROR on A ${Util.hex(arg)}` };
}

export function rol(cpu: CPU, arg: number, addrMode?: number) : operationInfo {
    asl(cpu, arg, addrMode);
    and(cpu, arg);
    return { log: `RLA on A ${Util.hex(arg)}` };
}