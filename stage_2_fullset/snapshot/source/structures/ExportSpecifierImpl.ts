//#region preamble
import {
  type CloneableStructure,
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
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class ExportSpecifierImpl
  extends ExportSpecifierStructureBase
  implements ExportSpecifierStructure
{
  readonly kind: StructureKind.ExportSpecifier = StructureKind.ExportSpecifier;
  isTypeOnly = false;
  name = "";
  alias?: string = undefined;

  public static copyFields(
    source: OptionalKind<ExportSpecifierStructure>,
    target: ExportSpecifierImpl,
  ): void {
    super.copyFields(source, target);
    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.name) {
      target.name = source.name;
    }

    if (source.alias) {
      target.alias = source.alias;
    }
  }

  public static clone(
    source: OptionalKind<ExportSpecifierStructure>,
  ): ExportSpecifierImpl {
    const target = new ExportSpecifierImpl();
    this.copyFields(source, target);
    return target;
  }
}

ExportSpecifierImpl satisfies CloneableStructure<ExportSpecifierStructure>;
StructuresClassesMap.set(StructureKind.ExportSpecifier, ExportSpecifierImpl);
