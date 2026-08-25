import { CPU, addrModes } from "./cpu";
import { Util } from "./util";

export type operationMethod = (cpu: CPU, arg: number, addrMode: number, debug: boolean) => void;

export const brk: operationMethod = (cpu, arg, addrMode, debug) => {
    if (debug) {
        cpu.logMessage("BRK");
    }
};

export const lda: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setAreg(arg);
    cpu.setFlags(arg);
    if (debug) {
        cpu.logMessage(`Loaded ${Util.hex(cpu.getAreg())} into A`);
    }
};

export const ldx: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setXreg(arg);
    if (debug) {
        cpu.logMessage(`Loaded ${Util.hex(cpu.getXreg())} into X`);
    }
};

export const ldy: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setYreg(arg);
    if (debug) {
        cpu.logMessage(`Loaded ${Util.hex(cpu.getYreg())} into Y`);
    }
};

export const sta: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.writeToMem(cpu.getAreg(), arg);
    if (debug) {
        cpu.logMessage(`Stored ${Util.hex(cpu.getAreg())} into memory at ${Util.hex(arg)}`);
    }
};

export const stx: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.writeToMem(cpu.getXreg(), arg);
    if (debug) {
        cpu.logMessage(`Stored ${Util.hex(cpu.getXreg())} into memory at ${Util.hex(arg)}`);
    }
};

export const sty: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.writeToMem(cpu.getYreg(), arg);
    if (debug) {
        cpu.logMessage(`Stored ${Util.hex(cpu.getYreg())} into memory at ${Util.hex(arg)}`);
    }
};

export const tax: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setXreg(cpu.getAreg());
    if (debug) {
        cpu.logMessage(`Transfered A ${Util.hex(cpu.getAreg())} into X`);
    }
};

export const txa: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setAreg(cpu.getXreg());
    cpu.setFlags(cpu.getXreg());
    if (debug) {
        cpu.logMessage(`Transfered X ${Util.hex(cpu.getXreg())} into A`);
    }
};

export const tay: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setYreg(cpu.getAreg());
    if (debug) {
        cpu.logMessage(`Transfered A ${Util.hex(cpu.getAreg())} into Y`);
    }
};

export const tya: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setAreg(cpu.getYreg());
    cpu.setFlags(cpu.getYreg());
    if (debug) {
        cpu.logMessage(`Transfered Y ${Util.hex(cpu.getYreg())} into A`);
    }
};

export const txs: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setSP(cpu.getXreg());
    if (debug) {
        cpu.logMessage(`Stored X ${cpu.getXreg()} into stack pointer`);
    }
};

export const tsx: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setXreg(cpu.getSP());
    cpu.setFlags(cpu.getSP());
    if (debug) {
        cpu.logMessage(`Stored SP ${cpu.getSP()} into X`);
    }
};

export const inc: operationMethod = (cpu, arg, addrMode, debug) => {
    const result = cpu.readFromMem(arg) + 1;
    cpu.writeToMem(result, arg);
    cpu.setFlags(result);
    if (debug) {
        cpu.logMessage(`Incremented ${arg}`);
    }
};

export const dec: operationMethod = (cpu, arg, addrMode, debug) => {
    const result = cpu.readFromMem(arg) - 1;
    cpu.writeToMem(result, arg);
    cpu.setFlags(result);
    if (debug) {
        cpu.logMessage(`Decremented ${arg}`);
    }
};

export const inx: operationMethod = (cpu, arg, addrMode, debug) => {
    let val = cpu.getXreg() + 1;
    cpu.setXreg(val);
    cpu.setFlags(val);
    if (debug) {
        cpu.logMessage(`Incremented X`);
    }
};

export const dex: operationMethod = (cpu, arg, addrMode, debug) => {
    let val = cpu.getXreg() - 1;
    cpu.setXreg(val);
    cpu.setFlags(val);
    if (debug) {
        cpu.logMessage(`Decremented X`);
    }
};

export const iny: operationMethod = (cpu, arg, addrMode, debug) => {
    let val = cpu.getYreg() + 1;
    cpu.setYreg(val);
    cpu.setFlags(val);
    if (debug) {
        cpu.logMessage(`Incremented Y`);
    }
};

export const dey: operationMethod = (cpu, arg, addrMode, debug) => {
    let val = cpu.getYreg() - 1;
    cpu.setYreg(val);
    cpu.setFlags(val);
    if (debug) {
        cpu.logMessage(`Decremented Y`);
    }
};

export const jmp: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setPC(arg);
    if (debug) {
        cpu.logMessage(`Jumped to ${Util.hex(arg)}`);
    }
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
};

export const rts: operationMethod = (cpu, arg, addrMode, debug) => {
    let lo = cpu.pullFromStack();
    let hi = cpu.pullFromStack();
    let returnAddr = Util.bytesToAddr(lo, hi) + 1;

    cpu.setPC(returnAddr);
    if (debug) {
        cpu.logMessage(`Returned from subroutine to ${Util.hex(returnAddr)}`);
    }
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
};

export const sec: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setCarry();
    if (debug) {
        cpu.logMessage(`Set Carry`);
    }
};

export const clc: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.clearCarry();
    if (debug) {
        cpu.logMessage(`Cleared Carry`);
    }
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
        cpu.logMessage(`Compared X (${Util.hex(cpu.getAreg())}) to ${Util.hex(arg)}`);
    }
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
};

export const bit: operationMethod = (cpu, arg, addrMode, debug) => {
    let result = cpu.getAreg() & arg;
    cpu.setFlags(result);
    if((arg & 0x80) === 0x80) cpu.setNegative(); else cpu.clearNegative();
    if((arg & 0x40) === 0x40) cpu.setOverflow(); else cpu.clearOverflow();
    if (debug) {
        cpu.logMessage(`BIT with ${Util.hex(arg)}`);
    }
};

export const beq: operationMethod = (cpu, arg, addrMode, debug) => {
    if(cpu.getFlags().Z){
        cpu.setPC(arg);
    }
    if (debug) {
        cpu.logMessage(`Branch if equal (${Util.hex(arg)})`);
    }
};

export const bne: operationMethod = (cpu, arg, addrMode, debug) => {
    if(!cpu.getFlags().Z){
        cpu.setPC(arg);
    }
    if (debug) {
        cpu.logMessage(`Branch if not equal (${Util.hex(arg)})`);
    }
};

export const bcc: operationMethod = (cpu, arg, addrMode, debug) => {
    if(!cpu.getFlags().C){
        cpu.setPC(arg);
    }
    if (debug) {
        cpu.logMessage(`Branch if carry clear (${Util.hex(arg)})`);
    }
};

export const bcs: operationMethod = (cpu, arg, addrMode, debug) => {
    if(cpu.getFlags().C){
        cpu.setPC(arg);
    }
    if (debug) {
        cpu.logMessage(`Branch if carry set (${Util.hex(arg)})`);
    }
};

export const bmi: operationMethod = (cpu, arg, addrMode, debug) => {
    if(cpu.getFlags().N){
        cpu.setPC(arg);
    }
    if (debug) {
        cpu.logMessage(`Branch if negative (${Util.hex(arg)})`);
    }
};

export const bpl: operationMethod = (cpu, arg, addrMode, debug) => {
    if(!cpu.getFlags().N){
        cpu.setPC(arg);
    }
    if (debug) {
        cpu.logMessage(`Branch if not negative (${Util.hex(arg)})`);
    }
};

export const and: operationMethod = (cpu, arg, addrMode, debug) => {
    const result = cpu.getAreg() & arg;
    cpu.setAreg(result);
    cpu.setFlags(result);
    if (debug) {
        cpu.logMessage(`AND ${arg} with A`);
    }
};

export const ora: operationMethod = (cpu, arg, addrMode, debug) => {
    const result = cpu.getAreg() | arg;
    cpu.setAreg(result);
    cpu.setFlags(result);
    if (debug) {
        cpu.logMessage(`OR ${arg} with A`);
    }
};

export const eor: operationMethod = (cpu, arg, addrMode, debug) => {
    const result = cpu.getAreg() ^ arg;
    cpu.setAreg(result);
    cpu.setFlags(result);
    if (debug) {
        cpu.logMessage(`EOR ${arg} with A`);
    }
};

export const pha: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.pushToStack(cpu.getAreg());
    if (debug) {
        cpu.logMessage(`Pushed A to stack`);
    }
};

export const pla: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setAreg(cpu.pullFromStack());
    cpu.setFlags(cpu.getAreg());
    if (debug) {
        cpu.logMessage(`Pulled A from stack`);
    }
};

export const php: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.pushToStack(cpu.getStatusReg());
    if (debug) {
        cpu.logMessage(`Pushed Status Reg to stack`);
    }
};

export const plp: operationMethod = (cpu, arg, addrMode, debug) => {
    cpu.setStatusReg(cpu.pullFromStack());
    if (debug) {
        cpu.logMessage(`Pulled Status Reg from stack`);
    }
};

export const asl: operationMethod = (cpu, arg, addrMode, debug) => {
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

    if (debug) {
        cpu.logMessage(`ASL on A ${Util.hex(arg)}`);
    }
};

export const lsr: operationMethod = (cpu, arg, addrMode, debug) => {
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

    if (debug) {
        cpu.logMessage(`LSR on A ${Util.hex(arg)}`);
    }
};

export const ror: operationMethod = (cpu, arg, addrMode, debug) => {
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

    if (debug) {
        cpu.logMessage(`ROR on A ${Util.hex(arg)}`);
    }
};

export const rol: operationMethod = (cpu, arg, addrMode, debug) => {
    let c = Number(cpu.getFlags().C);
    let result = ((arg << 1) & 0xFF) | c;

    if (addrMode === addrModes.ACCUMULATOR) { // Accumulator mode
        cpu.setAreg(result);
    } else {
        cpu.writeToMem(result, arg);
    }

    cpu.setFlags(result);

    if ((result & 0x80) === 0x80) {
        cpu.setCarry();
    } else {
        cpu.clearCarry();
    }

    if (debug) {
        cpu.logMessage(`ROL on A ${Util.hex(arg)}`);
    }
};