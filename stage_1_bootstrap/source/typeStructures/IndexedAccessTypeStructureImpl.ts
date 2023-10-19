import {
  TypeStructureKind
} from "../base/TypeStructureKind.js";

import type {
  TypeStructures
} from "./TypeStructures.js";

import TypeStructuresWithChildren from "./TypeStructuresWithChildren.js";

import TypeStructureClassesMap from "../base/TypeStructureClassesMap.js";
import type {
  CloneableTypeStructure
} from "../types/CloneableStructure.js";

/**
 * `Foo["index"]`
 *
 * @see `ArrayTypeStructureImpl` for `boolean[]`
 * @see `MappedTypeTypeStructureImpl` for `{ [key in keyof Foo]: boolean}`
 * @see `ObjectLiteralTypeStructureImpl` for `{ [key: string]: boolean }`
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
