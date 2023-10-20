//#region preamble
import { FunctionDeclarationOverloadImpl } from "../exports.js";
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type AsyncableNodeStructureFields,
  AsyncableNodeStructureMixin,
  type CloneableStructure,
  cloneStructureArray,
  COPY_FIELDS,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type ExtractStructure,
  type GeneratorableNodeStructureFields,
  GeneratorableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NameableNodeStructureFields,
  NameableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
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
import type { Class, Jsonify } from "type-fest";
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
  implements
    RequiredOmit<
      PreferArrayFields<FunctionDeclarationStructure>,
      "name" | "returnType"
    >
{
  readonly kind: StructureKind.Function = StructureKind.Function;
  readonly overloads: FunctionDeclarationOverloadImpl[] = [];

  public static [COPY_FIELDS](
    source: OptionalKind<FunctionDeclarationStructure>,
    target: FunctionDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
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
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<FunctionDeclarationStructure> {
    const rv = super.toJSON() as FunctionDeclarationStructure;
    rv.kind = this.kind;
    rv.overloads = this.overloads;
    return rv;
  }
}

FunctionDeclarationImpl satisfies CloneableStructure<
  FunctionDeclarationStructure,
  FunctionDeclarationImpl
> &
  Class<ExtractStructure<FunctionDeclarationStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.Function, FunctionDeclarationImpl);
