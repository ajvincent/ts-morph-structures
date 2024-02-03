import type {
  WriterFunction,
} from "ts-morph";

import {
  TypeStructures,
  WriterTypeStructureImpl,
  type stringOrWriterFunction,
} from "../../snapshot/source/exports.js";

import {
  TypeStructuresBase,
  TypeStructureClassesMap,
} from "../../snapshot/source/internal-exports.js";

/**
 * This supports setting "implements" and "extends" types for arrays behind read-only array
 * proxies.  The goal is to manage type structures and writer functions in one place,
 * where direct array access is troublesome (particularly, "write access").
 */
export default class TypeStructureSet
extends Set<string | TypeStructures>
{
  static #getBackingValue(
    value: string | TypeStructures
  ): stringOrWriterFunction
  {
    return typeof value === "object" ? value.writerFunction : value;
  }

  readonly #backingArray: Pick<
    stringOrWriterFunction[],
    "indexOf" | "length" | "push" | "splice"
  >;

  /**
   * @param backingArray - The (non-proxied) array to update when changes happen.
   */
  constructor(
    backingArray: stringOrWriterFunction[]
  )
  {
    super();
    this.#backingArray = backingArray;

    for (const value of backingArray) {
      if (typeof value === "string") {
        super.add(value);
        continue;
      }

      const typeStructure = (
        TypeStructuresBase.getTypeStructureForCallback(value) ??
        new WriterTypeStructureImpl(value)
      );
      super.add(typeStructure);
    }
  }

  add(
    value: string | TypeStructures
  ): this
  {
    if (!super.has(value)) {
      this.#backingArray.push(TypeStructureSet.#getBackingValue(value));
    }

    return super.add(value);
  }

  clear(): void
  {
    this.#backingArray.length = 0;
    return super.clear();
  }

  delete(
    value: string | TypeStructures
  ): boolean
  {
    const backingValue = TypeStructureSet.#getBackingValue(value);
    const index = this.#backingArray.indexOf(backingValue);
    if (index === -1) {
      return false;
    }

    this.#backingArray.splice(index, 1);
    return super.delete(value);
  }

  /**
   * Replace all the types this set managers with those from another array.
   * @param array - the types to add.
   */
  replaceFromTypeArray(
    array: (string | WriterFunction)[]
  ): void
  {
    this.clear();
    array.forEach(value => {
      if (typeof value === "string") {
        this.add(value);
        return;
      }

      const structure: TypeStructures = (
        TypeStructuresBase.getTypeStructureForCallback(value) ??
        new WriterTypeStructureImpl(value)
      );
      this.add(structure);
    });
  }

  /**
   * Replace all the type structures this set managers with those from another set.
   * @param other - the type structure set to copy
   */
  cloneFromTypeStructureSet(
    other: TypeStructureSet
  ): void
  {
    this.clear();
    other.forEach(value => {
      if (typeof value === "string")
        this.add(value);
      else
        this.add(TypeStructureClassesMap.clone(value));
    });
  }
}
