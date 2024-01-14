// #region preamble
import type { CodeBlockWriter, WriterFunction } from "ts-morph";

import { type TypeStructures } from "./TypeStructures.js";

import { TypeParameterDeclarationImpl } from "../exports.js";

import ParameterTypeStructureImpl from "./ParameterTypeStructureImpl.js";
import PrefixOperatorsTypeStructureImpl from "./PrefixOperatorsTypeStructureImpl.js";

import TypeStructureClassesMap from "../base/TypeStructureClassesMap.js";
import TypeStructuresWithTypeParameters from "./TypeStructuresWithTypeParameters.js";

import { TypeStructureKind } from "../base/TypeStructureKind.js";

import type { CloneableTypeStructure } from "../types/CloneableStructure.js";
// #endregion preamble

export enum FunctionWriterStyle {
  Arrow = "Arrow",
  Method = "Method",
  GetAccessor = "GetAccessor",
  SetAccessor = "SetAccessor",
}

export interface FunctionTypeContext {
  name: string | undefined;
  isConstructor: boolean;
  // useful for constraintStructure, defaultStructure
  typeParameters: TypeParameterDeclarationImpl[];
  parameters: ParameterTypeStructureImpl[];
  restParameter: ParameterTypeStructureImpl | undefined;
  returnType: string | TypeStructures | undefined;
  writerStyle: FunctionWriterStyle;
}

/** ("new" | "get" | "set" | "") name<typeParameters>(parameters, ...restParameter) ("=\>" | ":" ) returnType */
export default class FunctionTypeStructureImpl extends TypeStructuresWithTypeParameters<TypeStructureKind.Function> {
  static clone(other: FunctionTypeStructureImpl): FunctionTypeStructureImpl {
    return new FunctionTypeStructureImpl({
      name: other.name,
      isConstructor: other.isConstructor,
      typeParameters: other.typeParameters.map((typeParam) =>
        TypeParameterDeclarationImpl.clone(typeParam),
      ),
      parameters: other.parameters.map((param) =>
        ParameterTypeStructureImpl.clone(param),
      ),
      restParameter: other.restParameter
        ? ParameterTypeStructureImpl.clone(other.restParameter)
        : undefined,
      returnType: other.returnType
        ? TypeStructureClassesMap.clone(other.returnType)
        : undefined,
      writerStyle: other.writerStyle,
    });
  }

  readonly kind: TypeStructureKind.Function = TypeStructureKind.Function;

  name: string;
  isConstructor: boolean;
  typeParameters: TypeParameterDeclarationImpl[];
  parameters: ParameterTypeStructureImpl[];
  restParameter: ParameterTypeStructureImpl | undefined;
  returnType: string | TypeStructures | undefined;
  writerStyle: FunctionWriterStyle = FunctionWriterStyle.Arrow;

  constructor(context: Partial<FunctionTypeContext>) {
    super();
    this.name = context.name ?? "";
    this.isConstructor = context.isConstructor ?? false;
    this.typeParameters = context.typeParameters?.slice() ?? [];
    this.parameters = context.parameters?.slice() ?? [];
    this.restParameter = context.restParameter;
    this.returnType = context.returnType;
    this.writerStyle = context.writerStyle ?? FunctionWriterStyle.Arrow;

    this.registerCallbackForTypeStructure();
  }

  #writerFunction(writer: CodeBlockWriter): void {
    if (this.writerStyle === FunctionWriterStyle.GetAccessor) {
      writer.write("get ");
      if (this.name) writer.write(this.name);
    } else if (this.writerStyle === FunctionWriterStyle.SetAccessor) {
      writer.write("set ");
      if (this.name) writer.write(this.name);
    } else if (this.writerStyle === FunctionWriterStyle.Method) {
      if (this.name) writer.write(this.name);
    } else if (this.isConstructor) writer.write("new ");

    if (this.typeParameters.length) {
      FunctionTypeStructureImpl.pairedWrite(
        writer,
        "<",
        ">",
        false,
        false,
        () => {
          const lastChild = this.typeParameters[this.typeParameters.length - 1];

          for (const typeParam of this.typeParameters) {
            TypeStructuresWithTypeParameters.writeTypeParameter(
              typeParam,
              writer,
              "extends",
            );

            if (typeParam !== lastChild) {
              writer.write(", ");
            }
          }
        },
      );
    }

    FunctionTypeStructureImpl.pairedWrite(
      writer,
      "(",
      ")",
      false,
      false,
      () => {
        let lastType:
          | ParameterTypeStructureImpl
          | PrefixOperatorsTypeStructureImpl
          | undefined;
        if (this.restParameter)
          lastType = new PrefixOperatorsTypeStructureImpl(
            ["..."],
            this.restParameter,
          );
        else if (this.parameters.length > 0)
          lastType = this.parameters[this.parameters.length - 1];

        for (const type of this.parameters) {
          type.writerFunction(writer);
          if (type !== lastType) writer.write(", ");
        }
        if (this.restParameter) {
          writer.write("...");
          lastType!.writerFunction(writer);
        }
      },
    );

    if (this.returnType) {
      switch (this.writerStyle) {
        case FunctionWriterStyle.Arrow:
          writer.write(" => ");
          FunctionTypeStructureImpl.writeStringOrType(writer, this.returnType);
          break;

        case FunctionWriterStyle.GetAccessor:
        case FunctionWriterStyle.Method:
          writer.write(": ");
          FunctionTypeStructureImpl.writeStringOrType(writer, this.returnType);
          break;
      }
    }
  }

  writerFunction: WriterFunction = this.#writerFunction.bind(this);
}

FunctionTypeStructureImpl satisfies CloneableTypeStructure<FunctionTypeStructureImpl>;

TypeStructureClassesMap.set(
  TypeStructureKind.Function,
  FunctionTypeStructureImpl,
);
