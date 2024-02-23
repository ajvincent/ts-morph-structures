import {
  SourceFileImpl
} from "#stage_two/snapshot/source/exports.js";

import BaseClassModule from "./BaseClassModule.js";

export default
class DecoratorModule extends BaseClassModule
{
  static readonly map = new Map<string, DecoratorModule>;

  constructor(decoratorName: string)
  {
    super("source/decorators/standard", decoratorName, false);
    DecoratorModule.map.set(decoratorName, this);
  }

  useCount = 0;

  /*
  #buildClassDeclaration(): ClassDeclarationImpl {
    throw new Error("Method not implemented.");
  }
  */

  protected getSourceFileImpl(): SourceFileImpl
  {
    throw new Error("Method not implemented.");
  }
}
