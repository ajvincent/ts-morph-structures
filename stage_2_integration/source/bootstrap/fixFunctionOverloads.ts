import {
  Structure,
  type Structures,
  StructureKind,
  type WriterFunction,
  forEachStructureChild
} from "ts-morph";

/**
 * Remove function overloads preceding a function.
 * @param structure - The structure direct from ts-morph to clean up.
 * @internal
 */
export default function fixFunctionOverloads(
  structure: Structures
): void
{
  if (Structure.isStatemented(structure) && Array.isArray(structure.statements)) {
    structure.statements = structure.statements.filter((statement: string | WriterFunction | Structures) => {
      if (typeof statement !== "object")
        return true;
      if (statement.kind !== StructureKind.FunctionOverload)
        return true;
      return false;
    });
  }

  forEachStructureChild(structure, fixFunctionOverloads);
}
