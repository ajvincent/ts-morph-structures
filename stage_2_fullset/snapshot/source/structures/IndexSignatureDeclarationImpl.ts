//#region preamble
import {
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type ReadonlyableNodeStructureFields,
  ReadonlyableNodeStructureMixin,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import type { IndexSignatureDeclarationStructure, Structures } from "ts-morph";
//#endregion preamble
const IndexSignatureDeclarationStructureBase = MultiMixinBuilder<
  [
    ReadonlyableNodeStructureFields,
    ReturnTypedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ReadonlyableNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class IndexSignatureDeclarationImpl extends IndexSignatureDeclarationStructureBase {
  keyName?: string = undefined;
  keyType?: string = undefined;

  public static copyFields(
    source: IndexSignatureDeclarationStructure & Structures,
    target: IndexSignatureDeclarationImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.keyName) {
      target.keyName = source.keyName;
    }

    if (source.keyType) {
      target.keyType = source.keyType;
    }
  }
}
