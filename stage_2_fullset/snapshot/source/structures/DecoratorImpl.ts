//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  REPLACE_WRITER_WITH_STRING,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import { type DecoratorStructure, OptionalKind, StructureKind } from "ts-morph";
import type { Jsonify } from "type-fest";
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

  public static [COPY_FIELDS](
    source: OptionalKind<DecoratorStructure>,
    target: DecoratorImpl,
  ): void {
    super[COPY_FIELDS](source, target);
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
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<DecoratorStructure> {
    const rv = super.toJSON() as DecoratorStructure;
    rv.arguments = this.arguments.map((value) => {
      return StructureBase[REPLACE_WRITER_WITH_STRING](value);
    });
    rv.kind = this.kind;
    rv.typeArguments = this.typeArguments;
    return rv;
  }
}

DecoratorImpl satisfies CloneableStructure<DecoratorStructure, DecoratorImpl>;
StructuresClassesMap.set(StructureKind.Decorator, DecoratorImpl);
