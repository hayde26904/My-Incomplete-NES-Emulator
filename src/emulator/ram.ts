import { Memory } from "./memory";

export class RAM extends Memory {
    constructor(size: number, bytes?: Uint8Array){
        super(size, bytes);
    }
}