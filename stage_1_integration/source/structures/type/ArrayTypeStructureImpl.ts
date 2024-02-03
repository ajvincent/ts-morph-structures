import type {
  CodeBlockWriter,
  WriterFunction,
} from "ts-morph";

import {
  TypeStructureKind,
  type TypeStructures,
} from "../../../snapshot/source/exports.js";

import {
  type CloneableTypeStructure,
  TypeStructuresBase,
  TypeStructureClassesMap,
} from "../../../snapshot/source/internal-exports.js";

/**
 * `boolean[]`
 *
 * @see `IndexedAccessTypeStructureImpl` for `Foo["index"]`
 * @see `TupleTypeStructureImpl` for `[number, boolean]`
 */
export default class ArrayTypeStructureImpl
extends TypeStructuresBase<TypeStructureKind.Array>
{
  public static clone(
    other: ArrayTypeStructureImpl
  ): ArrayTypeStructureImpl
  {
    return new ArrayTypeStructureImpl(
      TypeStructureClassesMap.clone(other.objectType)
    );
  }

  readonly kind = TypeStructureKind.Array;
  public objectType: string | TypeStructures;

  constructor(
    objectType: string | TypeStructures
  )
  {
    super();
    this.objectType = objectType;
    this.registerCallbackForTypeStructure();
  }

  #writerFunction(writer: CodeBlockWriter): void
  {
    TypeStructuresBase.writeStringOrType(writer, this.objectType);
    writer.write("[]");
  }

  readonly writerFunction: WriterFunction = this.#writerFunction.bind(this);
}
ArrayTypeStructureImpl satisfies CloneableTypeStructure<ArrayTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.Array, ArrayTypeStructureImpl);
