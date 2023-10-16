//#region preamble
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  COPY_FIELDS,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypedNodeStructureFields,
  TypedNodeStructureMixin,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  StructureKind,
  type TypeAliasDeclarationStructure,
} from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
const TypeAliasDeclarationStructureBase = MultiMixinBuilder<
  [
    TypedNodeStructureFields,
    ExportableNodeStructureFields,
    AmbientableNodeStructureFields,
    TypeParameteredNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    TypedNodeStructureMixin,
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class TypeAliasDeclarationImpl
  extends TypeAliasDeclarationStructureBase
  implements
    RequiredOmit<PreferArrayFields<TypeAliasDeclarationStructure>, "type">
{
  readonly kind: StructureKind.TypeAlias = StructureKind.TypeAlias;
  type: stringOrWriter = "";

  constructor(name: string, type: stringOrWriter) {
    super();
    this.name = name;
    this.type = type;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<TypeAliasDeclarationStructure>,
    target: TypeAliasDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.type) {
      target.type = source.type;
    }
  }

  public static clone(
    source: OptionalKind<TypeAliasDeclarationStructure>,
  ): TypeAliasDeclarationImpl {
    const target = new TypeAliasDeclarationImpl(source.name, source.type);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<TypeAliasDeclarationStructure> {
    const rv = super.toJSON() as TypeAliasDeclarationStructure;
    rv.kind = this.kind;
    rv.type = StructureBase[REPLACE_WRITER_WITH_STRING](this.type);
    return rv;
  }
}

TypeAliasDeclarationImpl satisfies CloneableStructure<
  TypeAliasDeclarationStructure,
  TypeAliasDeclarationImpl
>;
StructuresClassesMap.set(StructureKind.TypeAlias, TypeAliasDeclarationImpl);
