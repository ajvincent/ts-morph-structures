import {
  PropertyDeclarationImpl,
} from "../../../prototype-snapshot/exports.js";

import StructureDictionaries from "../../StructureDictionaries.js";
import type {
  DecoratorImplMeta
} from "../../structureMeta/DataClasses.js";

export default function addBooleanFields(
  name: string,
  meta: DecoratorImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.decoratorParts.get(meta);
  if (!parts)
    return Promise.resolve();

  meta.booleanKeys.forEach(key => {
    const prop = new PropertyDeclarationImpl(key);
    prop.initializer = "false";

    parts.classDecl.properties.push(prop);
    parts.copyFields.statements.push(
      `target.${key} = source.${key} ?? false;`
    );
  });

  return Promise.resolve();
}
