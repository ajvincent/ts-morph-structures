import {
  TypeStructureKind
} from "../base/TypeStructureKind.js";

import type {
  TypeStructures
} from "./TypeStructures.js";

import TypeStructuresWithChildren from "./TypeStructuresWithChildren.js";

export default
class ParenthesesTypeStructureImpl
extends TypeStructuresWithChildren<TypeStructureKind.Parentheses, [string | TypeStructures]>
{
  public readonly kind = TypeStructureKind.Parentheses;
  protected readonly objectType: null = null;
  public readonly childTypes: [string | TypeStructures];

  protected readonly startToken = "(";
  protected readonly joinChildrenToken = "";
  protected readonly endToken = ")";
  protected readonly maxChildCount = 1;

  constructor(
    childType: string | TypeStructures
  )
  {
    super();
    this.childTypes = [childType];
    this.registerCallbackForTypeStructure();
  }
}
