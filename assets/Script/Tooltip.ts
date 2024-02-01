export class Tooltip{

    private static _instance: Tooltip;
    public static getInstance(): Tooltip {
        if (!this._instance) {
            this._instance = new Tooltip();
        }
        return this._instance;
    }
}