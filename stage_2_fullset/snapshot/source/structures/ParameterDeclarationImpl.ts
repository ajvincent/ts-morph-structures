//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
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
  Scope,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const ParameterDeclarationStructureBase = MultiMixinBuilder<
  [
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
  scope?: Scope = undefined;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<ParameterDeclarationStructure>,
    target: ParameterDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    target.isRestParameter = source.isRestParameter ?? false;
    if (source.scope) {
      target.scope = source.scope;
    }
  }

  public static clone(
    source: OptionalKind<ParameterDeclarationStructure>,
  ): ParameterDeclarationImpl {
    const target = new ParameterDeclarationImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }
}

ParameterDeclarationImpl satisfies CloneableStructure<
  ParameterDeclarationStructure,
  ParameterDeclarationImpl
>;
StructuresClassesMap.set(StructureKind.Parameter, ParameterDeclarationImpl);
