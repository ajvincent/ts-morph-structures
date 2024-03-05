import {
  ClassMembersMap,
  IntersectionTypeStructureImpl,
  LiteralTypeStructureImpl,
  MethodSignatureImpl,
  ParameterDeclarationImpl,
  TypeArgumentedTypeStructureImpl,
  UnionTypeStructureImpl,
} from "#stage_two/snapshot/source/exports.js";

import BaseModule from "./BaseModule.js";
import InternalJSDocTag from "../build/classTools/InternalJSDocTag.js";


export default
abstract class BaseClassModule extends BaseModule
{
  public classMembersMap?: ClassMembersMap;

  readonly abstract baseName: string;
  readonly abstract exportName: string;

  createCopyFieldsMethod(): MethodSignatureImpl
  {
    const methodSignature = new MethodSignatureImpl("[COPY_FIELDS]");

    const sourceParam = new ParameterDeclarationImpl("source");
    sourceParam.typeStructure = new IntersectionTypeStructureImpl([
      LiteralTypeStructureImpl.get(this.baseName),
      LiteralTypeStructureImpl.get("Structures")
    ]);

    const targetParam = new ParameterDeclarationImpl("target");
    targetParam.typeStructure = new IntersectionTypeStructureImpl([
      LiteralTypeStructureImpl.get(this.exportName),
      LiteralTypeStructureImpl.get("Structures")
    ]);

    methodSignature.docs.push(InternalJSDocTag);
    methodSignature.parameters.push(sourceParam, targetParam);
    methodSignature.returnTypeStructure = LiteralTypeStructureImpl.get("void");

    this.addImports("internal", ["COPY_FIELDS"], []);
    this.addImports("ts-morph", [], [
      this.baseName,
      "Structures"
    ]);

    return methodSignature;
  }

  createToJSONMethod(): MethodSignatureImpl
  {
    this.addImports("internal", [], ["StructureClassToJSON"]);

    const methodSignature = new MethodSignatureImpl("toJSON");
    methodSignature.returnTypeStructure = new TypeArgumentedTypeStructureImpl(
      LiteralTypeStructureImpl.get("StructureClassToJSON"),
      [
        LiteralTypeStructureImpl.get(this.exportName)
      ]
    );
    return methodSignature;
  }

  createStructureIteratorMethod(): MethodSignatureImpl
  {
    this.addImports("public", [], ["StructureImpls", "TypeStructures"]);
    this.addImports("internal", ["STRUCTURE_AND_TYPES_CHILDREN"], []);

    const methodSignature = new MethodSignatureImpl("[STRUCTURE_AND_TYPES_CHILDREN]");
    methodSignature.docs.push(InternalJSDocTag);

    methodSignature.returnTypeStructure = new TypeArgumentedTypeStructureImpl(
      LiteralTypeStructureImpl.get("IterableIterator"),
      [
        new UnionTypeStructureImpl([
          LiteralTypeStructureImpl.get("StructureImpls"),
          LiteralTypeStructureImpl.get("TypeStructures")
        ])
      ]
    );
    return methodSignature;
  }
}
