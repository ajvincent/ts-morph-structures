import type {
  CodeBlockWriter,
} from "ts-morph";

export interface CallExpressionStatementContext {
  name: string;
  readonly typeParameters: string[];
  readonly parameters: string[];
}

export default
class CallExpressionStatement implements CallExpressionStatementContext
{
  name: string;
  readonly typeParameters: string[] = [];
  readonly parameters: string[] = [];

  constructor(
    context: Pick<CallExpressionStatementContext, "name"> & Partial<CallExpressionStatementContext>
  )
  {
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
      writer.write("<");
      this.typeParameters.forEach((typeParam, index): void => {
        writer.write(typeParam);
        writer.conditionalWrite(index < this.typeParameters.length - 1, ", ");
      });
      writer.write(">");
    }

    writer.write("(");
    this.parameters.forEach((param, index) => {
      writer.write(param);
      writer.conditionalWrite(index < this.parameters.length - 1, ", ");
    });
    writer.write(");");
  }

  readonly writerFunction = this.#writerFunction.bind(this);
}
