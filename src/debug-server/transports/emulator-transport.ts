import { TransportEventName } from "../../shared/debug-types";

export abstract class EmulatorTransport {

    public abstract readonly name: string;
    protected eventHandler: Function;

    constructor(eventHandler: Function) {
        this.eventHandler = eventHandler;
    }

    emit(event: TransportEventName, data: Object = null) {
        this.eventHandler({
            transport: this,
            event,
            data
        })
    }

    abstract start(): void;
    abstract step(): void;
    abstract reset(): void;
}