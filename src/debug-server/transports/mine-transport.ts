import { WebSocket, WebSocketServer } from "ws";
import {EmulatorTransport} from "./emulator-transport.js"
import { EmulatorEventName, OpExecutionInfo } from "../../shared/debug-types.js";
const PORT = 3000;

export class MINETransport extends EmulatorTransport {

    public readonly name: string = "MINE";
    protected wss: WebSocketServer = null;
    protected emuSocket: WebSocket = null;

    constructor(eventHandler: Function) {
        super(eventHandler);
    }

    start() {

        const PORT = 3000;
        this.wss = new WebSocketServer({ port: PORT });

        console.log(`${this.name} server running at port ${PORT}. Waiting for ${this.name}`);

        this.wss.on('connection', (socket: WebSocket) => {

            this.emuSocket = socket

            this.emit("connect");

            socket.on('message', (raw: Buffer) => {
                const message = JSON.parse(raw.toString());
                const eventName: EmulatorEventName = message.event;
                const opData: OpExecutionInfo = message.data;

                switch (eventName) {
                    case "step":
                        this.emit("step", opData);
                        break;
                }
                
            });

            socket.on('close', () => {
                this.emit("disconnect");
            });

        });

    }

    step() {
        if (!this.emuSocket) return;
        this.emuSocket.send("step");
    }

    reset() {
        if (!this.emuSocket) return;
        this.emuSocket.send("reset");
    }

}