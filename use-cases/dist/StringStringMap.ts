interface StringStringKey {
  readonly firstKey: string,
  readonly secondKey: string
}

export default class StringStringMap<V> {
    readonly [Symbol.toStringTag]: string = "StringStringMap";
    readonly #hashMap = new Map<string, V>;

    /** @returns the number of elements in the Map. */
    get size(): number {
    }

    static #hashKeys(firstKey: string, secondKey: string): string {
        return JSON.stringify({firstKey, secondKey});
    }

    static #parseKeys(hashedKey: string): [string, string] {
        const { firstKey, secondKey } = JSON.parse(hashedKey) as StringStringKey;
        return [firstKey, secondKey];
    }

    clear(): void {
    }

    /** @returns true if an element in the Map existed and has been removed, or false if the element does not exist. */
    delete(firstKey: string, secondKey: string): boolean {
    }

    /**
     * Executes a provided function once per each key/value pair in the Map, in insertion order.
     */
    forEach(callbackfn: (value: V, firstKey: string, secondKey: string, map: StringStringMap) => void, thisArg?: any): void {
    }

    /**
     * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
     * @returns Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
     */
    get(firstKey: string, secondKey: string): V | undefined {
    }

    /** @returns boolean indicating whether an element with the specified key exists or not. */
    has(firstKey: string, secondKey: string): boolean {
    }

    /**
     * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
     */
    set(firstKey: string, secondKey: string, value: V): this {
    }

    /** Returns an iterable of entries in the map. */
    *[Symbol.iterator](): IterableIterator<[string, string, V]> {
        for (const x of this.#hashMap[Symbol.iterator]()) {
                  const [ firstKey, secondKey ] = StringStringMap.#parseKeys(x[0]);
                  yield [firstKey, secondKey, x[1]];
                }
    }

    /**
     * Returns an iterable of key, value pairs for every entry in the map.
     */
    entries(): IterableIterator<[string, string, V]> {
        return this[Symbol.iterator]();
    }

    /**
     * Returns an iterable of keys in the map
     */
    *keys(): IterableIterator<[string, string]> {
        for (const x of this.#hashMap.keys()) {
                  const [ firstKey, secondKey ] = StringStringMap.#parseKeys(x[0]);
                  yield [firstKey, secondKey];
                }
    }

    /**
     * Returns an iterable of values in the map
     */
    values(): IterableIterator<V> {
        return this.#hashMap.values()
    }
}
