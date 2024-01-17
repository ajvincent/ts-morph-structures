import { TypeStructureKind } from "../../base/TypeStructureKind.js";

import type { TypeStructures } from "./TypeStructures.js";

import TypeStructuresWithChildren from "./TypeStructuresWithChildren.js";

import TypeStructureClassesMap from "../../base/TypeStructureClassesMap.js";
import type { CloneableTypeStructure } from "../../types/CloneableStructure.js";

/** @example `Foo | Bar | ...` */
export default class UnionTypeStructureImpl extends TypeStructuresWithChildren<
  TypeStructureKind.Union,
  (string | TypeStructures)[]
> {
  static clone(other: UnionTypeStructureImpl): UnionTypeStructureImpl {
    return new UnionTypeStructureImpl(
      TypeStructureClassesMap.cloneArray(other.childTypes),
    );
  }

  readonly kind = TypeStructureKind.Union;
  protected readonly objectType: null = null;
  public childTypes: (string | TypeStructures)[];
  protected readonly startToken = "";
  protected readonly joinChildrenToken = " | ";
  protected readonly endToken = "";
  protected readonly maxChildCount = Infinity;

  constructor(childTypes: (string | TypeStructures)[] = []) {
    super();
    this.childTypes = childTypes;
    this.registerCallbackForTypeStructure();
  }
}
UnionTypeStructureImpl satisfies CloneableTypeStructure<UnionTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.Union, UnionTypeStructureImpl);
