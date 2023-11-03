//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import type { stringOrWriterFunction } from "../types/stringOrWriterFunction.js";
import MultiMixinBuilder from "mixin-decorators";
import { type DecoratorStructure, OptionalKind, StructureKind } from "ts-morph";
import type { Class, Jsonify } from "type-fest";
//#endregion preamble
const DecoratorStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class DecoratorImpl
  extends DecoratorStructureBase
  implements RequiredOmit<PreferArrayFields<DecoratorStructure>>
{
  readonly kind: StructureKind.Decorator = StructureKind.Decorator;
  readonly arguments: stringOrWriterFunction[] = [];
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

DecoratorImpl satisfies CloneableStructure<DecoratorStructure, DecoratorImpl> &
  Class<ExtractStructure<DecoratorStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.Decorator, DecoratorImpl);
