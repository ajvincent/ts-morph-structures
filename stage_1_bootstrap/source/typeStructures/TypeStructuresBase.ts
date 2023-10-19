import type {
  CodeBlockWriter,
  WriterFunction
} from "ts-morph";

import {
  KindedTypeStructure,
  TypeStructureKind,
} from "../base/TypeStructureKind.js";

import type {
  TypeStructures
} from "./TypeStructures.js";

export default
abstract class TypeStructuresBase<Kind extends TypeStructureKind>
implements KindedTypeStructure<Kind>
{
  static readonly #callbackToTypeStructureImpl = new WeakMap<
    WriterFunction,
    TypeStructuresBase<TypeStructureKind>
  >;

  static getTypeStructureForCallback(
    callback: WriterFunction
  ): TypeStructuresBase<TypeStructureKind> | undefined
  {
    return this.#callbackToTypeStructureImpl.get(callback);
  }

  protected static writeStringOrType(
    writer: CodeBlockWriter,
    value: string | TypeStructures
  ): void
  {
    if (typeof value === "string")
      writer.write(value);
    else
      value.writerFunction(writer);
  }

  static deregisterCallbackForTypeStructure(
    structure: TypeStructuresBase<TypeStructureKind>
  ): void {
    this.#callbackToTypeStructureImpl.delete(structure.writerFunction);
  }

  protected registerCallbackForTypeStructure(): void {
    if (TypeStructuresBase.#callbackToTypeStructureImpl.has(this.writerFunction))
      return;
    TypeStructuresBase.#callbackToTypeStructureImpl.set(this.writerFunction, this);
  }

  abstract readonly kind: Kind;
  abstract readonly writerFunction: WriterFunction;
}
