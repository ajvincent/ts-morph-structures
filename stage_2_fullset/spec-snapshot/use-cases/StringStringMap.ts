import path from "path";

import {
  InterfaceDeclaration,
  ModuleKind,
  ModuleResolutionKind,
  Project,
  type ProjectOptions,
  ScriptTarget,
  StructureKind,
  type SourceFile,
} from "ts-morph";

import {
  ClassDeclarationImpl,
  InterfaceDeclarationImpl,
  LiteralTypeStructureImpl,
  type TypeMemberImpl,
  TypeMembersMap,
  VoidTypeNodeToTypeStructureConsole,
  getTypeAugmentedStructure,
  ParameterDeclarationImpl,
} from "#stage_two/snapshot/source/exports.js";

import tempDirWithCleanup from "#utilities/source/tempDirWithCleanup.js";

import getTypeScriptNodes from "#utilities/source/typescript-builtins.js";

xit("Use cases:  A two-keyed (string, string) map class", async () => {
  const {
    tempDir,
    resolve: tempDirResolver,
    promise: tempDirCleanup
  } = await tempDirWithCleanup();

  try {
    let classModuleFile: SourceFile;
    {
      const pathToClassModule = path.join(tempDir, "StringStringMap.ts");
      const TSC_CONFIG: ProjectOptions = {
        "compilerOptions": {
          "lib": ["es2022"],
          "module": ModuleKind.ESNext,
          "target": ScriptTarget.ESNext,
          "moduleResolution": ModuleResolutionKind.NodeNext,
          "sourceMap": true,
          "declaration": true,
        },
        skipAddingFilesFromTsConfig: true,
        skipFileDependencyResolution: true,
      };

      const project = new Project(TSC_CONFIG);
      classModuleFile = project.createSourceFile(pathToClassModule, `
  interface StringStringKey {
    readonly firstKey: string,
    readonly secondKey: string
  }

  class StringStringMap<V> {
    static #hashKeys(firstKey: string, secondKey: string): string {
      return JSON.stringify({firstKey, secondKey});
    }

    static #parseKeys(hashedKey: string): [string, string]
    {
      const { firstKey, secondKey } = JSON.parse(hashedKey) as StringStringKey;
      return [firstKey, secondKey];
    }

    readonly #hashMap = new Map<string, V>;
  }
      `.trim());
    }

    const StringStringMap = getTypeAugmentedStructure(
      classModuleFile.getClassOrThrow("StringStringMap"),
      VoidTypeNodeToTypeStructureConsole,
      true
    ).rootStructure as ClassDeclarationImpl;
    void(StringStringMap);

    let MapTypeMembers: TypeMembersMap;
    {
      const MapInterfaceNodes = getTypeScriptNodes<InterfaceDeclaration>(
        sourceFile => sourceFile.getInterfaces().filter(ifc => ifc.getName() === "Map")
      ).map(entry => entry[1]);
      const MapInterfaceDecls = MapInterfaceNodes.map(
        node => getTypeAugmentedStructure(
          node, VoidTypeNodeToTypeStructureConsole, true
        ).rootStructure as InterfaceDeclarationImpl
      );

      const tempTypeEntries: [string, TypeMemberImpl][] = MapInterfaceDecls.map(
        decl => Array.from(TypeMembersMap.fromMemberedObject(decl).entries())
      ).flat();

      MapTypeMembers = new TypeMembersMap(tempTypeEntries);
    }
    void(MapTypeMembers);

    // convert method parameters
    MapTypeMembers.arrayOfKind<StructureKind.MethodSignature>(StructureKind.MethodSignature).forEach(method => {
      /* blocked on type structure traversal:
      forEach parameters[0].typeStructure
      [Symbol.iterator] returnTypeStructure
      entries returnTypeStructure
      keys returnTypeStructure
      */

      // convert this to use traversal

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < method.parameters.length; i++) {
        const param: ParameterDeclarationImpl = method.parameters[i];
        if (param.typeStructure === LiteralTypeStructureImpl.get("K")) {
          const firstKey = new ParameterDeclarationImpl("firstKey");
          firstKey.typeStructure = LiteralTypeStructureImpl.get("string");

          const secondKey = new ParameterDeclarationImpl("secondKey");
          secondKey.typeStructure = LiteralTypeStructureImpl.get("string");
          method.parameters.splice(i, 1, firstKey, secondKey);
          break;
        }
      }
      /*
      console.log(JSON.stringify(method, null, 2));
      */
    });
  }
  finally {
    tempDirResolver(undefined);
    await tempDirCleanup;
  }
});
