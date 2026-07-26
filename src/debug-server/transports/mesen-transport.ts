import {EmulatorTransport} from "./emulator-transport.js"
import {createServer, Server, Socket} from "node:net";

export class MesenTransport extends EmulatorTransport {

    public readonly name: string = "Mesen";
    protected tcpServer: Server = null;
    protected emuSocket: Socket = null;

    constructor(eventHandler: Function) {
        super(eventHandler);
    }

    start(){

        const PORT = 3001;
        const server = createServer();

        server.on("connection", (socket: Socket) => {
            this.emuSocket = socket;

            this.emit("connect");

            socket.on("close", () => {
                this.emit("disconnect");
            });
        });

        server.listen(PORT, () => {
            console.log(`${this.name} server running at port ${PORT}. Waiting for ${this.name}`);
        });

    }

    step(){
        if (!this.emuSocket) return;
        this.emuSocket.emit("step\n");
    }

    reset(){
        if (!this.emuSocket) return;
        this.emuSocket.emit("reset\n");
    }
}