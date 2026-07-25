export class Util {
    public static bytesToAddr(lobyte : number, hibyte : number): number {
        let lo = lobyte & 0xFF;
        let hi = hibyte & 0xFF;
        return (hi << 8) | lo;
    }

    public static addrToBytes(addr : number): Uint8Array {
        let lo = addr & 0xFF;
        let hi = (addr & 0xFF00) >> 8;
        return new Uint8Array([lo, hi]);
    }

    public static Uint8ArrayToHex(arr : Uint8Array) {
        return Array.from(arr).map(byte => byte.toString(16).padStart(2, '0')).join(' ');
    }

    public static hex(value : number) : string {
        if(typeof value === 'undefined' || value === null){
            return "none";
        } else {
            return value.toString(16).toUpperCase().padStart(2, '0');
        }
    }

    public static binary(value : number) : string {
        if(value === null){
            return "none";
        } else {
            return value.toString(2);
        }
    }

    public static getBit(byte : number, bit : number) : number{
        return (byte >> bit) & 1;
    }

    //bitmask matches order that booleans come in array. true true false false = 1100
    public static boolsToBitmask(bools : Array<boolean>) : number{
        let mask = 0;
        let startingPoint = 1 << bools.length - 1;

        bools.forEach((value, i) => {
            if (value) {
                mask = mask ^ (startingPoint >> i);
            }
        });

        return mask;
    }

    public static bitmaskToBools(bitmask : number) : Array<boolean> {
        let len = Math.floor(Math.log2(bitmask)) + 1;
        let startingPoint = 1 << len - 1;
        let bools = new Array();

        for(let i = 0; i < len; i++){
            if ((bitmask >> (len - 1 - i)) & 1) {
                bools[i] = Boolean(bitmask ^ (startingPoint >> i));
            } else {
                bools[i] = false;
            }
        }

        return bools;
    }
}