import assert from "node:assert/strict";

import {
  StructureKind
} from "ts-morph";

import {
  getTypeAugmentedStructure,
  type PropertySignatureImpl,
  TypeStructureKind,
  VoidTypeNodeToTypeStructureConsole,
} from "#stage_two/snapshot/source/exports.js";

import {
  getClassInterfaceName,
} from "#utilities/source/StructureNameTransforms.js";

import TS_MORPH_D from "#utilities/source/ts-morph-d-file.js";

import InterfaceModule from "../moduleClasses/InterfaceModule.js";
import { PromiseAllParallel } from "#utilities/source/PromiseTypes.js";

export default async function createInterfaces(
  structureNames: readonly string[]
): Promise<void>
{
  /* Here's what we have to do.
  (1) Create the structure interfaces.
  (2) Determine which decorator interfaces we need.
  (3) Create the decorator interfaces.
  (4) Consolidate decorator interfaces into structures as necessary.
  (5) Convert structure members' types to the desired format.
  */

  const decoratorNamesUnordered: string[] = [];
  for (const name of structureNames) {
    createStructureInterface(name);
    const interfaceModule = InterfaceModule.structuresMap.get(
      getClassInterfaceName(name)
    )!
    decoratorNamesUnordered.push(...interfaceModule.extendsSet);
  }

  const decoratorNames = new Set<string>(decoratorNamesUnordered);
  for (const name of decoratorNames) {
    createDecoratorInterface(name, decoratorNames);
  }

  const interfaceModules = [
    ...InterfaceModule.structuresMap.values(),
    ...InterfaceModule.decoratorsMap.values()
  ];
  await PromiseAllParallel(interfaceModules, module => module.saveFile());
}

function createStructureInterface(
  name: string,
): void
{
  const interfaceModule = new InterfaceModule(
    getClassInterfaceName(name),
  );

  addInterface(name, interfaceModule);
  if (name === "SourceFileStructure")
    interfaceModule.structureKindName = "SourceFile";
  else
    assert(interfaceModule.structureKindName, "structure kind name not found for " + name);

  InterfaceModule.structuresMap.set(
    interfaceModule.defaultExportName, interfaceModule
  );

  tightenTypeMembers(interfaceModule);
}

function createDecoratorInterface(
  name: string,
  decoratorNames: Set<string>,
): void
{
  const interfaceModule = new InterfaceModule(
    getClassInterfaceName(name),
  );

  addInterface(name, interfaceModule);
  interfaceModule.extendsSet.forEach(
    extendName => decoratorNames.add(extendName)
  );

  InterfaceModule.decoratorsMap.set(
    interfaceModule.defaultExportName, interfaceModule
  );

  tightenTypeMembers(interfaceModule);
}

function addInterface(
  name: string,
  interfaceModule: InterfaceModule,
): void
{
  const structureInterface = getTypeAugmentedStructure(
    TS_MORPH_D.getInterfaceOrThrow(name),
    VoidTypeNodeToTypeStructureConsole,
    true,
    StructureKind.Interface
  ).rootStructure;

  for (const extendsValue of structureInterface.extendsSet) {
    const { kind } = extendsValue;
    assert(kind === TypeStructureKind.Literal || kind === TypeStructureKind.TypeArgumented);
    if (kind === TypeStructureKind.Literal) {
      const id = extendsValue.stringValue;
      if (id.endsWith("SpecificStructure") || id.endsWith("BaseStructure")) {
        addInterface(id, interfaceModule);
      } else {
        interfaceModule.extendsSet.add(extendsValue.stringValue);
      }
    }
    else {
      assert.equal(extendsValue.objectType.kind, TypeStructureKind.Literal);
      assert.equal(extendsValue.objectType.stringValue, "KindedStructure");

      const kindedName = extendsValue.childTypes[0];
      assert.equal(kindedName.kind, TypeStructureKind.QualifiedName);
      assert.equal(kindedName.childTypes[0], "StructureKind");
      assert.equal(kindedName.childTypes.length, 2);

      interfaceModule.structureKindName = kindedName.childTypes[1];
    }
  }

  interfaceModule.typeMembers.addMembers(structureInterface.properties);
}

function tightenTypeMembers(
  interfaceModule: InterfaceModule
): void
{
  interfaceModule.typeMembers.arrayOfKind(StructureKind.PropertySignature).forEach(
    property => tightenProperty(interfaceModule, property)
  );
}

function tightenProperty(
  interfaceModule: InterfaceModule,
  property: PropertySignatureImpl,
): void
{
  void(interfaceModule); // allows setting imports
  void(property);
}
