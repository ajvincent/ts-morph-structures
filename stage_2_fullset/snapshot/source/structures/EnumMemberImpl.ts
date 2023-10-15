//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
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

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<EnumMemberStructure>,
    target: EnumMemberImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.value) {
      target.value = source.value;
    }
  }

  public static clone(
    source: OptionalKind<EnumMemberStructure>,
  ): EnumMemberImpl {
    const target = new EnumMemberImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): EnumMemberStructure {
    const rv = super.toJSON() as EnumMemberStructure;
    rv.kind = this.kind;
    if (this.value) {
      rv.value = this.value;
    }

    return rv;
  }
}

EnumMemberImpl satisfies CloneableStructure<
  EnumMemberStructure,
  EnumMemberImpl
>;
StructuresClassesMap.set(StructureKind.EnumMember, EnumMemberImpl);
