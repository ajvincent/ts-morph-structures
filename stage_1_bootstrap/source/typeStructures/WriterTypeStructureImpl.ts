// #region preamble
import type {
  WriterFunction,
} from "ts-morph";

import TypeStructureClassesMap from "../base/TypeStructureClassesMap.js";

import {
  TypeStructureKind,
} from "../base/TypeStructureKind.js";

import TypeStructuresBase from "./TypeStructuresBase.js";
import type {
  CloneableTypeStructure
} from "../types/CloneableStructure.js";
// #endregion preamble

/** Wrappers for writer functions from external sources.  Leaf nodes. */
export default class WriterTypeStructureImpl
extends TypeStructuresBase<TypeStructureKind.Writer>
{
  static clone(
    other: WriterTypeStructureImpl
  ): WriterTypeStructureImpl
  {
    return new WriterTypeStructureImpl(other.writerFunction);
  }

  readonly kind = TypeStructureKind.Writer;
  readonly writerFunction: WriterFunction;

  constructor(writer: WriterFunction)
  {
    super();
    this.writerFunction = writer;
    Reflect.defineProperty(this, "writerFunction", {
      writable: false,
      configurable: false
    });
    this.registerCallbackForTypeStructure();
  }
}
WriterTypeStructureImpl satisfies CloneableTypeStructure<WriterTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.Writer, WriterTypeStructureImpl);
