import type {
  CodeBlockWriter,
} from "ts-morph";

import type {
  stringOrWriterFunction
} from "#stage_two/snapshot/source/exports.js";
import StatementBase from "./StatementBase.js";

export interface CallExpressionStatementContext {
  name: string;
  readonly typeParameters: string[];
  readonly parameters: stringOrWriterFunction[];
}

export default
class CallExpressionStatementImpl extends StatementBase
implements CallExpressionStatementContext
{
  name: string;
  readonly typeParameters: string[] = [];
  readonly parameters: stringOrWriterFunction[] = [];

  constructor(
    context: Pick<CallExpressionStatementContext, "name"> & Partial<CallExpressionStatementContext>
  )
  {
    super();
    this.name = context.name;
    this.typeParameters = context.typeParameters ?? [];
    this.parameters = context.parameters ?? [];
  }

  #writerFunction(
    writer: CodeBlockWriter
  ): void
  {
    writer.write(this.name);
    if (this.typeParameters.length) {
      this.pairedWrite(writer, "<", ">", () => {
        this.writeArray(writer, this.typeParameters);
      })
    }

    this.pairedWrite(writer, "(", ")", () => {
      this.writeArray(writer, this.parameters);
    });
  }

  readonly writerFunction = this.#writerFunction.bind(this);
}
