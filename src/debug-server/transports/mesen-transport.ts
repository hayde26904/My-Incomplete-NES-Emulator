import {EmulatorTransport} from "./emulator-transport.js"

export class MesenTransport extends EmulatorTransport {

    public readonly name: string = "Mesen";

    constructor(eventHandler: Function) {
        super(eventHandler);
    }

    start(){
    }

    step(){

    }
}