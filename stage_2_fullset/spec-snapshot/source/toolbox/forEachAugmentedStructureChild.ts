import {
  ClassDeclarationImpl,
  MethodDeclarationImpl,
  type StructureImpls,
  type TypeStructures,
  UnionTypeStructureImpl,
  forEachAugmentedStructureChild,
} from "#stage_two/snapshot/source/exports.js";
import { Structures, forEachStructureChild } from "ts-morph";

type ChildStructure = StructureImpls | TypeStructures;
type ForEachStructureCallback<TStructure> = (child: ChildStructure) => TStructure | void;

describe("forEachAugmentedStructureImpl", () => {
  it("iterates over an array of structures until it hits a match", () => {
    const firstClass = new ClassDeclarationImpl, secondClass = new ClassDeclarationImpl, thirdClass = new ClassDeclarationImpl;
    const firstType = new UnionTypeStructureImpl, secondType = new UnionTypeStructureImpl, thirdType = new UnionTypeStructureImpl;
    // ensuring we don't visit grandchildren
    firstType.childTypes.push(thirdType);

    const visited = new Set<ChildStructure>;

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

    const visited = new Set<ChildStructure>;

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

    const visited = new Set<ChildStructure>;
    const expected = Symbol("expected");

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

    const visited = new Set<ChildStructure>;
    const expected = Symbol("expected");

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
});
