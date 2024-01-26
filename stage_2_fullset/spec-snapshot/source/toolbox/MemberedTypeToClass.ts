import {
  StructureKind,
  type CodeBlockWriter,
  type WriterFunction
} from "ts-morph";

import {
  ClassFieldStatementsMap, ClassMembersMap,
  type MemberedStatementsKey,
  MemberedStatementsKeyClass,
  MemberedTypeToClass,
  type MemberedTypeToClass_StatementGetter,
  type stringOrWriterFunction,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

class StubStatementsGetter implements MemberedTypeToClass_StatementGetter {
  static #hashKeys(
    fieldName: string,
    groupName: string,
    purpose: string
  ): string
  {
    const keyClass = new MemberedStatementsKeyClass(fieldName, groupName, purpose);
    return JSON.stringify(keyClass);
  }

  readonly #writerToContents = new WeakMap<WriterFunction, string>;
  readonly #statementsMap = new Map<string, stringWriterOrStatementImpl[]>;
  readonly #visitedHashes = new Set<string>;

  createWriter(
    contents = "void(true);"
  ): WriterFunction
  {
    const writer = function(writer: CodeBlockWriter): void {
      writer.writeLine(contents);
    };
    this.#writerToContents.set(writer, contents);
    return writer;
  }

  getWriterValues(
    keys: stringOrWriterFunction[]
  ): string[]
  {
    return keys.map(key => {
      if (typeof key === "string")
        return key;
      return this.#writerToContents.get(key)!;
    });
  }

  setStatements(
    fieldName: string,
    groupName: string,
    purpose: string,
    statements: stringWriterOrStatementImpl[]
  ): void
  {
    const hash = StubStatementsGetter.#hashKeys(fieldName, groupName, purpose);
    this.#statementsMap.set(hash, statements);
  }

  getStatements(
    key: MemberedStatementsKey
  ): Promise<stringWriterOrStatementImpl[]>
  {
    const hash = StubStatementsGetter.#hashKeys(key.fieldKey, key.statementGroupKey, key.purpose);
    this.#visitedHashes.add(hash);
    return Promise.resolve(this.#statementsMap.get(hash) ?? []);
  }

  get visitedSize(): number {
    return this.#visitedHashes.size;
  }

  hasVisited(
    fieldName: string,
    groupName: string,
    purpose: string,
  ): boolean
  {
    return this.#visitedHashes.has(
      StubStatementsGetter.#hashKeys(fieldName, groupName, purpose)
    );
  }

  matchesVisited(
    fieldNames: string[],
    groupNames: string[],
    purposeKeys: string[]
  ): boolean
  {
    for (const fieldName of fieldNames) {
      for (const groupName of groupNames) {
        for (const purpose of purposeKeys) {
          if (!this.hasVisited(fieldName, groupName, purpose))
            return false;
        }
      }
    }

    return true;
  }
}

describe("MemberedTypeToClass", () => {
  let statementsGetter: StubStatementsGetter;
  let typeToClass: MemberedTypeToClass;
  beforeEach(() => {
    statementsGetter = new StubStatementsGetter;
    typeToClass = new MemberedTypeToClass([], statementsGetter);
  });

  it("can create an empty class, with no statement maps", async () => {
    const classMembers: ClassMembersMap = await typeToClass.buildClassMembersMap();
    expect(classMembers.size).toBe(0);

    expect(statementsGetter.visitedSize).toBe(0);
  });

  it("will visit all keys and groups for a constructor with multiple statement groups", async () => {
    // testing order of statement groups
    typeToClass.defineStatementsByPurpose("first", false);
    typeToClass.defineStatementsByPurpose("second", false);
    typeToClass.defineStatementsByPurpose("fourth", false);

    const first_head_ctor = statementsGetter.createWriter(`void("first head");`);
    const first_tail_ctor = statementsGetter.createWriter(`void("first tail");`);
    const second_head_ctor = statementsGetter.createWriter(`void("second head");`);
    const second_tail_ctor = statementsGetter.createWriter(`void("second tail");`);
    const fourth_head_ctor = statementsGetter.createWriter(`void("fourth head");`);
    const fourth_tail_ctor = statementsGetter.createWriter(`void("fourth tail");`);

    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL, "constructor", "first", [
        first_head_ctor
      ]
    );
    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN, "constructor", "first", [
        first_tail_ctor
      ]
    );
    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL, "constructor", "fourth", [
        fourth_head_ctor
      ]
    );
    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN, "constructor", "fourth", [
        fourth_tail_ctor
      ]
    );
    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL, "constructor", "second", [
        second_head_ctor
      ]
    );
    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN, "constructor", "second", [
        second_tail_ctor
      ]
    );

    const classMembers: ClassMembersMap = await typeToClass.buildClassMembersMap();

    expect(statementsGetter.matchesVisited(
      [ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL, ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN],
      [ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "constructor"],
      ["first", "second", "fourth"],
    )).toBe(true);
    expect(statementsGetter.visitedSize).toBe(12);

    expect(classMembers.size).toBe(1);
    const ctor = classMembers.get(
      ClassMembersMap.keyFromName(StructureKind.Constructor, false, "constructor")
    );
    expect(ctor).not.toBeUndefined();
    if (!ctor)
      return;
    expect(ctor.kind).toBe(StructureKind.Constructor);
    if (ctor.kind !== StructureKind.Constructor)
      return;

    expect(ctor.typeParameters.length).toBe(0);
    expect(ctor.parameters.length).toBe(0);

    const expectedStatements = statementsGetter.getWriterValues([
      first_head_ctor,
      first_tail_ctor,

      second_head_ctor,
      second_tail_ctor,

      fourth_head_ctor,
      fourth_tail_ctor,
    ]);
    const actualStatements = statementsGetter.getWriterValues(ctor.statements as stringOrWriterFunction[]);

    expect(actualStatements).toEqual(expectedStatements);
  });
});
