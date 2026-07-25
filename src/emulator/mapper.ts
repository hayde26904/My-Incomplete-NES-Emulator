import { ROM } from "./rom";

export abstract class Mapper {
    public rom : ROM;

    constructor() {
    }

    public setPrgRom(rom : ROM) : void {
        this.rom = rom;
    }

    public getPrgRom() : ROM {
        return this.rom;
    }

    public abstract read(address : number) : number;
    public abstract write(value : number, address : number) : void;

}