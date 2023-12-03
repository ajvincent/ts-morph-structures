import {
  CodeBlockWriter,
  WriterFunction,
} from "ts-morph";

import {
  ClassDeclarationImpl,
  ArrayTypeStructureImpl,
  WriterTypeStructureImpl,
} from "#stage_two/snapshot/source/exports.js";

describe("Type structure set properties work", () => {
  let writerCount = 0;
  function writerFunction(
    writer: CodeBlockWriter
  ): void {
    writerCount++;
    writer.write("hello");
  }

  const writerTypeStructure = new WriterTypeStructureImpl(writerFunction);
  const arrayTypeStructure = new ArrayTypeStructureImpl("boolean");

  let classDecl: ClassDeclarationImpl;
  beforeEach(() => {
    writerCount = 0;
  });

  it("adding types directly", () => {
    classDecl = new ClassDeclarationImpl;
    classDecl.implementsSet.add("NumberStringType");
    classDecl.implementsSet.add("NumberStringInterface");
    classDecl.implementsSet.add(writerTypeStructure);
    classDecl.implementsSet.add(arrayTypeStructure);

    expect(
      () => classDecl.implements.push("never")
    ).toThrow();

    expect(classDecl.implements).toEqual([
      "NumberStringType",
      "NumberStringInterface",
      writerFunction,
      arrayTypeStructure.writerFunction
    ]);

    expect(Array.from(classDecl.implementsSet.values())).toEqual([
      "NumberStringType",
      "NumberStringInterface",
      writerTypeStructure,
      arrayTypeStructure
    ]);

    expect(writerCount).toBe(0);
  });

  describe("with static clone() taking a", () => {
    it("structure and an implements array", () => {
      classDecl = ClassDeclarationImpl.clone({
        implements: [
          "NumberStringType",
          "NumberStringInterface",
          writerFunction,
          arrayTypeStructure.writerFunction
        ]
      });

      expect(classDecl.implements).toEqual([
        "NumberStringType",
        "NumberStringInterface",
        writerFunction,
        arrayTypeStructure.writerFunction
      ]);

      expect(Array.from(classDecl.implementsSet.values())).toEqual([
        "NumberStringType",
        "NumberStringInterface",
        writerTypeStructure,
        arrayTypeStructure
      ]);

      expect(writerCount).toBe(0);
    });

    it("structure and an implements function", () => {
      classDecl = ClassDeclarationImpl.clone({
        implements: arrayTypeStructure.writerFunction
      });
  
      expect(classDecl.implements).toEqual([
        arrayTypeStructure.writerFunction
      ]);
  
      expect(Array.from(classDecl.implementsSet.values())).toEqual([
        arrayTypeStructure
      ]);
  
      expect(writerCount).toBe(0);
    });

    it("current structure implementation", () => {
      classDecl = new ClassDeclarationImpl;
      classDecl.implementsSet.add("NumberStringType");
      classDecl.implementsSet.add("NumberStringInterface");
      classDecl.implementsSet.add(writerTypeStructure);
      classDecl.implementsSet.add(arrayTypeStructure);

      classDecl = ClassDeclarationImpl.clone(classDecl);

      const classImplements = classDecl.implements.slice();
      const arrayWriter = classImplements.pop();

      expect(classImplements).toEqual([
        "NumberStringType",
        "NumberStringInterface",
        writerFunction,
      ]);
      expect(typeof arrayWriter).toBe("function");
      expect(arrayWriter).not.toBe(arrayTypeStructure.writerFunction);

      expect(writerCount).toBe(0);

      const writer = new CodeBlockWriter();
      (arrayWriter as WriterFunction)(writer);
      expect(writer.toString()).toBe("boolean[]");
    });
  });

  it("with .toJSON()", () => {
    classDecl = new ClassDeclarationImpl;
    classDecl.implementsSet.add("NumberStringType");
    classDecl.implementsSet.add("NumberStringInterface");
    classDecl.implementsSet.add(writerTypeStructure);
    classDecl.implementsSet.add(arrayTypeStructure);

    expect(classDecl.toJSON().implements).toEqual([
      "NumberStringType",
      "NumberStringInterface",
      "hello",
      "boolean[]"
    ]);

    expect(writerCount).toBe(1);
  });
});
