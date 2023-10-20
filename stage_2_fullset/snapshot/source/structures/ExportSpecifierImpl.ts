//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ExportSpecifierStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class, Jsonify } from "type-fest";
//#endregion preamble
const ExportSpecifierStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class ExportSpecifierImpl
  extends ExportSpecifierStructureBase
  implements RequiredOmit<PreferArrayFields<ExportSpecifierStructure>, "alias">
{
  readonly kind: StructureKind.ExportSpecifier = StructureKind.ExportSpecifier;
  alias?: string = undefined;
  isTypeOnly = false;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<ExportSpecifierStructure>,
    target: ExportSpecifierImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.alias) {
      target.alias = source.alias;
    }
  }

  public static clone(
    source: OptionalKind<ExportSpecifierStructure>,
  ): ExportSpecifierImpl {
    const target = new ExportSpecifierImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<ExportSpecifierStructure> {
    const rv = super.toJSON() as ExportSpecifierStructure;
    if (this.alias) {
      rv.alias = this.alias;
    }

    rv.isTypeOnly = this.isTypeOnly;
    rv.kind = this.kind;
    return rv;
  }
}

ExportSpecifierImpl satisfies CloneableStructure<
  ExportSpecifierStructure,
  ExportSpecifierImpl
> &
  Class<ExtractStructure<ExportSpecifierStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.ExportSpecifier, ExportSpecifierImpl);
