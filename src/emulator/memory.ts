export abstract class Memory {
    private memory: Uint8Array;

    constructor(size : number, bytes? : Uint8Array) {
        if(!bytes){
            this.memory = new Uint8Array(size).fill(0);
        } else {
            this.memory = bytes;
        }
    }

    public read(address: number): number {
        return this.memory[address];
    }

    public readRange(start : number, end : number): Uint8Array {
        return this.memory.slice(start, end);
    }

    public write(value: number, address : number): void {
        this.memory[address] = value;
    }

    public getSize() : number{
        return this.memory.length;
    }

    public getMemory() : Uint8Array{
        return this.memory;
    }
    
    public setMemory(bytes : Uint8Array) : void {
        this.memory = bytes;
    }
}