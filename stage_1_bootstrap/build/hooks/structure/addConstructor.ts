import StructureDictionaries from "#stage_one/build/StructureDictionaries.js";

import {
  PropertyName,
  PropertyValue,
  StructureImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";

import ConstantTypeStructures from "#stage_one/build/utilities/ConstantTypeStructures.js";

import {
  ConstructorDeclarationImpl,
  ParameterDeclarationImpl,
} from "#stage_one/prototype-snapshot/exports.js";

export default function addConstructor(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta)!;

  let constructor: ConstructorDeclarationImpl | undefined;
  if (meta.decoratorKeys.has("NamedNodeStructure")) {
    constructor = new ConstructorDeclarationImpl;
    constructor.statements.push("super();");
    const param = new ParameterDeclarationImpl("name");
    param.typeStructure = ConstantTypeStructures.string;
    constructor.parameters.push(param);
    constructor.statements.push(`this.name = name;`);
  }

  meta.structureFields.forEach((value: PropertyValue, key: PropertyName) => {
    if (value.hasQuestionToken || value.mayBeUndefined)
      return;
    if (key === "kind")
      return;
    if (!constructor) {
      constructor ??= new ConstructorDeclarationImpl;
      constructor.statements.push("super();");
    }

    const param = new ParameterDeclarationImpl(key);
    const existingProp = parts.classDecl.properties.find(decl => decl.name === key)!;
    if (existingProp.typeStructure)
      param.typeStructure = existingProp.typeStructure;
    else if (existingProp.initializer === `""`) {
      param.typeStructure = ConstantTypeStructures.string;
      existingProp.typeStructure = ConstantTypeStructures.string;
      existingProp.initializer = undefined;
    }

    constructor.parameters.push(param);
    constructor.statements.push(`this.${key} = ${key};`);
  });

  if (constructor) {
    parts.classDecl.ctors.push(constructor);
  }

  return Promise.resolve();
}

