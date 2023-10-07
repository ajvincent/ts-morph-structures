//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type DecoratorStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const DecoratorStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class DecoratorImpl
  extends DecoratorStructureBase
  implements DecoratorStructure
{
  readonly kind: StructureKind.Decorator = StructureKind.Decorator;
  arguments: stringOrWriter[] = [];
  typeArguments: string[] = [];
  name = "";

  public static copyFields(
    source: DecoratorStructure & Structures,
    target: DecoratorImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (Array.isArray(source.arguments)) {
      target.arguments = source.arguments.slice();
    } else if (source.arguments !== undefined) {
      target.arguments = [source.arguments];
    }

    if (Array.isArray(source.typeArguments)) {
      target.typeArguments = source.typeArguments.slice();
    } else if (source.typeArguments !== undefined) {
      target.typeArguments = [source.typeArguments];
    }

    if (source.name) {
      target.name = source.name;
    }
  }
}
