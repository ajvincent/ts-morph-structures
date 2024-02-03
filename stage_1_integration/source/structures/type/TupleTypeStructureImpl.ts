import {
  TypeStructureKind,
  type TypeStructures,
} from "../../../snapshot/source/exports.js";

import {
  type CloneableTypeStructure,
  TypeStructureClassesMap,
  TypeStructuresWithChildren,
} from "../../../snapshot/source/internal-exports.js";

/**
 * @example
 * `[number, boolean]`
 *
 * @see `ArrayTypeStructureImpl` for `boolean[]`
 * @see `IndexedAccessTypeStructureImpl` for `Foo["index"]`
 */
export default
class TupleTypeStructureImpl
extends TypeStructuresWithChildren<TypeStructureKind.Tuple, (string | TypeStructures)[]>
{
  static clone(
    other: TupleTypeStructureImpl
  ): TupleTypeStructureImpl
  {
    return new TupleTypeStructureImpl(
      TypeStructureClassesMap.cloneArray(other.childTypes)
    );
  }

  readonly kind = TypeStructureKind.Tuple;
  protected readonly objectType: null = null;
  public childTypes: (string | TypeStructures)[];
  protected readonly startToken = "[";
  protected readonly joinChildrenToken = ", ";
  protected readonly endToken = "]";
  protected readonly maxChildCount = Infinity;

  constructor(
    childTypes: (string | TypeStructures)[] = []
  )
  {
    super();
    this.childTypes = childTypes;
    this.registerCallbackForTypeStructure();
  }
}
TupleTypeStructureImpl satisfies CloneableTypeStructure<TupleTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.Tuple, TupleTypeStructureImpl);