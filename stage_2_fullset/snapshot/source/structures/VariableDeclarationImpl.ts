//#region preamble
import {
  type CloneableStructure,
  type ExclamationTokenableNodeStructureFields,
  ExclamationTokenableNodeStructureMixin,
  type InitializerExpressionableNodeStructureFields,
  InitializerExpressionableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
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
  StructureKind,
  type VariableDeclarationStructure,
} from "ts-morph";
//#endregion preamble
const VariableDeclarationStructureBase = MultiMixinBuilder<
  [
    ExclamationTokenableNodeStructureFields,
    InitializerExpressionableNodeStructureFields,
    TypedNodeStructureFields,
    NamedNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ExclamationTokenableNodeStructureMixin,
    InitializerExpressionableNodeStructureMixin,
    TypedNodeStructureMixin,
    NamedNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class VariableDeclarationImpl
  extends VariableDeclarationStructureBase
  implements VariableDeclarationStructure
{
  readonly kind: StructureKind.VariableDeclaration =
    StructureKind.VariableDeclaration;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static copyFields(
    source: OptionalKind<VariableDeclarationStructure>,
    target: VariableDeclarationImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<VariableDeclarationStructure>,
  ): VariableDeclarationImpl {
    const target = new VariableDeclarationImpl(source.name);
    this.copyFields(source, target);
    return target;
  }
}

VariableDeclarationImpl satisfies CloneableStructure<VariableDeclarationStructure>;
StructuresClassesMap.set(
  StructureKind.VariableDeclaration,
  VariableDeclarationImpl,
);
