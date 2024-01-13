import {
  StructureKind,
  VariableDeclarationKind,
} from "ts-morph";

import StructureDictionaries, {
  StructureParts
} from "#stage_one/build/StructureDictionaries.js";

import {
  StructureImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";

import {
  LiteralTypedStructureImpl,
  ParameterDeclarationImpl,
  VariableDeclarationImpl,
  VariableStatementImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import ClassFieldStatementsMap from "#stage_one/build/utilities/public/ClassFieldStatementsMap.js";
import ClassMembersMap from "#stage_one/build/utilities/public/ClassMembersMap.js";

export default function structureSpecialCases(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta)!;
  switch (parts.classDecl.name) {
    case "IndexSignatureDeclarationImpl":
      fixKeyTypeField(parts, dictionaries);
      break;

    case "SetAccessorDeclarationImpl":
      addParameterToSetAccessorCtor(parts, dictionaries);
      break;
  }
  return Promise.resolve();
}

function fixKeyTypeField(
  parts: StructureParts,
  dictionaries: StructureDictionaries,
): void
{
  parts.importsManager.addImports({
    pathToImportedModule: dictionaries.internalExports.absolutePathToExportFile,
    isPackageImport: false,
    importNames: ["REPLACE_WRITER_WITH_STRING"],
    isDefaultImport: false,
    isTypeOnly: false,
  });

  const propertyName = ClassMembersMap.keyFromName(StructureKind.Property, false, "keyType");
  const getterName = ClassMembersMap.keyFromName(StructureKind.GetAccessor, false, "keyType");
  const setterName = ClassMembersMap.keyFromName(StructureKind.SetAccessor, false, "keyType");

  const setter = parts.classMembersMap.getAsKind(
    setterName,
    StructureKind.SetAccessor
  )!;

  const initializer = parts.classFieldsStatements.get(
    propertyName,
    ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
  )![0] as string;

  parts.classFieldsStatements.delete(
    propertyName,
    ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY
  );

  parts.classFieldsStatements.set(
    ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN,
    getterName,
    [
      `const type = ${initializer};`,
      `return type ? StructureBase[REPLACE_WRITER_WITH_STRING](type) : undefined;`,
    ]
  );

  parts.classFieldsStatements.set(
    ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN,
    setterName,
    [
      `${initializer} = ${setter.parameters[0].name};`,
    ]
  );
}

function addParameterToSetAccessorCtor(
  parts: StructureParts,
  dictionaries: StructureDictionaries
): void
{
  parts.importsManager.addImports({
    pathToImportedModule: dictionaries.publicExports.absolutePathToExportFile,
    isPackageImport: false,
    importNames: ["ParameterDeclarationImpl"],
    isDefaultImport: false,
    isTypeOnly: false
  });

  const setterParam = new ParameterDeclarationImpl("setterParameter");
  setterParam.typeStructure = new LiteralTypedStructureImpl("ParameterDeclarationImpl");

  const ctor = parts.classMembersMap.getAsKind<StructureKind.Constructor>(
    "constructor", StructureKind.Constructor
  )!;
  ctor.parameters.push(setterParam);

  parts.classFieldsStatements.set("setterParameter", "constructor", [
    "this.parameters.push(setterParameter);"
  ]);

  const cloneStatements = parts.classFieldsStatements.get(
    "(body)", "static clone"
  )!;

  const valueParamStatement = new VariableStatementImpl();
  valueParamStatement.declarationKind = VariableDeclarationKind.Const;
  const valueParamDeclaration = new VariableDeclarationImpl("valueParam");
  valueParamDeclaration.type = "ParameterDeclarationImpl";
  valueParamDeclaration.initializer = `new ParameterDeclarationImpl("value");`;
  valueParamStatement.declarations.push(valueParamDeclaration);

  cloneStatements.splice(
    0, 1,
    // harder to read, I know, but also a valuable unit test
    valueParamStatement,
    `const hasSourceParameter = source.parameters && source.parameters.length > 0;`,

    // `const target = new ${classDecl.name!}(${constructorArgs.join(", ")});`,
    (cloneStatements[0] as string).replace("source.name", "source.name, valueParam")
  );

  parts.classFieldsStatements.set("valueParam", "static clone", [
    `if (hasSourceParameter) {
      // copy-fields included copying the existing parameter, so we have to drop our artificial one
      target.parameters.shift();
    }`
  ]);
}
