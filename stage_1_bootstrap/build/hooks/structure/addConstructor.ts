import {
  StructureKind
} from "ts-morph";

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

  const isStatic_property = parts.classMembersMap.getAsKind<StructureKind.Property>("isStatic", StructureKind.Property);
  const hasNamed = meta.decoratorKeys.has("NamedNodeStructure");
  if (Boolean(isStatic_property) || hasNamed) {
    constructor = new ConstructorDeclarationImpl;
    constructor.statements.push("super();");
  }

  if (isStatic_property) {
    isStatic_property.isReadonly = true;
    isStatic_property.initializer = undefined;
    isStatic_property.typeStructure = ConstantTypeStructures.boolean;

    const staticParam = new ParameterDeclarationImpl("isStatic");
    staticParam.typeStructure = ConstantTypeStructures.boolean;
    constructor!.parameters.push(staticParam);
    constructor!.statements.push(`this.isStatic = isStatic;`);
  }

  if (hasNamed) {
    const nameParam = new ParameterDeclarationImpl("name");
    nameParam.typeStructure = ConstantTypeStructures.string;
    constructor!.parameters.push(nameParam);
    constructor!.statements.push(`this.name = name;`);
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
    const existingProp = parts.classMembersMap.getAsKind<StructureKind.Property>(key, StructureKind.Property)!
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
    parts.classMembersMap.addMembers([constructor]);
  }

  return Promise.resolve();
}
