// #region preamble
import type {
  CodeBlockWriter,
  WriterFunction,
} from "ts-morph";

import TypeStructureClassesMap from "../base/TypeStructureClassesMap.js";

import {
  TypeStructureKind,
} from "../base/TypeStructureKind.js";

import TypeStructuresBase from "../base/TypeStructuresBase.js";
import {
  CloneableTypeStructure
} from "../types/CloneableStructure.js";
// #endregion preamble

export default class StringTypeStructureImpl
extends TypeStructuresBase<TypeStructureKind.String>
{
  static clone(
    other: StringTypeStructureImpl
  ): StringTypeStructureImpl
  {
    return new StringTypeStructureImpl(other.stringValue);
  }

  readonly kind = TypeStructureKind.String;
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
    writer.quote(this.stringValue);
  }

  readonly writerFunction: WriterFunction = this.#writerFunction.bind(this);
}
StringTypeStructureImpl satisfies CloneableTypeStructure<StringTypeStructureImpl>;

TypeStructureClassesMap.set(TypeStructureKind.Literal, StringTypeStructureImpl);
