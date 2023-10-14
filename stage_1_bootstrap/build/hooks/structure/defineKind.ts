import StructureDictionaries from "#stage_one/build/StructureDictionaries.js";
import { StructureImplMeta } from "#stage_one/build/structureMeta/DataClasses.js";
import ConstantTypeStructures from "#stage_one/build/utilities/ConstantTypeStructures.js";
import {
  LiteralTypedStructureImpl,
  PropertyDeclarationImpl,
  QualifiedNameTypedStructureImpl
} from "#stage_one/prototype-snapshot/exports.js";

export default function defineKindProperty(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta);
  if (!parts)
    return Promise.resolve();

  const { classMembersMap, importsManager } = parts;
  if (classMembersMap.has("kind"))
    return Promise.resolve();

  const kindProperty = new PropertyDeclarationImpl("kind");
  kindProperty.isReadonly = true;
  kindProperty.typeStructure = new QualifiedNameTypedStructureImpl([
    ConstantTypeStructures.StructureKind,
    new LiteralTypedStructureImpl(meta.structureKindName)
  ]);
  kindProperty.initializer = "StructureKind." + meta.structureKindName;

  classMembersMap.addMembers([kindProperty]);

  importsManager.addImports({
    pathToImportedModule: "ts-morph",
    isPackageImport: true,
    isDefaultImport: false,
    isTypeOnly: false,
    importNames: ["StructureKind"]
  });

  return Promise.resolve();
}
