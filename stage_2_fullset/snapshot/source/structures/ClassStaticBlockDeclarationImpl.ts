//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
  type StatementedNodeStructureFields,
  StatementedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ClassStaticBlockDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
const ClassStaticBlockDeclarationStructureBase = MultiMixinBuilder<
  [
    StatementedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [StatementedNodeStructureMixin, JSDocableNodeStructureMixin, StructureMixin],
  StructureBase,
);

export default class ClassStaticBlockDeclarationImpl
  extends ClassStaticBlockDeclarationStructureBase
  implements
    RequiredOmit<PreferArrayFields<ClassStaticBlockDeclarationStructure>>
{
  readonly kind: StructureKind.ClassStaticBlock =
    StructureKind.ClassStaticBlock;

  public static clone(
    source: OptionalKind<ClassStaticBlockDeclarationStructure>,
  ): ClassStaticBlockDeclarationImpl {
    const target = new ClassStaticBlockDeclarationImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<ClassStaticBlockDeclarationStructure> {
    const rv = super.toJSON() as ClassStaticBlockDeclarationStructure;
    rv.kind = this.kind;
    return rv;
  }
}

ClassStaticBlockDeclarationImpl satisfies CloneableStructure<
  ClassStaticBlockDeclarationStructure,
  ClassStaticBlockDeclarationImpl
>;
StructuresClassesMap.set(
  StructureKind.ClassStaticBlock,
  ClassStaticBlockDeclarationImpl,
);
