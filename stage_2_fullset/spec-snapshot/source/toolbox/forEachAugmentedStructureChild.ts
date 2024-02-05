import {
  ArrayTypeStructureImpl,
  ClassDeclarationImpl,
  ConditionalTypeStructureImpl,
  FunctionTypeStructureImpl,
  InferTypeStructureImpl,
  MappedTypeStructureImpl,
  MemberedObjectTypeStructureImpl,
  MethodDeclarationImpl,
  ParameterTypeStructureImpl,
  PrefixOperatorsTypeStructureImpl,
  type StructureImpls,
  TemplateLiteralTypeStructureImpl,
  TypeParameterDeclarationImpl,
  type TypeStructures,
  StringTypeStructureImpl,
  TypeArgumentedTypeStructureImpl,
  UnionTypeStructureImpl,
  forEachAugmentedStructureChild,
} from "#stage_two/snapshot/source/exports.js";
import { Structures, forEachStructureChild } from "ts-morph";

type ChildStructure = StructureImpls | TypeStructures;
type ForEachStructureCallback<TStructure> = (child: ChildStructure) => TStructure | void;

describe("forEachAugmentedStructureImpl", () => {
  const visited = new Set<ChildStructure>;
  const expected = Symbol("expected");

  beforeEach(() => {
    visited.clear();
  });

  it("iterates over an array of structures until it hits a match", () => {
    const firstClass = new ClassDeclarationImpl, secondClass = new ClassDeclarationImpl, thirdClass = new ClassDeclarationImpl;
    const firstType = new UnionTypeStructureImpl, secondType = new UnionTypeStructureImpl, thirdType = new UnionTypeStructureImpl;
    // ensuring we don't visit grandchildren
    firstType.childTypes.push(thirdType);

    function callback(
      child: ChildStructure
    ): ChildStructure | undefined
    {
      visited.add(child);
      return child === secondClass ? child : undefined;
    }
    callback satisfies ForEachStructureCallback<ChildStructure>;

    const result = forEachAugmentedStructureChild<ChildStructure>([
      firstClass, firstType, secondClass, secondType, thirdClass,
    ], callback);

    expect(result).toBe(secondClass);
    expect(Array.from(visited.values())).toEqual([
      firstClass, firstType, secondClass
    ]);
  });

  it("iterates over the child structures of a structure before visiting its type structures", () => {
    const classDecl = new ClassDeclarationImpl;
    const methodOne = new MethodDeclarationImpl(false, "one");
    const methodTwo = new MethodDeclarationImpl(true, "two");
    const childUnion = new UnionTypeStructureImpl(["NumberStringType", "NumberStringInterface"]);

    // ensuring we don't visit grandchildren
    const unionDecl = new UnionTypeStructureImpl([childUnion, "NumberStringType", "NumberStringInterface"]);
    methodOne.returnTypeStructure = childUnion;

    classDecl.implementsSet.add(unionDecl);
    classDecl.methods.push(methodOne, methodTwo);

    function callback(
      child: ChildStructure
    ): void
    {
      visited.add(child);
    }
    callback satisfies ForEachStructureCallback<ChildStructure>;

    const result = forEachAugmentedStructureChild(classDecl, callback);
    expect(result).toBeUndefined();
    expect(Array.from(visited.values())).toEqual([methodOne, methodTwo, unionDecl]);
  });

  it("returns the same result as forEachStructureChild() when matching a structure", () => {
    const classDecl = new ClassDeclarationImpl;
    const methodOne = new MethodDeclarationImpl(false, "one");
    const methodTwo = new MethodDeclarationImpl(true, "two");
    const methodThree = new MethodDeclarationImpl(false, "three");
    const unionDecl = new UnionTypeStructureImpl(["NumberStringType", "NumberStringInterface"]);
    classDecl.implementsSet.add(unionDecl);
    classDecl.methods.push(methodOne, methodTwo, methodThree);

    function callback(
      child: Structures
    ): typeof expected | undefined
    {
      visited.add(child as StructureImpls);
      return child === methodTwo ? expected : undefined;
    }

    const result = forEachStructureChild<typeof expected>(classDecl, callback);
    expect(result).toBe(expected);
    expect(Array.from(visited.values())).toEqual([methodOne, methodTwo]);

    visited.clear();

    function augmentedCallback(
      child: ChildStructure
    ): typeof expected | undefined
    {
      visited.add(child);
      return child === methodTwo ? expected : undefined;
    }
    augmentedCallback satisfies ForEachStructureCallback<typeof expected>;

    const augmentedResult = forEachAugmentedStructureChild<typeof expected>(classDecl, augmentedCallback);
    expect(augmentedResult).toBe(expected);
    expect(Array.from(visited.values())).toEqual([methodOne, methodTwo]);
  });

  it("returns a matching type structure from among the children if no structure match is found", () => {
    const classDecl = new ClassDeclarationImpl;
    const methodOne = new MethodDeclarationImpl(false, "one");
    const methodTwo = new MethodDeclarationImpl(true, "two");
    const methodThree = new MethodDeclarationImpl(false, "three");

    const childUnion = new UnionTypeStructureImpl(["NumberStringType", "NumberStringInterface"]);
    const firstType = new UnionTypeStructureImpl([childUnion]),
          secondType = new UnionTypeStructureImpl,
          thirdType = new UnionTypeStructureImpl;

    methodOne.returnTypeStructure = childUnion;

    classDecl.methods.push(methodOne, methodTwo, methodThree);
    classDecl.implementsSet.add(firstType);
    classDecl.implementsSet.add(secondType);
    classDecl.implementsSet.add(thirdType);

    function augmentedCallback(
      child: ChildStructure
    ): typeof expected | undefined
    {
      visited.add(child);
      return child === secondType ? expected : undefined;
    }
    augmentedCallback satisfies ForEachStructureCallback<typeof expected>;

    const augmentedResult = forEachAugmentedStructureChild<typeof expected>(classDecl, augmentedCallback);
    expect(augmentedResult).toBe(expected);
    expect(Array.from(visited.values())).toEqual(
      [methodOne, methodTwo, methodThree, firstType, secondType]
    );
  });

  describe("visits children of type structures:", () => {
    const childUnion = new UnionTypeStructureImpl,
    firstType = new UnionTypeStructureImpl([childUnion]),
    secondType = new UnionTypeStructureImpl,
    thirdType = new UnionTypeStructureImpl;

    function skipCallback(
      child: ChildStructure
    ): void
    {
      visited.add(child);
    }

    function forEachChildSkipAll(
      parentType: TypeStructures,
      expectVisited: ChildStructure[]
    ): void
    {
      const result = forEachAugmentedStructureChild<typeof expected>(parentType, skipCallback);
      expect(result).withContext("skip all").toBeUndefined();
      expect(Array.from(visited.values())).withContext("skip all").toEqual(expectVisited);
      visited.clear();
    }

    function acceptCallback(
      child: ChildStructure
    ): typeof expected | undefined
    {
      visited.add(child);
      return child === secondType ? expected : undefined;
    }

    function forEachChildAcceptSecond(parentType: TypeStructures): void {
      const result = forEachAugmentedStructureChild<typeof expected>(parentType, acceptCallback);
      expect(result).withContext("accept second").toBe(expected);
      expect(Array.from(visited.values())).withContext("accept second").toEqual([
        firstType, secondType
      ]);
      visited.clear();
    }

    it("with no children: StringTypeStructureImpl", () => {
      const type = new StringTypeStructureImpl("hello");
      const result = forEachAugmentedStructureChild<typeof expected>(type, skipCallback);
      expect(result).toBeUndefined();
      expect(visited.size).toBe(0);
    });

    it("with an object type and child types: TypeStructuresWithChildren", () => {
      const type = new TypeArgumentedTypeStructureImpl(firstType, [secondType, thirdType]);
      forEachChildSkipAll(type, [firstType, secondType, thirdType]);
      forEachChildAcceptSecond(type);
    });

    describe("with just an object type", () => {
      it("ArrayTypeStructureImpl", () => {
        const type = new ArrayTypeStructureImpl(secondType);
        forEachChildSkipAll(type, [secondType]);
      });

      it("InferTypeStructureImpl", () => {
        const typeParam = new TypeParameterDeclarationImpl("T");
        const inferType = new InferTypeStructureImpl(new TypeParameterDeclarationImpl("T"));

        const result = forEachAugmentedStructureChild<typeof expected>(inferType, skipCallback);
        expect(result).withContext("skip all").toBeUndefined();
        expect(Array.from(visited.values())).withContext("skip all").toEqual([typeParam]);
      });

      it("ParameterTypeStructureImpl", () => {
        const type = new ParameterTypeStructureImpl("second", secondType);
        forEachChildSkipAll(type, [secondType]);
      });

      it("PrefixOperatorsTypeStructureImpl", () => {
        const type = new PrefixOperatorsTypeStructureImpl(["keyof", "typeof"], secondType);
        forEachChildSkipAll(type, [secondType]);
      });
    });

    it("with just child types: UnionTypeStructureImpl", () => {
      const type = new UnionTypeStructureImpl([firstType, secondType, thirdType]);
      forEachChildSkipAll(type, [firstType, secondType, thirdType]);
      forEachChildAcceptSecond(type);
    });

    describe("with special case types: ", () => {
      it("ConditionalTypeStructureImpl", () => {
        const stringType = new StringTypeStructureImpl("foo");

        const type = new ConditionalTypeStructureImpl({
          checkType: firstType,
          extendsType: secondType,
          trueType: thirdType,
          falseType: stringType
        });

        forEachChildSkipAll(type, [firstType, secondType, thirdType, stringType]);
        forEachChildAcceptSecond(type);
      });

      xit("FunctionTypeStructureImpl", () => {
        void(FunctionTypeStructureImpl);
      });

      it("MappedTypeStructureImpl", () => {
        const typeParam = new TypeParameterDeclarationImpl("first");
        const mapped = new MappedTypeStructureImpl(typeParam);
        mapped.asName = secondType;
        mapped.type = thirdType;

        forEachChildSkipAll(mapped, [typeParam, secondType, thirdType]);
        const result = forEachAugmentedStructureChild<typeof expected>(mapped, acceptCallback);
        expect(result).withContext("accept second").toBe(expected);
        expect(Array.from(visited.values())).withContext("accept second").toEqual([
          typeParam, secondType
        ]);
      });

      xit("MemberedObjectTypeStructureImpl", () => {
        void(MemberedObjectTypeStructureImpl);
      });

      it("TemplateLiteralTypeStructureImpl", () => {
        const template = new TemplateLiteralTypeStructureImpl(
          "head", [
            [firstType, "first"],
            [secondType, "second"],
            [thirdType, "third"]
          ]
        );

        forEachChildSkipAll(template, [firstType, secondType, thirdType]);
        forEachChildAcceptSecond(template);
      });
    });
  });
});
