// #region preamble
import assert from 'node:assert/strict'

import path from "path";

import {
  CodeBlockWriter,
  StructureKind,
  WriterFunction
} from "ts-morph";

import {
  COPY_FIELDS_NAME,
  distDir
} from "#stage_two/generation/build/constants.js";

import ConstantTypeStructures from "#stage_two/generation/build/utilities/ConstantTypeStructures.js";
import {
  ArrayTypedStructureImpl,
  LiteralTypedStructureImpl,
  MethodDeclarationImpl,
  ParameterDeclarationImpl,
  ParenthesesTypedStructureImpl,
  PropertyDeclarationImpl,
  TypeStructureClassesMap,
  TypeStructureKind,
  TypeStructures,
  UnionTypedStructureImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import StructureDictionaries, {
  DecoratorParts,
  StructureParts,
} from "#stage_two/generation/build/StructureDictionaries.js";

import {
  DecoratorImplMeta,
  PropertyName,
  PropertyValue,
  StructureImplMeta,
} from "#stage_two/generation/build/structureMeta/DataClasses.js";

import pairedWrite from "../utilities/pairedWrite.js";
import ClassFieldStatementsMap from "../utilities/public/ClassFieldStatementsMap.js";
import {
  getStructureImplName,
} from '#utilities/source/StructureNameTransforms.js';
// #endregion preamble

export default function addClassProperties(
  name: string,
  meta: DecoratorImplMeta | StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  let parts: DecoratorParts | StructureParts;
  if (meta instanceof DecoratorImplMeta) {
    parts = dictionaries.decoratorParts.get(meta)!;
  } else {
    parts = dictionaries.structureParts.get(meta)!;
  }

  const properties: PropertyDeclarationImpl[] = [];

  meta.booleanKeys.forEach(key => {
    const prop = new PropertyDeclarationImpl(key);
    properties.push(prop);

    parts.classFieldsStatements.set(
      key, ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, ["false"]
    );
    parts.classMembersMap.addMembers([prop]);

    if (key !== "isStatic") {
      parts.classFieldsStatements.set(key, COPY_FIELDS_NAME, [
        `target.${key} = source.${key} ?? false;`
      ]);
    }
  });

  meta.structureFieldArrays.forEach((
    propertyValue: PropertyValue,
    propertyKey: PropertyName
  ): void => addStructureFieldArray(name, dictionaries, parts, propertyValue, propertyKey));

  meta.structureFields.forEach((
    propertyValue: PropertyValue,
    propertyKey: PropertyName
  ): void => addStructureField(dictionaries, parts, propertyValue, propertyKey));
  parts.classMembersMap.addMembers(properties);

  return Promise.resolve();
}

function addStructureFieldArray(
  structureName: string,
  dictionaries: StructureDictionaries,
  parts: DecoratorParts | StructureParts,
  propertyValue: PropertyValue,
  propertyKey: PropertyName
): void
{
  const signature = parts.classImplementsMap.getAsKind<StructureKind.PropertySignature>(
    propertyKey, StructureKind.PropertySignature
  )!;
  signature.isReadonly = true;

  const prop = new PropertyDeclarationImpl(propertyKey);
  prop.isReadonly = true;

  let typeStructure = getTypeStructureForValue(propertyValue, parts, dictionaries);
  if (typeStructure.kind === TypeStructureKind.Union)
    typeStructure = new ParenthesesTypedStructureImpl(typeStructure);

  prop.typeStructure = new ArrayTypedStructureImpl(typeStructure);

  // this has to come early because write_cloneStatementsArray depends on it.
  parts.classMembersMap.addMembers([prop]);

  const hasAStructure = propertyValue.otherTypes.some(
    valueInUnion => valueInUnion.structureName && dictionaries.structures.has(valueInUnion.structureName)
  );

  let statement: WriterFunction;
  if (hasAStructure) {
    if (propertyValue.otherTypes.length === 2) {
      statement = write_cloneRequiredAndOptionalArray(
        structureName, dictionaries, parts, propertyValue, propertyKey
      );
    }
    else {
      statement = write_cloneStructureArray(
        structureName, dictionaries, parts, propertyValue, propertyKey
      );
    }
  }
  else if (propertyKey === "statements") {
    statement = write_cloneStatementsArray(
      structureName, dictionaries, parts, propertyValue, propertyKey
    );
  }
  else {
    statement = (writer: CodeBlockWriter): void => {
      writer.write(`if (Array.isArray(source.${propertyKey})) `);
      writer.block(() => {
        writer.write(`target.${propertyKey}.push(...source.${propertyKey});`);
      });
      writer.write(`else if (source.${propertyKey} !== undefined)`);
      writer.block(() => {
        writer.write(`target.${propertyKey}.push(source.${propertyKey});`)
      });
    };
  }

  parts.classFieldsStatements.set(propertyKey, COPY_FIELDS_NAME, [statement]);
  parts.classFieldsStatements.set(
    propertyKey, ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, ["[]"]
  );
}

function addStructureField(
  dictionaries: StructureDictionaries,
  parts: DecoratorParts | StructureParts,
  propertyValue: PropertyValue,
  propertyKey: PropertyName
): void
{
  const prop = new PropertyDeclarationImpl(propertyKey);
  prop.hasQuestionToken = propertyValue.hasQuestionToken;

  if (prop.hasQuestionToken) {
    parts.classImplementsMap.getAsKind<StructureKind.PropertySignature>(
      propertyKey, StructureKind.PropertySignature
    )!.hasQuestionToken = true;
  }

  let typeStructure = getTypeStructureForValue(propertyValue, parts, dictionaries);
  if (typeStructure.kind === TypeStructureKind.Union)
    typeStructure = new ParenthesesTypedStructureImpl(typeStructure);

  if ((typeStructure !== ConstantTypeStructures.string) || prop.hasQuestionToken)
    prop.typeStructure = typeStructure;

  const initializer = getInitializerForValue(propertyKey, propertyValue, parts, dictionaries);
  if (initializer) {
    parts.classFieldsStatements.set(propertyKey, ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, [
      initializer
    ]);
  }

  if (propertyKey === "kind") {
    prop.isReadonly = true;
  }
  else {
    const hasAStructure = propertyValue.otherTypes.some(
      valueInUnion => valueInUnion.structureName && dictionaries.structures.has(valueInUnion.structureName)
    );
    if (hasAStructure) {
      assert(false, "structure found and needs entry in copyFields");
    }
    else {
      parts.classFieldsStatements.set(propertyKey, COPY_FIELDS_NAME, [
        `if (source.${propertyKey}) {\n  target.${propertyKey} = source.${propertyKey};\n}\n`,
      ]);
    }
  }

  parts.classMembersMap.addMembers([prop]);
}

function getTypeStructureForValue(
  value: PropertyValue,
  parts: DecoratorParts | StructureParts,
  dictionaries: StructureDictionaries,
): TypeStructures
{
  const structures = getTypeStructureArrayForValue(value, parts, dictionaries);
  if (structures.length === 1) {
    return structures[0];
  }
  return new UnionTypedStructureImpl(structures);
}

const stringOrWriterModule = path.join(distDir, "source/types/stringOrWriterFunction.d.ts");
const cloneStructureArrayModule = path.join(distDir, "source/base/cloneStructureArray.ts");

function getTypeStructureArrayForValue(
  value: PropertyValue,
  parts: DecoratorParts | StructureParts,
  dictionaries: StructureDictionaries
): TypeStructures[]
{
  const typeStructures: TypeStructures[] = [];

  if (value.mayBeString && value.mayBeWriter) {
    typeStructures.push(
      ConstantTypeStructures.stringOrWriterFunction
    );

    parts.importsManager.addImports({
      pathToImportedModule: stringOrWriterModule,
      isPackageImport: false,
      importNames: ["stringOrWriterFunction"],
      isDefaultImport: false,
      isTypeOnly: true,
    });

    dictionaries.publicExports.addExports({
      absolutePathToModule: path.join(distDir, "source/types/stringOrWriterFunction.ts"),
      exportNames: ["stringOrWriterFunction"],
      isDefaultExport: false,
      isType: true,
    });
  }
  else if (value.mayBeString) {
    typeStructures.push(ConstantTypeStructures.string);
  }
  else if (value.mayBeWriter) {
    typeStructures.push(ConstantTypeStructures.WriterFunction);
    parts.importsManager.addImports({
      pathToImportedModule: "ts-morph",
      isPackageImport: true,
      importNames: ["WriterFunction"],
      isDefaultImport: false,
      isTypeOnly: true
    });
  }

  if (value.mayBeUndefined) {
    typeStructures.push(ConstantTypeStructures.undefined);
  }

  value.otherTypes.forEach(valueInUnion => {
    if (valueInUnion.structureName && dictionaries.structures.has(valueInUnion.structureName)) {
      const implName = getStructureImplName(valueInUnion.structureName);
      typeStructures.push(new LiteralTypedStructureImpl(implName));

      if (implName !== parts.classDecl.name) {
        parts.importsManager.addImports({
          pathToImportedModule: dictionaries.publicExports.absolutePathToExportFile,
          isPackageImport: false,
          importNames: [implName],
          isDefaultImport: false,
          isTypeOnly: false,
        });
      }

      return;
    }

    typeStructures.push(new LiteralTypedStructureImpl(
      valueInUnion.structureName ??
      valueInUnion.unionName ??
      valueInUnion.tsmorph_Type!
    ));

    if (valueInUnion.structureName) {
      parts.importsManager.addImports({
        pathToImportedModule: "ts-morph",
        isPackageImport: true,
        importNames: [valueInUnion.structureName],
        isDefaultImport: false,
        isTypeOnly: true
      });
    }

    if (valueInUnion.unionName) {
      parts.importsManager.addImports({
        pathToImportedModule: "ts-morph",
        isPackageImport: true,
        importNames: [valueInUnion.unionName],
        isDefaultImport: false,
        isTypeOnly: true
      });
    }

    if (valueInUnion.tsmorph_Type) {
      if (valueInUnion.tsmorph_Type !== "number") {
        parts.importsManager.addImports({
          pathToImportedModule: "ts-morph",
          isPackageImport: true,
          importNames: [valueInUnion.tsmorph_Type.replace(/\..*/g, "")],
          isDefaultImport: false,
          isTypeOnly: false
        });
      }
    }
  });

  return typeStructures;
}

function getInitializerForValue(
  key: PropertyName,
  value: PropertyValue,
  parts: DecoratorParts | StructureParts,
  dictionaries: StructureDictionaries
): string | undefined
{
  if (value.mayBeUndefined || value.hasQuestionToken) {
    return "undefined";
  }

  if (value.mayBeString) {
    return `""`;
  }

  if (key === "kind") {
    return value.otherTypes[0].tsmorph_Type!;
  }

  void(parts);
  void(dictionaries);
  return undefined;
}

function write_cloneRequiredAndOptionalArray(
  structureName: string,
  dictionaries: StructureDictionaries,
  parts: DecoratorParts | StructureParts,
  propertyValue: PropertyValue,
  propertyKey: PropertyName
): WriterFunction
{
  assert(
    propertyValue.mayBeString === false,
    `expected mayBeString to be false for structure name ${structureName}, property name ${propertyKey}`
  );
  assert(
    propertyValue.mayBeWriter === false,
    `expected mayBeWriter to be false for structure name ${structureName}, property name ${propertyKey}`
  );
  assert(
    propertyValue.mayBeUndefined === false,
    `expected mayBeUndefined to be false for structure name ${structureName}, property name ${propertyKey}`
  );
  assert(
    propertyValue.otherTypes[0].isOptionalKind === true,
    `expected first type to be required for structure name ${structureName}, property name ${propertyKey}`
  );
  assert(
    propertyValue.otherTypes[0].structureName !== undefined,
    `expected first structure name to exist for structure name ${structureName}, property name ${propertyKey}`
  );
  assert(
    propertyValue.otherTypes[1].isOptionalKind === false,
    `expected second type to be optional for structure name ${structureName}, property name ${propertyKey}`
  );
  assert(
    propertyValue.otherTypes[1].structureName !== undefined,
    `expected second structure name to exist for structure name ${structureName}, property name ${propertyKey}`
  );

  const requiredName = propertyValue.otherTypes[1].structureName
  const requiredKind = dictionaries.structures.get(requiredName)!.structureKindName;
  const requiredImpl = getStructureImplName(requiredName);

  const optionalName = propertyValue.otherTypes[0].structureName;
  const optionalKind = dictionaries.structures.get(optionalName)!.structureKindName;
  const optionalImpl = getStructureImplName(optionalName);

  parts.importsManager.addImports({
    pathToImportedModule: dictionaries.internalExports.absolutePathToExportFile,
    isDefaultImport: false,
    isPackageImport: false,
    isTypeOnly: false,
    importNames: [
      "cloneRequiredAndOptionalArray"
    ]
  });

  parts.importsManager.addImports({
    pathToImportedModule: "ts-morph",
    isPackageImport: true,
    isDefaultImport: false,
    isTypeOnly: true,
    importNames: [
      "OptionalKind",
      requiredName,
      optionalName,
    ]
  });

  parts.importsManager.addImports({
    pathToImportedModule: "ts-morph",
    isPackageImport: true,
    isDefaultImport: false,
    isTypeOnly: false,
    importNames: [
      "StructureKind",
    ]
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: cloneStructureArrayModule,
    isDefaultExport: false,
    isType: false,
    exportNames: [
      "cloneRequiredAndOptionalArray"
    ]
  });

  const statement = (writer: CodeBlockWriter): void => {
    if (propertyValue.mayBeUndefined || propertyValue.hasQuestionToken) {
      writer.write(`if (source.${propertyKey}) `);
      writer.block(() => addPush(writer));
    }
    else {
      addPush(writer);
    }
  };

  const addPush = (writer: CodeBlockWriter): void => {
    writer.write(`target.${propertyKey}.push`);
    pairedWrite(writer, "(", ");", false, false, () => {
      writer.indent(() => {
        writer.write("...cloneRequiredAndOptionalArray");
        pairedWrite(writer, "<", ">", true, true, () => {
          writer.writeLine(requiredName + ",");
          writer.writeLine(`StructureKind.${requiredKind},`);
          writer.writeLine(`OptionalKind<${optionalName}>,`);
          writer.writeLine(`StructureKind.${optionalKind},`);
          writer.writeLine(requiredImpl + ",");
          writer.writeLine(optionalImpl);
        });
        pairedWrite(writer, "(", ")", true, true, () => {
          writer.write(`source.${propertyKey}, StructureKind.${requiredKind}, StructureKind.${optionalKind}`)
        });
      });
    });
  }

  return statement;
}

function write_cloneStructureArray(
  structureName: string,
  dictionaries: StructureDictionaries,
  parts: DecoratorParts | StructureParts,
  propertyValue: PropertyValue,
  propertyKey: PropertyName
): WriterFunction
{
  assert(
    propertyValue.otherTypes.length === 1,
    `expected propertyValue.otherTypes.length to be 1 or 2 for structure name ${structureName}, property name ${propertyKey}`
  );

  let cloneImportName: string;
  if (propertyValue.mayBeString && propertyValue.mayBeWriter)
    cloneImportName = "cloneStructureStringOrWriterArray";
  else if (propertyValue.mayBeString)
    cloneImportName = "cloneStructureOrStringArray";
  else {
    assert(
      propertyValue.mayBeWriter === false,
      `expected propertyValue.mayBeWriter to be false for structure name ${structureName}, property name ${propertyKey}`
    );
    cloneImportName = "cloneStructureArray";
  }
  const otherType = propertyValue.otherTypes[0];
  const targetImpl = getStructureImplName(otherType.structureName!);
  let sourceType = otherType.structureName!;
  const sourceKind = dictionaries.structures.get(sourceType)!.structureKindName;

  const tsMorphImportNames: string[] = [sourceType];
  if (otherType.isOptionalKind) {
    sourceType = `OptionalKind<${sourceType}>`;
    tsMorphImportNames.push("OptionalKind");
  }
  parts.importsManager.addImports({
    pathToImportedModule: "ts-morph",
    isPackageImport: true,
    isDefaultImport: false,
    isTypeOnly: true,
    importNames: tsMorphImportNames
  });

  parts.importsManager.addImports({
    pathToImportedModule: "ts-morph",
    isPackageImport: true,
    isDefaultImport: false,
    isTypeOnly: false,
    importNames: [
      "StructureKind",
    ]
  });

  parts.importsManager.addImports({
    pathToImportedModule: dictionaries.publicExports.absolutePathToExportFile,
    isDefaultImport: false,
    isPackageImport: false,
    isTypeOnly: false,
    importNames: [
      targetImpl
    ]
  });

  parts.importsManager.addImports({
    pathToImportedModule: dictionaries.internalExports.absolutePathToExportFile,
    isDefaultImport: false,
    isPackageImport: false,
    isTypeOnly: false,
    importNames: [
      cloneImportName
    ]
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: cloneStructureArrayModule,
    isDefaultExport: false,
    isType: false,
    exportNames: [
      cloneImportName
    ]
  });

  const statement = (writer: CodeBlockWriter): void => {
    if (propertyValue.mayBeUndefined || propertyValue.hasQuestionToken) {
      writer.write(`if (source.${propertyKey}) `);
      writer.block(() => addPush(writer));
    }
    else {
      addPush(writer);
    }
  };

  const addPush = (writer: CodeBlockWriter): void => {
    writer.write(`target.${propertyKey}.push`);
    pairedWrite(writer, "(", ");", true, true, () => {
      writer.write("..." + cloneImportName);
      pairedWrite(writer, "<", ">", false, false, () => {
        writer.write(sourceType + ", ");
        writer.write(`StructureKind.${sourceKind}, `);
        writer.write(targetImpl)
      });
      pairedWrite(writer, "(", ")", false, false, () => {
        writer.write(`source.${propertyKey}, `);
        writer.write(`StructureKind.${sourceKind}`);
      });
    });
  }

  return statement;
}

/* FIXME: this should be using the classFieldStatementsMap, and should be a special case for the `StatementedNodeStructureMixin` */
function write_cloneStatementsArray(
  structureName: string,
  dictionaries: StructureDictionaries,
  parts: DecoratorParts | StructureParts,
  propertyValue: PropertyValue,
  propertyKey: PropertyName
): WriterFunction
{
  void(propertyKey);
  void(propertyValue);

  parts.importsManager.addImports({
    pathToImportedModule: dictionaries.internalExports.absolutePathToExportFile,
    isDefaultImport: false,
    isPackageImport: false,
    isTypeOnly: false,
    importNames: [
      "StructuresClassesMap",
    ]
  });

  parts.importsManager.addImports({
    pathToImportedModule: "ts-morph",
    isDefaultImport: false,
    isPackageImport: true,
    isTypeOnly: true,
    importNames: [
      "StatementStructures",
    ]
  });

  parts.importsManager.addImports({
    pathToImportedModule: dictionaries.publicExports.absolutePathToExportFile,
    isDefaultImport: false,
    isPackageImport: false,
    isTypeOnly: true,
    importNames: [
      "StatementStructureImpls",
    ]
  });

  let sourceParamType: UnionTypedStructureImpl, returnType: UnionTypedStructureImpl;
  {
    const statementsProp = parts.classMembersMap.getAsKind<StructureKind.Property>("statements", StructureKind.Property)!
    const statementsArrayType = statementsProp.typeStructure!;
    assert(statementsArrayType.kind === TypeStructureKind.Array, `expected Array type structure`);
    const parensType = (statementsArrayType as ArrayTypedStructureImpl).objectType;
    assert(parensType.kind === TypeStructureKind.Parentheses, `expected Parentheses type structure`);
    const unionType = (parensType as ParenthesesTypedStructureImpl).childTypes[0];
    assert(unionType.kind === TypeStructureKind.Union, `expected Union type structure`);
    const literalType = (unionType as UnionTypedStructureImpl).childTypes[1];
    assert((literalType.kind === TypeStructureKind.Literal) && (literalType.stringValue === "StatementStructures"),
      `expected "StatementStructures" literal type`);

    sourceParamType = TypeStructureClassesMap.clone(unionType) as UnionTypedStructureImpl;

    (unionType as UnionTypedStructureImpl).childTypes.splice(
      1, 1, new LiteralTypedStructureImpl("StatementStructureImpls")
    );

    returnType = TypeStructureClassesMap.clone(unionType) as UnionTypedStructureImpl;
  }

  const cloneStatementMethod = new MethodDeclarationImpl("#cloneStatement");
  cloneStatementMethod.isStatic = true;
  const sourceParam = new ParameterDeclarationImpl("source");
  sourceParam.typeStructure = sourceParamType;
  cloneStatementMethod.parameters.push(sourceParam);
  cloneStatementMethod.returnTypeStructure = returnType;

  cloneStatementMethod.statements.push(writer => {
    writer.write(`if (typeof source !== "object") `);
    writer.block(() => writer.write("return source;"));
    writer.writeLine(`return StructuresClassesMap.clone<StatementStructures, StatementStructureImpls>(source);`);
  });

  parts.classMembersMap.addMembers([cloneStatementMethod]);

  return (writer: CodeBlockWriter) => {
    // this is one time where it's just faster and clearer to write the code than to spell out the contents in structures
    writer.write(`
let statementsArray: (stringOrWriterFunction | StatementStructureImpls)[] = [];
if (Array.isArray(source.statements)) {
  statementsArray = source.statements as (stringOrWriterFunction | StatementStructureImpls)[];
}
else if (source.statements !== undefined) {
  statementsArray = [source.statements];
}
target.statements.push(
  ...statementsArray.map(statement => StatementedNodeStructureMixin.#cloneStatement(statement))
);
    `);
  };
}
