interface HashMapInterface<T> {

    //simple hashmap from Java
    add(key: string, value: T): void;
    remove(key: string): void;
    containsKey(key: string): boolean;
    get(key: string): T;
    keys(): string[];
    lenght(): number;
    values(): T[];
}
