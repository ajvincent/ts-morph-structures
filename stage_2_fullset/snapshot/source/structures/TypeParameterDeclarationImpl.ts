//#region preamble
import {
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type Structures,
  type TypeParameterDeclarationStructure,
  TypeParameterVariance,
} from "ts-morph";
//#endregion preamble
const TypeParameterDeclarationStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class TypeParameterDeclarationImpl extends TypeParameterDeclarationStructureBase {
  isConst = false;
  constraint?: stringOrWriter = undefined;
  default?: stringOrWriter = undefined;
  variance?: TypeParameterVariance = undefined;

  public static copyFields(
    source: TypeParameterDeclarationStructure & Structures,
    target: TypeParameterDeclarationImpl & Structures,
  ): void {
    super.copyFields(source, target);
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
}
