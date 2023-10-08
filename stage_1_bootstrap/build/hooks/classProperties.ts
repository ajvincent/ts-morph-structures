import path from "path";
import {
  CodeBlockWriter,
  WriterFunction
} from "ts-morph";

import { distDir } from "#stage_one/build/constants.js";

import ConstantTypeStructures from "#stage_one/build/utilities/ConstantTypeStructures.js";
import {
  ArrayTypedStructureImpl,
  LiteralTypedStructureImpl,
  ParenthesesTypedStructureImpl,
  PropertyDeclarationImpl,
  TypeStructureKind,
  TypeStructures,
  UnionTypedStructureImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import StructureDictionaries, {
  DecoratorParts,
  StructureParts,
} from "#stage_one/build/StructureDictionaries.js";

import {
  DecoratorImplMeta,
  PropertyName,
  PropertyValue,
  StructureImplMeta,
} from "#stage_one/build/structureMeta/DataClasses.js";

import assert from "#stage_one/build/utilities/assert.js";
import pairedWrite from "../utilities/pairedWrite.js";

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

  meta.structureFieldArrays.forEach((
    propertyValue: PropertyValue,
    propertyKey: PropertyName
  ): void => addStructureFieldArray(name, dictionaries, parts, propertyValue, propertyKey));

  meta.structureFields.forEach((propertyValue, key) => {
    const prop = new PropertyDeclarationImpl(key);
    prop.hasQuestionToken = propertyValue.hasQuestionToken;

    let typeStructure = getTypeStructureForValue(propertyValue, parts, dictionaries);
    if (typeStructure.kind === TypeStructureKind.Union)
      typeStructure = new ParenthesesTypedStructureImpl(typeStructure);

    if ((typeStructure !== ConstantTypeStructures.string) || prop.hasQuestionToken)
      prop.typeStructure = typeStructure;

    prop.initializer = getInitializerForValue(key, propertyValue, parts, dictionaries);
    parts.classDecl.properties.push(prop);

    if (key === "kind") {
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
        parts.copyFields.statements.push(
          (writer) => {
            writer.write(`if (source.${key}) `);
            writer.block(() => writer.write(`target.${key} = source.${key};`));
          }
        );
      }
    }
  });

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
  const prop = new PropertyDeclarationImpl(propertyKey);
  prop.initializer = "[]";
  prop.isReadonly = true;

  let typeStructure = getTypeStructureForValue(propertyValue, parts, dictionaries);
  if (typeStructure.kind === TypeStructureKind.Union)
    typeStructure = new ParenthesesTypedStructureImpl(typeStructure);

  prop.typeStructure = new ArrayTypedStructureImpl(typeStructure);

  parts.classDecl.properties.push(prop);

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

  parts.copyFields.statements.push(statement!);
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

const stringOrWriterModule = path.join(distDir, "source/types/stringOrWriter.d.ts");
const cloneStructureArrayModule = path.join(distDir, "source/base/cloneStructureArray.ts");

function getTypeStructureArrayForValue(
  value: PropertyValue,
  parts: DecoratorParts | StructureParts,
  dictionaries: StructureDictionaries
): TypeStructures[]
{
  const structures: TypeStructures[] = [];

  if (value.mayBeString && value.mayBeWriter) {
    structures.push(ConstantTypeStructures.stringOrWriter);

    parts.importsManager.addImports({
      pathToImportedModule: stringOrWriterModule,
      isPackageImport: false,
      importNames: ["stringOrWriter"],
      isDefaultImport: false,
      isTypeOnly: true,
    });

    dictionaries.publicExports.addExports({
      absolutePathToModule: path.join(distDir, "source/types/stringOrWriter.ts"),
      exportNames: ["stringOrWriter"],
      isDefaultExport: false,
      isType: true,
    });
  }
  else if (value.mayBeString) {
    structures.push(ConstantTypeStructures.string);
  }
  else if (value.mayBeWriter) {
    structures.push(ConstantTypeStructures.WriterFunction);
    parts.importsManager.addImports({
      pathToImportedModule: "ts-morph",
      isPackageImport: true,
      importNames: ["WriterFunction"],
      isDefaultImport: false,
      isTypeOnly: true
    });
  }

  if (value.mayBeUndefined) {
    structures.push(ConstantTypeStructures.undefined);
  }

  value.otherTypes.forEach(valueInUnion => {
    if (valueInUnion.structureName && dictionaries.structures.has(valueInUnion.structureName)) {
      const implName = valueInUnion.structureName.replace(/Structure$/, "Impl");
      structures.push(new LiteralTypedStructureImpl(implName));

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

    structures.push(new LiteralTypedStructureImpl(
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

  return structures;
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

  /*
  const { classDecl } = parts;
  let ctor: ConstructorDeclarationImpl;
  if (!classDecl.ctors.length) {
    ctor = new ConstructorDeclarationImpl;
    ctor.statements.push("super();");

    classDecl.ctors.push(ctor);
  } else {
    ctor = classDecl.ctors[0];
  }

  const param = new ParameterDeclarationImpl(key);
  param.typeStructure = getTypeStructureForValue(value, parts, dictionaries);

  ctor.parameters.push(param);
  ctor.statements.push(`this.${key} = ${key};`);
  */
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

  console.warn(JSON.stringify({
    mixinName: structureName,
    propertyName: propertyKey,
    isArray: false,
    ...propertyValue,
  }, null, 2) + ",");

  const requiredName = propertyValue.otherTypes[1].structureName!
  const requiredKind = dictionaries.structures.get(requiredName)!.structureKindName;
  const requiredImpl = requiredName.replace(/Structure$/, "Impl");

  const optionalName = propertyValue.otherTypes[0].structureName!;
  const optionalKind = dictionaries.structures.get(optionalName)!.structureKindName;
  const optionalImpl = optionalName.replace(/Structure$/, "Impl");

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
  const targetImpl = otherType.structureName!.replace(/Structure$/, "Impl");
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
