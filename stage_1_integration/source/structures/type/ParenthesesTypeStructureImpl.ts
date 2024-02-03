import {
  TypeStructureKind,
  type TypeStructures
} from "../../../snapshot/source/exports.js";

import {
  type CloneableTypeStructure,
  TypeStructureClassesMap,
  TypeStructuresWithChildren,
} from "../../../snapshot/source/internal-exports.js";

/** Wrap the child type in parentheses. */
export default
class ParenthesesTypeStructureImpl
extends TypeStructuresWithChildren<TypeStructureKind.Parentheses, [string | TypeStructures]>
{
  static clone(
    other: ParenthesesTypeStructureImpl
  ): ParenthesesTypeStructureImpl
  {
    return new ParenthesesTypeStructureImpl(other.childTypes[0]);
  }

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
ParenthesesTypeStructureImpl satisfies CloneableTypeStructure<ParenthesesTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.Parentheses, ParenthesesTypeStructureImpl);
