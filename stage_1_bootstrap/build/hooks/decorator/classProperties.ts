import path from "path";
import {
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

  meta.structureFieldArrays.forEach((propertyValue, key) => {
    const prop = new PropertyDeclarationImpl(key);
    prop.initializer = "[]";

    let typeStructure = getTypeStructureForValue(propertyValue, parts, dictionaries);
    if (typeStructure.kind === TypeStructureKind.Union)
      typeStructure = new ParenthesesTypedStructureImpl(typeStructure);

    prop.typeStructure = new ArrayTypedStructureImpl(typeStructure);

    parts.classDecl.properties.push(prop);

    const maySlice = propertyValue.otherTypes.every(
      valueInUnion => !valueInUnion.isOptionalKind
    );
    if (maySlice) {
      const statement: WriterFunction = writer => {
        writer.write(`if (Array.isArray(source.${key})) `);
        writer.block(() => {
          writer.write(`target.${key} = source.${key}.slice();`);
        });
        writer.write(`else if (source.${key} !== undefined)`);
        writer.block(() => {
          writer.write(`target.${key} = [source.${key}];`)
        });
      };
      parts.copyFields.statements.push(statement);
    }
    else {
      console.warn(name + " mixin missing a copyFields line for " + key);
    }
  });

  meta.structureFields.forEach((propertyValue, key) => {
    const prop = new PropertyDeclarationImpl(key);
    prop.hasQuestionToken = propertyValue.hasQuestionToken;

    let typeStructure = getTypeStructureForValue(propertyValue, parts, dictionaries);
    if (typeStructure.kind === TypeStructureKind.Union)
      typeStructure = new ParenthesesTypedStructureImpl(typeStructure);

    if ((typeStructure !== ConstantTypeStructures.string) || prop.hasQuestionToken)
      prop.typeStructure = typeStructure;

    prop.initializer = getInitializerForValue(key, propertyValue, parts, dictionaries);
    if (key === "kind")
      prop.isReadonly = true;

    parts.classDecl.properties.push(prop);
    parts.copyFields.statements.push(
      (writer) => {
        writer.write(`if (source.${key}) `);
        writer.block(() => writer.write(`target.${key} = source.${key};`));
      }
    );
  });

  return Promise.resolve();
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
