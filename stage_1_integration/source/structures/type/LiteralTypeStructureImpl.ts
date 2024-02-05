// #region preamble
import type {
  CodeBlockWriter,
  WriterFunction,
} from "ts-morph";

import {
  TypeStructureKind,
} from "../../../snapshot/source/exports.js";

import {
  type CloneableTypeStructure,
  TypeStructureClassesMap,
  TypeStructuresBase,
} from "../../../snapshot/source/internal-exports.js";
// #endregion preamble

/**
 * Literals (boolean, number, string, void, etc.), without quotes, brackets, or
 * anything else around them.  Leaf nodes.
 *
 * Please try not to use this.  Type structure classes will generally accept
 * strings as child type structures for the same purpose this fills.
 *
 * @internal
 */
export default class LiteralTypeStructureImpl
extends TypeStructuresBase<TypeStructureKind.Literal>
{
  static readonly #cache = new Map<string, LiteralTypeStructureImpl>;

  static get(
    name: string
  ): LiteralTypeStructureImpl
  {
    if (!this.#cache.has(name)) {
      this.#cache.set(name, new LiteralTypeStructureImpl(name));
    }
    return this.#cache.get(name)!;
  }

  static clone(
    other: LiteralTypeStructureImpl
  ): LiteralTypeStructureImpl
  {
    return new LiteralTypeStructureImpl(other.stringValue);
  }

  readonly kind = TypeStructureKind.Literal;
  readonly stringValue: string;

  constructor(literal: string)
  {
    super();

    this.stringValue = literal;
    Reflect.defineProperty(this, "stringValue", {
      writable: false,
      configurable: false
    });

    this.registerCallbackForTypeStructure();
  }

  #writerFunction(writer: CodeBlockWriter): void
  {
    writer.write(this.stringValue);
  }

  readonly writerFunction: WriterFunction = this.#writerFunction.bind(this);
}
LiteralTypeStructureImpl satisfies CloneableTypeStructure<LiteralTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.Literal, LiteralTypeStructureImpl);
