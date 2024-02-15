//#region preamble
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  COPY_FIELDS,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type ExtractStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  REPLACE_WRITER_WITH_STRING,
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypeAliasDeclarationStructureClassIfc,
  type TypedNodeStructureFields,
  TypedNodeStructureMixin,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../../internal-exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  StructureKind,
  type TypeAliasDeclarationStructure,
} from "ts-morph";
import type { Class } from "type-fest";
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
  implements TypeAliasDeclarationStructureClassIfc
{
  readonly kind: StructureKind.TypeAlias = StructureKind.TypeAlias;

  constructor(name: string, type: stringOrWriterFunction) {
    super();
    this.name = name;
    this.type = type;
  }

  get type(): stringOrWriterFunction {
    return super.type ?? "";
  }

  set type(value: stringOrWriterFunction) {
    super.type = value;
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

  public toJSON(): StructureClassToJSON<TypeAliasDeclarationImpl> {
    const rv = super.toJSON() as StructureClassToJSON<TypeAliasDeclarationImpl>;
    rv.kind = this.kind;
    rv.type = StructureBase[REPLACE_WRITER_WITH_STRING](this.type);
    return rv;
  }
}

TypeAliasDeclarationImpl satisfies CloneableStructure<
  TypeAliasDeclarationStructure,
  TypeAliasDeclarationImpl
> &
  Class<ExtractStructure<TypeAliasDeclarationStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.TypeAlias, TypeAliasDeclarationImpl);
