export class HashMap<T> implements HashMapInterface<T> {
    private _keys: string[] = [];
    private _values: T[] = [];

    constructor(init?: { key: string; value: T; }[]) {
        if (init) {
            for (let x = 0; x < init.length; x++) {
                // @ts-ignore
                this[init[x].key] = init[x].value;
                this._keys.push(init[x].key);
                this._values.push(init[x].value);
            }
        }
    }

    public add(key: string, value: T): void {
        // @ts-ignore
        this[key] = value;
        this._keys.push(key);
        this._values.push(value);
    }

    public remove(key: string): void {
        const index = this._keys.indexOf(key, 0);
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        // @ts-ignore
        delete this[key];
    }

    public get(key: string): T {
        // @ts-ignore
        return this[key];
    }

    public keys(): string[] {
        return this._keys;
    }

    public values(): T[] {
        return this._values;
    }

    public containsKey(key: string): boolean {
        // @ts-ignore
        return typeof this[key] !== 'undefined';

    }

    public toLookup(): HashMapInterface<T> {
        return this;
    }

    public lenght(): number {
        return this._keys.length;
    }
}
