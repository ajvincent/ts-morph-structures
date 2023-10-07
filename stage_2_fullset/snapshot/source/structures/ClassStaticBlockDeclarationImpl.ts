//#region preamble
import {
  type CloneableStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
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
  implements ClassStaticBlockDeclarationStructure
{
  readonly kind: StructureKind.ClassStaticBlock =
    StructureKind.ClassStaticBlock;

  public static copyFields(
    source: OptionalKind<ClassStaticBlockDeclarationStructure>,
    target: ClassStaticBlockDeclarationImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<ClassStaticBlockDeclarationStructure>,
  ): ClassStaticBlockDeclarationImpl {
    const target = new ClassStaticBlockDeclarationImpl();
    this.copyFields(source, target);
    return target;
  }
}

ClassStaticBlockDeclarationImpl satisfies CloneableStructure<ClassStaticBlockDeclarationStructure>;
StructuresClassesMap.set(
  StructureKind.ClassStaticBlock,
  ClassStaticBlockDeclarationImpl,
);
