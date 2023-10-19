import type {
  CodeBlockWriter, WriterFunction,
} from "ts-morph";

import {
  TypeStructureKind,
} from "../base/TypeStructureKind.js";

import TypeStructuresBase from "../base/TypeStructuresBase.js";

import type {
  TypeStructures
} from "./TypeStructures.js";

class TypePrinterSettings
{
  indentChildren = false;
  newLinesAroundChildren = false;
  oneLinePerChild = false;
}

export default
abstract class TypeStructuresWithChildren<
  Kind extends TypeStructureKind,
  Children extends readonly (string | TypeStructures)[]
>
extends TypeStructuresBase<Kind>
{
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
  static #pairedWrite(
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

  static #writeStringOrType(
    writer: CodeBlockWriter,
    value: string | TypeStructures
  ): void
  {
    if (typeof value === "string")
      writer.write(value);
    else
      value.writerFunction(writer);
  }

  abstract readonly kind: Kind;

  /** This lives outside the start and end tokens.  Think of this as a parent type for the children, ie. `Partial`. */
  protected abstract objectType: string | TypeStructures | null;
  /** The child types we join together, and wrap in the start and end tokens. */
  public abstract readonly childTypes: Children;
  /** A very short string, one or two characters, before all child types. */
  protected abstract readonly startToken: string;
  /** A very short string, between all child types. */
  protected abstract readonly joinChildrenToken: string;
  /** A very short string, one or two characters, after all child types. */
  protected abstract readonly endToken: string;
  /** The maximum number of children to support. */
  protected abstract readonly maxChildCount: number;

  /** For customizing printing of the child types. */
  readonly printerSettings = new TypePrinterSettings;

  #writerFunctionOuter(
    writer: CodeBlockWriter
  ): void
  {
    if (this.objectType) {
      TypeStructuresWithChildren.#writeStringOrType(writer, this.objectType);
    }

    TypeStructuresWithChildren.#pairedWrite(
      writer,
      this.startToken,
      this.endToken,
      this.printerSettings.newLinesAroundChildren,
      this.printerSettings.indentChildren,
      () => this.#writerFunctionInner(writer)
    );
  }

  #writerFunctionInner(
    writer: CodeBlockWriter,
  ): void
  {
    let { childTypes } = this;
    if (childTypes.length === 0)
      return;
    if ( childTypes.length > this.maxChildCount)
      childTypes = childTypes.slice(0, this.maxChildCount) as unknown as Children;

    const lastChild = childTypes[childTypes.length - 1];
    for (const child of childTypes) {
      TypeStructuresWithChildren.#writeStringOrType(writer, child);
      if (child === lastChild)
        return;

      if (this.printerSettings.oneLinePerChild) {
        writer.write(this.joinChildrenToken.trimEnd());
        writer.newLine();
      }
      else {
        writer.write(this.joinChildrenToken);
      }
    }
  }

  readonly writerFunction: WriterFunction = this.#writerFunctionOuter.bind(this);
}
