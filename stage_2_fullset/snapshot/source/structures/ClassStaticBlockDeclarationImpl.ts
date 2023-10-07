//#region preamble
import {
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type StatementedNodeStructureFields,
  StatementedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import type {
  ClassStaticBlockDeclarationStructure,
  Structures,
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

export default class ClassStaticBlockDeclarationImpl extends ClassStaticBlockDeclarationStructureBase {
  public static copyFields(
    source: ClassStaticBlockDeclarationStructure & Structures,
    target: ClassStaticBlockDeclarationImpl & Structures,
  ): void {
    super.copyFields(source, target);
  }
}
