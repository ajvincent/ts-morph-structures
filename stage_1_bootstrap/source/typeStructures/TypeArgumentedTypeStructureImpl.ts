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

/**
 * This resolves type parameters, as opposed to defining them.
 *
 * @example
 * `Pick<NumberStringType, "repeatForward">`
 *
 * @see `TypeParameterDeclarationImpl` for `Type<Foo extends object>`
 */
export default
class TypeArgumentedTypeStructureImpl
extends TypeStructuresWithChildren<TypeStructureKind.TypeArgumented, (string | TypeStructures)[]>
{
  static clone(
    other: TypeArgumentedTypeStructureImpl
  ): TypeArgumentedTypeStructureImpl
  {
    return new TypeArgumentedTypeStructureImpl(
      TypeStructureClassesMap.clone(other.objectType),
      TypeStructureClassesMap.cloneArray(other.childTypes)
    );
  }

  readonly kind = TypeStructureKind.TypeArgumented;
  public objectType: (string | TypeStructures);
  public childTypes: (string | TypeStructures)[];
  protected readonly startToken = "<";
  protected readonly joinChildrenToken = ", ";
  protected readonly endToken = ">";
  protected readonly maxChildCount = Infinity;

  constructor(
    objectType: (string | TypeStructures),
    childTypes: (string | TypeStructures)[] = []
  )
  {
    super();
    this.objectType = objectType;
    this.childTypes = childTypes;
    this.registerCallbackForTypeStructure();
  }
}
TypeArgumentedTypeStructureImpl satisfies CloneableTypeStructure<TypeArgumentedTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.Union, TypeArgumentedTypeStructureImpl);
