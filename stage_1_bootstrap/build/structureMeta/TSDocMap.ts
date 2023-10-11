import type {
  JSDocStructure,
} from "ts-morph";

import { JSDocImpl } from "#stage_one/prototype-snapshot/exports.js";

interface JSDocData {
  isStructureDef: boolean;
  className: string;
  isStatic: boolean;
  fieldName: string;
}

type JSDocRequired = Required<Pick<JSDocStructure, "description" | "tags">>;

class JSDocMap {
  static #hasher(data: JSDocData): string {
    return JSON.stringify(data);
  }

  readonly #map = new Map<string, JSDocImpl | null>;
  readonly #decoratorClassNames = new Set<string>;
  readonly #structureClassNames = new Set<string>;

  addStructureFields(
    className: string,
    staticFields: Record<string, JSDocRequired>,
    instanceFields: Record<string, JSDocRequired>
  ): void
  {
    this.#structureClassNames.add(className);
    for (const [fieldName, doc] of Object.entries(staticFields)) {
      const hash = JSDocMap.#hasher({isStructureDef: true, className, isStatic: true, fieldName});
      const impl = JSDocImpl.clone(doc);
      this.#map.set(hash, impl);
    }
    for (const [fieldName, doc] of Object.entries(instanceFields)) {
      const hash = JSDocMap.#hasher({isStructureDef: true, className, isStatic: false, fieldName});
      const impl = JSDocImpl.clone(doc);
      this.#map.set(hash, impl);
    }
  }

  addDecoratorFields(
    className: string,
    staticFields: Record<string, JSDocRequired>,
    instanceFields: Record<string, JSDocRequired>
  ): void
  {
    this.#decoratorClassNames.add(className);
    for (const [fieldName, doc] of Object.entries(staticFields)) {
      const hash = JSDocMap.#hasher({isStructureDef: false, className, isStatic: true, fieldName});
      const impl = JSDocImpl.clone(doc);
      this.#map.set(hash, impl);
    }
    for (const [fieldName, doc] of Object.entries(instanceFields)) {
      const hash = JSDocMap.#hasher({isStructureDef: false, className, isStatic: false, fieldName});
      const impl = JSDocImpl.clone(doc);
      this.#map.set(hash, impl);
    }
  }

  requireFields(
    isStructureDef: boolean,
    className: string,
    staticFields: readonly string[],
    instanceFields: readonly string[]
  ): void {
    staticFields.forEach(fieldName => {
      const hash = JSDocMap.#hasher({isStructureDef, className, isStatic: true, fieldName});
      const starHash = JSDocMap.#hasher({isStructureDef, className: "*", isStatic: true, fieldName});
      if (!this.#map.has(hash) && !this.#map.has(starHash))
        this.#map.set(hash, null);
    });

    instanceFields.forEach(fieldName => {
      const hash = JSDocMap.#hasher({isStructureDef, className, isStatic: false, fieldName});
      const starHash = JSDocMap.#hasher({isStructureDef, className: "*", isStatic: false, fieldName});
      if (!this.#map.has(hash) && !this.#map.has(starHash))
        this.#map.set(hash, null);
    });
  }

  hasStructureClass(
    className: string,
  ): boolean
  {
    return this.#structureClassNames.has(className);
  }

  hasDecoratorClass(
    className: string
  ): boolean
  {
    return this.#decoratorClassNames.has(className);
  }

  getFieldDoc(
    isStructureDef: boolean,
    className: string,
    isStatic: boolean,
    fieldName: string,
  ): JSDocImpl | undefined | null
  {
    let hasClass = false;
    if (isStructureDef)
      hasClass = this.#structureClassNames.has(className);
    else
      hasClass = this.#decoratorClassNames.has(className);
    if (!hasClass)
      return undefined;

    const hash = JSDocMap.#hasher({isStructureDef, className, isStatic, fieldName});
    const starHash = JSDocMap.#hasher({isStructureDef, className: "*", isStatic, fieldName});
    return this.#map.get(hash) ?? this.#map.get(starHash);
  }

  toJSON(): never {
    throw new Error("not yet implemented");
  }

  static fromJSON(): never {
    throw new Error("not yet implemented");
  }
}

const TSDocMap = new JSDocMap;
export default TSDocMap;

TSDocMap.addDecoratorFields(
  "QuestionTokenableNodeStructureMixin", {}, {
    "hasQuestionToken": {
      description: "When true, inserts a question mark (?) after the field name.",
      tags: []
    },
  },
);
