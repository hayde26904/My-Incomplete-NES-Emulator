import { CPU, addrModes } from "./cpu";
import { Util } from "./util";

export type operationMethod = (cpu: CPU, arg: number, addrMode: number, debug: boolean) => number;

export const brk: operationMethod = (cpu, arg, addrMode, debug) => {
    if (debug) {
        cpu.logMessage("BRK");
    }
    return 0;
};

export const lda: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setAreg(arg);
    cpu.setFlags(arg);
    if (debug) {
        cpu.logMessage(`Loaded ${Util.hex(cpu.getAreg())} into A`);
    }
    return 0;
};

export const ldx: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setXreg(arg);
    cpu.setFlags(arg);
    if (debug) {
        cpu.logMessage(`Loaded ${Util.hex(cpu.getXreg())} into X`);
    }
    return 0;
};

export const ldy: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setYreg(arg);
    cpu.setFlags(arg);
    if (debug) {
        cpu.logMessage(`Loaded ${Util.hex(cpu.getYreg())} into Y`);
    }
    return 0;
};

export const sta: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.writeToMem(cpu.getAreg(), arg);
    if (debug) {
        cpu.logMessage(`Stored ${Util.hex(cpu.getAreg())} into memory at ${Util.hex(arg)}`);
    }
    return 0;
};

export const stx: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.writeToMem(cpu.getXreg(), arg);
    if (debug) {
        cpu.logMessage(`Stored ${Util.hex(cpu.getXreg())} into memory at ${Util.hex(arg)}`);
    }
    return 0;
};

export const sty: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.writeToMem(cpu.getYreg(), arg);
    if (debug) {
        cpu.logMessage(`Stored ${Util.hex(cpu.getYreg())} into memory at ${Util.hex(arg)}`);
    }
    return 0;
};

export const tax: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setXreg(cpu.getAreg());
    cpu.setFlags(cpu.getXreg());
    if (debug) {
        cpu.logMessage(`Transfered A ${Util.hex(cpu.getAreg())} into X`);
    }
    return 0;
};

export const txa: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setAreg(cpu.getXreg());
    cpu.setFlags(cpu.getXreg());
    if (debug) {
        cpu.logMessage(`Transfered X ${Util.hex(cpu.getXreg())} into A`);
    }
    return 0;
};

export const tay: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setYreg(cpu.getAreg());
    cpu.setFlags(cpu.getAreg());
    if (debug) {
        cpu.logMessage(`Transfered A ${Util.hex(cpu.getAreg())} into Y`);
    }
    return 0;
};

export const tya: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setAreg(cpu.getYreg());
    cpu.setFlags(cpu.getYreg());
    if (debug) {
        cpu.logMessage(`Transfered Y ${Util.hex(cpu.getYreg())} into A`);
    }
    return 0;
};

export const txs: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setSP(cpu.getXreg());
    if (debug) {
        cpu.logMessage(`Stored X ${cpu.getXreg()} into stack pointer`);
    }
    return 0;
};

export const tsx: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setXreg(cpu.getSP());
    cpu.setFlags(cpu.getSP());
    if (debug) {
        cpu.logMessage(`Stored SP ${cpu.getSP()} into X`);
    }
    return 0;
};

export const inc: operationMethod = (cpu, arg, addrMode, debug) => {
    const result = cpu.readFromMem(arg) + 1;
    cpu.writeToMem(result, arg);
    cpu.setFlags(result);
    if (debug) {
        cpu.logMessage(`Incremented ${arg}`);
    }
    return 0;
};

export const dec: operationMethod = (cpu, arg, addrMode, debug) => {
    const result = cpu.readFromMem(arg) - 1;
    cpu.writeToMem(result, arg);
    cpu.setFlags(result);
    if (debug) {
        cpu.logMessage(`Decremented ${arg}`);
    }
    return 0;
};

export const inx: operationMethod = (cpu, arg, addrMode, debug) => {
    let val = cpu.getXreg() + 1;
    cpu.setXreg(val);
    cpu.setFlags(val);
    if (debug) {
        cpu.logMessage(`Incremented X`);
    }
    return 0;
};

export const dex: operationMethod = (cpu, arg, addrMode, debug) => {
    let val = cpu.getXreg() - 1;
    cpu.setXreg(val);
    cpu.setFlags(val);
    if (debug) {
        cpu.logMessage(`Decremented X`);
    }
    return 0;
};

export const iny: operationMethod = (cpu, arg, addrMode, debug) => {
    let val = cpu.getYreg() + 1;
    cpu.setYreg(val);
    cpu.setFlags(val);
    if (debug) {
        cpu.logMessage(`Incremented Y`);
    }
    return 0;
};

export const dey: operationMethod = (cpu, arg, addrMode, debug) => {
    let val = cpu.getYreg() - 1;
    cpu.setYreg(val);
    cpu.setFlags(val);
    if (debug) {
        cpu.logMessage(`Decremented Y`);
    }
    return 0;
};

export const jmp: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setPC(arg);
    if (debug) {
        cpu.logMessage(`Jumped to ${Util.hex(arg)}`);
    }
    return 0;
};

export const jsr: operationMethod = (cpu, arg, addrMode, debug) => {
    let from = cpu.getPC() - 1;
    let [lo, hi] = Util.addrToBytes(from);

    cpu.pushToStack(hi);
    cpu.pushToStack(lo);
    cpu.setPC(arg);
    if (debug) {
        cpu.logMessage(`Jumped to subroutine ${Util.hex(arg)} from ${Util.hex(Util.bytesToAddr(lo, hi))}`);
    }
    return 0;
};

export const rts: operationMethod = (cpu, arg, addrMode, debug) => {
    let lo = cpu.pullFromStack();
    let hi = cpu.pullFromStack();
    let returnAddr = Util.bytesToAddr(lo, hi) + 1;

    cpu.setPC(returnAddr);
    if (debug) {
        cpu.logMessage(`Returned from subroutine to ${Util.hex(returnAddr)}`);
    }
    return 0;
};

export const rti: operationMethod = (cpu, arg, addrMode, debug) => {

    let lo = cpu.pullFromStack();
    let hi = cpu.pullFromStack();
    let statusReg = cpu.pullFromStack();
    let returnAddr = Util.bytesToAddr(lo, hi);

    cpu.setStatusReg(statusReg);
    cpu.setPC(returnAddr);
    cpu.endNMI();
    if (debug) {
        cpu.logMessage(`Returned from interrupt to ${Util.hex(returnAddr)}`);
    }
    return 0;
};

export const sec: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setCarry();
    if (debug) {
        cpu.logMessage(`Set Carry`);
    }
    return 0;
};

export const clc: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.clearCarry();
    if (debug) {
        cpu.logMessage(`Cleared Carry`);
    }
    return 0;
};

export const adc: operationMethod = (cpu, arg, addrMode, debug) => {
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
    cpu.setFlags(result);
    if (debug) {
        cpu.logMessage(`Added ${arg} to A`);
    }
    return 0;
};

export const sbc: operationMethod = (cpu, arg, addrMode, debug) => {
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
    cpu.setFlags(result);
    if (debug) {
        cpu.logMessage(`Subtracted ${arg} from A`);
    }
    return 0;
};

export const cmp: operationMethod = (cpu, arg, addrMode, debug) => {
    let result = cpu.getAreg() - arg;
    cpu.setFlags(result);

    if(result < 0){
        cpu.clearCarry();
    } else {
        cpu.setCarry();
    }
    if (debug) {
        cpu.logMessage(`Compared A (${Util.hex(cpu.getAreg())}) to ${Util.hex(arg)}`);
    }
    return 0;
};

export const cpx: operationMethod = (cpu, arg, addrMode, debug) => {
    let result = cpu.getXreg() - arg;
    cpu.setFlags(result);

    if(result < 0){
        cpu.clearCarry();
    } else {
        cpu.setCarry();
    }
    if (debug) {
        cpu.logMessage(`Compared X (${Util.hex(cpu.getXreg())}) to ${Util.hex(arg)}`);
    }
    return 0;
};

export const cpy: operationMethod = (cpu, arg, addrMode, debug) => {
    let result = cpu.getYreg() - arg;
    cpu.setFlags(result);

    if(result < 0){
        cpu.clearCarry();
    } else {
        cpu.setCarry();
    }
    if (debug) {
        cpu.logMessage(`Compared Y (${Util.hex(cpu.getYreg())}) to ${Util.hex(arg)}`);
    }
    return 0;
};

export const bit: operationMethod = (cpu, arg, addrMode, debug) => {
    let result = cpu.getAreg() & arg;
    cpu.setFlags(result);
    if((arg & 0x80) === 0x80) cpu.setNegative(); else cpu.clearNegative();
    if((arg & 0x40) === 0x40) cpu.setOverflow(); else cpu.clearOverflow();
    if (debug) {
        cpu.logMessage(`BIT with ${Util.hex(arg)}`);
    }
    return 0;
};

export const beq: operationMethod = (cpu, arg, addrMode, debug) => {
    let extraCycles = 0;
    if(cpu.getFlags().Z){
        cpu.setPC(arg);
        extraCycles = 1;
    }

    if (debug) {
        cpu.logMessage(`Branch if equal (${Util.hex(arg)})`);
    }
    
    return extraCycles;
};

export const bne: operationMethod = (cpu, arg, addrMode, debug) => {
    let extraCycles = 0;
    if(!cpu.getFlags().Z){
        cpu.setPC(arg);
        extraCycles = 1;
    }
    if (debug) {
        cpu.logMessage(`Branch if not equal (${Util.hex(arg)})`);
    }
    return extraCycles;
};

export const bcc: operationMethod = (cpu, arg, addrMode, debug) => {
    let extraCycles = 0;
    if(!cpu.getFlags().C){
        cpu.setPC(arg);
        extraCycles = 1;
    }
    if (debug) {
        cpu.logMessage(`Branch if carry clear (${Util.hex(arg)})`);
    }
    return extraCycles;
};

export const bcs: operationMethod = (cpu, arg, addrMode, debug) => {
    let extraCycles = 0;
    if(cpu.getFlags().C){
        cpu.setPC(arg);
        extraCycles = 1;
    }
    if (debug) {
        cpu.logMessage(`Branch if carry set (${Util.hex(arg)})`);
    }
    return extraCycles;
};

export const bmi: operationMethod = (cpu, arg, addrMode, debug) => {
    let extraCycles = 0;
    if(cpu.getFlags().N){
        cpu.setPC(arg);
        extraCycles = 1;
    }
    if (debug) {
        cpu.logMessage(`Branch if negative (${Util.hex(arg)})`);
    }
    return extraCycles;
};

export const bpl: operationMethod = (cpu, arg, addrMode, debug) => {
    let extraCycles = 0;
    if(!cpu.getFlags().N){
        cpu.setPC(arg);
        extraCycles = 1;
    }
    if (debug) {
        cpu.logMessage(`Branch if not negative (${Util.hex(arg)})`);
    }
    return extraCycles;
};

export const and: operationMethod = (cpu, arg, addrMode, debug) => {
    const result = cpu.getAreg() & arg;
    cpu.setAreg(result);
    cpu.setFlags(result);
    if (debug) {
        cpu.logMessage(`AND ${Util.hex(arg)} with A`);
    }

    return 0;
};

export const ora: operationMethod = (cpu, arg, addrMode, debug) => {
    const result = cpu.getAreg() | arg;
    cpu.setAreg(result);
    cpu.setFlags(result);
    if (debug) {
        cpu.logMessage(`OR ${Util.hex(arg)} with A`);
    }

    return 0;
};

export const eor: operationMethod = (cpu, arg, addrMode, debug) => {
    const result = cpu.getAreg() ^ arg;
    cpu.setAreg(result);
    cpu.setFlags(result);
    if (debug) {
        cpu.logMessage(`EOR ${Util.hex(arg)} with A`);
    }

    return 0;
};

export const pha: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.pushToStack(cpu.getAreg());
    if (debug) {
        cpu.logMessage(`Pushed A to stack`);
    }

    return 0;
};

export const pla: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setAreg(cpu.pullFromStack());
    cpu.setFlags(cpu.getAreg());
    if (debug) {
        cpu.logMessage(`Pulled A from stack`);
    }

    return 0;
};

export const php: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.pushToStack(cpu.getStatusReg());
    if (debug) {
        cpu.logMessage(`Pushed Status Reg to stack`);
    }
    return 0;
};

export const plp: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setStatusReg(cpu.pullFromStack());
    if (debug) {
        cpu.logMessage(`Pulled Status Reg from stack`);
    }

    return 0;
};

export const asl: operationMethod = (cpu, arg, addrMode, debug) => {
    const originalValue = (addrMode === addrModes.ACCUMULATOR) ? cpu.getAreg() : cpu.readFromMem(arg);
    let result = (originalValue << 1) & 0xFF;

    if (addrMode === addrModes.ACCUMULATOR) { // Accumulator mode
        cpu.setAreg(result);
    } else {
        cpu.writeToMem(result, arg);
    }

    cpu.setFlags(result);

    if((originalValue & 0x80) === 0x80){
        cpu.setCarry();
    } else {
        cpu.clearCarry();
    }

    if (debug) {
        cpu.logMessage(`ASL on A ${Util.hex(arg)}`);
    }

    return 0;
};

export const lsr: operationMethod = (cpu, arg, addrMode, debug) => {
    const originalValue = (addrMode === addrModes.ACCUMULATOR) ? cpu.getAreg() : cpu.readFromMem(arg);
    let result = (originalValue >> 1) & 0xFF;

    if (addrMode === addrModes.ACCUMULATOR) { // Accumulator mode
        cpu.setAreg(result);
    } else {
        cpu.writeToMem(result, arg);
    }

    cpu.setFlags(result);

    if((originalValue & 0x01) === 0x01){
        cpu.setCarry();
    } else {
        cpu.clearCarry();
    }

    if (debug) {
        cpu.logMessage(`LSR on A ${Util.hex(arg)}`);
    }

    return 0;
};

export const ror: operationMethod = (cpu, arg, addrMode, debug) => {
    let c = Number(cpu.getFlags().C);
    const originalValue = (addrMode === addrModes.ACCUMULATOR) ? cpu.getAreg() : cpu.readFromMem(arg);
    let result = ((originalValue >> 1) & 0xFF) | ((c << 7) & 0x80);

    if (addrMode === addrModes.ACCUMULATOR) {
        cpu.setAreg(result);
    } else {
        cpu.writeToMem(result, arg);
    }

    cpu.setFlags(result);

    if ((originalValue & 0x01) === 0x01) {
        cpu.setCarry();
    } else {
        cpu.clearCarry();
    }

    if (debug) {
        cpu.logMessage(`ROR on A ${Util.hex(arg)}`);
    }

    return 0;
};

export const rol: operationMethod = (cpu, arg, addrMode, debug) => {
    let c = Number(cpu.getFlags().C);
    const originalValue = (addrMode === addrModes.ACCUMULATOR) ? cpu.getAreg() : cpu.readFromMem(arg);
    let result = ((originalValue << 1) & 0xFF) | c;

    if (addrMode === addrModes.ACCUMULATOR) { // Accumulator mode
        cpu.setAreg(result);
    } else {
        cpu.writeToMem(result, arg);
    }

    cpu.setFlags(result);

    if ((originalValue & 0x80) === 0x80) {
        cpu.setCarry();
    } else {
        cpu.clearCarry();
    }

    if (debug) {
        cpu.logMessage(`ROL on A ${Util.hex(arg)}`);
    }

    return 0;
};