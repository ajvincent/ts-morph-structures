//#region preamble
import {
  type CloneableStructure,
  type DecoratableNodeStructureFields,
  DecoratableNodeStructureMixin,
  type InitializerExpressionableNodeStructureFields,
  InitializerExpressionableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type OverrideableNodeStructureFields,
  OverrideableNodeStructureMixin,
  type QuestionTokenableNodeStructureFields,
  QuestionTokenableNodeStructureMixin,
  type ReadonlyableNodeStructureFields,
  ReadonlyableNodeStructureMixin,
  type ScopeableNodeStructureFields,
  ScopeableNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypedNodeStructureFields,
  TypedNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  type ParameterDeclarationStructure,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const ParameterDeclarationStructureBase = MultiMixinBuilder<
  [
    ScopeableNodeStructureFields,
    ReadonlyableNodeStructureFields,
    OverrideableNodeStructureFields,
    TypedNodeStructureFields,
    InitializerExpressionableNodeStructureFields,
    DecoratableNodeStructureFields,
    QuestionTokenableNodeStructureFields,
    NamedNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ScopeableNodeStructureMixin,
    ReadonlyableNodeStructureMixin,
    OverrideableNodeStructureMixin,
    TypedNodeStructureMixin,
    InitializerExpressionableNodeStructureMixin,
    DecoratableNodeStructureMixin,
    QuestionTokenableNodeStructureMixin,
    NamedNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class ParameterDeclarationImpl
  extends ParameterDeclarationStructureBase
  implements ParameterDeclarationStructure
{
  readonly kind: StructureKind.Parameter = StructureKind.Parameter;
  isRestParameter = false;

  public static copyFields(
    source: OptionalKind<ParameterDeclarationStructure>,
    target: ParameterDeclarationImpl,
  ): void {
    super.copyFields(source, target);
    target.isRestParameter = source.isRestParameter ?? false;
  }

  public static clone(
    source: OptionalKind<ParameterDeclarationStructure>,
  ): ParameterDeclarationImpl {
    const target = new ParameterDeclarationImpl();
    this.copyFields(source, target);
    return target;
  }
}

ParameterDeclarationImpl satisfies CloneableStructure<ParameterDeclarationStructure>;
StructuresClassesMap.set(StructureKind.Parameter, ParameterDeclarationImpl);
