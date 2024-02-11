
import StructureDictionaries from "./StructureDictionaries.js";
import fillDictionaries from "./structureMeta/fillDictionaries.js";

// #region hooks

import createDecoratorParts from "./hooks/decorator/createParts.js";
import addClassProperties from "./hooks/classProperties.js";
import addInterfaceFields from "./hooks/addInterfaceFields.js";
import add_toJSON from "./hooks/add_toJSON.js";
import addTSDoc from "./hooks/addTSDoc.js";
import addTypeStructures from "./hooks/addTypeStructures.js";
import moveMembersToClass from "./hooks/moveMembersToClass.js";
import sortClassMembers from "./hooks/sortClassMembers.js";
import sortRequiredOmit from "./hooks/sortRequiredOmit.js";
import saveDecoratorFile from "./hooks/decorator/save.js";
import createStructureParts from "./hooks/structure/createParts.js";
import defineKindProperty from "./hooks/structure/defineKind.js";
import addConstructor from "./hooks/structure/addConstructor.js";
import addStaticClone from "./hooks/structure/addStaticClone.js";
import addDeclarationFromSignature from "./hooks/structure/addDeclarationFromSignature.js";
import saveStructureFile from "./hooks/structure/save.js";
import removeUselessCopyFields from "./hooks/structure/removeUselessCopyFields.js";
import structureSpecialCases from "./hooks/structure/specialCases.js";
import buildImplUnions from "./utilities/buildImplUnions.js";

import defineExistingExports from "./publicAndInternalExports.js";

import logIfNameStart from "./hooks/logIfNameStart.js";
import sortInterfaceFields from "./hooks/sortInterfaceFields.js";
void(logIfNameStart);

// #endregion hooks

export default
async function BuildClassesDriver(distDir: string): Promise<void>
{
  const dictionary = new StructureDictionaries;
  await defineExistingExports(dictionary, distDir);

  fillDictionaries(dictionary);

  dictionary.addDecoratorHook("create decorator parts", createDecoratorParts);
  dictionary.addDecoratorHook("add interface fields", addInterfaceFields);
  dictionary.addDecoratorHook("add class properties", addClassProperties);
  dictionary.addDecoratorHook("add .toJSON()", add_toJSON);
  dictionary.addDecoratorHook("add TSDoc", addTSDoc);
  dictionary.addDecoratorHook("add type structures", addTypeStructures);
  dictionary.addDecoratorHook("move members to class", moveMembersToClass);
  dictionary.addDecoratorHook("sort interface members", sortInterfaceFields);
  dictionary.addDecoratorHook("sort class members", sortClassMembers);
  dictionary.addDecoratorHook("sort required omit", sortRequiredOmit);
  dictionary.addDecoratorHook("save decorator file", saveDecoratorFile);

  dictionary.addStructureHook("create structure parts", createStructureParts);
  dictionary.addStructureHook("add interface fields", addInterfaceFields);
  dictionary.addStructureHook("add class properties", addClassProperties);
  dictionary.addStructureHook("define structure kind", defineKindProperty);
  dictionary.addStructureHook("add constructor", addConstructor);
  dictionary.addStructureHook("add static clone method", addStaticClone);
  dictionary.addStructureHook("add static fromSignature method", addDeclarationFromSignature);
  dictionary.addStructureHook("remove useless copy-fields method", removeUselessCopyFields);
  dictionary.addStructureHook("add .toJSON()", add_toJSON);
  dictionary.addStructureHook("add type structures", addTypeStructures);
  dictionary.addStructureHook("add TSDoc", addTSDoc);
  dictionary.addStructureHook("special cases", structureSpecialCases);
  dictionary.addStructureHook("move members to class", moveMembersToClass);
  dictionary.addStructureHook("sort interface members", sortInterfaceFields);
  dictionary.addStructureHook("sort class members", sortClassMembers);
  dictionary.addStructureHook("sort required omit", sortRequiredOmit);
  dictionary.addStructureHook("save structure file", saveStructureFile);

  await dictionary.build();
  await buildImplUnions(dictionary, distDir);

  await Promise.all([
    dictionary.publicExports.commit(),
    dictionary.internalExports.commit()
  ]);
}
