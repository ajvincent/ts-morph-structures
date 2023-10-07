//#region preamble
import {
  type ExclamationTokenableNodeStructureFields,
  ExclamationTokenableNodeStructureMixin,
  type InitializerExpressionableNodeStructureFields,
  InitializerExpressionableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  type TypedNodeStructureFields,
  TypedNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import type { Structures, VariableDeclarationStructure } from "ts-morph";
//#endregion preamble
const VariableDeclarationStructureBase = MultiMixinBuilder<
  [
    ExclamationTokenableNodeStructureFields,
    InitializerExpressionableNodeStructureFields,
    TypedNodeStructureFields,
    NamedNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ExclamationTokenableNodeStructureMixin,
    InitializerExpressionableNodeStructureMixin,
    TypedNodeStructureMixin,
    NamedNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class VariableDeclarationImpl extends VariableDeclarationStructureBase {
  public static copyFields(
    source: VariableDeclarationStructure & Structures,
    target: VariableDeclarationImpl & Structures,
  ): void {
    super.copyFields(source, target);
  }
}
