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
  type ExtractStructure,
  type FunctionDeclarationOverloadStructureClassIfc,
  type GeneratorableNodeStructureFields,
  GeneratorableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type FunctionDeclarationOverloadStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
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
  implements FunctionDeclarationOverloadStructureClassIfc
{
  readonly kind: StructureKind.FunctionOverload =
    StructureKind.FunctionOverload;

  public static clone(
    source: OptionalKind<FunctionDeclarationOverloadStructure>,
  ): FunctionDeclarationOverloadImpl {
    const target = new FunctionDeclarationOverloadImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<FunctionDeclarationOverloadImpl> {
    const rv =
      super.toJSON() as StructureClassToJSON<FunctionDeclarationOverloadImpl>;
    rv.kind = this.kind;
    return rv;
  }
}

FunctionDeclarationOverloadImpl satisfies CloneableStructure<
  FunctionDeclarationOverloadStructure,
  FunctionDeclarationOverloadImpl
> &
  Class<ExtractStructure<FunctionDeclarationOverloadStructure["kind"]>>;
StructuresClassesMap.set(
  StructureKind.FunctionOverload,
  FunctionDeclarationOverloadImpl,
);
