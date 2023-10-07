//#region preamble
import {
  type InitializerExpressionableNodeStructureFields,
  InitializerExpressionableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type EnumMemberStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const EnumMemberStructureBase = MultiMixinBuilder<
  [
    InitializerExpressionableNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    InitializerExpressionableNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class EnumMemberImpl
  extends EnumMemberStructureBase
  implements EnumMemberStructure
{
  readonly kind: StructureKind.EnumMember = StructureKind.EnumMember;
  value?: string | number = undefined;

  public static copyFields(
    source: EnumMemberStructure & Structures,
    target: EnumMemberImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.value) {
      target.value = source.value;
    }
  }
}
