//#region preamble
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type AsyncableNodeStructureFields,
  AsyncableNodeStructureMixin,
  type CloneableStructure,
  COPY_FIELDS,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type GeneratorableNodeStructureFields,
  GeneratorableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type FunctionDeclarationOverloadStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const FunctionDeclarationOverloadStructureBase = MultiMixinBuilder<
  [
    AsyncableNodeStructureFields,
    GeneratorableNodeStructureFields,
    ExportableNodeStructureFields,
    AmbientableNodeStructureFields,
    ParameteredNodeStructureFields,
    ReturnTypedNodeStructureFields,
    TypeParameteredNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    AsyncableNodeStructureMixin,
    GeneratorableNodeStructureMixin,
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class FunctionDeclarationOverloadImpl
  extends FunctionDeclarationOverloadStructureBase
  implements FunctionDeclarationOverloadStructure
{
  readonly kind: StructureKind.FunctionOverload =
    StructureKind.FunctionOverload;

  public static [COPY_FIELDS](
    source: OptionalKind<FunctionDeclarationOverloadStructure>,
    target: FunctionDeclarationOverloadImpl,
  ): void {
    super[COPY_FIELDS](source, target);
  }

  public static clone(
    source: OptionalKind<FunctionDeclarationOverloadStructure>,
  ): FunctionDeclarationOverloadImpl {
    const target = new FunctionDeclarationOverloadImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }
}

FunctionDeclarationOverloadImpl satisfies CloneableStructure<FunctionDeclarationOverloadStructure>;
StructuresClassesMap.set(
  StructureKind.FunctionOverload,
  FunctionDeclarationOverloadImpl,
);
