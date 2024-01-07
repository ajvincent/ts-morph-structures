import {
  Node,
  Structures,
  TypeNode,
} from "ts-morph";

export interface NodeWithStructures extends Node {
  getStructure(): Structures;
}

/** A string message and a type node. */
export interface BuildTypesForStructureFailures {
  message: string,
  typeNode: TypeNode
}

/**
 * @param message - The failure message.
 * @param failingTypeNode - the type node we failed to resolve.
 */
export type TypeNodeToTypeStructureConsole = (
  message: string,
  failingTypeNode: TypeNode,
) => void
