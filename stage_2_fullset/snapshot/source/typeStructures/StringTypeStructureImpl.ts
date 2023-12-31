// #region preamble
import type { CodeBlockWriter, WriterFunction } from "ts-morph";

import TypeStructureClassesMap from "../base/TypeStructureClassesMap.js";

import { TypeStructureKind } from "../base/TypeStructureKind.js";

import TypeStructuresBase from "./TypeStructuresBase.js";
import type { CloneableTypeStructure } from "../types/CloneableStructure.js";
// #endregion preamble

/** Strings, encased in double quotes.  Leaf nodes. */
export default class StringTypeStructureImpl extends TypeStructuresBase<TypeStructureKind.String> {
  static clone(other: StringTypeStructureImpl): StringTypeStructureImpl {
    return new StringTypeStructureImpl(other.stringValue);
  }

  readonly kind = TypeStructureKind.String;
  readonly stringValue: string;

  constructor(literal: string) {
    super();

    this.stringValue = literal;
    Reflect.defineProperty(this, "stringValue", {
      writable: false,
      configurable: false,
    });

    this.registerCallbackForTypeStructure();
  }

  #writerFunction(writer: CodeBlockWriter): void {
    writer.quote(this.stringValue);
  }

  readonly writerFunction: WriterFunction = this.#writerFunction.bind(this);
}
StringTypeStructureImpl satisfies CloneableTypeStructure<StringTypeStructureImpl>;

TypeStructureClassesMap.set(TypeStructureKind.String, StringTypeStructureImpl);
