import {MINETransport} from "./transports/mine-transport.js";
import { MesenTransport } from "./transports/mesen-transport.js";
import * as Coordinator from "./coordinator.js";

const MINE = new MINETransport(Coordinator.handleTransportEvent);
const Mesen = new MesenTransport(Coordinator.handleTransportEvent);

Coordinator.addTransport(MINE);
Coordinator.addTransport(Mesen);

Coordinator.startTransports();