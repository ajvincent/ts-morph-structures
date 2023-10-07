// #region preamble

import {
  Scope,
} from "ts-morph";

import {
  ClassDeclarationImpl,
  LiteralTypedStructureImpl,
  MethodDeclarationImpl,
  ParameterDeclarationImpl,
  //TypeArgumentedTypedStructureImpl,
  IntersectionTypedStructureImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import type {
  DecoratorImplMeta,
  StructureImplMeta,
} from "#stage_one/build/structureMeta/DataClasses.js";


import ConstantTypeStructures from "./ConstantTypeStructures.js";

// #endregion preamble

export default function defineCopyFieldsMethod(
  meta: DecoratorImplMeta | StructureImplMeta,
  classDecl: ClassDeclarationImpl
): MethodDeclarationImpl
{
  const copyFields = new MethodDeclarationImpl("copyFields");
  copyFields.scope = Scope.Public;
  copyFields.isStatic = true;

  const sourceParam = new ParameterDeclarationImpl("source");
  sourceParam.typeStructure = new IntersectionTypedStructureImpl([
    new LiteralTypedStructureImpl(meta.structureName),
    ConstantTypeStructures.Structures
  ]);

  const targetParam = new ParameterDeclarationImpl("target");
  targetParam.typeStructure = new IntersectionTypedStructureImpl([
    /*
    new TypeArgumentedTypedStructureImpl(
      ConstantTypeStructures.Required,
      [
    */
        new LiteralTypedStructureImpl(classDecl.name!),
    /*
      ]
    ),
    */
    ConstantTypeStructures.Structures
  ]);

  copyFields.parameters.push(sourceParam, targetParam);
  copyFields.returnTypeStructure = ConstantTypeStructures.void;

  copyFields.statements.push(
    `super.copyFields(source, target);`
  );

  classDecl.methods.push(copyFields);
  return copyFields;
}
