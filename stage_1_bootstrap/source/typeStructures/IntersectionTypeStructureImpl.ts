import {
  TypeStructureKind,
} from "../base/TypeStructureKind.js";

import type {
  TypeStructures
} from "./TypeStructures.js";

import TypeStructuresWithChildren from "./TypeStructuresWithChildren.js";

import TypeStructureClassesMap from "../base/TypeStructureClassesMap.js";
import type {
  CloneableTypeStructure
} from "../types/CloneableStructure.js";

/** Foo | Bar | ... */
export default
class IntersectionTypeStructureImpl
extends TypeStructuresWithChildren<TypeStructureKind.Intersection, (string | TypeStructures)[]>
{
  static clone(
    other: IntersectionTypeStructureImpl
  ): IntersectionTypeStructureImpl
  {
    return new IntersectionTypeStructureImpl(
      TypeStructureClassesMap.cloneArray(other.childTypes)
    );
  }

  readonly kind = TypeStructureKind.Intersection;
  protected readonly objectType: null = null;
  public childTypes: (string | TypeStructures)[];
  protected readonly startToken = "";
  protected readonly joinChildrenToken = " & ";
  protected readonly endToken = "";
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
IntersectionTypeStructureImpl satisfies CloneableTypeStructure<IntersectionTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.Intersection, IntersectionTypeStructureImpl);
