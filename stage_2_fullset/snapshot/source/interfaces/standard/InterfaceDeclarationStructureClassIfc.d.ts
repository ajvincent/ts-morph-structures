import type {
  CallSignatureDeclarationImpl,
  ConstructSignatureDeclarationImpl,
  GetAccessorDeclarationImpl,
  IndexSignatureDeclarationImpl,
  MethodSignatureImpl,
  PropertySignatureImpl,
  SetAccessorDeclarationImpl,
} from "../../exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StructureKind } from "ts-morph";

export interface InterfaceDeclarationStructureClassIfc {
  readonly kind: StructureKind.Interface;
  callSignatures: CallSignatureDeclarationImpl[];
  constructSignatures: ConstructSignatureDeclarationImpl[];
  extends: stringOrWriterFunction[];
  getAccessors: GetAccessorDeclarationImpl[];
  indexSignatures: IndexSignatureDeclarationImpl[];
  methods: MethodSignatureImpl[];
  properties: PropertySignatureImpl[];
  setAccessors: SetAccessorDeclarationImpl[];
}
