//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  StructureKind,
  type TypeParameterDeclarationStructure,
  TypeParameterVariance,
} from "ts-morph";
//#endregion preamble
const TypeParameterDeclarationStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class TypeParameterDeclarationImpl
  extends TypeParameterDeclarationStructureBase
  implements TypeParameterDeclarationStructure
{
  readonly kind: StructureKind.TypeParameter = StructureKind.TypeParameter;
  constraint?: stringOrWriter = undefined;
  default?: stringOrWriter = undefined;
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
    target.isConst = source.isConst ?? false;
    if (source.constraint) {
      target.constraint = source.constraint;
    }

    if (source.default) {
      target.default = source.default;
    }

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
}

TypeParameterDeclarationImpl satisfies CloneableStructure<
  TypeParameterDeclarationStructure,
  TypeParameterDeclarationImpl
>;
StructuresClassesMap.set(
  StructureKind.TypeParameter,
  TypeParameterDeclarationImpl,
);
