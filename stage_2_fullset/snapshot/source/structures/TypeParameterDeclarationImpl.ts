//#region preamble
import type { TypeStructures } from "../exports.js";
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
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  TypeAccessors,
  TypeStructureClassesMap,
} from "../internal-exports.js";
import type { stringOrWriterFunction } from "../types/stringOrWriterFunction.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  StructureKind,
  type TypeParameterDeclarationStructure,
  TypeParameterVariance,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const TypeParameterDeclarationStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

interface ConstraintInterface {
  constraintStructure: string | TypeStructures | undefined;
}

interface DefaultInterface {
  defaultStructure: string | TypeStructures | undefined;
}

export default class TypeParameterDeclarationImpl
  extends TypeParameterDeclarationStructureBase
  implements
    RequiredOmit<
      PreferArrayFields<TypeParameterDeclarationStructure>,
      "constraint" | "default" | "variance"
    >,
    ConstraintInterface,
    DefaultInterface
{
  readonly kind: StructureKind.TypeParameter = StructureKind.TypeParameter;
  readonly #constraintManager = new TypeAccessors();
  readonly #defaultManager = new TypeAccessors();
  isConst = false;
  variance?: TypeParameterVariance = undefined;

  constructor(name: string) {
    super();
    this.name = name;
  }

  get constraint(): stringOrWriterFunction | undefined {
    return this.#constraintManager.type;
  }

  set constraint(value: stringOrWriterFunction | undefined) {
    this.#constraintManager.type = value;
  }

  get constraintStructure(): string | TypeStructures | undefined {
    return this.#constraintManager.typeStructure;
  }

  set constraintStructure(value: string | TypeStructures | undefined) {
    this.#constraintManager.typeStructure = value;
  }

  get default(): stringOrWriterFunction | undefined {
    return this.#defaultManager.type;
  }

  set default(value: stringOrWriterFunction | undefined) {
    this.#defaultManager.type = value;
  }

  get defaultStructure(): string | TypeStructures | undefined {
    return this.#defaultManager.typeStructure;
  }

  set defaultStructure(value: string | TypeStructures | undefined) {
    this.#defaultManager.typeStructure = value;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<TypeParameterDeclarationStructure>,
    target: TypeParameterDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    const { constraintStructure } =
      source as unknown as TypeParameterDeclarationImpl;
    if (constraintStructure) {
      target.constraintStructure =
        TypeStructureClassesMap.clone(constraintStructure);
    } else if (source.constraint) {
      target.constraint = source.constraint;
    }

    const { defaultStructure } =
      source as unknown as TypeParameterDeclarationImpl;
    if (defaultStructure) {
      target.defaultStructure = TypeStructureClassesMap.clone(defaultStructure);
    } else if (source.default) {
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

  public toJSON(): StructureClassToJSON<TypeParameterDeclarationImpl> {
    const rv =
      super.toJSON() as StructureClassToJSON<TypeParameterDeclarationImpl>;
    if (this.constraint) {
      rv.constraint = StructureBase[REPLACE_WRITER_WITH_STRING](
        this.constraint,
      );
    } else {
      rv.constraint = undefined;
    }

    if (this.default) {
      rv.default = StructureBase[REPLACE_WRITER_WITH_STRING](this.default);
    } else {
      rv.default = undefined;
    }

    rv.isConst = this.isConst;
    rv.kind = this.kind;
    if (this.variance) {
      rv.variance = this.variance;
    } else {
      rv.variance = undefined;
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
