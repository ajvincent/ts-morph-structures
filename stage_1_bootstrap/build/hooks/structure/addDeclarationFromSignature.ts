/*
import {
  StructureKind,
  VariableDeclarationKind,
} from "ts-morph";
*/

import StructureDictionaries, {
  type StructureParts
} from "#stage_one/build/StructureDictionaries.js";

import {
  StructureImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";

import {
  LiteralTypedStructureImpl,
  MethodDeclarationImpl,
  ParameterDeclarationImpl,
  /*
  UnionTypedStructureImpl,
  VariableDeclarationImpl,
  VariableStatementImpl,
  */
} from "#stage_one/prototype-snapshot/exports.js";

import ClassFieldStatementsMap from "#stage_one/build/utilities/public/ClassFieldStatementsMap.js";
import ClassMembersMap from "#stage_one/build/utilities/public/ClassMembersMap.js";
import { Scope } from "ts-morph";
//import ConstantTypeStructures from "#stage_one/build/utilities/ConstantTypeStructures.js";

export default function addDeclarationFromSignature(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta)!;
  switch (parts.classDecl.name) {
    case "ConstructorDeclarationImpl":
      convertConstructor(parts, dictionaries);
      break;
    case "MethodDeclarationImpl":
      /*
      declarationFromSignature(
        parts,
        dictionaries.structureParts.get("MethodSignatureImpl"),
        dictionaries
      );
      */
      break;
    case "PropertyDeclarationImpl":
      /*
      declarationFromSignature(
        parts,
        dictionaries.structureParts.get("PropertySignatureImpl");
        dictionaries
      );
      */
      break;
  }
  return Promise.resolve();
}

function convertConstructor(
  parts: StructureParts,
  dictionaries: StructureDictionaries
): void
{
  addImport(parts, dictionaries, false, false, "cloneStructureOrStringArray");
  addImport(parts, dictionaries, true, true, "JSDocImpl");
  addImport(parts, dictionaries, true, true, "ParameterDeclarationImpl");
  addImport(parts, dictionaries, true, true, "TypeParameterDeclarationImpl");
  addImport(parts, dictionaries, false, false, "TypeStructureClassesMap");
  const signatureImplClass = "ConstructSignatureDeclarationImpl";

  const groupName = createFromSignatureMethod(signatureImplClass, parts, dictionaries);
  parts.classFieldsStatements.set(
    ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL, groupName, [
      `const declaration = new ${parts.classDecl.name};`
    ]
  );
  parts.classFieldsStatements.set(
    ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN, groupName, [
      `return declaration;`
    ]
  );

  parts.classFieldsStatements.set("docs", groupName, [
    `declaration.docs.push(...cloneStructureOrStringArray<
      JSDocImpl,
      StructureKind.JSDoc,
      JSDocImpl
    >(
      signature.docs as (string | JSDocImpl)[],
      StructureKind.JSDoc
    ) as JSDocImpl[]);`,
  ]);

  parts.classFieldsStatements.set("leadingTrivia", groupName, [
    `declaration.leadingTrivia.push(...signature.leadingTrivia);`,
  ]);
  parts.classFieldsStatements.set("trailingTrivia", groupName, [
    `declaration.trailingTrivia.push(...signature.trailingTrivia);`,
  ]);

  parts.classFieldsStatements.set("typeParameters", groupName, [
    `declaration.typeParameters.push(
      ...StructuresClassesMap.cloneArray(
        signature.typeParameters as TypeParameterDeclarationImpl[]
      ) as TypeParameterDeclarationImpl[],
    );`
  ]);
  parts.classFieldsStatements.set("parameters", groupName, [
    `declaration.parameters.push(
      ...StructuresClassesMap.cloneArray(
        signature.parameters as ParameterDeclarationImpl[]
      ) as ParameterDeclarationImpl[]
    );`,
  ]);
  parts.classFieldsStatements.set("returnType", groupName, [
    `if (signature.returnTypeStructure) {
      declaration.returnTypeStructure = TypeStructureClassesMap.clone(signature.returnTypeStructure);
    }`,
  ]);
}

function createFromSignatureMethod(
  sourceType: string,
  parts: StructureParts,
  dictionaries: StructureDictionaries
): string
{
  addImport(parts, dictionaries, true, true, sourceType);

  const method = new MethodDeclarationImpl("fromSignature");
  method.isStatic = true;
  method.scope = Scope.Public;
  {
    const param = new ParameterDeclarationImpl("signature");
    param.typeStructure = new LiteralTypedStructureImpl(sourceType);
    method.parameters.push(param);
  }
  method.returnType = parts.classDecl.name;
  parts.classMembersMap.addMembers([method]);
  return ClassMembersMap.keyFromMember(method);
}

function addImport(
  parts: StructureParts,
  dictionaries: StructureDictionaries,
  isPublic: boolean,
  isTypeOnly: boolean,
  name: string
): void
{
  const exportManager = isPublic ? dictionaries.publicExports : dictionaries.internalExports;
  parts.importsManager.addImports({
    pathToImportedModule: exportManager.absolutePathToExportFile,
    isPackageImport: false,
    isDefaultImport: false,
    importNames: [name],
    isTypeOnly
  });
}