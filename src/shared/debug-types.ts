import { EmulatorTransport } from "../debug-server/transports/emulator-transport";

export interface OpExecutionInfo {
    PC: number,
    opCode: number,
    A: number,
    X: number,
    Y: number,
    SP: number,
    status: number
}

export type TransportEventName =
    "connect" |
    "disconnect" |
    "step";

export type EmulatorEventName =
    "step"

export interface EmulatorEvent {
    event: EmulatorEventName,
    data: Object
}

export interface TransportEvent {
    transport: EmulatorTransport,
    event: TransportEventName,
    data: Object
}