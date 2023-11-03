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
import {
  OptionalKind,
  StructureKind,
  type TypeParameterDeclarationStructure,
  TypeParameterVariance,
} from "ts-morph";
import type { Class, Jsonify } from "type-fest";
//#endregion preamble
const TypeParameterDeclarationStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class TypeParameterDeclarationImpl
  extends TypeParameterDeclarationStructureBase
  implements
    RequiredOmit<
      PreferArrayFields<TypeParameterDeclarationStructure>,
      "constraint" | "default" | "variance"
    >
{
  readonly kind: StructureKind.TypeParameter = StructureKind.TypeParameter;
  constraint?: stringOrWriterFunction = undefined;
  default?: stringOrWriterFunction = undefined;
  isConst = false;
  variance?: TypeParameterVariance = undefined;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<TypeParameterDeclarationStructure>,
    target: TypeParameterDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.constraint) {
      target.constraint = source.constraint;
    }

    if (source.default) {
      target.default = source.default;
    }

    target.isConst = source.isConst ?? false;
    if (source.variance) {
      target.variance = source.variance;
    }
  }

  public static clone(
    source: OptionalKind<TypeParameterDeclarationStructure>,
  ): TypeParameterDeclarationImpl {
    const target = new TypeParameterDeclarationImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<TypeParameterDeclarationStructure> {
    const rv = super.toJSON() as TypeParameterDeclarationStructure;
    if (this.constraint) {
      rv.constraint = StructureBase[REPLACE_WRITER_WITH_STRING](
        this.constraint,
      );
    }

    if (this.default) {
      rv.default = StructureBase[REPLACE_WRITER_WITH_STRING](this.default);
    }

    rv.isConst = this.isConst;
    rv.kind = this.kind;
    if (this.variance) {
      rv.variance = this.variance;
    }

    return rv;
  }
}

TypeParameterDeclarationImpl satisfies CloneableStructure<
  TypeParameterDeclarationStructure,
  TypeParameterDeclarationImpl
> &
  Class<ExtractStructure<TypeParameterDeclarationStructure["kind"]>>;
StructuresClassesMap.set(
  StructureKind.TypeParameter,
  TypeParameterDeclarationImpl,
);
