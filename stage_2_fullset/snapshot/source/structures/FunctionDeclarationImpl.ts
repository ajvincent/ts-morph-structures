//#region preamble
import { FunctionDeclarationOverloadImpl } from "../exports.js";
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type AsyncableNodeStructureFields,
  AsyncableNodeStructureMixin,
  type CloneableStructure,
  cloneStructureArray,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type GeneratorableNodeStructureFields,
  GeneratorableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NameableNodeStructureFields,
  NameableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  type StatementedNodeStructureFields,
  StatementedNodeStructureMixin,
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
  type FunctionDeclarationStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const FunctionDeclarationStructureBase = MultiMixinBuilder<
  [
    NameableNodeStructureFields,
    AsyncableNodeStructureFields,
    GeneratorableNodeStructureFields,
    ExportableNodeStructureFields,
    StatementedNodeStructureFields,
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
    NameableNodeStructureMixin,
    AsyncableNodeStructureMixin,
    GeneratorableNodeStructureMixin,
    ExportableNodeStructureMixin,
    StatementedNodeStructureMixin,
    AmbientableNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class FunctionDeclarationImpl
  extends FunctionDeclarationStructureBase
  implements FunctionDeclarationStructure
{
  readonly kind: StructureKind.Function = StructureKind.Function;
  readonly overloads: FunctionDeclarationOverloadImpl[] = [];

  public static copyFields(
    source: OptionalKind<FunctionDeclarationStructure>,
    target: FunctionDeclarationImpl,
  ): void {
    super.copyFields(source, target);
    if (source.overloads) {
      target.overloads.push(
        ...cloneStructureArray<
          OptionalKind<FunctionDeclarationOverloadStructure>,
          StructureKind.FunctionOverload,
          FunctionDeclarationOverloadImpl
        >(source.overloads, StructureKind.FunctionOverload),
      );
    }
  }

  public static clone(
    source: OptionalKind<FunctionDeclarationStructure>,
  ): FunctionDeclarationImpl {
    const target = new FunctionDeclarationImpl();
    this.copyFields(source, target);
    return target;
  }
}

FunctionDeclarationImpl satisfies CloneableStructure<FunctionDeclarationStructure>;
StructuresClassesMap.set(StructureKind.Function, FunctionDeclarationImpl);
