import type {
  WriterFunction
} from "ts-morph";

import {
  KindedTypeStructure,
  TypeStructureKind,
} from "./TypeStructureKind.js";

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
