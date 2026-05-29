
export class InputManager {
    keys = new Set();

    constructor() {
        window.addEventListener('keydown', (e) => {
            console.log(e.code);
            this.keys.add(e.code)
        });
        window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    }

    isPressed = (code) => {
        return this.keys.has(code);
    }
}



export const input = new InputManager();