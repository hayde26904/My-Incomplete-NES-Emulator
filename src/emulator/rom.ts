import { Memory } from "./memory";

export class ROM extends Memory {
    constructor(bytes: Uint8Array){
        super(bytes.length, bytes);
    }

    public override write(value: number, address : number){
    }
}