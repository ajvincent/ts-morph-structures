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
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import { type DecoratorStructure, OptionalKind, StructureKind } from "ts-morph";
//#endregion preamble
const DecoratorStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class DecoratorImpl
  extends DecoratorStructureBase
  implements DecoratorStructure
{
  readonly kind: StructureKind.Decorator = StructureKind.Decorator;
  readonly arguments: stringOrWriter[] = [];
  readonly typeArguments: string[] = [];

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static copyFields(
    source: OptionalKind<DecoratorStructure>,
    target: DecoratorImpl,
  ): void {
    super.copyFields(source, target);
    if (Array.isArray(source.arguments)) {
      target.arguments.push(...source.arguments);
    } else if (source.arguments !== undefined) {
      target.arguments.push(source.arguments);
    }

    if (Array.isArray(source.typeArguments)) {
      target.typeArguments.push(...source.typeArguments);
    } else if (source.typeArguments !== undefined) {
      target.typeArguments.push(source.typeArguments);
    }
  }

  public static clone(source: OptionalKind<DecoratorStructure>): DecoratorImpl {
    const target = new DecoratorImpl(source.name);
    this.copyFields(source, target);
    return target;
  }
}

DecoratorImpl satisfies CloneableStructure<DecoratorStructure>;
StructuresClassesMap.set(StructureKind.Decorator, DecoratorImpl);
