//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { ExportableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const ExportableNodeStructureKey: unique symbol;
export type ExportableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ExportableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: Required<ExportableNodeStructure>;
    symbolKey: typeof ExportableNodeStructureKey;
  }
>;

export default function ExportableNode(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  ExportableNodeStructureFields["staticFields"],
  ExportableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class ExportableNodeMixin extends baseClass {
    isExported = false;
    isDefaultExport = false;

    public static copyFields(
      source: ExportableNodeStructure & Structures,
      target: Required<ExportableNodeMixin> & Structures,
    ): void {
      super.copyFields(source, target);
      target.isExported = source.isExported ?? false;
      target.isDefaultExport = source.isDefaultExport ?? false;
    }
  }

  return ExportableNodeMixin;
}

ExportableNode satisfies SubclassDecorator<
  ExportableNodeStructureFields,
  typeof StructureBase,
  false
>;
