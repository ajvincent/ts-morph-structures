//#region preamble
import {
  COPY_FIELDS,
  type RightExtendsLeft,
  StructureBase,
} from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { ExportableNodeStructure, Structures } from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const ExportableNodeStructureKey: unique symbol;
export type ExportableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ExportableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: ExportableNodeStructure;
    symbolKey: typeof ExportableNodeStructureKey;
  }
>;

export default function ExportableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  ExportableNodeStructureFields["staticFields"],
  ExportableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class ExportableNodeStructureMixin extends baseClass {
    isDefaultExport = false;
    isExported = false;

    public static [COPY_FIELDS](
      source: ExportableNodeStructure & Structures,
      target: ExportableNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      target.isExported = source.isExported ?? false;
      target.isDefaultExport = source.isDefaultExport ?? false;
    }

    public toJSON(): Jsonify<ExportableNodeStructure> {
      const rv = super.toJSON() as ExportableNodeStructure;
      rv.isDefaultExport = this.isDefaultExport;
      rv.isExported = this.isExported;
      return rv;
    }
  }

  return ExportableNodeStructureMixin;
}

ExportableNodeStructureMixin satisfies SubclassDecorator<
  ExportableNodeStructureFields,
  typeof StructureBase,
  false
>;
