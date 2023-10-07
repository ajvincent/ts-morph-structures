//#region preamble
import {
  type CloneableStructure,
  type InitializerExpressionableNodeStructureFields,
  InitializerExpressionableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type EnumMemberStructure,
  OptionalKind,
  StructureKind,
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
    source: OptionalKind<EnumMemberStructure>,
    target: EnumMemberImpl,
  ): void {
    super.copyFields(source, target);
    if (source.value) {
      target.value = source.value;
    }
  }

  public static clone(
    source: OptionalKind<EnumMemberStructure>,
  ): EnumMemberImpl {
    const target = new EnumMemberImpl();
    this.copyFields(source, target);
    return target;
  }
}

EnumMemberImpl satisfies CloneableStructure<EnumMemberStructure>;
StructuresClassesMap.set(StructureKind.EnumMember, EnumMemberImpl);
