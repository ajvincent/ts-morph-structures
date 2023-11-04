import {
  CodeBlockWriter,
  WriterFunction
} from "ts-morph";

import {
  StringTypeStructureImpl,
  WriterTypeStructureImpl,
} from "#stage_two/snapshot/source/exports.js";

import {
  TypeAccessors,
  TypeStructuresBase,
} from "#stage_two/snapshot/source/internal-exports.js";

describe("TypeAccessors with", () => {
  let manager: TypeAccessors;
  beforeEach(() => manager = new TypeAccessors);

  const stringTypeStructure = new StringTypeStructureImpl("NumberStringType");
  const writerTypeStructure = new WriterTypeStructureImpl(writer => writer.write("NumberStringType"));

  it("an undefined type and type structure", () => {
    expect(manager.type).toBe(undefined);
    expect(manager.typeStructure).toBe(undefined);

    const clone = TypeAccessors.cloneType(manager.type);
    expect(clone).toBe(manager.type);
  });

  it("a string type", () => {
    manager.type = "NumberStringType";
    expect(manager.type).toBe("NumberStringType");
    expect(manager.typeStructure).toBe("NumberStringType");

    const clone = TypeAccessors.cloneType(manager.type);
    expect(clone).toBe(manager.type);
  });

  it("a WriterFunction type", () => {
    const callback: WriterFunction = (writer: CodeBlockWriter) => void(writer);
    manager.type = callback;

    expect(manager.type).toBe(callback);
    expect(manager.typeStructure).toBeInstanceOf(WriterTypeStructureImpl);
    expect(
      (manager.typeStructure as WriterTypeStructureImpl)?.writerFunction
    ).toBe(callback);

    const clone = TypeAccessors.cloneType(manager.type);
    expect(clone).toBe(manager.type);
  });

  it("a string type structure", () => {
    manager.typeStructure = stringTypeStructure;

    expect(manager.type).toBe(stringTypeStructure.writerFunction);
    expect(manager.typeStructure).toBe(stringTypeStructure);

    const clone = TypeAccessors.cloneType(manager.type);
    expect(typeof clone).toBe("function");

    if (typeof clone === "function") {
      const cloneTypeStructure = TypeStructuresBase.getTypeStructureForCallback(clone);
      expect(cloneTypeStructure).toBeInstanceOf(StringTypeStructureImpl);
      expect(cloneTypeStructure).not.toBe(stringTypeStructure);
      expect((cloneTypeStructure as StringTypeStructureImpl).stringValue).toBe(stringTypeStructure.stringValue);
    }
  });

  it("a writer function type structure", () => {
    manager.typeStructure = writerTypeStructure;

    expect(manager.type).toBe(writerTypeStructure.writerFunction);
    expect(manager.typeStructure).toBe(writerTypeStructure);

    const clone = TypeAccessors.cloneType(manager.type);
    expect(clone).toBe(manager.type);
  });
});
