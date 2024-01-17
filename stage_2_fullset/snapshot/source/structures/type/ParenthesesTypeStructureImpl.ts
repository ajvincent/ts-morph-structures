import { TypeStructureKind } from "../../base/TypeStructureKind.js";

import type { TypeStructures } from "./TypeStructures.js";

import TypeStructuresWithChildren from "./TypeStructuresWithChildren.js";

import TypeStructureClassesMap from "../../base/TypeStructureClassesMap.js";
import type { CloneableTypeStructure } from "../../types/CloneableStructure.js";

/** Wrap the child type in parentheses. */
export default class ParenthesesTypeStructureImpl extends TypeStructuresWithChildren<
  TypeStructureKind.Parentheses,
  [string | TypeStructures]
> {
  static clone(
    other: ParenthesesTypeStructureImpl,
  ): ParenthesesTypeStructureImpl {
    return new ParenthesesTypeStructureImpl(other.childTypes[0]);
  }

  public readonly kind = TypeStructureKind.Parentheses;
  protected readonly objectType: null = null;
  public readonly childTypes: [string | TypeStructures];

  protected readonly startToken = "(";
  protected readonly joinChildrenToken = "";
  protected readonly endToken = ")";
  protected readonly maxChildCount = 1;

  constructor(childType: string | TypeStructures) {
    super();
    this.childTypes = [childType];
    this.registerCallbackForTypeStructure();
  }
}
ParenthesesTypeStructureImpl satisfies CloneableTypeStructure<ParenthesesTypeStructureImpl>;
TypeStructureClassesMap.set(
  TypeStructureKind.Parentheses,
  ParenthesesTypeStructureImpl,
);
