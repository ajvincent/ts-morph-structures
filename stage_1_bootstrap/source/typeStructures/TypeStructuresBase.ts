import type {
  CodeBlockWriter,
  WriterFunction
} from "ts-morph";

import {
  KindedTypeStructure,
  TypeStructureKind,
} from "../base/TypeStructureKind.js";

import type {
  TypeStructures
} from "./TypeStructures.js";

export default
abstract class TypeStructuresBase<Kind extends TypeStructureKind>
implements KindedTypeStructure<Kind>
{
  static readonly #callbackToTypeStructureImpl = new WeakMap<
    WriterFunction,
    TypeStructuresBase<TypeStructureKind>
  >;

  static getTypeStructureForCallback(
    callback: WriterFunction
  ): TypeStructuresBase<TypeStructureKind> | undefined
  {
    return this.#callbackToTypeStructureImpl.get(callback);
  }

  /**
   * Write a start token, invoke a block, and write the end token, in that order.
   * @param writer - the code block writer.
   * @param startToken - the start token.
   * @param endToken - the end token.
   * @param newLine - true if we should call `.newLine()` after the start and before the end.
   * @param indent - true if we should indent the block statements.
   * @param block - the callback to execute for the block statements.
   *
   * @see {@link https://github.com/dsherret/code-block-writer/issues/44}
   */
  protected static pairedWrite(
    writer: CodeBlockWriter,
    startToken: string,
    endToken: string,
    newLine: boolean,
    indent: boolean,
    block: () => void
  ) : void
  {
    writer.write(startToken);
    if (newLine)
      writer.newLine();
    if (indent)
      writer.indent(block);
    else
      block();
    if (newLine)
      writer.newLine();
    writer.write(endToken);
  }

  protected static writeStringOrType(
    writer: CodeBlockWriter,
    value: string | TypeStructures
  ): void
  {
    if (typeof value === "string")
      writer.write(value);
    else
      value.writerFunction(writer);
  }

  static deregisterCallbackForTypeStructure(
    structure: TypeStructuresBase<TypeStructureKind>
  ): void {
    this.#callbackToTypeStructureImpl.delete(structure.writerFunction);
  }

  protected registerCallbackForTypeStructure(): void {
    if (TypeStructuresBase.#callbackToTypeStructureImpl.has(this.writerFunction))
      return;
    TypeStructuresBase.#callbackToTypeStructureImpl.set(this.writerFunction, this);
  }

  abstract readonly kind: Kind;
  abstract readonly writerFunction: WriterFunction;
}
