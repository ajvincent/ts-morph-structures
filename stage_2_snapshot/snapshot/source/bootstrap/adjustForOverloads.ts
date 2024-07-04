import assert from "node:assert/strict";
import {
  /*
  type ClassDeclaration,
  type ClassExpression,
  */
  type FunctionDeclarationStructure,
  type FunctionDeclarationOverloadStructure,
  Node,
  /*
  type ObjectLiteralExpression,
  */
  OverloadableNode,
  Structure,
  type Structures,
  StructureKind,
  type WriterFunction,
  forEachStructureChild,
} from "ts-morph";

/**
 * Remove function overloads preceding a function.
 * @param structure - The structure direct from ts-morph to clean up.
 * @internal
 */
export function fixFunctionOverloads(structure: Structures): void {
  if (
    Structure.isStatemented(structure) &&
    Array.isArray(structure.statements)
  ) {
    structure.statements = structure.statements.filter(
      (statement: string | WriterFunction | Structures) => {
        if (typeof statement !== "object") return true;
        if (statement.kind !== StructureKind.FunctionOverload) return true;
        return false;
      },
    );

    // declared functions don't appear as overloads always
    let lastNamedFunction: FunctionDeclarationStructure | undefined;
    for (let i = structure.statements.length - 1; i >= 0; i--) {
      const statement: string | Structures | WriterFunction =
        structure.statements[i];
      if (typeof statement !== "object") {
        lastNamedFunction = undefined;
        continue;
      }
      if (statement.kind !== StructureKind.Function) {
        lastNamedFunction = undefined;
        continue;
      }
      if (statement.name === undefined) {
        lastNamedFunction = undefined;
        continue;
      }
      if (
        lastNamedFunction === undefined ||
        lastNamedFunction.name !== statement.name
      ) {
        lastNamedFunction = statement;
        continue;
      }

      assert(
        lastNamedFunction.overloads === undefined ||
          lastNamedFunction.overloads.length === 0,
        "why does a function with the same name in this statement block have overloads?",
      );
      assert(
        lastNamedFunction.statements === undefined ||
          lastNamedFunction.statements.length === 0,
        "why does a function with the same name in this statement block have statements?",
      );

      // the statement is actually a function overload
      const overload =
        statement as unknown as FunctionDeclarationOverloadStructure;
      overload.kind = StructureKind.FunctionOverload;
      lastNamedFunction.overloads ||= [];
      lastNamedFunction.overloads.push(overload);
      delete statement.name;

      structure.statements.splice(i, 1);
    }
  }

  forEachStructureChild(structure, fixFunctionOverloads);
}

export function getOverloadIndex(node: OverloadableNode & Node): number {
  const nodes: OverloadableNode[] = node.getOverloads();
  return nodes.indexOf(node);
}

/*
export function isOverload(
  node: OverloadableNode & Node
): boolean
{
  if (Node.isAmbientable(node) && node.hasDeclareKeyword())
    return false;

  if (Node.isMethodDeclaration(node) || Node.isConstructorDeclaration(node)) {
    const parent: ClassDeclaration | ClassExpression | ObjectLiteralExpression = node.getParentOrThrow();
    if (Node.isAmbientable(parent) && parent.hasDeclareKeyword())
      return false;
  }

  const nodes: OverloadableNode[] = node.getOverloads();
  const implNode = node.getImplementation();
  if (implNode)
    nodes.push(implNode);
  return nodes[nodes.length - 1] !== node;
}
*/
