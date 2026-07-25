import { TransportEvent, OpExecutionInfo} from "../shared/debug-types.js";
import { EmulatorTransport } from "./transports/emulator-transport.js";

const STEP_INTERVAL = 1;

const transports = new Set<EmulatorTransport>();
const connectedTransports = new Set<EmulatorTransport>(); // emulators connected over the network

export function addTransport(transport: EmulatorTransport) {
    transports.add(transport);
}

export function startTransports() {
    transports.forEach((transport: EmulatorTransport) => {
        transport.start();
    });
}

export function handleTransportEvent(event: TransportEvent) {
    const eventName = event.event;

    switch (eventName) {
        case "connect":
            handleConnect(event.transport);
            break;
        case "disconnect":
            handleDisconnect(event.transport);
            break;
        case "step":
            handleStep(event.transport, event.data as OpExecutionInfo);
            break;
    }
}

function handleConnect(transport: EmulatorTransport) {
    if (!transports.has(transport)) throw new Error("Unknown Emulator");
    connectedTransports.add(transport);
    console.log(`${transport.name} connected successfully`);

    if (connectedTransports.size >= 1) {
        startStepping();
    }
    
}

function handleDisconnect(transport: EmulatorTransport) {
    connectedTransports.delete(transport);
    console.log(`${transport.name} disconnected successfully`);
}

function handleStep(transport: EmulatorTransport, opData: OpExecutionInfo) {
    console.log(`${transport.name}: ${JSON.stringify(opData)}`);
    setTimeout(() => {

        if (connectedTransports.has(transport)) {
            transport.step();
        }

    }, STEP_INTERVAL);
}

function startStepping() {
    console.log("STARTING STEPPING");
    connectedTransports.forEach((transport: EmulatorTransport) => {
        transport.step();
    });
}

function stopStepping() {

}