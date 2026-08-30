// will be cleaned up later
export class Input {
    private keyState : Set<string>;
    private controlStack : Array<number> = [];
    private controlStackIndex : number = 0;
    private latchBitmask : number = 0;

    constructor(){
        this.keyState = new Set<string>();
        window.addEventListener("keydown", (event) => {
            this.keyState.add(event.code);
        });
        window.addEventListener("keyup", (event) => {
            this.keyState.delete(event.code);
        });
    }

    public pollController(){
        this.controlStack = [
            +this.keyState.has("Space"),
            +this.keyState.has("ShiftLeft"),
            +this.keyState.has("ShiftRight"),
            +this.keyState.has("Enter"),
            +this.keyState.has("KeyW"),
            +this.keyState.has("KeyS"),
            +this.keyState.has("KeyA"),
            +this.keyState.has("KeyD")
        ];
    }

    public read() : number {
        
        const value = this.controlStack[this.controlStackIndex];
        this.controlStackIndex = (this.controlStackIndex + 1) % this.controlStack.length;
        return value;
    }

    public write(bitmask : number){
        this.latchBitmask = bitmask;

        if (this.latchBitmask === 1) {
            this.pollController();
        }
    }


}
