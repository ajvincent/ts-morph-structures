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
 * `Foo["index"]`
 *
 * @see `ArrayTypeStructureImpl` for `boolean[]`
 * @see `MappedTypeStructureImpl` for `{ [key in keyof Foo]: boolean}`
 * @see `MemberedObjectTypeStructureImpl` for `{ [key: string]: boolean }`
 */
export default
class IndexedAccessTypeStructureImpl
extends TypeStructuresWithChildren<TypeStructureKind.IndexedAccess, [string | TypeStructures]>
{
  static clone(
    other: IndexedAccessTypeStructureImpl
  ): IndexedAccessTypeStructureImpl
  {
    return new IndexedAccessTypeStructureImpl(
      other.objectType, other.childTypes[0]
    );
  }

  public readonly kind = TypeStructureKind.IndexedAccess;
  public objectType: string | TypeStructures;
  public readonly childTypes: [string | TypeStructures];

  protected readonly startToken = "[";
  protected readonly joinChildrenToken = "";
  protected readonly endToken = "]";
  protected readonly maxChildCount = 1;

  constructor(
    objectType: string | TypeStructures,
    indexType: string | TypeStructures
  )
  {
    super();
    this.objectType = objectType;
    this.childTypes = [indexType];
    this.registerCallbackForTypeStructure();
  }
}
IndexedAccessTypeStructureImpl satisfies CloneableTypeStructure<IndexedAccessTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.IndexedAccess, IndexedAccessTypeStructureImpl);