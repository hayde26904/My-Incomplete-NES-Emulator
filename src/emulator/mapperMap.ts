import { Mapper } from "./mapper";
import { NROM } from "./mappers";
import { ROM } from "./rom";


export const mapperMap = new Map<number, Mapper>([
    [0x00, new NROM()],
]);