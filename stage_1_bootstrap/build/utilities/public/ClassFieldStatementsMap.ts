import type {
  WriterFunction
} from "ts-morph";

type stringOrWriterArray = (string | WriterFunction)[];
type keyPair = {fieldName: string, statementGroup: string};

/**
 * This is a map for specifying statements across several locations for a single class field.
 *
 * For example, a field may require statements for:
 * - defining a getter and/or a setter
 * - initializing in a constructor
 * - implementing a .toJSON() method
 *
 * The field name specifies which field the statements are about.  The statement group specifies where the statements go.
 */
export default class ClassFieldStatementsMap
{
  static #hashKey(fieldName: string, statementGroup: string): string {
    return JSON.stringify({fieldName, statementGroup});
  }
  static #parseKey(key: string): keyPair {
    return JSON.parse(key) as keyPair;
  }

  /** A special field name for the start of a function. */
  public static readonly FIELD_HEAD_SUPER_CALL = "(super call)";
  /** A special field name for the end of a function. */
  public static readonly FIELD_TAIL_FINAL_RETURN = "(final return)";

  /** A convenience sorting function for fields. */
  public static fieldComparator(
    a: string,
    b: string
  ): number
  {
    if ((a === this.FIELD_HEAD_SUPER_CALL) || (b === this.FIELD_TAIL_FINAL_RETURN))
      return -1;
    if ((a === this.FIELD_TAIL_FINAL_RETURN) || (b === this.FIELD_HEAD_SUPER_CALL))
      return +1;
    return a.localeCompare(b);
  }

  readonly #map = new Map<string, stringOrWriterArray>;

  public constructor(
    iterable?: [string, string, stringOrWriterArray][]
  )
  {
    if (iterable) {
      for (const [fieldName, statementGroup, statements] of iterable) {
        this.set(fieldName, statementGroup, statements);
      }
    }
  }

  /**
   * The number of elements in this collection.
   * @returns The element count.
   */
  public get size(): number
  {
    return this.#map.size;
  }

  /**
   * Clear the collection.
   */
  public clear(): void
  {
    this.#map.clear();
  }

  /**
   * Delete an element from the collection by the given key sequence.
   *
   * @param fieldName - The first key.
   * @param statementGroup - The second key.
   * @returns True if we found the statements and deleted it.
   */
  public delete(fieldName: string, statementGroup: string): boolean
  {
    return this.#map.delete(ClassFieldStatementsMap.#hashKey(fieldName, statementGroup));
  }

  /**
   * Yield the key-statements tuples of the collection.
   */
  public * entries(): IterableIterator<[string, string, stringOrWriterArray]>
  {
    const iterator = this.#map.entries();
    for (const [hashed, statements] of iterator) {
      const {fieldName, statementGroup} = ClassFieldStatementsMap.#parseKey(hashed);
      yield [fieldName, statementGroup, statements];
    }
  }

  /**
   * Iterate over the keys and statementss.
   * @param __callback__ - A function to invoke for each iteration.
   * @param __thisArg__ -  statements to use as this when executing callback.
   */
  public forEach(
    __callback__: (
      statements: stringOrWriterArray,
      fieldName: string,
      statementGroup: string,
      __collection__: ClassFieldStatementsMap
    ) => void,
    __thisArg__?: unknown
  ): void
  {
    this.#map.forEach(
      (statements: stringOrWriterArray, hashed: string) => {
        const {fieldName, statementGroup} = ClassFieldStatementsMap.#parseKey(hashed);
        __callback__.apply(__thisArg__, [statements, fieldName, statementGroup, this]);
      }
    );
  }

  /**
   * Get a statements for a key set.
   *
   * @param fieldName - The first key.
   * @param statementGroup - The second key.
   * @returns The statements.  Undefined if it isn't in the collection.
   */
  public get(fieldName: string, statementGroup: string): stringOrWriterArray | undefined
  {
    return this.#map.get(ClassFieldStatementsMap.#hashKey(fieldName, statementGroup));
  }

  /**
   * Report if the collection has a statements for a key set.
   *
   * @param fieldName - The first key.
   * @param statementGroup - The second key.
   * @returns True if the key set refers to a statements in the collection.
   */
  public has(fieldName: string, statementGroup: string): boolean
  {
    return this.#map.has(ClassFieldStatementsMap.#hashKey(fieldName, statementGroup));
  }

  /**
   * Yield the key sets of the collection.
   */
  public * keys(): IterableIterator<[string, string]>
  {
    const iterator = this.#map.keys();
    for (const hashed of iterator) {
      const {fieldName, statementGroup} = ClassFieldStatementsMap.#parseKey(hashed);
      yield [fieldName, statementGroup];
    }
  }

  /**
   * Set a statements for a key set.
   *
   * @param fieldName - The first key.
   * @param statementGroup - The second key.
   * @param statements - The statements.
   * @returns This collection.
   */
  public set(fieldName: string, statementGroup: string, statements: stringOrWriterArray): this
  {
    this.#map.set(
      ClassFieldStatementsMap.#hashKey(fieldName, statementGroup), statements
    );
    return this;
  }

  /**
   * Yield the statementss of the collection.
   */
  public values(): IterableIterator<stringOrWriterArray>
  {
    return this.#map.values();
  }

  public [Symbol.iterator](): IterableIterator<[string, string, stringOrWriterArray]>
  {
    return this.entries();
  }

  public [Symbol.toStringTag] = "ClassFieldStatementsMap";
}
