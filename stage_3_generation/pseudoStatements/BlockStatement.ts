import type {
  CodeBlockWriter
} from "ts-morph";

import {
  type stringOrWriterFunction
} from "#stage_two/snapshot/source/exports.js";

export default class BlockStatement
{
  readonly #beforeBlock?: stringOrWriterFunction;
  readonly #statements: readonly stringOrWriterFunction[];
  readonly #afterBlock?: stringOrWriterFunction;

  constructor(
    statements: readonly stringOrWriterFunction[],
    beforeBlock?: stringOrWriterFunction,
    afterBlock?: stringOrWriterFunction
  )
  {
    this.#beforeBlock = beforeBlock;
    this.#statements = statements;
    this.#afterBlock = afterBlock;
  }

  #writerFunction(
    writer: CodeBlockWriter
  ): void
  {
    if (this.#beforeBlock) {
      this.#writeStatement(writer, this.#beforeBlock, false);
    }
    writer.block(() => {
      for (const statement of this.#statements) {
        this.#writeStatement(writer, statement, true);
      }
    });
    if (this.#afterBlock) {
      this.#writeStatement(writer, this.#afterBlock, false);
    }
  }

  #writeStatement(
    writer: CodeBlockWriter,
    statement: stringOrWriterFunction,
    newLine: boolean
  ): void
  {
    if (typeof statement === "function") {
      statement(writer);
    }
    else if (newLine) {
      writer.writeLine(statement);
    }
    else {
      writer.write(statement);
    }
  }

  readonly writerFunction = this.#writerFunction.bind(this);
}
