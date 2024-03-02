import {
  ClassFieldStatementsMap,
  MemberedStatementsKey,
  type stringWriterOrStatementImpl
} from "#stage_two/snapshot/source/exports.js";
import GetterFilter from "./GetterFilter.js";

export default class StructureIteratorStatements extends GetterFilter
{
  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    return (key.statementGroupKey === "[STRUCTURE_AND_TYPES_CHILDREN]") && (
      /^#.*Manager$/.test(key.fieldKey) || (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL)
    );
  }

  /*
  public *[STRUCTURE_AND_TYPES_CHILDREN](): IterableIterator<
    StructureImpls | TypeStructures
  > {
    yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
    if (typeof this.returnTypeStructure === "object")
      yield this.returnTypeStructure;
  }
  */

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    if (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL) {
      return [`yield* super[STRUCTURE_AND_TYPES_CHILDREN]();`];
    }

    const propertyName = key.fieldKey.substring(1).replace("Manager", "Structure");
    return [
      `if (typeof this.${propertyName} === "object") yield this.${propertyName};`
    ]
  }
}
