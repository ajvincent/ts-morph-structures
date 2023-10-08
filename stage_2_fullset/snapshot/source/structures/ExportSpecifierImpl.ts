//#region preamble
import {
  type CloneableStructure,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
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
//#endregion preamble
const ExportSpecifierStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class ExportSpecifierImpl
  extends ExportSpecifierStructureBase
  implements ExportSpecifierStructure
{
  readonly kind: StructureKind.ExportSpecifier = StructureKind.ExportSpecifier;
  isTypeOnly = false;
  alias?: string = undefined;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static copyFields(
    source: OptionalKind<ExportSpecifierStructure>,
    target: ExportSpecifierImpl,
  ): void {
    super.copyFields(source, target);
    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.alias) {
      target.alias = source.alias;
    }
  }

  public static clone(
    source: OptionalKind<ExportSpecifierStructure>,
  ): ExportSpecifierImpl {
    const target = new ExportSpecifierImpl(source.name);
    this.copyFields(source, target);
    return target;
  }
}

ExportSpecifierImpl satisfies CloneableStructure<ExportSpecifierStructure>;
StructuresClassesMap.set(StructureKind.ExportSpecifier, ExportSpecifierImpl);
