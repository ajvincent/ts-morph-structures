import {
  ClassDeclarationImpl,
  ClassFieldStatementsMap,
  ClassMembersMap
} from "#stage_two/snapshot/source/exports.js";
import BaseModule from "./BaseModule.js";

export default
abstract class BaseClassModule extends BaseModule
{
  readonly statementsMap = new ClassFieldStatementsMap;
  readonly classMembersMap = new ClassMembersMap;

  constructor(
    pathToParentDirectory: string,
    defaultExportName: string
  ) {
    super(pathToParentDirectory, defaultExportName);
  }

  abstract buildClassDeclaration(): ClassDeclarationImpl;
}
