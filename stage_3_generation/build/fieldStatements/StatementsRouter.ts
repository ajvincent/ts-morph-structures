import {
  ClassFieldStatementsMap,
  MemberedStatementsKey,
  stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import {
  BaseClassModule,
} from "../../moduleClasses/exports.js";

import StatementGetterBase from "./GetterBase.js";
import GetterFilter from "./GetterFilter.js";

import ArrayBooleanAndString from "./ArrayBooleanAndString.js";
import CopyFieldsStatements from "./CopyFields.js";
import StructureIteratorStatements from "./StructureIterator.js";
import ToJSONStatements from "./ToJSON.js";
import UndefinedProperties from "./UndefinedProperties.js";

import TypeManagerStatements from "./TypeStructures/Manager.js";
import TypeGetterStatements from "./TypeStructures/TypeGetter.js";
import TypeStructureGetterStatements from "./TypeStructures/StructureGetter.js";

import DebuggingFilter from "./Debugging.js";
void(DebuggingFilter);
void(ClassFieldStatementsMap);

export default
class StatementsRouter extends StatementGetterBase
{
  readonly filters: GetterFilter[];

  constructor(
    module: BaseClassModule
  )
  {
    super(module);
    this.filters = [
      new ArrayBooleanAndString(module),
      new CopyFieldsStatements(module),
      new ToJSONStatements(module),
      new StructureIteratorStatements(module),
      new TypeManagerStatements(module),
      new TypeGetterStatements(module),
      new TypeStructureGetterStatements(module),

      // this is last, because anything with a value we should've filtered out by now.
      new UndefinedProperties(module),
    ];
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    for (const filter of this.filters) {
      if (filter.accept(key)) {
        return filter.getStatements(key);
      }
    }

    return [];
  }
}
