//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { GeneratorableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const GeneratorableNodeStructureKey: unique symbol;
export type GeneratorableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof GeneratorableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: Required<GeneratorableNodeStructure>;
    symbolKey: typeof GeneratorableNodeStructureKey;
  }
>;

export default function GeneratorableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  GeneratorableNodeStructureFields["staticFields"],
  GeneratorableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class GeneratorableNodeStructureMixin extends baseClass {
    isGenerator = false;

    public static copyFields(
      source: GeneratorableNodeStructure & Structures,
      target: Required<GeneratorableNodeStructureMixin> & Structures,
    ): void {
      super.copyFields(source, target);
      target.isGenerator = source.isGenerator ?? false;
    }
  }

  return GeneratorableNodeStructureMixin;
}

GeneratorableNodeStructureMixin satisfies SubclassDecorator<
  GeneratorableNodeStructureFields,
  typeof StructureBase,
  false
>;
