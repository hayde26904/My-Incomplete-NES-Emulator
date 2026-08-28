// will be cleaned up later
export class Input {
    private keyState : Set<string>;
    private controlStack : Array<number> = [];

    constructor(){
        this.keyState = new Set<string>();
        window.addEventListener("keydown", (event) => {
            this.keyState.add(event.code);
        });
        window.addEventListener("keyup", (event) => {
            this.keyState.delete(event.code);
        });
    }

    public prepareControlStack(){
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

    public shiftControlStack() : number {
        if(this.controlStack.length === 0){
            return 1;
        }
        return this.controlStack.shift();
    }


}
