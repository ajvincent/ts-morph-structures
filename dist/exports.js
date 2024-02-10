import assert from 'node:assert/strict';
import { CodeBlockWriter, StructureKind, SyntaxKind, Node, forEachStructureChild, ConstructorTypeNode, Writers } from 'ts-morph';
import path from 'path';
import MultiMixinBuilder from 'mixin-decorators';

var TypeStructureKind;
(function (TypeStructureKind) {
    TypeStructureKind[TypeStructureKind["Literal"] = 1000000000] = "Literal";
    TypeStructureKind[TypeStructureKind["String"] = 1000000001] = "String";
    TypeStructureKind[TypeStructureKind["Writer"] = 1000000002] = "Writer";
    TypeStructureKind[TypeStructureKind["QualifiedName"] = 1000000003] = "QualifiedName";
    TypeStructureKind[TypeStructureKind["Parentheses"] = 1000000004] = "Parentheses";
    TypeStructureKind[TypeStructureKind["PrefixOperators"] = 1000000005] = "PrefixOperators";
    TypeStructureKind[TypeStructureKind["Infer"] = 1000000006] = "Infer";
    TypeStructureKind[TypeStructureKind["Union"] = 1000000007] = "Union";
    TypeStructureKind[TypeStructureKind["Intersection"] = 1000000008] = "Intersection";
    TypeStructureKind[TypeStructureKind["Tuple"] = 1000000009] = "Tuple";
    TypeStructureKind[TypeStructureKind["Array"] = 1000000010] = "Array";
    TypeStructureKind[TypeStructureKind["Conditional"] = 1000000011] = "Conditional";
    TypeStructureKind[TypeStructureKind["IndexedAccess"] = 1000000012] = "IndexedAccess";
    TypeStructureKind[TypeStructureKind["Mapped"] = 1000000013] = "Mapped";
    TypeStructureKind[TypeStructureKind["TypeArgumented"] = 1000000014] = "TypeArgumented";
    TypeStructureKind[TypeStructureKind["Function"] = 1000000015] = "Function";
    TypeStructureKind[TypeStructureKind["Parameter"] = 1000000016] = "Parameter";
    TypeStructureKind[TypeStructureKind["TemplateLiteral"] = 1000000017] = "TemplateLiteral";
    TypeStructureKind[TypeStructureKind["MemberedObject"] = 1000000018] = "MemberedObject";
})(TypeStructureKind || (TypeStructureKind = {}));

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This proxy handler is simply making any methods which modify an array in
 * place unreachable, and likewise prevents setting index values.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy#handler_functions}
 */
class ReadonlyArrayProxyHandler {
    /** Members which don't affect the original array. */
    static #safeMembers = new Set([
        Symbol.iterator,
        Symbol.unscopables,
        "length",
        "concat",
        "join",
        "slice",
        "indexOf",
        "lastIndexOf",
        "every",
        "some",
        "forEach",
        "map",
        "filter",
        "reduce",
        "reduceRight",
        "find",
        "findIndex",
        "entries",
        "keys",
        "values",
        "includes",
        "flatMap",
        "flat",
        "at",
        "findLast",
        "findLastIndex",
        "toReversed",
        "toSorted",
        "toSpliced",
        "with",
    ]);
    /** Determine if the array field is safe to return.  Some methods, all numbered indexes. */
    static #isSafeMember(p) {
        if (this.#safeMembers.has(p))
            return true;
        if (p === "constructor")
            return true;
        if (typeof p === "symbol")
            return false;
        const pNum = parseFloat(p);
        if (isNaN(pNum) || Math.floor(pNum) !== pNum || pNum < 0 || !isFinite(pNum))
            return false;
        return true;
    }
    #errorMessage;
    /**
     * @param errorMessage - an error message to throw for unreachable methods.
     */
    constructor(errorMessage) {
        this.#errorMessage = errorMessage;
    }
    apply(target, thisArg, argArray) {
        throw new Error("Method not implemented.");
    }
    construct(target, argArray, newTarget) {
        throw new Error("Method not implemented.");
    }
    defineProperty(target, property, attributes) {
        throw new Error(this.#errorMessage);
    }
    deleteProperty(target, p) {
        throw new Error(this.#errorMessage);
    }
    get(target, p, receiver) {
        if (ReadonlyArrayProxyHandler.#isSafeMember(p)) {
            return Reflect.get(target, p, receiver);
        }
        if (!Reflect.has(Array.prototype, p))
            return undefined;
        throw new Error(this.#errorMessage);
    }
    getOwnPropertyDescriptor(target, p) {
        if (ReadonlyArrayProxyHandler.#isSafeMember(p))
            return Reflect.getOwnPropertyDescriptor(target, p);
        if (!Reflect.has(Array.prototype, p))
            return undefined;
        throw new Error(this.#errorMessage);
    }
    getPrototypeOf(target) {
        return Reflect.getPrototypeOf(target);
    }
    has(target, p) {
        return Reflect.has(target, p);
    }
    isExtensible(target) {
        return Reflect.isExtensible(target);
    }
    ownKeys(target) {
        return Reflect.ownKeys(target);
    }
    preventExtensions(target) {
        throw new Error(this.#errorMessage);
    }
    set(target, p, newValue, receiver) {
        throw new Error(this.#errorMessage);
    }
    setPrototypeOf(target, v) {
        throw new Error(this.#errorMessage);
    }
}

// example: ImportDeclarationStructure::namedImports: OptionalKind<ImportSpecifierStructure>[]
function cloneStructureStringOrWriterArray(sources, sourceKind) {
    const sourceArray = forceArray(sources);
    return sourceArray.map((sourceValue) => cloneStructureStringOrWriter(sourceValue, sourceKind));
}
// example: JSDocableNodeStructure::docs: OptionalKind<JSDocStructure>[]
function cloneStructureOrStringArray(sources, sourceKind) {
    const sourceArray = forceArray(sources);
    return sourceArray.map((sourceValue) => cloneStructureOrString(sourceValue, sourceKind));
}
// example: JsxElementStructure::attributes: (JsxSpreadAttributeStructure | OptionalKind<JsxAttributeStructure>)[]
function cloneRequiredAndOptionalArray(sources, requiredSourceKind, optionalSourceKind) {
    const sourceArray = forceArray(sources);
    return sourceArray.map((sourceValue) => cloneRequiredOrOptionalStructure(sourceValue, requiredSourceKind, optionalSourceKind));
}
// example: ParameteredNodeStructure::parameters: OptionalKind<ParameterDeclarationStructure>[]
function cloneStructureArray(sources, sourceKind) {
    const sourceArray = forceArray(sources);
    return sourceArray.map((sourceValue) => cloneStructure(sourceValue, sourceKind));
}
function forceArray(sources) {
    if (Array.isArray(sources)) {
        return sources;
    }
    return [sources];
}
function cloneStructureStringOrWriter(sourceValue, sourceKind) {
    if (typeof sourceValue === "function")
        return sourceValue;
    return cloneStructureOrString(sourceValue, sourceKind);
}
function cloneStructureOrString(sourceValue, sourceKind) {
    if (typeof sourceValue === "string")
        return sourceValue;
    return cloneStructure(sourceValue, sourceKind);
}
function cloneRequiredOrOptionalStructure(sourceValue, requiredSourceKind, optionalSourceKind) {
    if (sourceValue.kind === requiredSourceKind) {
        return cloneStructure(sourceValue, requiredSourceKind);
    }
    return cloneStructure(sourceValue, optionalSourceKind);
}
function cloneStructure(sourceValue, sourceKind) {
    const CloneClass = StructuresClassesMap.get(sourceKind);
    return CloneClass.clone(sourceValue);
}

const COPY_FIELDS = Symbol("copy fields");
const REPLACE_WRITER_WITH_STRING = Symbol("replaceWriterWithString");
const STRUCTURE_AND_TYPES_CHILDREN = Symbol("otherwise unreachable structure and type-structure children");

/* eslint-disable @typescript-eslint/no-empty-function */
class StructureBase {
    /** @internal */
    static [COPY_FIELDS](source, target) {
    }
    /** @internal */
    static [REPLACE_WRITER_WITH_STRING](value) {
        if (typeof value === "function") {
            const writer = new CodeBlockWriter();
            value(writer);
            return writer.toString();
        }
        return value;
    }
    toJSON() {
        return {};
    }
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() { }
}

class StructuresClassesMapClass extends Map {
    clone(structure) {
        return this.get(structure.kind).clone(structure);
    }
    cloneArray(structures) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return structures.map((structure) => this.clone(structure));
    }
}
const StructuresClassesMap = new StructuresClassesMapClass();

// #endregion preamble
/**
 * This provides an API for converting between a type (`WriterFunction`) and a `TypeStructure`.
 *
 * For any class providing a type (return type, constraint, extends, etc.), you can have an instance of
 * `TypeAccessors` as a private class field, and provide getters and setters for type and typeStructure
 * referring to the private TypeAccessors.
 *
 * See `../decorators/TypedNode.ts` for an example.
 */
class TypeAccessors {
    typeStructure = undefined;
    get type() {
        if (typeof this.typeStructure === "undefined")
            return undefined;
        if (this.typeStructure.kind === TypeStructureKind.Literal) {
            return this.typeStructure.stringValue;
        }
        return this.typeStructure.writerFunction;
    }
    set type(value) {
        if (typeof value === "undefined") {
            this.typeStructure = undefined;
            return;
        }
        if (typeof value === "string") {
            this.typeStructure = LiteralTypeStructureImpl.get(value);
            return;
        }
        const knownTypeStructure = TypeStructuresBase.getTypeStructureForCallback(value);
        if (knownTypeStructure) {
            this.typeStructure = knownTypeStructure;
            return;
        }
        this.typeStructure = new WriterTypeStructureImpl(value);
        TypeStructuresBase.deregisterCallbackForTypeStructure(this.typeStructure);
    }
    /**
     * Create a clone of an existing type, if it belongs to a type structure.
     *
     * If the underlying type structure exists, this will register the clone's type structure
     * for later retrieval.
     * @param type - the type to clone.
     * @returns the cloned type, or the original type if the type is not cloneable.
     */
    static cloneType(type) {
        if (typeof type !== "function")
            return type;
        const typeStructure = TypeStructuresBase.getTypeStructureForCallback(type);
        if (!typeStructure)
            return type;
        if (typeStructure.kind === TypeStructureKind.Literal)
            return typeStructure.stringValue;
        const value = TypeStructureClassesMap$1.clone(typeStructure);
        return value.writerFunction;
    }
}

class TypeStructureClassesMapClass extends Map {
    clone(structure) {
        return this.get(structure.kind).clone(structure);
    }
    cloneArray(structures) {
        return structures.map((structure) => this.clone(structure));
    }
}
const TypeStructureClassesMap = new TypeStructureClassesMapClass();
var TypeStructureClassesMap$1 = TypeStructureClassesMap;

/**
 * This supports setting "implements" and "extends" types for arrays behind read-only array
 * proxies.  The goal is to manage type structures and writer functions in one place,
 * where direct array access is troublesome (particularly, "write access").
 */
class TypeStructureSet extends Set {
    static #getBackingValue(value) {
        return value.kind === TypeStructureKind.Literal
            ? value.stringValue
            : value.writerFunction;
    }
    #backingArray;
    /**
     * @param backingArray - The (non-proxied) array to update when changes happen.
     */
    constructor(backingArray) {
        super();
        this.#backingArray = backingArray;
        for (const value of backingArray) {
            if (typeof value === "string") {
                super.add(LiteralTypeStructureImpl.get(value));
                continue;
            }
            const typeStructure = TypeStructuresBase.getTypeStructureForCallback(value) ??
                new WriterTypeStructureImpl(value);
            super.add(typeStructure);
        }
    }
    add(value) {
        if (!super.has(value)) {
            this.#backingArray.push(TypeStructureSet.#getBackingValue(value));
        }
        return super.add(value);
    }
    clear() {
        this.#backingArray.length = 0;
        return super.clear();
    }
    delete(value) {
        const backingValue = TypeStructureSet.#getBackingValue(value);
        const index = this.#backingArray.indexOf(backingValue);
        if (index === -1) {
            return false;
        }
        this.#backingArray.splice(index, 1);
        return super.delete(value);
    }
    /**
     * Replace all the types this set managers with those from another array.
     * @param array - the types to add.
     */
    replaceFromTypeArray(array) {
        this.clear();
        array.forEach((value) => {
            if (typeof value === "string") {
                this.add(LiteralTypeStructureImpl.get(value));
                return;
            }
            const structure = TypeStructuresBase.getTypeStructureForCallback(value) ??
                new WriterTypeStructureImpl(value);
            this.add(structure);
        });
    }
    /**
     * Replace all the type structures this set managers with those from another set.
     * @param other - the type structure set to copy
     */
    cloneFromTypeStructureSet(other) {
        this.clear();
        other.forEach((value) => {
            if (typeof value === "string")
                this.add(value);
            else
                this.add(TypeStructureClassesMap$1.clone(value));
        });
    }
}

// This file is generated.  Do not edit.  See ../../build/structureToSyntax.ts instead.
const StructureKindToSyntaxKindMap = new Map([
    [StructureKind.Class, SyntaxKind.ClassDeclaration],
    [StructureKind.ClassStaticBlock, SyntaxKind.ClassStaticBlockDeclaration],
    [StructureKind.Constructor, SyntaxKind.Constructor],
    [StructureKind.ConstructorOverload, SyntaxKind.Constructor],
    [StructureKind.GetAccessor, SyntaxKind.GetAccessor],
    [StructureKind.Method, SyntaxKind.MethodDeclaration],
    [StructureKind.MethodOverload, SyntaxKind.MethodDeclaration],
    [StructureKind.Property, SyntaxKind.PropertyDeclaration],
    [StructureKind.SetAccessor, SyntaxKind.SetAccessor],
    [StructureKind.Decorator, SyntaxKind.Decorator],
    [StructureKind.JSDoc, SyntaxKind.JSDoc],
    // no SyntaxKind found for StructureKind.JSDocTag
    [StructureKind.Enum, SyntaxKind.EnumDeclaration],
    [StructureKind.EnumMember, SyntaxKind.EnumMember],
    [StructureKind.PropertyAssignment, SyntaxKind.PropertyAssignment],
    [StructureKind.ShorthandPropertyAssignment, SyntaxKind.ShorthandPropertyAssignment],
    [StructureKind.SpreadAssignment, SyntaxKind.SpreadAssignment],
    [StructureKind.Function, SyntaxKind.FunctionDeclaration],
    [StructureKind.FunctionOverload, SyntaxKind.FunctionDeclaration],
    [StructureKind.Parameter, SyntaxKind.Parameter],
    [StructureKind.CallSignature, SyntaxKind.CallSignature],
    [StructureKind.ConstructSignature, SyntaxKind.ConstructSignature],
    [StructureKind.IndexSignature, SyntaxKind.IndexSignature],
    [StructureKind.Interface, SyntaxKind.InterfaceDeclaration],
    [StructureKind.MethodSignature, SyntaxKind.MethodSignature],
    [StructureKind.PropertySignature, SyntaxKind.PropertySignature],
    [StructureKind.JsxAttribute, SyntaxKind.JsxAttribute],
    [StructureKind.JsxElement, SyntaxKind.JsxElement],
    [StructureKind.JsxSelfClosingElement, SyntaxKind.JsxSelfClosingElement],
    [StructureKind.JsxSpreadAttribute, SyntaxKind.JsxSpreadAttribute],
    [StructureKind.ExportAssignment, SyntaxKind.ExportAssignment],
    [StructureKind.ExportDeclaration, SyntaxKind.ExportDeclaration],
    [StructureKind.ExportSpecifier, SyntaxKind.ExportSpecifier],
    [StructureKind.ImportAttribute, SyntaxKind.ImportAttribute],
    [StructureKind.ImportDeclaration, SyntaxKind.ImportDeclaration],
    [StructureKind.ImportSpecifier, SyntaxKind.ImportSpecifier],
    [StructureKind.Module, SyntaxKind.ModuleDeclaration],
    [StructureKind.SourceFile, SyntaxKind.SourceFile],
    [StructureKind.VariableStatement, SyntaxKind.VariableStatement],
    [StructureKind.TypeAlias, SyntaxKind.TypeAliasDeclaration],
    [StructureKind.TypeParameter, SyntaxKind.TypeParameter],
    [StructureKind.VariableDeclaration, SyntaxKind.VariableDeclaration],
]);

//#region preamble
function AbstractableNodeStructureMixin(baseClass, context) {
    class AbstractableNodeStructureMixin extends baseClass {
        isAbstract = false;
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            target.isAbstract = source.isAbstract ?? false;
        }
        toJSON() {
            const rv = super.toJSON();
            rv.isAbstract = this.isAbstract;
            return rv;
        }
    }
    return AbstractableNodeStructureMixin;
}

//#region preamble
function AmbientableNodeStructureMixin(baseClass, context) {
    class AmbientableNodeStructureMixin extends baseClass {
        hasDeclareKeyword = false;
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            target.hasDeclareKeyword = source.hasDeclareKeyword ?? false;
        }
        toJSON() {
            const rv = super.toJSON();
            rv.hasDeclareKeyword = this.hasDeclareKeyword;
            return rv;
        }
    }
    return AmbientableNodeStructureMixin;
}

//#region preamble
function AsyncableNodeStructureMixin(baseClass, context) {
    class AsyncableNodeStructureMixin extends baseClass {
        isAsync = false;
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            target.isAsync = source.isAsync ?? false;
        }
        toJSON() {
            const rv = super.toJSON();
            rv.isAsync = this.isAsync;
            return rv;
        }
    }
    return AsyncableNodeStructureMixin;
}

function DecoratableNodeStructureMixin(baseClass, context) {
    class DecoratableNodeStructureMixin extends baseClass {
        decorators = [];
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            if (source.decorators) {
                target.decorators.push(...cloneStructureArray(source.decorators, StructureKind.Decorator));
            }
        }
        toJSON() {
            const rv = super.toJSON();
            rv.decorators = this.decorators;
            return rv;
        }
    }
    return DecoratableNodeStructureMixin;
}

//#region preamble
function ExclamationTokenableNodeStructureMixin(baseClass, context) {
    class ExclamationTokenableNodeStructureMixin extends baseClass {
        hasExclamationToken = false;
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            target.hasExclamationToken = source.hasExclamationToken ?? false;
        }
        toJSON() {
            const rv = super.toJSON();
            rv.hasExclamationToken = this.hasExclamationToken;
            return rv;
        }
    }
    return ExclamationTokenableNodeStructureMixin;
}

//#region preamble
function ExportableNodeStructureMixin(baseClass, context) {
    class ExportableNodeStructureMixin extends baseClass {
        isDefaultExport = false;
        isExported = false;
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            target.isDefaultExport = source.isDefaultExport ?? false;
            target.isExported = source.isExported ?? false;
        }
        toJSON() {
            const rv = super.toJSON();
            rv.isDefaultExport = this.isDefaultExport;
            rv.isExported = this.isExported;
            return rv;
        }
    }
    return ExportableNodeStructureMixin;
}

//#region preamble
function GeneratorableNodeStructureMixin(baseClass, context) {
    class GeneratorableNodeStructureMixin extends baseClass {
        isGenerator = false;
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            target.isGenerator = source.isGenerator ?? false;
        }
        toJSON() {
            const rv = super.toJSON();
            rv.isGenerator = this.isGenerator;
            return rv;
        }
    }
    return GeneratorableNodeStructureMixin;
}

//#region preamble
function InitializerExpressionableNodeStructureMixin(baseClass, context) {
    class InitializerExpressionableNodeStructureMixin extends baseClass {
        initializer = undefined;
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            if (source.initializer) {
                target.initializer = source.initializer;
            }
        }
        toJSON() {
            const rv = super.toJSON();
            if (this.initializer) {
                rv.initializer = StructureBase[REPLACE_WRITER_WITH_STRING](this.initializer);
            }
            else {
                rv.initializer = undefined;
            }
            return rv;
        }
    }
    return InitializerExpressionableNodeStructureMixin;
}

function JSDocableNodeStructureMixin(baseClass, context) {
    class JSDocableNodeStructureMixin extends baseClass {
        docs = [];
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            if (source.docs) {
                target.docs.push(...cloneStructureOrStringArray(source.docs, StructureKind.JSDoc));
            }
        }
        toJSON() {
            const rv = super.toJSON();
            rv.docs = this.docs;
            return rv;
        }
    }
    return JSDocableNodeStructureMixin;
}

//#region preamble
function NameableNodeStructureMixin(baseClass, context) {
    class NameableNodeStructureMixin extends baseClass {
        name = undefined;
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            if (source.name) {
                target.name = source.name;
            }
        }
        toJSON() {
            const rv = super.toJSON();
            if (this.name) {
                rv.name = this.name;
            }
            else {
                rv.name = undefined;
            }
            return rv;
        }
    }
    return NameableNodeStructureMixin;
}

//#region preamble
function NamedNodeStructureMixin(baseClass, context) {
    class NamedNodeStructureMixin extends baseClass {
        name = "";
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            if (source.name) {
                target.name = source.name;
            }
        }
        toJSON() {
            const rv = super.toJSON();
            rv.name = this.name;
            return rv;
        }
    }
    return NamedNodeStructureMixin;
}

//#region preamble
function OverrideableNodeStructureMixin(baseClass, context) {
    class OverrideableNodeStructureMixin extends baseClass {
        hasOverrideKeyword = false;
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            target.hasOverrideKeyword = source.hasOverrideKeyword ?? false;
        }
        toJSON() {
            const rv = super.toJSON();
            rv.hasOverrideKeyword = this.hasOverrideKeyword;
            return rv;
        }
    }
    return OverrideableNodeStructureMixin;
}

function ParameteredNodeStructureMixin(baseClass, context) {
    class ParameteredNodeStructureMixin extends baseClass {
        parameters = [];
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            if (source.parameters) {
                target.parameters.push(...cloneStructureArray(source.parameters, StructureKind.Parameter));
            }
        }
        toJSON() {
            const rv = super.toJSON();
            rv.parameters = this.parameters;
            return rv;
        }
    }
    return ParameteredNodeStructureMixin;
}

//#region preamble
function QuestionTokenableNodeStructureMixin(baseClass, context) {
    class QuestionTokenableNodeStructureMixin extends baseClass {
        /** When true, inserts a question mark (?) after the field name. */
        hasQuestionToken = false;
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            target.hasQuestionToken = source.hasQuestionToken ?? false;
        }
        toJSON() {
            const rv = super.toJSON();
            rv.hasQuestionToken = this.hasQuestionToken;
            return rv;
        }
    }
    return QuestionTokenableNodeStructureMixin;
}

//#region preamble
function ReadonlyableNodeStructureMixin(baseClass, context) {
    class ReadonlyableNodeStructureMixin extends baseClass {
        isReadonly = false;
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            target.isReadonly = source.isReadonly ?? false;
        }
        toJSON() {
            const rv = super.toJSON();
            rv.isReadonly = this.isReadonly;
            return rv;
        }
    }
    return ReadonlyableNodeStructureMixin;
}

function ReturnTypedNodeStructureMixin(baseClass, context) {
    class ReturnTypedNodeStructureMixin extends baseClass {
        #returnTypeManager = new TypeAccessors();
        get returnType() {
            return this.#returnTypeManager.type;
        }
        set returnType(value) {
            this.#returnTypeManager.type = value;
        }
        get returnTypeStructure() {
            return this.#returnTypeManager.typeStructure;
        }
        set returnTypeStructure(value) {
            this.#returnTypeManager.typeStructure = value;
        }
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            const { returnTypeStructure } = source;
            if (returnTypeStructure) {
                target.returnTypeStructure =
                    TypeStructureClassesMap$1.clone(returnTypeStructure);
            }
            else if (source.returnType) {
                target.returnType = source.returnType;
            }
        }
        /** @internal */
        *[STRUCTURE_AND_TYPES_CHILDREN]() {
            yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
            if (typeof this.returnTypeStructure === "object")
                yield this.returnTypeStructure;
        }
        toJSON() {
            const rv = super.toJSON();
            if (this.returnType) {
                rv.returnType = StructureBase[REPLACE_WRITER_WITH_STRING](this.returnType);
            }
            else {
                rv.returnType = undefined;
            }
            return rv;
        }
    }
    return ReturnTypedNodeStructureMixin;
}

//#region preamble
function ScopedNodeStructureMixin(baseClass, context) {
    class ScopedNodeStructureMixin extends baseClass {
        scope = undefined;
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            if (source.scope) {
                target.scope = source.scope;
            }
        }
        toJSON() {
            const rv = super.toJSON();
            if (this.scope) {
                rv.scope = this.scope;
            }
            else {
                rv.scope = undefined;
            }
            return rv;
        }
    }
    return ScopedNodeStructureMixin;
}

function StatementedNodeStructureMixin(baseClass, context) {
    class StatementedNodeStructureMixin extends baseClass {
        statements = [];
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            let statementsArray = [];
            if (Array.isArray(source.statements)) {
                statementsArray = source.statements;
            }
            else if (source.statements !== undefined) {
                statementsArray = [source.statements];
            }
            target.statements.push(...statementsArray.map((statement) => StatementedNodeStructureMixin.#cloneStatement(statement)));
        }
        static #cloneStatement(source) {
            if (typeof source !== "object") {
                return source;
            }
            return StructuresClassesMap.clone(source);
        }
        toJSON() {
            const rv = super.toJSON();
            rv.statements = this.statements.map((value) => {
                if (typeof value === "object") {
                    return value;
                }
                return StructureBase[REPLACE_WRITER_WITH_STRING](value);
            });
            return rv;
        }
    }
    return StatementedNodeStructureMixin;
}

//#region preamble
function StructureMixin(baseClass, context) {
    class StructureMixin extends baseClass {
        leadingTrivia = [];
        trailingTrivia = [];
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            if (Array.isArray(source.leadingTrivia)) {
                target.leadingTrivia.push(...source.leadingTrivia);
            }
            else if (source.leadingTrivia !== undefined) {
                target.leadingTrivia.push(source.leadingTrivia);
            }
            if (Array.isArray(source.trailingTrivia)) {
                target.trailingTrivia.push(...source.trailingTrivia);
            }
            else if (source.trailingTrivia !== undefined) {
                target.trailingTrivia.push(source.trailingTrivia);
            }
        }
        toJSON() {
            const rv = super.toJSON();
            rv.leadingTrivia = this.leadingTrivia.map((value) => {
                return StructureBase[REPLACE_WRITER_WITH_STRING](value);
            });
            rv.trailingTrivia = this.trailingTrivia.map((value) => {
                return StructureBase[REPLACE_WRITER_WITH_STRING](value);
            });
            return rv;
        }
    }
    return StructureMixin;
}

function TypedNodeStructureMixin(baseClass, context) {
    class TypedNodeStructureMixin extends baseClass {
        #typeManager = new TypeAccessors();
        get type() {
            return this.#typeManager.type;
        }
        set type(value) {
            this.#typeManager.type = value;
        }
        get typeStructure() {
            return this.#typeManager.typeStructure;
        }
        set typeStructure(value) {
            this.#typeManager.typeStructure = value;
        }
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            const { typeStructure } = source;
            if (typeStructure) {
                target.typeStructure = TypeStructureClassesMap$1.clone(typeStructure);
            }
            else if (source.type) {
                target.type = source.type;
            }
        }
        /** @internal */
        *[STRUCTURE_AND_TYPES_CHILDREN]() {
            yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
            if (typeof this.typeStructure === "object")
                yield this.typeStructure;
        }
        toJSON() {
            const rv = super.toJSON();
            if (this.type) {
                rv.type = StructureBase[REPLACE_WRITER_WITH_STRING](this.type);
            }
            else {
                rv.type = undefined;
            }
            return rv;
        }
    }
    return TypedNodeStructureMixin;
}

function TypeParameteredNodeStructureMixin(baseClass, context) {
    class TypeParameteredNodeStructureMixin extends baseClass {
        typeParameters = [];
        static [COPY_FIELDS](source, target) {
            super[COPY_FIELDS](source, target);
            if (source.typeParameters) {
                target.typeParameters.push(...cloneStructureOrStringArray(source.typeParameters, StructureKind.TypeParameter));
            }
        }
        toJSON() {
            const rv = super.toJSON();
            rv.typeParameters = this.typeParameters;
            return rv;
        }
    }
    return TypeParameteredNodeStructureMixin;
}

class TypeStructuresBase {
    static #callbackToTypeStructureImpl = new WeakMap();
    registerCallbackForTypeStructure() {
        if (TypeStructuresBase.#callbackToTypeStructureImpl.has(this.writerFunction))
            return;
        TypeStructuresBase.#callbackToTypeStructureImpl.set(this.writerFunction, this);
    }
    static getTypeStructureForCallback(callback) {
        return this.#callbackToTypeStructureImpl.get(callback);
    }
    static deregisterCallbackForTypeStructure(structure) {
        this.#callbackToTypeStructureImpl.delete(structure.writerFunction);
    }
    /**
     * Write a start token, invoke a block, and write the end token, in that order.
     * @param writer - the code block writer.
     * @param startToken - the start token.
     * @param endToken - the end token.
     * @param newLine - true if we should call `.newLine()` after the start and before the end.
     * @param indent - true if we should indent the block statements.
     * @param block - the callback to execute for the block statements.
     *
     * @see {@link https://github.com/dsherret/code-block-writer/issues/44}
     */
    static pairedWrite(writer, startToken, endToken, newLine, indent, block) {
        writer.write(startToken);
        if (newLine)
            writer.newLine();
        if (indent)
            writer.indent(block);
        else
            block();
        if (newLine)
            writer.newLine();
        writer.write(endToken);
    }
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() { }
}

class TypePrinterSettings {
    indentChildren = false;
    newLinesAroundChildren = false;
    oneLinePerChild = false;
}
class TypeStructuresWithChildren extends TypeStructuresBase {
    /** For customizing printing of the child types. */
    printerSettings = new TypePrinterSettings();
    #writerFunctionOuter(writer) {
        this.objectType?.writerFunction(writer);
        TypeStructuresBase.pairedWrite(writer, this.startToken, this.endToken, this.printerSettings.newLinesAroundChildren, this.printerSettings.indentChildren, () => this.#writerFunctionInner(writer));
    }
    #writerFunctionInner(writer) {
        let { childTypes } = this;
        if (childTypes.length === 0)
            return;
        if (childTypes.length > this.maxChildCount)
            childTypes = childTypes.slice(0, this.maxChildCount);
        const lastChild = childTypes[childTypes.length - 1];
        for (const child of childTypes) {
            child.writerFunction(writer);
            if (child === lastChild)
                return;
            if (this.printerSettings.oneLinePerChild) {
                writer.write(this.joinChildrenToken.trimEnd());
                writer.newLine();
            }
            else {
                writer.write(this.joinChildrenToken);
            }
        }
    }
    writerFunction = this.#writerFunctionOuter.bind(this);
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        if (typeof this.objectType === "object" && this.objectType)
            yield this.objectType;
        for (const child of this.childTypes) {
            if (typeof child === "object")
                yield child;
        }
    }
}

class TypeStructuresWithTypeParameters extends TypeStructuresBase {
    static writeTypeParameter(typeParam, writer, constraintMode) {
        writer.write(typeParam.name);
        switch (constraintMode) {
            case "extends":
                TypeStructuresWithTypeParameters.#writeConstraintExtends(typeParam, writer);
                break;
            case "in":
                TypeStructuresWithTypeParameters.#writeConstraintIn(typeParam, writer);
                break;
        }
        // isConst, variance not supported yet... need examples to test against
    }
    static #writeConstraintExtends(typeParam, writer) {
        const constraint = typeParam.constraint;
        if (typeof constraint === "undefined")
            return;
        writer.write(" extends ");
        if (typeof constraint === "string") {
            writer.write(constraint);
        }
        else {
            constraint(writer);
        }
        const _default = typeParam.default;
        if (_default) {
            writer.write(" = ");
            if (typeof _default === "string") {
                writer.write(_default);
            }
            else {
                _default(writer);
            }
        }
    }
    static #writeConstraintIn(typeParam, writer) {
        const constraint = typeParam.constraint;
        if (typeof constraint === "undefined")
            return;
        writer.write(" in ");
        if (typeof constraint === "string") {
            writer.write(constraint);
        }
        else {
            constraint(writer);
        }
    }
}

class DefaultMap extends Map {
    getDefault(key, builder) {
        let value = this.get(key);
        if (!value) {
            value = builder();
            this.set(key, value);
        }
        return value;
    }
}
class DefaultWeakMap extends WeakMap {
    getDefault(key, builder) {
        let value = this.get(key);
        if (!value) {
            value = builder();
            this.set(key, value);
        }
        return value;
    }
}

/** @internal */
class MemberedStatementsKeyClass {
    fieldKey;
    statementGroupKey;
    purpose;
    isFieldStatic;
    fieldType;
    isGroupStatic;
    groupType;
    constructor(fieldKey, statementGroupKey, purpose, fieldTypeContext, groupTypeContext) {
        this.fieldKey = fieldKey;
        this.statementGroupKey = statementGroupKey;
        this.purpose = purpose;
        const [isFieldStatic, fieldType] = fieldTypeContext ?? [false, undefined];
        this.isFieldStatic = isFieldStatic;
        this.fieldType = fieldType;
        const [isGroupStatic, groupType] = groupTypeContext ?? [false, undefined];
        this.isGroupStatic = isGroupStatic;
        this.groupType = groupType;
    }
    toJSON() {
        return {
            fieldKey: this.fieldKey,
            statementGroupKey: this.statementGroupKey,
            purpose: this.purpose,
        };
    }
}

// #region preamble
// #endregion preamble
const knownSyntaxKinds = new Set(StructureKindToSyntaxKindMap.values());
/**
 * Get structures for a node and its descendants.
 * @param nodeWithStructures - The node.
 * @returns a map of structures to their original nodes.
 * @internal
 */
function structureImplToNodeMap(nodeWithStructures) {
    return structureToNodeMap(nodeWithStructures, true);
}
/**
 * Get structures for a node and its descendants.
 * @param nodeWithStructures - The node.
 * @param useTypeAwareStructures - true if we should use the StructureImpls.
 * @param hashNeedle - A string to search for among hashes for nodes and structures.  Generates console logs.
 * @returns a map of structures to their original nodes.
 * @internal
 */
function structureToNodeMap(nodeWithStructures, useTypeAwareStructures, hashNeedle) {
    return new StructureAndNodeData(nodeWithStructures, useTypeAwareStructures, hashNeedle).structureToNodeMap;
}
/**
 * @internal
 *
 * Iterate over descendant nodes, then over descendant structures, and finally map each structure to a node.
 *
 * @remarks
 *
 * Here's how this works:
 *
 * 1. Each node gets an almost unique hash.  I store the node and hash in `#nodeSetsByHash`.
 * 2. Each structure gets an unique hash.  I store the structure's hash in `#structureToHash`.
 * 3. From each structure, I compute an equivalent node hash.  Then I look up the hash in `#nodeSetsByHash`
 *    and pull the first node from the resulting set, as a match.
 *
 * That said, this code is fragile.  There are nuances to structure and node traversals which I
 * have had to find via debugging, and I only have my tests to make sure it is correct.  Changes to either
 * TypeScript or ts-morph could break this easily.
 *
 * Hashes I generate are internal to this class, so if I need to change the hash, I can.
 */
class StructureAndNodeData {
    structureToNodeMap = new Map();
    // #region private fields, and life-cycle.
    #rootNode;
    #rootStructure = null;
    /** The structures we haven't matched yet,  This must be empty at the end of the run. */
    #unusedStructures = new Set();
    /** The root node and its descendants. */
    #unusedNodes = new Set();
    #hashToStructureMap = new Map();
    #structureToHash = new Map();
    #structureToParent = new Map();
    #nodeSetsByHash = new Map();
    #nodeToHash = new Map();
    #hashCounter = new Map();
    #appendCounterPostfix(hash) {
        let count = this.#hashCounter.get(hash) ?? 0;
        this.#hashCounter.set(hash, ++count);
        return hash + "#" + count;
    }
    constructor(nodeWithStructures, useTypeAwareStructures, hashNeedle) {
        this.#rootNode = nodeWithStructures;
        this.#collectDescendantNodes(this.#rootNode, "");
        if (hashNeedle) {
            this.#nodeSetsByHash.forEach((nodeSet, hash) => {
                if (hash.includes(hashNeedle))
                    console.log("nodeSet: ", hash, Array.from(nodeSet));
            });
        }
        this.#rootStructure = this.#rootNode.getStructure();
        if (useTypeAwareStructures)
            this.#rootStructure = StructuresClassesMap.get(this.#rootStructure.kind).clone(this.#rootStructure);
        this.#collectDescendantStructures(this.#rootStructure, "");
        if (hashNeedle) {
            this.#structureToHash.forEach((hash, structure) => {
                if (hash.includes(hashNeedle)) {
                    console.log("structure hash: ", hash, structure);
                }
            });
        }
        this.#unusedStructures.forEach((value) => this.#mapStructureToNode(value));
        assert(this.#unusedStructures.size === 0, "we should've resolved every structure");
        this.#cleanup();
    }
    #cleanup() {
        this.#rootNode = null;
        this.#rootStructure = null;
        this.#unusedNodes.clear();
        this.#unusedStructures.clear();
        this.#hashToStructureMap.clear();
        this.#structureToHash.clear();
        this.#structureToParent.clear();
        this.#nodeSetsByHash.clear();
        this.#nodeToHash.clear();
        this.#hashCounter.clear();
    }
    // #endregion private fields, and life-cycle.
    // #region node traversal
    /**
     * Generate a hash for each child, and call this function for each child node.
     * @param node - the node we are visiting.
     * @param hash - the parent node's hash.
     *
     * @remarks
     * Each node's hash will be the parent hash, then a slash, then the return from `this.#hashNodeLocal()`.
     */
    #collectDescendantNodes = (node, hash) => {
        const kind = node.getKind();
        // Build the node hash, and register the node.
        if (knownSyntaxKinds.has(kind)) {
            hash += "/" + this.#hashNodeLocal(node);
            this.#nodeToHash.set(node, hash);
            if (!this.#nodeSetsByHash.has(hash)) {
                this.#nodeSetsByHash.set(hash, new Set());
            }
            const nodeSet = this.#nodeSetsByHash.get(hash);
            nodeSet.add(node);
            this.#unusedNodes.add(node);
            this.#nodeToHash.set(node, hash);
        }
        // Visit child nodes, recursively, with the resolved hash.
        if (Node.isJSDocable(node)) {
            this.#collectJSDocableNodes(node, hash);
        }
        switch (kind) {
            case SyntaxKind.ClassDeclaration: {
                const nodeAsClass = node.asKindOrThrow(SyntaxKind.ClassDeclaration);
                this.#collectClassFields(nodeAsClass, hash);
                break;
            }
        }
        node.forEachChild((child) => this.#collectDescendantNodes(child, hash));
    };
    /**
     * Get the hash for a node's local part (meaning without parent hashing).
     *
     * @param node - the node to hash.
     * @returns the hash part for this node.
     *
     * @remarks
     * The current format is `${node.getKindName}:${node.getName()}(/overload)?`
     */
    #hashNodeLocal(node) {
        let hash = this.#nodeToHash.get(node) ?? "";
        if (!hash) {
            hash = node.getKindName().toString();
            if (Node.isNamed(node) ||
                Node.isNameable(node) ||
                Node.isPropertyNamed(node) ||
                Node.isBindingNamed(node) ||
                Node.isImportSpecifier(node) ||
                Node.isExportSpecifier(node) ||
                Node.isDecorator(node) ||
                Node.isModuleDeclaration(node) ||
                false) {
                const name = node.getName();
                if (name)
                    hash += ":" + name;
            }
            /* TypeScript has every overloadable as sibling nodes, and instances of the same class.
             * ConstructorDeclaration (overload 1),
             * ConstructorDeclaration (overload 2),
             * ConstructorDeclaration (not an overload)
             *
             * ts-morph structures have the overloads as child structures of the non-overload structure.
             * ConstructorDeclarationStructure (not an overload)
             *   ConstructorDeclarationOverloadStructure (overload 1)
             *   ConstructorDeclarationOverloadStructure (overload 2)
             *
             * The hashes have to reflect this pattern.
             */
            if (hash && Node.isOverloadable(node) && node.isOverload()) {
                hash += "/overload";
            }
        }
        return hash;
    }
    #collectClassFields(node, hash) {
        const childNodes = [
            // .getMembers() visits nodes we will otherwise visit later.
            ...node.getProperties(),
        ];
        childNodes.forEach((child) => this.#collectDescendantNodes(child, hash));
    }
    #collectJSDocableNodes(node, hash) {
        const childNodes = node.getJsDocs();
        childNodes.forEach((child) => this.#collectDescendantNodes(child, hash));
    }
    // #endregion node traversal
    // #region structure traversal
    /**
     * Generate a hash for each structure, and call this function for each child structure.
     *
     * @param structure - the structure we are visiting.
     * @param hash - the parent structure's hash.
     *
     * @remarks
     * Each structure's hash will be the parent hash, then a slash, then the return from `this.#hashStructureLocal()`.
     * Structure hashes are unique.
     */
    #collectDescendantStructures(structure, hash) {
        if (structure.kind === StructureKind.JSDocTag)
            return;
        hash += "/" + this.#hashStructureLocal(structure);
        this.#structureToHash.set(structure, hash);
        this.#hashToStructureMap.set(hash, structure);
        this.#unusedStructures.add(structure);
        /* forEachStructureChild hits function overloads before the function implementation.
         * The overloads appear on the function structure's overloads property.
         * So, I defer them to a later recursion loop.
         */
        forEachStructureChild(structure, (child) => {
            if (child.kind === StructureKind.FunctionOverload)
                return;
            this.#structureToParent.set(child, structure);
            this.#collectDescendantStructures(child, hash);
        });
        if (structure.kind === StructureKind.Function &&
            structure.overloads?.length) {
            structure.overloads.forEach((child) => {
                const overloadStructure = child;
                overloadStructure.kind = StructureKind.FunctionOverload;
                this.#structureToParent.set(overloadStructure, structure);
                this.#collectDescendantStructures(overloadStructure, hash);
            });
        }
    }
    /**
     * Get the hash for a structure.
     * @param structure - the structure to hash.
     * @returns the hash part for this structure.
     *
     * @remarks
     * The current format is `${StructureKind[structure.kind]}:${structure.name}#${number}}`.
     */
    #hashStructureLocal(structure) {
        let hash = this.#structureToHash.get(structure) ?? "";
        if (!hash) {
            hash = StructureKind[structure.kind];
            if ("name" in structure) {
                hash += ":" + structure.name?.toString();
            }
            hash = this.#appendCounterPostfix(hash);
        }
        return hash;
    }
    // #endregion structure traversal
    // #region structure-to-node
    #mapStructureToNode(structure) {
        const structureHash = this.#hashStructureLocal(structure);
        const nodeHash = this.#createNodeHashFromStructure(structure);
        let parentStructure = null;
        // these are outside the statement block for debugging purposes.
        let parentNode = null;
        let parentNodeHash = "";
        if (structure !== this.#rootStructure) {
            parentStructure = this.#structureToParent.get(structure);
            if (!parentStructure) {
                throw new Error("assert failure, no parent structure");
            }
            parentNode = this.structureToNodeMap.get(parentStructure) ?? null;
            if (!parentNode)
                throw new Error("assert failure, parent node not found");
            parentNodeHash = this.#nodeToHash.get(parentNode);
            if (!parentNodeHash)
                throw new Error("assert failure, parent node hash not found");
        }
        const candidateNodes = this.#nodeSetsByHash.get(nodeHash);
        if (!candidateNodes || candidateNodes.size === 0) {
            /* We didn't match the structure to an existing node.  Probable causes of failure:
            1. iterating over the nodes, we hit the target node with a different parent node than we expected.  `#collectDescendantNodes()`
            2. Iterating over the structures, we hit the target structure with a different parent structure. `#collectDescendantStructures()`.
            3. The node hash from the structure is wrong.  `#createNodeHashFromStructure()`.
            */
            let parentMsg = "";
            if (parentNode) {
                const sourceFile = this.#rootNode.getSourceFile();
                parentMsg = `, parent at ${JSON.stringify(sourceFile.getLineAndColumnAtPos(parentNode.getPos()))}`;
            }
            throw new Error(`Expected candidate node to exist, structureHash = "${structureHash}", nodeHash = "${nodeHash}"${parentMsg}`);
        }
        // First-in, first-out set, so map the first node and exit.
        for (const node of candidateNodes) {
            this.structureToNodeMap.set(structure, node);
            this.#hashToStructureMap.delete(structureHash);
            this.#unusedStructures.delete(structure);
            this.#unusedNodes.delete(node);
            candidateNodes.delete(node);
            break;
        }
    }
    /**
     * Create a node hash for a structure, equivalent to the original node's hash.
     *
     * @param structure - the structure to hash
     * @returns a candidate node hash.
     */
    #createNodeHashFromStructure(structure) {
        let parentHash = "";
        if (structure !== this.#rootStructure) {
            const parentStructure = this.#structureToParent.get(structure);
            const parentNode = this.structureToNodeMap.get(parentStructure);
            const parentHashTemp = this.#nodeToHash.get(parentNode);
            if (parentHashTemp === undefined) {
                throw new Error("assert failure, no parent hash");
            }
            parentHash = parentHashTemp;
        }
        let localKind = SyntaxKind[StructureKindToSyntaxKindMap.get(structure.kind)];
        // Sometimes TypeScript assigned the same syntax kind number to multiple strings ihe SyntaxKind enum...
        if (localKind === "JSDocComment")
            localKind = "JSDoc";
        if (localKind === "FirstStatement")
            localKind = "VariableStatement";
        if (StructureKind[structure.kind].endsWith("Overload")) {
            localKind = "overload";
        }
        let hash = parentHash + "/" + localKind;
        if ("name" in structure)
            hash += ":" + structure.name?.toString();
        return hash;
    }
}

// #region preamble
/**
 * Build type structures for structures with types.
 * @param structureMap - the map of structures to original nodes.
 * @param userConsole - a callback for conversion failures.
 * @param subStructureResolver - when we discover a node with its own structures to investigate.
 * @param converter - a callback to convert a type node to a type structure.
 * @returns the messages and nodes where conversion fails.
 *
 * This is really a routing mechanism.  For each node, it determines which type
 * nodes we need to create type structures for, then passes them off to the
 * converter to generate the type structure.  Finally, it assigns the resulting
 * type structure to the appropriate structure field.
 */
function buildTypesForStructures(structureMap, userConsole, subStructureResolver, converter) {
    const failures = [];
    function consoleTrap(message, failingTypeNode) {
        userConsole(message, failingTypeNode);
        failures.push({ message, failingTypeNode });
    }
    for (const [structure, node] of structureMap) {
        switch (structure.kind) {
            case StructureKind.Parameter:
            case StructureKind.Property:
            case StructureKind.PropertySignature:
            case StructureKind.TypeAlias:
            case StructureKind.VariableDeclaration: {
                assert(Node.isTyped(node), "we should have a typed node");
                convertTypeField(structure, node, consoleTrap, subStructureResolver, converter);
                break;
            }
            case StructureKind.IndexSignature: {
                assert(Node.isIndexSignatureDeclaration(node), "we should have an index signature node");
                convertKeyTypeField(structure, node, consoleTrap, subStructureResolver, converter);
                // fall through to returnTypeStructure builder
            }
            case StructureKind.CallSignature:
            case StructureKind.Constructor:
            case StructureKind.ConstructorOverload:
            case StructureKind.ConstructSignature:
            case StructureKind.Function:
            case StructureKind.FunctionOverload:
            case StructureKind.GetAccessor:
            case StructureKind.Method:
            case StructureKind.MethodOverload:
            case StructureKind.MethodSignature:
            case StructureKind.SetAccessor: {
                assert(Node.isReturnTyped(node), "we should have a return-typed node");
                convertReturnTypeField(structure, node, consoleTrap, subStructureResolver, converter);
                break;
            }
            case StructureKind.TypeParameter: {
                assert(Node.isTypeParameterDeclaration(node), "we should have a type parameter declaration");
                convertConstraintField(structure, node, consoleTrap, subStructureResolver, converter);
                convertDefaultField(structure, node, consoleTrap, subStructureResolver, converter);
                break;
            }
            case StructureKind.Class: {
                assert(Node.isClassDeclaration(node), "we should have a class declaration");
                convertExtendsFieldForClass(structure, node, consoleTrap, subStructureResolver, converter);
                structure.implementsSet.clear();
                const implementsTypeNodes = node.getImplements();
                implementsTypeNodes.forEach((implementsTypeNode) => {
                    convertImplementsTypeNodeForClass(structure, implementsTypeNode, consoleTrap, subStructureResolver, converter);
                });
                break;
            }
            case StructureKind.Interface: {
                assert(Node.isInterfaceDeclaration(node), "we should have an interface declaration");
                structure.extendsSet.clear();
                const extendsTypeNodes = node.getExtends();
                extendsTypeNodes.forEach((extendsTypeNode) => {
                    convertExtendsTypeNodeForInterface(structure, extendsTypeNode, consoleTrap, subStructureResolver, converter);
                });
                break;
            }
        }
    }
    return failures;
}
function convertTypeField(structure, node, consoleTrap, subStructureResolver, converter) {
    runConversion(node.getTypeNode(), consoleTrap, subStructureResolver, converter, (typeStructure) => (structure.typeStructure = typeStructure));
}
function convertKeyTypeField(structure, node, consoleTrap, subStructureResolver, converter) {
    runConversion(node.getKeyTypeNode(), consoleTrap, subStructureResolver, converter, (typeStructure) => (structure.keyTypeStructure = typeStructure));
}
function convertReturnTypeField(structure, node, consoleTrap, subStructureResolver, converter) {
    runConversion(node.getReturnTypeNode(), consoleTrap, subStructureResolver, converter, (typeStructure) => (structure.returnTypeStructure = typeStructure));
}
function convertConstraintField(structure, node, consoleTrap, subStructureResolver, converter) {
    runConversion(node.getConstraint(), consoleTrap, subStructureResolver, converter, (typeStructure) => (structure.constraintStructure = typeStructure));
}
function convertDefaultField(structure, node, consoleTrap, subStructureResolver, converter) {
    runConversion(node.getDefault(), consoleTrap, subStructureResolver, converter, (typeStructure) => (structure.defaultStructure = typeStructure));
}
function convertExtendsFieldForClass(structure, node, consoleTrap, subStructureResolver, converter) {
    runConversion(node.getExtends(), consoleTrap, subStructureResolver, converter, (typeStructure) => (structure.extendsStructure = typeStructure));
}
function convertImplementsTypeNodeForClass(structure, typeNode, consoleTrap, subStructureResolver, converter) {
    runConversion(typeNode, consoleTrap, subStructureResolver, converter, (typeStructure) => structure.implementsSet.add(typeStructure));
}
function convertExtendsTypeNodeForInterface(structure, typeNode, consoleTrap, subStructureResolver, converter) {
    runConversion(typeNode, consoleTrap, subStructureResolver, converter, (typeStructure) => structure.extendsSet.add(typeStructure));
}
/**
 * Attempt to convert one type node to a type structure.
 * @param typeNode - the type node.  May be undefined, in which case this is a no-op.
 * @param consoleTrap - a callback for conversion failures.
 * @param subStructureResolver - when we discover a node with its own structures to investigate.
 * @param converter - a callback to convert a type node to a type structure.
 * @param callback - internal callback to use the returned type structure.
 * @returns
 *
 * @internal
 */
function runConversion(typeNode, consoleTrap, subStructureResolver, converter, callback) {
    if (!typeNode)
        return;
    const typeStructure = converter(typeNode, consoleTrap, subStructureResolver);
    if (typeStructure)
        callback(typeStructure);
}

const LiteralKeywords = new Map([
    [SyntaxKind.AnyKeyword, "any"],
    [SyntaxKind.BooleanKeyword, "boolean"],
    [SyntaxKind.FalseKeyword, "false"],
    [SyntaxKind.NeverKeyword, "never"],
    [SyntaxKind.NumberKeyword, "number"],
    [SyntaxKind.NullKeyword, "null"],
    [SyntaxKind.ObjectKeyword, "object"],
    [SyntaxKind.StringKeyword, "string"],
    [SyntaxKind.SymbolKeyword, "symbol"],
    [SyntaxKind.TrueKeyword, "true"],
    [SyntaxKind.UndefinedKeyword, "undefined"],
    [SyntaxKind.UnknownKeyword, "unknown"],
    [SyntaxKind.VoidKeyword, "void"],
]);
function convertTypeNode(typeNode, consoleTrap, subStructureResolver) {
    if (Node.isLiteralTypeNode(typeNode)) {
        typeNode = typeNode.getFirstChildOrThrow();
    }
    {
        const kind = typeNode.getKind();
        const keyword = LiteralKeywords.get(kind);
        if (keyword) {
            return LiteralTypeStructureImpl.get(keyword);
        }
    }
    if (Node.isNumericLiteral(typeNode)) {
        return LiteralTypeStructureImpl.get(typeNode.getLiteralText());
    }
    if (Node.isThisTypeNode(typeNode))
        return LiteralTypeStructureImpl.get("this");
    if (Node.isStringLiteral(typeNode)) {
        return new StringTypeStructureImpl(typeNode.getLiteralText());
    }
    if (Node.isArrayTypeNode(typeNode)) {
        const childStructure = convertTypeNode(typeNode.getElementTypeNode(), consoleTrap, subStructureResolver);
        if (!childStructure)
            return null;
        return new ArrayTypeStructureImpl(childStructure);
    }
    if (Node.isConditionalTypeNode(typeNode)) {
        return convertConditionalTypeNode(typeNode, consoleTrap, subStructureResolver);
    }
    if (Node.isFunctionTypeNode(typeNode) ||
        Node.isConstructorTypeNode(typeNode)) {
        return convertFunctionTypeNode(typeNode, consoleTrap, subStructureResolver);
    }
    if (Node.isIndexedAccessTypeNode(typeNode)) {
        const objectType = convertTypeNode(typeNode.getObjectTypeNode(), consoleTrap, subStructureResolver);
        if (!objectType)
            return null;
        const indexType = convertTypeNode(typeNode.getIndexTypeNode(), consoleTrap, subStructureResolver);
        if (!indexType)
            return null;
        return new IndexedAccessTypeStructureImpl(objectType, indexType);
    }
    if (Node.isInferTypeNode(typeNode)) {
        const declaration = typeNode.getTypeParameter();
        const subStructure = convertTypeParameterNode(declaration, subStructureResolver);
        if (!subStructure)
            return null;
        return new InferTypeStructureImpl(subStructure);
    }
    if (Node.isMappedTypeNode(typeNode)) {
        return convertMappedTypeNode(typeNode, consoleTrap, subStructureResolver);
    }
    if (Node.isParenthesizedTypeNode(typeNode)) {
        const childStructure = convertTypeNode(typeNode.getTypeNode(), consoleTrap, subStructureResolver);
        if (!childStructure)
            return null;
        return new ParenthesesTypeStructureImpl(childStructure);
    }
    // PrefixOperators
    if (Node.isTypeOperatorTypeNode(typeNode)) {
        return convertTypeOperatorNode(typeNode, consoleTrap, subStructureResolver);
    }
    if (Node.isRestTypeNode(typeNode)) {
        const structure = convertTypeNode(typeNode.getLastChildOrThrow(), consoleTrap, subStructureResolver);
        if (!structure)
            return null;
        return prependPrefixOperator("...", structure);
    }
    if (Node.isTypeQuery(typeNode)) {
        const structureMaybeString = composeQualifiedName(typeNode.getExprName());
        const structure = typeof structureMaybeString === "string"
            ? LiteralTypeStructureImpl.get(structureMaybeString)
            : structureMaybeString;
        return prependPrefixOperator("typeof", structure);
    }
    if (Node.isTemplateLiteralTypeNode(typeNode)) {
        return convertTemplateLiteralTypeNode(typeNode, consoleTrap, subStructureResolver);
    }
    if (Node.isTypeLiteral(typeNode)) {
        return convertTypeLiteralNode(typeNode, consoleTrap, subStructureResolver);
    }
    // Type nodes with generic type node children, based on a type.
    let childTypeNodes = [], parentStructure;
    if (Node.isUnionTypeNode(typeNode)) {
        parentStructure = new UnionTypeStructureImpl();
        childTypeNodes = typeNode.getTypeNodes();
    }
    else if (Node.isIntersectionTypeNode(typeNode)) {
        parentStructure = new IntersectionTypeStructureImpl();
        childTypeNodes = typeNode.getTypeNodes();
    }
    else if (Node.isTupleTypeNode(typeNode)) {
        parentStructure = new TupleTypeStructureImpl();
        childTypeNodes = typeNode.getElements();
    }
    // class extends expressionWithTypeArguments
    else if (Node.isExpressionWithTypeArguments(typeNode)) {
        const expression = typeNode.getExpression();
        const objectType = LiteralTypeStructureImpl.get(expression.getText());
        childTypeNodes = typeNode.getTypeArguments();
        if (childTypeNodes.length === 0)
            return objectType;
        parentStructure = new TypeArgumentedTypeStructureImpl(objectType);
    }
    // identifiers, type-argumented type nodes
    else if (Node.isTypeReference(typeNode)) {
        const objectTypeMaybeString = composeQualifiedName(typeNode.getTypeName());
        const objectType = typeof objectTypeMaybeString === "string"
            ? LiteralTypeStructureImpl.get(objectTypeMaybeString)
            : objectTypeMaybeString;
        childTypeNodes = typeNode.getTypeArguments();
        if (childTypeNodes.length === 0) {
            return objectType;
        }
        childTypeNodes = typeNode.getTypeArguments();
        parentStructure = new TypeArgumentedTypeStructureImpl(objectType);
    }
    if (parentStructure) {
        const success = convertAndAppendChildTypes(childTypeNodes, parentStructure.childTypes, consoleTrap, subStructureResolver);
        return success ? parentStructure : null;
    }
    reportConversionFailure("unsupported type node", typeNode, typeNode, consoleTrap);
    return null;
}
function convertConditionalTypeNode(condition, consoleTrap, subStructureResolver) {
    const checkType = convertTypeNode(condition.getCheckType(), consoleTrap, subStructureResolver);
    if (!checkType)
        return null;
    const extendsType = convertTypeNode(condition.getExtendsType(), consoleTrap, subStructureResolver);
    if (!extendsType)
        return null;
    const trueType = convertTypeNode(condition.getTrueType(), consoleTrap, subStructureResolver);
    if (!trueType)
        return null;
    const falseType = convertTypeNode(condition.getFalseType(), consoleTrap, subStructureResolver);
    if (!falseType)
        return null;
    return new ConditionalTypeStructureImpl({
        checkType,
        extendsType,
        trueType,
        falseType,
    });
}
function convertFunctionTypeNode(typeNode, consoleTrap, subStructureResolver) {
    let typeParameterNodes = [];
    try {
        // https://github.com/dsherret/ts-morph/issues/1434
        typeParameterNodes = typeNode.getTypeParameters();
    }
    catch (ex) {
        typeParameterNodes = typeNode.getChildrenOfKind(SyntaxKind.TypeParameter);
    }
    const typeParameterStructures = [];
    for (const declaration of typeParameterNodes.values()) {
        const subStructure = convertTypeParameterNode(declaration, subStructureResolver);
        if (!subStructure)
            return null;
        typeParameterStructures.push(subStructure);
    }
    let restParameter = undefined;
    const parameterNodes = typeNode
        .getParameters()
        .slice();
    if (parameterNodes.length) {
        const lastParameter = parameterNodes[parameterNodes.length - 1];
        if (lastParameter.isRestParameter()) {
            parameterNodes.pop();
            restParameter = convertParameterNodeTypeNode(lastParameter, consoleTrap, subStructureResolver);
        }
    }
    const parameterStructures = parameterNodes.map((parameterNode) => convertParameterNodeTypeNode(parameterNode, consoleTrap, subStructureResolver));
    const returnTypeNode = typeNode.getReturnTypeNode();
    let returnTypeStructure = undefined;
    if (returnTypeNode) {
        returnTypeStructure =
            convertTypeNode(returnTypeNode, consoleTrap, subStructureResolver) ??
                undefined;
    }
    const functionContext = {
        name: undefined,
        isConstructor: typeNode instanceof ConstructorTypeNode,
        typeParameters: typeParameterStructures,
        parameters: parameterStructures,
        restParameter,
        returnType: returnTypeStructure,
        writerStyle: FunctionWriterStyle.Arrow,
    };
    return new FunctionTypeStructureImpl(functionContext);
}
function convertTypeParameterNode(declaration, subStructureResolver) {
    const subStructure = subStructureResolver(declaration);
    if (subStructure.kind !== StructureKind.TypeParameter)
        return null;
    return subStructure;
}
function convertParameterNodeTypeNode(node, consoleTrap, subStructureResolver) {
    const paramTypeNode = node.getTypeNode();
    let paramTypeStructure = null;
    if (paramTypeNode) {
        paramTypeStructure = convertTypeNode(paramTypeNode, consoleTrap, subStructureResolver);
    }
    return new ParameterTypeStructureImpl(node.getName(), paramTypeStructure ?? undefined);
}
function composeQualifiedName(entity) {
    if (Node.isQualifiedName(entity)) {
        const leftStructure = composeQualifiedName(entity.getLeft());
        const rightTypeAsString = entity.getRight().getText();
        if (leftStructure instanceof QualifiedNameTypeStructureImpl) {
            leftStructure.childTypes.push(rightTypeAsString);
            return leftStructure;
        }
        return new QualifiedNameTypeStructureImpl([
            leftStructure,
            rightTypeAsString,
        ]);
    }
    return entity.getText();
}
function convertMappedTypeNode(mappedTypeNode, consoleTrap, subStructureResolver) {
    let parameterStructure;
    {
        const typeParameterNode = mappedTypeNode.getTypeParameter();
        const structure = convertTypeParameterNode(typeParameterNode, subStructureResolver);
        if (!structure) {
            return reportConversionFailure("unsupported type parameter node", typeParameterNode, mappedTypeNode, consoleTrap);
        }
        parameterStructure = structure;
    }
    const mappedStructure = new MappedTypeStructureImpl(parameterStructure);
    {
        let nameStructure = undefined;
        const nameTypeNode = mappedTypeNode.getNameTypeNode();
        if (nameTypeNode) {
            nameStructure =
                convertTypeNode(nameTypeNode, consoleTrap, subStructureResolver) ??
                    undefined;
        }
        if (nameStructure)
            mappedStructure.asName = nameStructure;
    }
    {
        let typeStructure = undefined;
        const typeNode = mappedTypeNode.getTypeNode();
        if (typeNode) {
            typeStructure =
                convertTypeNode(typeNode, consoleTrap, subStructureResolver) ??
                    undefined;
        }
        if (typeStructure)
            mappedStructure.type = typeStructure;
    }
    switch (mappedTypeNode.getReadonlyToken()?.getKind()) {
        case SyntaxKind.ReadonlyKeyword:
            mappedStructure.readonlyToken = "readonly";
            break;
        case SyntaxKind.PlusToken:
            mappedStructure.readonlyToken = "+readonly";
            break;
        case SyntaxKind.MinusToken:
            mappedStructure.readonlyToken = "-readonly";
            break;
    }
    switch (mappedTypeNode.getQuestionToken()?.getKind()) {
        case SyntaxKind.QuestionToken:
            mappedStructure.questionToken = "?";
            break;
        case SyntaxKind.PlusToken:
            mappedStructure.questionToken = "+?";
            break;
        case SyntaxKind.MinusToken:
            mappedStructure.questionToken = "-?";
            break;
    }
    return mappedStructure;
}
function convertTemplateLiteralTypeNode(templateNode, consoleTrap, subStructureResolver) {
    const headText = templateNode.getHead().getLiteralText();
    const spans = [];
    for (const childTypeNode of templateNode.getTemplateSpans()) {
        if (childTypeNode.getKind() !== SyntaxKind.TemplateLiteralTypeSpan ||
            childTypeNode.getChildCount() !== 2) {
            return reportConversionFailure("unsupported template span", childTypeNode, childTypeNode, consoleTrap);
        }
        const [grandchildTypeNode, middleOrTailNode] = childTypeNode.getChildren();
        if (!Node.isLiteralLike(middleOrTailNode)) {
            return reportConversionFailure("unsupported template middle or tail literal node", middleOrTailNode, childTypeNode, consoleTrap);
        }
        let grandchildStructure;
        if (Node.isTypeNode(grandchildTypeNode)) {
            grandchildStructure = convertTypeNode(grandchildTypeNode, consoleTrap, subStructureResolver);
        }
        else {
            const kind = grandchildTypeNode.getKind();
            const keyword = LiteralKeywords.get(kind);
            if (keyword) {
                grandchildStructure = LiteralTypeStructureImpl.get(keyword);
            }
            else {
                return reportConversionFailure("unsupported template middle or tail type node", grandchildTypeNode, childTypeNode, consoleTrap);
            }
        }
        if (!grandchildStructure)
            return null;
        const literalText = middleOrTailNode.getLiteralText();
        spans.push([grandchildStructure, literalText]);
    }
    return new TemplateLiteralTypeStructureImpl(headText, spans);
}
function convertTypeLiteralNode(memberedTypeNode, consoleTrap, subStructureResolver) {
    const structure = new MemberedObjectTypeStructureImpl();
    const members = memberedTypeNode.getMembers();
    for (const member of members) {
        const childStructure = subStructureResolver(member);
        if (!childStructure.kind) {
            return reportConversionFailure("unknown member kind", member, memberedTypeNode, consoleTrap);
        }
        switch (childStructure.kind) {
            case StructureKind.CallSignature:
                structure.callSignatures.push(childStructure);
                break;
            case StructureKind.ConstructSignature:
                structure.constructSignatures.push(childStructure);
                break;
            case StructureKind.GetAccessor:
                structure.getAccessors.push(childStructure);
                break;
            case StructureKind.IndexSignature:
                structure.indexSignatures.push(childStructure);
                break;
            case StructureKind.MethodSignature:
                structure.methods.push(childStructure);
                break;
            case StructureKind.PropertySignature:
                structure.properties.push(childStructure);
                break;
            case StructureKind.SetAccessor:
                structure.setAccessors.push(childStructure);
                break;
            default:
                return reportConversionFailure("unable to convert member of TypeElementMemberedTypeNode", member, memberedTypeNode, consoleTrap);
        }
    }
    return structure;
}
function convertTypeOperatorNode(typeNode, consoleTrap, subStructureResolver) {
    const structure = convertTypeNode(typeNode.getTypeNode(), consoleTrap, subStructureResolver);
    if (!structure)
        return null;
    switch (typeNode.getOperator()) {
        case SyntaxKind.ReadonlyKeyword:
            return prependPrefixOperator("readonly", structure);
        case SyntaxKind.KeyOfKeyword:
            return prependPrefixOperator("keyof", structure);
        case SyntaxKind.UniqueKeyword:
            return prependPrefixOperator("unique", structure);
        // no other possibilities
        default:
            return null;
    }
}
function prependPrefixOperator(operator, typeStructure) {
    if (typeStructure instanceof PrefixOperatorsTypeStructureImpl) {
        typeStructure.operators.unshift(operator);
        return typeStructure;
    }
    return new PrefixOperatorsTypeStructureImpl([operator], typeStructure);
}
function convertAndAppendChildTypes(childTypeNodes, elements, consoleTrap, subStructureResolver) {
    return childTypeNodes.every((typeNode) => {
        const childStructure = convertTypeNode(typeNode, consoleTrap, subStructureResolver);
        if (childStructure) {
            elements.push(childStructure);
            return true;
        }
        return false;
    });
}
function reportConversionFailure(prefixMessage, failingNode, failingTypeNode, consoleTrap) {
    const pos = failingNode.getPos();
    const { line, column } = failingNode
        .getSourceFile()
        .getLineAndColumnAtPos(pos);
    consoleTrap(`${prefixMessage}: "${failingNode.getKindName()}" at line ${line}, column ${column}`, failingTypeNode);
    return null;
}

// #region preamble
/**
 * Get a structure for a node, with type structures installed throughout its descendants.
 * @param rootNode - The node to start from.
 * @param userConsole - a callback for conversion failures.
 * @param assertNoFailures - if true, assert there are no conversion failures.
 * @returns the root structure, the root node, and any failures during recursion.
 */
function getTypeAugmentedStructure(rootNode, userConsole, assertNoFailures) {
    const map = structureImplToNodeMap(rootNode);
    assert(map.size > 0, "we should have some structures");
    let rootStructure;
    for (const [structure, node] of map.entries()) {
        if (node === rootNode) {
            rootStructure = structure;
            break;
        }
    }
    assert(rootStructure, "we should have a root structure");
    const subFailures = [];
    const failures = buildTypesForStructures(map, userConsole, (nodeWithStructure) => {
        const subStructureResults = getTypeAugmentedStructure(nodeWithStructure, userConsole, false);
        subFailures.push(...subStructureResults.failures);
        return subStructureResults.rootStructure;
    }, convertTypeNode);
    failures.push(...subFailures);
    if (assertNoFailures) {
        assert(failures.length === 0, "caller required no failures, but we did fail");
    }
    return {
        rootStructure,
        rootNode,
        failures,
    };
}

function VoidTypeNodeToTypeStructureConsole(message, failingTypeNode) {
}

//#region preamble
//#endregion preamble
const CallSignatureDeclarationStructureBase = MultiMixinBuilder([
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class CallSignatureDeclarationImpl extends CallSignatureDeclarationStructureBase {
    kind = StructureKind.CallSignature;
    static clone(source) {
        const target = new CallSignatureDeclarationImpl();
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.CallSignature, CallSignatureDeclarationImpl);

var _a$4;
//#endregion preamble
const ClassDeclarationStructureBase = MultiMixinBuilder([
    NameableNodeStructureMixin,
    DecoratableNodeStructureMixin,
    AbstractableNodeStructureMixin,
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class ClassDeclarationImpl extends ClassDeclarationStructureBase {
    static #implementsArrayReadonlyHandler = new ReadonlyArrayProxyHandler("The implements array is read-only.  Please use this.implementsSet to set strings and type structures.");
    kind = StructureKind.Class;
    #extendsManager = new TypeAccessors();
    #implements_ShadowArray = [];
    #implementsProxyArray = new Proxy(this.#implements_ShadowArray, _a$4.#implementsArrayReadonlyHandler);
    ctors = [];
    getAccessors = [];
    implementsSet = new TypeStructureSet(this.#implements_ShadowArray);
    methods = [];
    properties = [];
    setAccessors = [];
    get extends() {
        return this.#extendsManager.type;
    }
    set extends(value) {
        this.#extendsManager.type = value;
    }
    get extendsStructure() {
        return this.#extendsManager.typeStructure;
    }
    set extendsStructure(value) {
        this.#extendsManager.typeStructure = value;
    }
    get implements() {
        return this.#implementsProxyArray;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.ctors) {
            target.ctors.push(...cloneStructureArray(source.ctors, StructureKind.Constructor));
        }
        const { extendsStructure } = source;
        if (extendsStructure) {
            target.extendsStructure = TypeStructureClassesMap$1.clone(extendsStructure);
        }
        else if (source.extends) {
            target.extends = source.extends;
        }
        if (source.getAccessors) {
            target.getAccessors.push(...cloneStructureArray(source.getAccessors, StructureKind.GetAccessor));
        }
        const { implementsSet } = source;
        if (implementsSet instanceof TypeStructureSet) {
            target.implementsSet.cloneFromTypeStructureSet(implementsSet);
        }
        else if (Array.isArray(source.implements)) {
            target.implementsSet.replaceFromTypeArray(source.implements);
        }
        else if (typeof source.implements === "function") {
            target.implementsSet.replaceFromTypeArray([source.implements]);
        }
        if (source.methods) {
            target.methods.push(...cloneStructureArray(source.methods, StructureKind.Method));
        }
        if (source.properties) {
            target.properties.push(...cloneStructureArray(source.properties, StructureKind.Property));
        }
        if (source.setAccessors) {
            target.setAccessors.push(...cloneStructureArray(source.setAccessors, StructureKind.SetAccessor));
        }
    }
    static clone(source) {
        const target = new _a$4();
        this[COPY_FIELDS](source, target);
        return target;
    }
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        if (typeof this.extendsStructure === "object")
            yield this.extendsStructure;
        for (const typeStructure of this.implementsSet) {
            if (typeof typeStructure === "object")
                yield typeStructure;
        }
    }
    toJSON() {
        const rv = super.toJSON();
        rv.ctors = this.ctors;
        if (this.extends) {
            rv.extends = StructureBase[REPLACE_WRITER_WITH_STRING](this.extends);
        }
        else {
            rv.extends = undefined;
        }
        rv.getAccessors = this.getAccessors;
        rv.implements = this.implements.map((value) => {
            return StructureBase[REPLACE_WRITER_WITH_STRING](value);
        });
        rv.kind = this.kind;
        rv.methods = this.methods;
        rv.properties = this.properties;
        rv.setAccessors = this.setAccessors;
        return rv;
    }
}
_a$4 = ClassDeclarationImpl;
StructuresClassesMap.set(StructureKind.Class, ClassDeclarationImpl);

//#region preamble
//#endregion preamble
const ClassStaticBlockDeclarationStructureBase = MultiMixinBuilder([StatementedNodeStructureMixin, JSDocableNodeStructureMixin, StructureMixin], StructureBase);
class ClassStaticBlockDeclarationImpl extends ClassStaticBlockDeclarationStructureBase {
    kind = StructureKind.ClassStaticBlock;
    static clone(source) {
        const target = new ClassStaticBlockDeclarationImpl();
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.ClassStaticBlock, ClassStaticBlockDeclarationImpl);

//#endregion preamble
const ConstructorDeclarationStructureBase = MultiMixinBuilder([
    ScopedNodeStructureMixin,
    StatementedNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class ConstructorDeclarationImpl extends ConstructorDeclarationStructureBase {
    kind = StructureKind.Constructor;
    overloads = [];
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.overloads) {
            target.overloads.push(...cloneStructureArray(source.overloads, StructureKind.ConstructorOverload));
        }
    }
    static clone(source) {
        const target = new ConstructorDeclarationImpl();
        this[COPY_FIELDS](source, target);
        return target;
    }
    static fromSignature(signature) {
        const declaration = new ConstructorDeclarationImpl();
        declaration.docs.push(...cloneStructureOrStringArray(signature.docs, StructureKind.JSDoc));
        declaration.leadingTrivia.push(...signature.leadingTrivia);
        declaration.parameters.push(...StructuresClassesMap.cloneArray(signature.parameters));
        if (signature.returnTypeStructure) {
            declaration.returnTypeStructure = TypeStructureClassesMap$1.clone(signature.returnTypeStructure);
        }
        declaration.trailingTrivia.push(...signature.trailingTrivia);
        declaration.typeParameters.push(...StructuresClassesMap.cloneArray(signature.typeParameters));
        return declaration;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        rv.overloads = this.overloads;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.Constructor, ConstructorDeclarationImpl);

//#region preamble
//#endregion preamble
const ConstructorDeclarationOverloadStructureBase = MultiMixinBuilder([
    ScopedNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class ConstructorDeclarationOverloadImpl extends ConstructorDeclarationOverloadStructureBase {
    kind = StructureKind.ConstructorOverload;
    static clone(source) {
        const target = new ConstructorDeclarationOverloadImpl();
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.ConstructorOverload, ConstructorDeclarationOverloadImpl);

//#region preamble
//#endregion preamble
const ConstructSignatureDeclarationStructureBase = MultiMixinBuilder([
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class ConstructSignatureDeclarationImpl extends ConstructSignatureDeclarationStructureBase {
    kind = StructureKind.ConstructSignature;
    static clone(source) {
        const target = new ConstructSignatureDeclarationImpl();
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.ConstructSignature, ConstructSignatureDeclarationImpl);

//#region preamble
//#endregion preamble
const DecoratorStructureBase = MultiMixinBuilder([NamedNodeStructureMixin, StructureMixin], StructureBase);
class DecoratorImpl extends DecoratorStructureBase {
    kind = StructureKind.Decorator;
    arguments = [];
    typeArguments = [];
    constructor(name) {
        super();
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (Array.isArray(source.arguments)) {
            target.arguments.push(...source.arguments);
        }
        else if (source.arguments !== undefined) {
            target.arguments.push(source.arguments);
        }
        if (Array.isArray(source.typeArguments)) {
            target.typeArguments.push(...source.typeArguments);
        }
        else if (source.typeArguments !== undefined) {
            target.typeArguments.push(source.typeArguments);
        }
    }
    static clone(source) {
        const target = new DecoratorImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.arguments = this.arguments.map((value) => {
            return StructureBase[REPLACE_WRITER_WITH_STRING](value);
        });
        rv.kind = this.kind;
        rv.typeArguments = this.typeArguments;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.Decorator, DecoratorImpl);

//#endregion preamble
const EnumDeclarationStructureBase = MultiMixinBuilder([
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class EnumDeclarationImpl extends EnumDeclarationStructureBase {
    kind = StructureKind.Enum;
    isConst = false;
    members = [];
    constructor(name) {
        super();
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        target.isConst = source.isConst ?? false;
        if (source.members) {
            target.members.push(...cloneStructureArray(source.members, StructureKind.EnumMember));
        }
    }
    static clone(source) {
        const target = new EnumDeclarationImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.isConst = this.isConst;
        rv.kind = this.kind;
        rv.members = this.members;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.Enum, EnumDeclarationImpl);

//#region preamble
//#endregion preamble
const EnumMemberStructureBase = MultiMixinBuilder([
    InitializerExpressionableNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class EnumMemberImpl extends EnumMemberStructureBase {
    kind = StructureKind.EnumMember;
    value = undefined;
    constructor(name) {
        super();
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.value) {
            target.value = source.value;
        }
    }
    static clone(source) {
        const target = new EnumMemberImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        if (this.value) {
            rv.value = this.value;
        }
        else {
            rv.value = undefined;
        }
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.EnumMember, EnumMemberImpl);

//#region preamble
//#endregion preamble
const ExportAssignmentStructureBase = MultiMixinBuilder([JSDocableNodeStructureMixin, StructureMixin], StructureBase);
class ExportAssignmentImpl extends ExportAssignmentStructureBase {
    kind = StructureKind.ExportAssignment;
    expression = "";
    isExportEquals = false;
    constructor(expression) {
        super();
        this.expression = expression;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.expression) {
            target.expression = source.expression;
        }
        target.isExportEquals = source.isExportEquals ?? false;
    }
    static clone(source) {
        const target = new ExportAssignmentImpl(source.expression);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.expression = StructureBase[REPLACE_WRITER_WITH_STRING](this.expression);
        rv.isExportEquals = this.isExportEquals;
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.ExportAssignment, ExportAssignmentImpl);

//#endregion preamble
const ExportDeclarationStructureBase = MultiMixinBuilder([StructureMixin], StructureBase);
class ExportDeclarationImpl extends ExportDeclarationStructureBase {
    kind = StructureKind.ExportDeclaration;
    attributes;
    isTypeOnly = false;
    moduleSpecifier = undefined;
    namedExports = [];
    namespaceExport = undefined;
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.attributes) {
            target.attributes = [];
            target.attributes.push(...cloneStructureArray(source.attributes, StructureKind.ImportAttribute));
        }
        target.isTypeOnly = source.isTypeOnly ?? false;
        if (source.moduleSpecifier) {
            target.moduleSpecifier = source.moduleSpecifier;
        }
        if (source.namedExports) {
            target.namedExports.push(...cloneStructureStringOrWriterArray(source.namedExports, StructureKind.ExportSpecifier));
        }
        if (source.namespaceExport) {
            target.namespaceExport = source.namespaceExport;
        }
    }
    static clone(source) {
        const target = new ExportDeclarationImpl();
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.attributes = this.attributes;
        rv.isTypeOnly = this.isTypeOnly;
        rv.kind = this.kind;
        if (this.moduleSpecifier) {
            rv.moduleSpecifier = this.moduleSpecifier;
        }
        else {
            rv.moduleSpecifier = undefined;
        }
        rv.namedExports = this.namedExports.map((value) => {
            if (typeof value === "object") {
                return value;
            }
            return StructureBase[REPLACE_WRITER_WITH_STRING](value);
        });
        if (this.namespaceExport) {
            rv.namespaceExport = this.namespaceExport;
        }
        else {
            rv.namespaceExport = undefined;
        }
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.ExportDeclaration, ExportDeclarationImpl);

//#region preamble
//#endregion preamble
const ExportSpecifierStructureBase = MultiMixinBuilder([NamedNodeStructureMixin, StructureMixin], StructureBase);
class ExportSpecifierImpl extends ExportSpecifierStructureBase {
    kind = StructureKind.ExportSpecifier;
    alias = undefined;
    isTypeOnly = false;
    constructor(name) {
        super();
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.alias) {
            target.alias = source.alias;
        }
        target.isTypeOnly = source.isTypeOnly ?? false;
    }
    static clone(source) {
        const target = new ExportSpecifierImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        if (this.alias) {
            rv.alias = this.alias;
        }
        else {
            rv.alias = undefined;
        }
        rv.isTypeOnly = this.isTypeOnly;
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.ExportSpecifier, ExportSpecifierImpl);

//#endregion preamble
const FunctionDeclarationStructureBase = MultiMixinBuilder([
    NameableNodeStructureMixin,
    AsyncableNodeStructureMixin,
    GeneratorableNodeStructureMixin,
    ExportableNodeStructureMixin,
    StatementedNodeStructureMixin,
    AmbientableNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class FunctionDeclarationImpl extends FunctionDeclarationStructureBase {
    kind = StructureKind.Function;
    overloads = [];
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.overloads) {
            target.overloads.push(...cloneStructureArray(source.overloads, StructureKind.FunctionOverload));
        }
    }
    static clone(source) {
        const target = new FunctionDeclarationImpl();
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        rv.overloads = this.overloads;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.Function, FunctionDeclarationImpl);

//#region preamble
//#endregion preamble
const FunctionDeclarationOverloadStructureBase = MultiMixinBuilder([
    AsyncableNodeStructureMixin,
    GeneratorableNodeStructureMixin,
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class FunctionDeclarationOverloadImpl extends FunctionDeclarationOverloadStructureBase {
    kind = StructureKind.FunctionOverload;
    static clone(source) {
        const target = new FunctionDeclarationOverloadImpl();
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.FunctionOverload, FunctionDeclarationOverloadImpl);

//#endregion preamble
const GetAccessorDeclarationStructureBase = MultiMixinBuilder([
    DecoratableNodeStructureMixin,
    AbstractableNodeStructureMixin,
    ScopedNodeStructureMixin,
    StatementedNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class GetAccessorDeclarationImpl extends GetAccessorDeclarationStructureBase {
    kind = StructureKind.GetAccessor;
    isStatic;
    constructor(isStatic, name, returnType) {
        super();
        this.isStatic = isStatic;
        this.name = name;
        if (returnType) {
            this.returnTypeStructure = returnType;
        }
    }
    static clone(source) {
        const target = new GetAccessorDeclarationImpl(source.isStatic ?? false, source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.isStatic = this.isStatic;
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.GetAccessor, GetAccessorDeclarationImpl);

//#region preamble
//#endregion preamble
const ImportAttributeStructureBase = MultiMixinBuilder([StructureMixin], StructureBase);
class ImportAttributeImpl extends ImportAttributeStructureBase {
    kind = StructureKind.ImportAttribute;
    name;
    value;
    constructor(value, name) {
        super();
        this.name = name;
        this.value = value;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.name) {
            target.name = source.name;
        }
        if (source.value) {
            target.value = source.value;
        }
    }
    static clone(source) {
        const target = new ImportAttributeImpl(source.value, source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        rv.name = this.name;
        rv.value = this.value;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.ImportAttribute, ImportAttributeImpl);

//#endregion preamble
const ImportDeclarationStructureBase = MultiMixinBuilder([StructureMixin], StructureBase);
class ImportDeclarationImpl extends ImportDeclarationStructureBase {
    kind = StructureKind.ImportDeclaration;
    attributes;
    defaultImport = undefined;
    isTypeOnly = false;
    moduleSpecifier;
    namedImports = [];
    namespaceImport = undefined;
    constructor(moduleSpecifier) {
        super();
        this.moduleSpecifier = moduleSpecifier;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.attributes) {
            target.attributes = [];
            target.attributes.push(...cloneStructureArray(source.attributes, StructureKind.ImportAttribute));
        }
        if (source.defaultImport) {
            target.defaultImport = source.defaultImport;
        }
        target.isTypeOnly = source.isTypeOnly ?? false;
        if (source.moduleSpecifier) {
            target.moduleSpecifier = source.moduleSpecifier;
        }
        if (source.namedImports) {
            target.namedImports.push(...cloneStructureStringOrWriterArray(source.namedImports, StructureKind.ImportSpecifier));
        }
        if (source.namespaceImport) {
            target.namespaceImport = source.namespaceImport;
        }
    }
    static clone(source) {
        const target = new ImportDeclarationImpl(source.moduleSpecifier);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.attributes = this.attributes;
        if (this.defaultImport) {
            rv.defaultImport = this.defaultImport;
        }
        else {
            rv.defaultImport = undefined;
        }
        rv.isTypeOnly = this.isTypeOnly;
        rv.kind = this.kind;
        rv.moduleSpecifier = this.moduleSpecifier;
        rv.namedImports = this.namedImports.map((value) => {
            if (typeof value === "object") {
                return value;
            }
            return StructureBase[REPLACE_WRITER_WITH_STRING](value);
        });
        if (this.namespaceImport) {
            rv.namespaceImport = this.namespaceImport;
        }
        else {
            rv.namespaceImport = undefined;
        }
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.ImportDeclaration, ImportDeclarationImpl);

//#region preamble
//#endregion preamble
const ImportSpecifierStructureBase = MultiMixinBuilder([NamedNodeStructureMixin, StructureMixin], StructureBase);
class ImportSpecifierImpl extends ImportSpecifierStructureBase {
    kind = StructureKind.ImportSpecifier;
    alias = undefined;
    isTypeOnly = false;
    constructor(name) {
        super();
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.alias) {
            target.alias = source.alias;
        }
        target.isTypeOnly = source.isTypeOnly ?? false;
    }
    static clone(source) {
        const target = new ImportSpecifierImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        if (this.alias) {
            rv.alias = this.alias;
        }
        else {
            rv.alias = undefined;
        }
        rv.isTypeOnly = this.isTypeOnly;
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.ImportSpecifier, ImportSpecifierImpl);

//#endregion preamble
const IndexSignatureDeclarationStructureBase = MultiMixinBuilder([
    ReadonlyableNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class IndexSignatureDeclarationImpl extends IndexSignatureDeclarationStructureBase {
    kind = StructureKind.IndexSignature;
    #keyTypeManager = new TypeAccessors();
    keyName = undefined;
    get keyType() {
        const type = this.#keyTypeManager.type;
        return type ? StructureBase[REPLACE_WRITER_WITH_STRING](type) : undefined;
    }
    set keyType(value) {
        this.#keyTypeManager.type = value;
    }
    get keyTypeStructure() {
        return this.#keyTypeManager.typeStructure;
    }
    set keyTypeStructure(value) {
        this.#keyTypeManager.typeStructure = value;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.keyName) {
            target.keyName = source.keyName;
        }
        const { keyTypeStructure } = source;
        if (keyTypeStructure) {
            target.keyTypeStructure = TypeStructureClassesMap$1.clone(keyTypeStructure);
        }
        else if (source.keyType) {
            target.keyType = source.keyType;
        }
    }
    static clone(source) {
        const target = new IndexSignatureDeclarationImpl();
        this[COPY_FIELDS](source, target);
        return target;
    }
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        if (typeof this.keyTypeStructure === "object")
            yield this.keyTypeStructure;
    }
    toJSON() {
        const rv = super.toJSON();
        if (this.keyName) {
            rv.keyName = this.keyName;
        }
        else {
            rv.keyName = undefined;
        }
        if (this.keyType) {
            rv.keyType = this.keyType;
        }
        else {
            rv.keyType = undefined;
        }
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.IndexSignature, IndexSignatureDeclarationImpl);

var _a$3;
//#endregion preamble
const InterfaceDeclarationStructureBase = MultiMixinBuilder([
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class InterfaceDeclarationImpl extends InterfaceDeclarationStructureBase {
    static #extendsArrayReadonlyHandler = new ReadonlyArrayProxyHandler("The extends array is read-only.  Please use this.extendsSet to set strings and type structures.");
    kind = StructureKind.Interface;
    #extends_ShadowArray = [];
    #extendsProxyArray = new Proxy(this.#extends_ShadowArray, _a$3.#extendsArrayReadonlyHandler);
    callSignatures = [];
    constructSignatures = [];
    extendsSet = new TypeStructureSet(this.#extends_ShadowArray);
    getAccessors = [];
    indexSignatures = [];
    methods = [];
    properties = [];
    setAccessors = [];
    constructor(name) {
        super();
        this.name = name;
    }
    get extends() {
        return this.#extendsProxyArray;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.callSignatures) {
            target.callSignatures.push(...cloneStructureArray(source.callSignatures, StructureKind.CallSignature));
        }
        if (source.constructSignatures) {
            target.constructSignatures.push(...cloneStructureArray(source.constructSignatures, StructureKind.ConstructSignature));
        }
        const { extendsSet } = source;
        if (extendsSet instanceof TypeStructureSet) {
            target.extendsSet.cloneFromTypeStructureSet(extendsSet);
        }
        else if (Array.isArray(source.extends)) {
            target.extendsSet.replaceFromTypeArray(source.extends);
        }
        else if (typeof source.extends === "function") {
            target.extendsSet.replaceFromTypeArray([source.extends]);
        }
        if (source.getAccessors) {
            target.getAccessors.push(...cloneStructureArray(source.getAccessors, StructureKind.GetAccessor));
        }
        if (source.indexSignatures) {
            target.indexSignatures.push(...cloneStructureArray(source.indexSignatures, StructureKind.IndexSignature));
        }
        if (source.methods) {
            target.methods.push(...cloneStructureArray(source.methods, StructureKind.MethodSignature));
        }
        if (source.properties) {
            target.properties.push(...cloneStructureArray(source.properties, StructureKind.PropertySignature));
        }
        if (source.setAccessors) {
            target.setAccessors.push(...cloneStructureArray(source.setAccessors, StructureKind.SetAccessor));
        }
    }
    static clone(source) {
        const target = new _a$3(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        for (const typeStructure of this.extendsSet) {
            if (typeof typeStructure === "object")
                yield typeStructure;
        }
    }
    toJSON() {
        const rv = super.toJSON();
        rv.callSignatures = this.callSignatures;
        rv.constructSignatures = this.constructSignatures;
        rv.extends = this.extends.map((value) => {
            return StructureBase[REPLACE_WRITER_WITH_STRING](value);
        });
        rv.getAccessors = this.getAccessors;
        rv.indexSignatures = this.indexSignatures;
        rv.kind = this.kind;
        rv.methods = this.methods;
        rv.properties = this.properties;
        rv.setAccessors = this.setAccessors;
        return rv;
    }
}
_a$3 = InterfaceDeclarationImpl;
StructuresClassesMap.set(StructureKind.Interface, InterfaceDeclarationImpl);

//#endregion preamble
const JSDocStructureBase = MultiMixinBuilder([StructureMixin], StructureBase);
class JSDocImpl extends JSDocStructureBase {
    kind = StructureKind.JSDoc;
    description = undefined;
    tags = [];
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.description) {
            target.description = source.description;
        }
        if (source.tags) {
            target.tags.push(...cloneStructureArray(source.tags, StructureKind.JSDocTag));
        }
    }
    static clone(source) {
        const target = new JSDocImpl();
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        if (this.description) {
            rv.description = StructureBase[REPLACE_WRITER_WITH_STRING](this.description);
        }
        else {
            rv.description = undefined;
        }
        rv.kind = this.kind;
        rv.tags = this.tags;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.JSDoc, JSDocImpl);

//#region preamble
//#endregion preamble
const JSDocTagStructureBase = MultiMixinBuilder([StructureMixin], StructureBase);
class JSDocTagImpl extends JSDocTagStructureBase {
    kind = StructureKind.JSDocTag;
    tagName;
    text = undefined;
    constructor(tagName) {
        super();
        this.tagName = tagName;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.tagName) {
            target.tagName = source.tagName;
        }
        if (source.text) {
            target.text = source.text;
        }
    }
    static clone(source) {
        const target = new JSDocTagImpl(source.tagName);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        rv.tagName = this.tagName;
        if (this.text) {
            rv.text = StructureBase[REPLACE_WRITER_WITH_STRING](this.text);
        }
        else {
            rv.text = undefined;
        }
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.JSDocTag, JSDocTagImpl);

//#region preamble
//#endregion preamble
const JsxAttributeStructureBase = MultiMixinBuilder([StructureMixin], StructureBase);
class JsxAttributeImpl extends JsxAttributeStructureBase {
    kind = StructureKind.JsxAttribute;
    initializer = undefined;
    name = "";
    constructor(name) {
        super();
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.initializer) {
            target.initializer = source.initializer;
        }
        if (source.name) {
            target.name = source.name;
        }
    }
    static clone(source) {
        const target = new JsxAttributeImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        if (this.initializer) {
            rv.initializer = this.initializer;
        }
        else {
            rv.initializer = undefined;
        }
        rv.kind = this.kind;
        rv.name = this.name;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.JsxAttribute, JsxAttributeImpl);

//#endregion preamble
const JsxElementStructureBase = MultiMixinBuilder([NamedNodeStructureMixin, StructureMixin], StructureBase);
class JsxElementImpl extends JsxElementStructureBase {
    kind = StructureKind.JsxElement;
    attributes = [];
    bodyText = undefined;
    children = [];
    constructor(name) {
        super();
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.attributes) {
            target.attributes.push(...cloneRequiredAndOptionalArray(source.attributes, StructureKind.JsxSpreadAttribute, StructureKind.JsxAttribute));
        }
        if (source.bodyText) {
            target.bodyText = source.bodyText;
        }
        if (source.children) {
            target.children.push(...cloneRequiredAndOptionalArray(source.children, StructureKind.JsxSelfClosingElement, StructureKind.JsxElement));
        }
    }
    static clone(source) {
        const target = new JsxElementImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.attributes = this.attributes;
        if (this.bodyText) {
            rv.bodyText = this.bodyText;
        }
        else {
            rv.bodyText = undefined;
        }
        rv.children = this.children;
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.JsxElement, JsxElementImpl);

//#endregion preamble
const JsxSelfClosingElementStructureBase = MultiMixinBuilder([NamedNodeStructureMixin, StructureMixin], StructureBase);
class JsxSelfClosingElementImpl extends JsxSelfClosingElementStructureBase {
    kind = StructureKind.JsxSelfClosingElement;
    attributes = [];
    constructor(name) {
        super();
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.attributes) {
            target.attributes.push(...cloneRequiredAndOptionalArray(source.attributes, StructureKind.JsxSpreadAttribute, StructureKind.JsxAttribute));
        }
    }
    static clone(source) {
        const target = new JsxSelfClosingElementImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.attributes = this.attributes;
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.JsxSelfClosingElement, JsxSelfClosingElementImpl);

//#region preamble
//#endregion preamble
const JsxSpreadAttributeStructureBase = MultiMixinBuilder([StructureMixin], StructureBase);
class JsxSpreadAttributeImpl extends JsxSpreadAttributeStructureBase {
    kind = StructureKind.JsxSpreadAttribute;
    expression;
    constructor(expression) {
        super();
        this.expression = expression;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.expression) {
            target.expression = source.expression;
        }
    }
    static clone(source) {
        const target = new JsxSpreadAttributeImpl(source.expression);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.expression = this.expression;
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.JsxSpreadAttribute, JsxSpreadAttributeImpl);

//#endregion preamble
const MethodDeclarationStructureBase = MultiMixinBuilder([
    AsyncableNodeStructureMixin,
    GeneratorableNodeStructureMixin,
    OverrideableNodeStructureMixin,
    DecoratableNodeStructureMixin,
    AbstractableNodeStructureMixin,
    QuestionTokenableNodeStructureMixin,
    ScopedNodeStructureMixin,
    StatementedNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class MethodDeclarationImpl extends MethodDeclarationStructureBase {
    kind = StructureKind.Method;
    isStatic;
    overloads = [];
    constructor(isStatic, name) {
        super();
        this.isStatic = isStatic;
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.overloads) {
            target.overloads.push(...cloneStructureArray(source.overloads, StructureKind.MethodOverload));
        }
    }
    static clone(source) {
        const target = new MethodDeclarationImpl(source.isStatic ?? false, source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    static fromSignature(isStatic, signature) {
        const declaration = new MethodDeclarationImpl(isStatic, signature.name);
        declaration.docs.push(...cloneStructureOrStringArray(signature.docs, StructureKind.JSDoc));
        declaration.hasQuestionToken = signature.hasQuestionToken;
        declaration.leadingTrivia.push(...signature.leadingTrivia);
        declaration.parameters.push(...StructuresClassesMap.cloneArray(signature.parameters));
        if (signature.returnTypeStructure) {
            declaration.returnTypeStructure = TypeStructureClassesMap$1.clone(signature.returnTypeStructure);
        }
        declaration.trailingTrivia.push(...signature.trailingTrivia);
        declaration.typeParameters.push(...StructuresClassesMap.cloneArray(signature.typeParameters));
        return declaration;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.isStatic = this.isStatic;
        rv.kind = this.kind;
        rv.overloads = this.overloads;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.Method, MethodDeclarationImpl);

//#region preamble
//#endregion preamble
const MethodDeclarationOverloadStructureBase = MultiMixinBuilder([
    AsyncableNodeStructureMixin,
    GeneratorableNodeStructureMixin,
    OverrideableNodeStructureMixin,
    AbstractableNodeStructureMixin,
    QuestionTokenableNodeStructureMixin,
    ScopedNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class MethodDeclarationOverloadImpl extends MethodDeclarationOverloadStructureBase {
    kind = StructureKind.MethodOverload;
    isStatic;
    constructor(isStatic) {
        super();
        this.isStatic = isStatic;
    }
    static clone(source) {
        const target = new MethodDeclarationOverloadImpl(source.isStatic ?? false);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.isStatic = this.isStatic;
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.MethodOverload, MethodDeclarationOverloadImpl);

//#region preamble
//#endregion preamble
const MethodSignatureStructureBase = MultiMixinBuilder([
    QuestionTokenableNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class MethodSignatureImpl extends MethodSignatureStructureBase {
    kind = StructureKind.MethodSignature;
    constructor(name) {
        super();
        this.name = name;
    }
    static clone(source) {
        const target = new MethodSignatureImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.MethodSignature, MethodSignatureImpl);

//#region preamble
//#endregion preamble
const ModuleDeclarationStructureBase = MultiMixinBuilder([
    ExportableNodeStructureMixin,
    StatementedNodeStructureMixin,
    AmbientableNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class ModuleDeclarationImpl extends ModuleDeclarationStructureBase {
    kind = StructureKind.Module;
    declarationKind = undefined;
    constructor(name) {
        super();
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.declarationKind) {
            target.declarationKind = source.declarationKind;
        }
    }
    static clone(source) {
        const target = new ModuleDeclarationImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        if (this.declarationKind) {
            rv.declarationKind = this.declarationKind;
        }
        else {
            rv.declarationKind = undefined;
        }
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.Module, ModuleDeclarationImpl);

//#region preamble
//#endregion preamble
const ParameterDeclarationStructureBase = MultiMixinBuilder([
    ReadonlyableNodeStructureMixin,
    OverrideableNodeStructureMixin,
    TypedNodeStructureMixin,
    InitializerExpressionableNodeStructureMixin,
    DecoratableNodeStructureMixin,
    QuestionTokenableNodeStructureMixin,
    NamedNodeStructureMixin,
    StructureMixin,
], StructureBase);
class ParameterDeclarationImpl extends ParameterDeclarationStructureBase {
    kind = StructureKind.Parameter;
    isRestParameter = false;
    scope = undefined;
    constructor(name) {
        super();
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        target.isRestParameter = source.isRestParameter ?? false;
        if (source.scope) {
            target.scope = source.scope;
        }
    }
    static clone(source) {
        const target = new ParameterDeclarationImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.isRestParameter = this.isRestParameter;
        rv.kind = this.kind;
        if (this.scope) {
            rv.scope = this.scope;
        }
        else {
            rv.scope = undefined;
        }
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.Parameter, ParameterDeclarationImpl);

//#region preamble
//#endregion preamble
const PropertyAssignmentStructureBase = MultiMixinBuilder([NamedNodeStructureMixin, StructureMixin], StructureBase);
class PropertyAssignmentImpl extends PropertyAssignmentStructureBase {
    kind = StructureKind.PropertyAssignment;
    initializer = "";
    constructor(name, initializer) {
        super();
        this.initializer = initializer;
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.initializer) {
            target.initializer = source.initializer;
        }
    }
    static clone(source) {
        const target = new PropertyAssignmentImpl(source.name, source.initializer);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.initializer = StructureBase[REPLACE_WRITER_WITH_STRING](this.initializer);
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.PropertyAssignment, PropertyAssignmentImpl);

//#endregion preamble
const PropertyDeclarationStructureBase = MultiMixinBuilder([
    ExclamationTokenableNodeStructureMixin,
    ReadonlyableNodeStructureMixin,
    OverrideableNodeStructureMixin,
    TypedNodeStructureMixin,
    InitializerExpressionableNodeStructureMixin,
    QuestionTokenableNodeStructureMixin,
    DecoratableNodeStructureMixin,
    AbstractableNodeStructureMixin,
    ScopedNodeStructureMixin,
    AmbientableNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class PropertyDeclarationImpl extends PropertyDeclarationStructureBase {
    kind = StructureKind.Property;
    hasAccessorKeyword = false;
    isStatic;
    constructor(isStatic, name) {
        super();
        this.isStatic = isStatic;
        this.name = name;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        target.hasAccessorKeyword = source.hasAccessorKeyword ?? false;
    }
    static clone(source) {
        const target = new PropertyDeclarationImpl(source.isStatic ?? false, source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    static fromSignature(isStatic, signature) {
        const declaration = new PropertyDeclarationImpl(isStatic, signature.name);
        declaration.docs.push(...cloneStructureOrStringArray(signature.docs, StructureKind.JSDoc));
        declaration.hasQuestionToken = signature.hasQuestionToken;
        declaration.isReadonly = signature.isReadonly;
        declaration.leadingTrivia.push(...signature.leadingTrivia);
        declaration.trailingTrivia.push(...signature.trailingTrivia);
        if (signature.typeStructure) {
            declaration.typeStructure = TypeStructureClassesMap$1.clone(signature.typeStructure);
        }
        return declaration;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.hasAccessorKeyword = this.hasAccessorKeyword;
        rv.isStatic = this.isStatic;
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.Property, PropertyDeclarationImpl);

//#region preamble
//#endregion preamble
const PropertySignatureStructureBase = MultiMixinBuilder([
    ReadonlyableNodeStructureMixin,
    TypedNodeStructureMixin,
    InitializerExpressionableNodeStructureMixin,
    QuestionTokenableNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class PropertySignatureImpl extends PropertySignatureStructureBase {
    kind = StructureKind.PropertySignature;
    constructor(name) {
        super();
        this.name = name;
    }
    static clone(source) {
        const target = new PropertySignatureImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.PropertySignature, PropertySignatureImpl);

//#region preamble
//#endregion preamble
const SetAccessorDeclarationStructureBase = MultiMixinBuilder([
    DecoratableNodeStructureMixin,
    AbstractableNodeStructureMixin,
    ScopedNodeStructureMixin,
    StatementedNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class SetAccessorDeclarationImpl extends SetAccessorDeclarationStructureBase {
    kind = StructureKind.SetAccessor;
    isStatic;
    constructor(isStatic, name, setterParameter) {
        super();
        this.isStatic = isStatic;
        this.name = name;
        this.parameters.push(setterParameter);
    }
    static clone(source) {
        const valueParam = new ParameterDeclarationImpl("value");
        const hasSourceParameter = source.parameters && source.parameters.length > 0;
        const target = new SetAccessorDeclarationImpl(source.isStatic ?? false, source.name, valueParam);
        this[COPY_FIELDS](source, target);
        if (hasSourceParameter) {
            // copy-fields included copying the existing parameter, so we have to drop our artificial one
            target.parameters.shift();
        }
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.isStatic = this.isStatic;
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.SetAccessor, SetAccessorDeclarationImpl);

//#region preamble
//#endregion preamble
const ShorthandPropertyAssignmentStructureBase = MultiMixinBuilder([NamedNodeStructureMixin, StructureMixin], StructureBase);
class ShorthandPropertyAssignmentImpl extends ShorthandPropertyAssignmentStructureBase {
    kind = StructureKind.ShorthandPropertyAssignment;
    constructor(name) {
        super();
        this.name = name;
    }
    static clone(source) {
        const target = new ShorthandPropertyAssignmentImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.ShorthandPropertyAssignment, ShorthandPropertyAssignmentImpl);

//#region preamble
//#endregion preamble
const SourceFileStructureBase = MultiMixinBuilder([StatementedNodeStructureMixin, StructureMixin], StructureBase);
class SourceFileImpl extends SourceFileStructureBase {
    kind = StructureKind.SourceFile;
    static clone(source) {
        const target = new SourceFileImpl();
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.SourceFile, SourceFileImpl);

//#region preamble
//#endregion preamble
const SpreadAssignmentStructureBase = MultiMixinBuilder([StructureMixin], StructureBase);
class SpreadAssignmentImpl extends SpreadAssignmentStructureBase {
    kind = StructureKind.SpreadAssignment;
    expression = "";
    constructor(expression) {
        super();
        this.expression = expression;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.expression) {
            target.expression = source.expression;
        }
    }
    static clone(source) {
        const target = new SpreadAssignmentImpl(source.expression);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.expression = StructureBase[REPLACE_WRITER_WITH_STRING](this.expression);
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.SpreadAssignment, SpreadAssignmentImpl);

//#region preamble
//#endregion preamble
const TypeAliasDeclarationStructureBase = MultiMixinBuilder([
    TypedNodeStructureMixin,
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class TypeAliasDeclarationImpl extends TypeAliasDeclarationStructureBase {
    kind = StructureKind.TypeAlias;
    constructor(name, type) {
        super();
        this.name = name;
        this.type = type;
    }
    get type() {
        return super.type ?? "";
    }
    set type(value) {
        super.type = value;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.type) {
            target.type = source.type;
        }
    }
    static clone(source) {
        const target = new TypeAliasDeclarationImpl(source.name, source.type);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        rv.type = StructureBase[REPLACE_WRITER_WITH_STRING](this.type);
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.TypeAlias, TypeAliasDeclarationImpl);

//#endregion preamble
const TypeParameterDeclarationStructureBase = MultiMixinBuilder([NamedNodeStructureMixin, StructureMixin], StructureBase);
class TypeParameterDeclarationImpl extends TypeParameterDeclarationStructureBase {
    kind = StructureKind.TypeParameter;
    #constraintManager = new TypeAccessors();
    #defaultManager = new TypeAccessors();
    isConst = false;
    variance = undefined;
    constructor(name) {
        super();
        this.name = name;
    }
    get constraint() {
        return this.#constraintManager.type;
    }
    set constraint(value) {
        this.#constraintManager.type = value;
    }
    get constraintStructure() {
        return this.#constraintManager.typeStructure;
    }
    set constraintStructure(value) {
        this.#constraintManager.typeStructure = value;
    }
    get default() {
        return this.#defaultManager.type;
    }
    set default(value) {
        this.#defaultManager.type = value;
    }
    get defaultStructure() {
        return this.#defaultManager.typeStructure;
    }
    set defaultStructure(value) {
        this.#defaultManager.typeStructure = value;
    }
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        const { constraintStructure } = source;
        if (constraintStructure) {
            target.constraintStructure =
                TypeStructureClassesMap$1.clone(constraintStructure);
        }
        else if (source.constraint) {
            target.constraint = source.constraint;
        }
        const { defaultStructure } = source;
        if (defaultStructure) {
            target.defaultStructure = TypeStructureClassesMap$1.clone(defaultStructure);
        }
        else if (source.default) {
            target.default = source.default;
        }
        target.isConst = source.isConst ?? false;
        if (source.variance) {
            target.variance = source.variance;
        }
    }
    static clone(source) {
        const target = new TypeParameterDeclarationImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        if (typeof this.constraintStructure === "object")
            yield this.constraintStructure;
        if (typeof this.defaultStructure === "object")
            yield this.defaultStructure;
    }
    toJSON() {
        const rv = super.toJSON();
        if (this.constraint) {
            rv.constraint = StructureBase[REPLACE_WRITER_WITH_STRING](this.constraint);
        }
        else {
            rv.constraint = undefined;
        }
        if (this.default) {
            rv.default = StructureBase[REPLACE_WRITER_WITH_STRING](this.default);
        }
        else {
            rv.default = undefined;
        }
        rv.isConst = this.isConst;
        rv.kind = this.kind;
        if (this.variance) {
            rv.variance = this.variance;
        }
        else {
            rv.variance = undefined;
        }
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.TypeParameter, TypeParameterDeclarationImpl);

//#region preamble
//#endregion preamble
const VariableDeclarationStructureBase = MultiMixinBuilder([
    ExclamationTokenableNodeStructureMixin,
    InitializerExpressionableNodeStructureMixin,
    TypedNodeStructureMixin,
    NamedNodeStructureMixin,
    StructureMixin,
], StructureBase);
class VariableDeclarationImpl extends VariableDeclarationStructureBase {
    kind = StructureKind.VariableDeclaration;
    constructor(name) {
        super();
        this.name = name;
    }
    static clone(source) {
        const target = new VariableDeclarationImpl(source.name);
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.VariableDeclaration, VariableDeclarationImpl);

//#endregion preamble
const VariableStatementStructureBase = MultiMixinBuilder([
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
], StructureBase);
class VariableStatementImpl extends VariableStatementStructureBase {
    kind = StructureKind.VariableStatement;
    declarationKind = undefined;
    declarations = [];
    static [COPY_FIELDS](source, target) {
        super[COPY_FIELDS](source, target);
        if (source.declarationKind) {
            target.declarationKind = source.declarationKind;
        }
        target.declarations.push(...cloneStructureArray(source.declarations, StructureKind.VariableDeclaration));
    }
    static clone(source) {
        const target = new VariableStatementImpl();
        this[COPY_FIELDS](source, target);
        return target;
    }
    toJSON() {
        const rv = super.toJSON();
        if (this.declarationKind) {
            rv.declarationKind = this.declarationKind;
        }
        else {
            rv.declarationKind = undefined;
        }
        rv.declarations = this.declarations;
        rv.kind = this.kind;
        return rv;
    }
}
StructuresClassesMap.set(StructureKind.VariableStatement, VariableStatementImpl);

/**
 * `boolean[]`
 *
 * @see `IndexedAccessTypeStructureImpl` for `Foo["index"]`
 * @see `TupleTypeStructureImpl` for `[number, boolean]`
 */
class ArrayTypeStructureImpl extends TypeStructuresBase {
    static clone(other) {
        return new ArrayTypeStructureImpl(TypeStructureClassesMap$1.clone(other.objectType));
    }
    kind = TypeStructureKind.Array;
    objectType;
    constructor(objectType) {
        super();
        this.objectType = objectType;
        this.registerCallbackForTypeStructure();
    }
    #writerFunction(writer) {
        this.objectType.writerFunction(writer);
        writer.write("[]");
    }
    writerFunction = this.#writerFunction.bind(this);
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        if (typeof this.objectType === "object")
            yield this.objectType;
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.Array, ArrayTypeStructureImpl);

/** `checkType` extends `extendsType` ? `trueType` : `falseType` */
class ConditionalTypeStructureImpl extends TypeStructuresBase {
    static clone(other) {
        const parts = {
            checkType: TypeStructureClassesMap$1.clone(other.checkType),
            extendsType: TypeStructureClassesMap$1.clone(other.extendsType),
            trueType: TypeStructureClassesMap$1.clone(other.trueType),
            falseType: TypeStructureClassesMap$1.clone(other.falseType),
        };
        return new ConditionalTypeStructureImpl(parts);
    }
    kind = TypeStructureKind.Conditional;
    checkType;
    extendsType;
    trueType;
    falseType;
    constructor(conditionalParts) {
        super();
        this.checkType =
            conditionalParts.checkType ?? LiteralTypeStructureImpl.get("never");
        this.extendsType =
            conditionalParts.extendsType ?? LiteralTypeStructureImpl.get("never");
        this.trueType =
            conditionalParts.trueType ?? LiteralTypeStructureImpl.get("never");
        this.falseType =
            conditionalParts.falseType ?? LiteralTypeStructureImpl.get("never");
        this.registerCallbackForTypeStructure();
    }
    #writerFunction(writer) {
        this.checkType.writerFunction(writer);
        writer.write(" extends ");
        this.extendsType.writerFunction(writer);
        writer.write(" ? ");
        this.trueType.writerFunction(writer);
        writer.write(" : ");
        this.falseType.writerFunction(writer);
    }
    writerFunction = this.#writerFunction.bind(this);
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        if (typeof this.checkType === "object")
            yield this.checkType;
        if (typeof this.extendsType === "object")
            yield this.extendsType;
        if (typeof this.trueType === "object")
            yield this.trueType;
        if (typeof this.falseType === "object")
            yield this.falseType;
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.Conditional, ConditionalTypeStructureImpl);

var _a$2;
// #endregion preamble
var FunctionWriterStyle;
(function (FunctionWriterStyle) {
    FunctionWriterStyle["Arrow"] = "Arrow";
    FunctionWriterStyle["Method"] = "Method";
    FunctionWriterStyle["GetAccessor"] = "GetAccessor";
    FunctionWriterStyle["SetAccessor"] = "SetAccessor";
})(FunctionWriterStyle || (FunctionWriterStyle = {}));
/** ("new" | "get" | "set" | "") name<typeParameters>(parameters, ...restParameter) ("=\>" | ":" ) returnType */
class FunctionTypeStructureImpl extends TypeStructuresWithTypeParameters {
    static clone(other) {
        return new _a$2({
            name: other.name,
            isConstructor: other.isConstructor,
            typeParameters: other.typeParameters.map((typeParam) => TypeParameterDeclarationImpl.clone(typeParam)),
            parameters: other.parameters.map((param) => ParameterTypeStructureImpl.clone(param)),
            restParameter: other.restParameter
                ? ParameterTypeStructureImpl.clone(other.restParameter)
                : undefined,
            returnType: other.returnType
                ? TypeStructureClassesMap$1.clone(other.returnType)
                : undefined,
            writerStyle: other.writerStyle,
        });
    }
    kind = TypeStructureKind.Function;
    name;
    isConstructor;
    typeParameters;
    parameters;
    restParameter;
    returnType;
    writerStyle = FunctionWriterStyle.Arrow;
    constructor(context) {
        super();
        this.name = context.name ?? "";
        this.isConstructor = context.isConstructor ?? false;
        this.typeParameters = context.typeParameters?.slice() ?? [];
        this.parameters = context.parameters?.slice() ?? [];
        this.restParameter = context.restParameter;
        this.returnType = context.returnType;
        this.writerStyle = context.writerStyle ?? FunctionWriterStyle.Arrow;
        this.registerCallbackForTypeStructure();
    }
    #writerFunction(writer) {
        if (this.writerStyle === FunctionWriterStyle.GetAccessor) {
            writer.write("get ");
            if (this.name)
                writer.write(this.name);
        }
        else if (this.writerStyle === FunctionWriterStyle.SetAccessor) {
            writer.write("set ");
            if (this.name)
                writer.write(this.name);
        }
        else if (this.writerStyle === FunctionWriterStyle.Method) {
            if (this.name)
                writer.write(this.name);
        }
        else if (this.isConstructor)
            writer.write("new ");
        if (this.typeParameters.length) {
            _a$2.pairedWrite(writer, "<", ">", false, false, () => {
                const lastChild = this.typeParameters[this.typeParameters.length - 1];
                for (const typeParam of this.typeParameters) {
                    TypeStructuresWithTypeParameters.writeTypeParameter(typeParam, writer, "extends");
                    if (typeParam !== lastChild) {
                        writer.write(", ");
                    }
                }
            });
        }
        _a$2.pairedWrite(writer, "(", ")", false, false, () => {
            let lastType;
            if (this.restParameter)
                lastType = new PrefixOperatorsTypeStructureImpl(["..."], this.restParameter);
            else if (this.parameters.length > 0)
                lastType = this.parameters[this.parameters.length - 1];
            for (const type of this.parameters) {
                type.writerFunction(writer);
                if (type !== lastType)
                    writer.write(", ");
            }
            if (this.restParameter) {
                lastType.writerFunction(writer);
            }
        });
        if (this.returnType) {
            switch (this.writerStyle) {
                case FunctionWriterStyle.Arrow:
                    writer.write(" => ");
                    this.returnType.writerFunction(writer);
                    break;
                case FunctionWriterStyle.GetAccessor:
                case FunctionWriterStyle.Method:
                    writer.write(": ");
                    this.returnType.writerFunction(writer);
                    break;
            }
        }
    }
    writerFunction = this.#writerFunction.bind(this);
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        yield* this.typeParameters.values();
        yield* this.parameters.values();
        if (this.restParameter)
            yield this.restParameter;
        if (typeof this.returnType === "object")
            yield this.returnType;
    }
}
_a$2 = FunctionTypeStructureImpl;
TypeStructureClassesMap$1.set(TypeStructureKind.Function, FunctionTypeStructureImpl);

/**
 * @example
 * `Foo["index"]`
 *
 * @see `ArrayTypeStructureImpl` for `boolean[]`
 * @see `MappedTypeStructureImpl` for `{ [key in keyof Foo]: boolean}`
 * @see `MemberedObjectTypeStructureImpl` for `{ [key: string]: boolean }`
 */
class IndexedAccessTypeStructureImpl extends TypeStructuresWithChildren {
    static clone(other) {
        return new IndexedAccessTypeStructureImpl(other.objectType, other.childTypes[0]);
    }
    kind = TypeStructureKind.IndexedAccess;
    objectType;
    childTypes;
    startToken = "[";
    joinChildrenToken = "";
    endToken = "]";
    maxChildCount = 1;
    constructor(objectType, indexType) {
        super();
        this.objectType = objectType;
        this.childTypes = [indexType];
        this.registerCallbackForTypeStructure();
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.IndexedAccess, IndexedAccessTypeStructureImpl);

// #endregion preamble
/** @example infer \<type\> (extends \<type\>)? */
class InferTypeStructureImpl extends TypeStructuresWithTypeParameters {
    kind = TypeStructureKind.Infer;
    typeParameter;
    constructor(typeParameter) {
        super();
        this.typeParameter = typeParameter;
        this.registerCallbackForTypeStructure();
    }
    #writerFunction(writer) {
        writer.write("infer ");
        TypeStructuresWithTypeParameters.writeTypeParameter(this.typeParameter, writer, "extends");
    }
    writerFunction = this.#writerFunction.bind(this);
    static clone(other) {
        return new InferTypeStructureImpl(TypeParameterDeclarationImpl.clone(other.typeParameter));
    }
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        yield this.typeParameter;
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.Infer, InferTypeStructureImpl);

/** @example `Foo & Bar & ...` */
class IntersectionTypeStructureImpl extends TypeStructuresWithChildren {
    static clone(other) {
        return new IntersectionTypeStructureImpl(TypeStructureClassesMap$1.cloneArray(other.childTypes));
    }
    kind = TypeStructureKind.Intersection;
    objectType = null;
    childTypes;
    startToken = "";
    joinChildrenToken = " & ";
    endToken = "";
    maxChildCount = Infinity;
    constructor(childTypes = []) {
        super();
        this.childTypes = childTypes;
        this.registerCallbackForTypeStructure();
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.Intersection, IntersectionTypeStructureImpl);

// #endregion preamble
/**
 * Literals (boolean, number, string, void, etc.), without quotes, brackets, or
 * anything else around them.  Leaf nodes.
 */
class LiteralTypeStructureImpl extends TypeStructuresBase {
    static #cache = new Map();
    /**
     * Gets a singleton `LiteralTypeStructureImpl` for the given name.
     */
    static get(name) {
        if (!this.#cache.has(name)) {
            this.#cache.set(name, new LiteralTypeStructureImpl(name));
        }
        return this.#cache.get(name);
    }
    static clone(other) {
        return LiteralTypeStructureImpl.get(other.stringValue);
    }
    kind = TypeStructureKind.Literal;
    stringValue;
    constructor(literal) {
        super();
        this.stringValue = literal;
        Reflect.defineProperty(this, "stringValue", {
            writable: false,
            configurable: false,
        });
        this.registerCallbackForTypeStructure();
    }
    #writerFunction(writer) {
        writer.write(this.stringValue);
    }
    writerFunction = this.#writerFunction.bind(this);
}
TypeStructureClassesMap$1.set(TypeStructureKind.Literal, LiteralTypeStructureImpl);

// #endregion preamble
/**
 * `{ readonly [key in keyof Foo]: boolean }`
 *
 * @see `IndexedAccessTypedStructureImpl` for `Foo["index"]`
 * @see `ObjectLiteralTypedStructureImpl` for `{ [key: string]: boolean }`
 */
class MappedTypeStructureImpl extends TypeStructuresWithTypeParameters {
    kind = TypeStructureKind.Mapped;
    readonlyToken;
    parameter;
    asName = undefined;
    questionToken;
    type;
    constructor(parameter) {
        super();
        this.parameter = parameter;
        this.registerCallbackForTypeStructure();
    }
    #writerFunction(writer) {
        writer.block(() => {
            if (this.readonlyToken) {
                writer.write(this.readonlyToken + " ");
            }
            writer.write("[");
            TypeStructuresWithTypeParameters.writeTypeParameter(this.parameter, writer, "in");
            if (this.asName) {
                writer.write(" as ");
                this.asName.writerFunction(writer);
            }
            writer.write("]");
            if (this.questionToken) {
                writer.write(this.questionToken);
            }
            if (this.type) {
                writer.write(": ");
                this.type.writerFunction(writer);
            }
            writer.write(";");
        });
    }
    writerFunction = this.#writerFunction.bind(this);
    static clone(other) {
        const clone = new MappedTypeStructureImpl(TypeParameterDeclarationImpl.clone(other.parameter));
        if (other.asName) {
            clone.asName = TypeStructureClassesMap$1.clone(other.asName);
        }
        if (other.type) {
            clone.type = TypeStructureClassesMap$1.clone(other.type);
        }
        clone.readonlyToken = other.readonlyToken;
        clone.questionToken = other.questionToken;
        return clone;
    }
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        yield this.parameter;
        if (typeof this.asName === "object")
            yield this.asName;
        if (typeof this.type === "object")
            yield this.type;
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.Mapped, MappedTypeStructureImpl);

/**
 * ```typescript
 * {
 *    (callSignatureArgument) => string;
 *    new (constructSignatureArgument) => ClassName;
 *    get getterName(): symbol;
 *    [indexSignatureKey: string]: boolean;
 *    property: number;
 *    method(): void;
 *    set setterName(value: symbol);
 * }
 * ```
 *
 * @see `MappedTypeStructureImpl` for `{ readonly [key in keyof Foo]: boolean }`
 */
class MemberedObjectTypeStructureImpl extends TypeStructuresBase {
    static clone(other) {
        const membered = new MemberedObjectTypeStructureImpl();
        membered.callSignatures.push(...other.callSignatures.map((signature) => CallSignatureDeclarationImpl.clone(signature)));
        membered.constructSignatures.push(...other.constructSignatures.map((signature) => ConstructSignatureDeclarationImpl.clone(signature)));
        membered.getAccessors.push(...other.getAccessors.map((accessor) => GetAccessorDeclarationImpl.clone(accessor)));
        membered.indexSignatures.push(...other.indexSignatures.map((signature) => IndexSignatureDeclarationImpl.clone(signature)));
        membered.properties.push(...other.properties.map((signature) => PropertySignatureImpl.clone(signature)));
        membered.methods.push(...other.methods.map((signature) => MethodSignatureImpl.clone(signature)));
        membered.setAccessors.push(...other.setAccessors.map((accessor) => SetAccessorDeclarationImpl.clone(accessor)));
        return membered;
    }
    kind = TypeStructureKind.MemberedObject;
    callSignatures = [];
    constructSignatures = [];
    getAccessors = [];
    indexSignatures = [];
    methods = [];
    properties = [];
    setAccessors = [];
    constructor() {
        super();
        this.registerCallbackForTypeStructure();
    }
    #writerFunction(writer) {
        Writers.objectType(this)(writer);
    }
    writerFunction = this.#writerFunction.bind(this);
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        yield* this.callSignatures.values();
        yield* this.constructSignatures.values();
        yield* this.getAccessors.values();
        yield* this.indexSignatures.values();
        yield* this.methods.values();
        yield* this.properties.values();
        yield* this.setAccessors.values();
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.MemberedObject, MemberedObjectTypeStructureImpl);

// #endregion preamble
/** Just a parameter name and type for a `FunctionTypeStructureImpl`. */
class ParameterTypeStructureImpl extends TypeStructuresBase {
    static clone(other) {
        let typeClone;
        if (other.typeStructure)
            typeClone = TypeStructureClassesMap$1.clone(other.typeStructure);
        return new ParameterTypeStructureImpl(other.name, typeClone);
    }
    kind = TypeStructureKind.Parameter;
    writerFunction = this.#writerFunction.bind(this);
    name;
    typeStructure;
    constructor(name, typeStructure) {
        super();
        this.name = name;
        this.typeStructure = typeStructure;
        this.registerCallbackForTypeStructure();
    }
    #writerFunction(writer) {
        writer.write(this.name);
        if (this.typeStructure) {
            writer.write(": ");
            this.typeStructure.writerFunction(writer);
        }
    }
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        if (typeof this.typeStructure === "object")
            yield this.typeStructure;
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.Parameter, ParameterTypeStructureImpl);

/** Wrap the child type in parentheses. */
class ParenthesesTypeStructureImpl extends TypeStructuresWithChildren {
    static clone(other) {
        return new ParenthesesTypeStructureImpl(other.childTypes[0]);
    }
    kind = TypeStructureKind.Parentheses;
    objectType = null;
    childTypes;
    startToken = "(";
    joinChildrenToken = "";
    endToken = ")";
    maxChildCount = 1;
    constructor(childType) {
        super();
        this.childTypes = [childType];
        this.registerCallbackForTypeStructure();
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.Parentheses, ParenthesesTypeStructureImpl);

/** `("..." | "keyof" | "typeof" | "readonly" | "unique")[]` (object type) */
class PrefixOperatorsTypeStructureImpl extends TypeStructuresBase {
    static clone(other) {
        return new PrefixOperatorsTypeStructureImpl(other.operators, TypeStructureClassesMap$1.clone(other.objectType));
    }
    kind = TypeStructureKind.PrefixOperators;
    operators;
    objectType;
    constructor(operators, objectType) {
        super();
        this.operators = operators.slice();
        this.objectType = objectType;
        this.registerCallbackForTypeStructure();
    }
    #writerFunction(writer) {
        if (this.operators.length) {
            writer.write(this.operators.map((op) => (op === "..." ? op : op + " ")).join(""));
        }
        this.objectType.writerFunction(writer);
    }
    writerFunction = this.#writerFunction.bind(this);
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        if (typeof this.objectType === "object")
            yield this.objectType;
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.PrefixOperators, PrefixOperatorsTypeStructureImpl);

/** @example `Foo.bar.baz...` */
class QualifiedNameTypeStructureImpl extends TypeStructuresBase {
    static clone(other) {
        return new QualifiedNameTypeStructureImpl(other.childTypes.slice());
    }
    kind = TypeStructureKind.QualifiedName;
    childTypes;
    constructor(childTypes = []) {
        super();
        this.childTypes = childTypes;
        this.registerCallbackForTypeStructure();
    }
    #writerFunction(writer) {
        writer.write(this.childTypes.join("."));
    }
    writerFunction = this.#writerFunction.bind(this);
}
TypeStructureClassesMap$1.set(TypeStructureKind.QualifiedName, QualifiedNameTypeStructureImpl);

// #endregion preamble
/** Strings, encased in double quotes.  Leaf nodes. */
class StringTypeStructureImpl extends TypeStructuresBase {
    static #cache = new Map();
    /**
     * Gets a singleton `StringTypeStructureImpl` for the given name.
     */
    static get(name) {
        if (!this.#cache.has(name)) {
            this.#cache.set(name, new StringTypeStructureImpl(name));
        }
        return this.#cache.get(name);
    }
    static clone(other) {
        return StringTypeStructureImpl.get(other.stringValue);
    }
    kind = TypeStructureKind.String;
    stringValue;
    constructor(literal) {
        super();
        this.stringValue = literal;
        Reflect.defineProperty(this, "stringValue", {
            writable: false,
            configurable: false,
        });
        this.registerCallbackForTypeStructure();
    }
    #writerFunction(writer) {
        writer.quote(this.stringValue);
    }
    writerFunction = this.#writerFunction.bind(this);
}
TypeStructureClassesMap$1.set(TypeStructureKind.String, StringTypeStructureImpl);

/** `one${"A" | "B"}two${"C" | "D"}three` */
class TemplateLiteralTypeStructureImpl extends TypeStructuresBase {
    static clone(other) {
        const spans = other.spans.map((span) => [
            TypeStructureClassesMap$1.clone(span[0]),
            span[1],
        ]);
        return new TemplateLiteralTypeStructureImpl(other.head, spans);
    }
    kind = TypeStructureKind.TemplateLiteral;
    writerFunction = this.#writerFunction.bind(this);
    head;
    spans;
    constructor(head, spans) {
        super();
        this.head = head;
        this.spans = spans;
        this.registerCallbackForTypeStructure();
    }
    #writerFunction(writer) {
        TypeStructuresBase.pairedWrite(writer, "`", "`", false, false, () => {
            writer.write(this.head);
            this.spans.forEach((span) => {
                TypeStructuresBase.pairedWrite(writer, "${", "}", false, false, () => span[0].writerFunction(writer));
                writer.write(span[1]);
            });
        });
    }
    /** @internal */
    *[STRUCTURE_AND_TYPES_CHILDREN]() {
        yield* super[STRUCTURE_AND_TYPES_CHILDREN]();
        for (const span of this.spans) {
            const type = span[0];
            if (typeof type === "object")
                yield type;
        }
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.TemplateLiteral, TemplateLiteralTypeStructureImpl);

/**
 * @example
 * `[number, boolean]`
 *
 * @see `ArrayTypeStructureImpl` for `boolean[]`
 * @see `IndexedAccessTypeStructureImpl` for `Foo["index"]`
 */
class TupleTypeStructureImpl extends TypeStructuresWithChildren {
    static clone(other) {
        return new TupleTypeStructureImpl(TypeStructureClassesMap$1.cloneArray(other.childTypes));
    }
    kind = TypeStructureKind.Tuple;
    objectType = null;
    childTypes;
    startToken = "[";
    joinChildrenToken = ", ";
    endToken = "]";
    maxChildCount = Infinity;
    constructor(childTypes = []) {
        super();
        this.childTypes = childTypes;
        this.registerCallbackForTypeStructure();
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.Tuple, TupleTypeStructureImpl);

/**
 * This resolves type parameters, as opposed to defining them.
 *
 * @example
 * `Pick<NumberStringType, "repeatForward">`
 *
 * @see `TypeParameterDeclarationImpl` for `Type<Foo extends object>`
 */
class TypeArgumentedTypeStructureImpl extends TypeStructuresWithChildren {
    static clone(other) {
        return new TypeArgumentedTypeStructureImpl(TypeStructureClassesMap$1.clone(other.objectType), TypeStructureClassesMap$1.cloneArray(other.childTypes));
    }
    kind = TypeStructureKind.TypeArgumented;
    objectType;
    childTypes;
    startToken = "<";
    joinChildrenToken = ", ";
    endToken = ">";
    maxChildCount = Infinity;
    constructor(objectType, childTypes = []) {
        super();
        this.objectType = objectType;
        this.childTypes = childTypes;
        this.registerCallbackForTypeStructure();
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.TypeArgumented, TypeArgumentedTypeStructureImpl);

/** @example `Foo | Bar | ...` */
class UnionTypeStructureImpl extends TypeStructuresWithChildren {
    static clone(other) {
        return new UnionTypeStructureImpl(TypeStructureClassesMap$1.cloneArray(other.childTypes));
    }
    kind = TypeStructureKind.Union;
    objectType = null;
    childTypes;
    startToken = "";
    joinChildrenToken = " | ";
    endToken = "";
    maxChildCount = Infinity;
    constructor(childTypes = []) {
        super();
        this.childTypes = childTypes;
        this.registerCallbackForTypeStructure();
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.Union, UnionTypeStructureImpl);

// #endregion preamble
/** Wrappers for writer functions from external sources.  Leaf nodes. */
class WriterTypeStructureImpl extends TypeStructuresBase {
    static clone(other) {
        return new WriterTypeStructureImpl(other.writerFunction);
    }
    kind = TypeStructureKind.Writer;
    writerFunction;
    constructor(writer) {
        super();
        this.writerFunction = writer;
        Reflect.defineProperty(this, "writerFunction", {
            writable: false,
            configurable: false,
        });
        this.registerCallbackForTypeStructure();
    }
}
TypeStructureClassesMap$1.set(TypeStructureKind.Writer, WriterTypeStructureImpl);

/**
 * This is a map for specifying statements across several class members for a single class field.
 *
 * For example, a field may require statements for:
 * - defining a getter and/or a setter
 * - initializing in a constructor
 * - implementing a .toJSON() method
 *
 * The field name specifies which field the statements are about.
 * The statement group specifies where the statements go (what method, or an initializer).
 *
 * Special field keys:
 * ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL:
 *   These statements will appear at the head of the statement block.
 * ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN:
 *   These statements will appear at the tail of the statement block.
 *
 * Special statement group keys:
 * ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY:
 *   This represents an initializer for a property, or a value reference for a getter or setter.
 *   Field keys will have `get ` or `set ` stripped from them for this group key.
 *   Statement arrays for this group key should contain exactly one statement, and should be just a string.
 *
 * @example
 * ```typescript
 * map.set("foo", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, ['this.#foo.value']);
 * map.set("foo", "toJSON", ["rv.foo = this.foo;"]);
 * // ...
 * map.set(ClassFieldsStatementsMap.FIELD_HEAD_SUPER_CALL, "toJSON", ["const rv = super.toJSON();"]);
 * map.set(ClassFieldsStatementsMap.FIELD_TAIL_FINAL_RETURN, "toJSON", ["return rv;"]);
 *
 * Array.from(map.groupStatementsMap("toJSON")!.values())
 * // [["const rv = super.toJSON();"], ["rv.foo = this.foo;"], ["return rv;"]];
 * ```
 */
class ClassFieldStatementsMap {
    static normalizeKeys(fieldName, statementGroup) {
        if (statementGroup === ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY) {
            fieldName = fieldName.replace(/\b[gs]et /, "");
        }
        return [fieldName, statementGroup];
    }
    static #hashKey(fieldName, statementGroup) {
        return JSON.stringify({ fieldName, statementGroup });
    }
    static #parseKey(key) {
        return JSON.parse(key);
    }
    /** A special field name for the start of a function. */
    static FIELD_HEAD_SUPER_CALL = "(super call)";
    /** A special field name for the end of a function. */
    static FIELD_TAIL_FINAL_RETURN = "(final return)";
    static GROUP_INITIALIZER_OR_PROPERTY = "(initializer or property reference)";
    /** A convenience sorting function for fields. */
    static fieldComparator(a, b) {
        if (a === this.FIELD_HEAD_SUPER_CALL || b === this.FIELD_TAIL_FINAL_RETURN)
            return -1;
        if (a === this.FIELD_TAIL_FINAL_RETURN || b === this.FIELD_HEAD_SUPER_CALL)
            return +1;
        return a.localeCompare(b);
    }
    #map = new Map();
    #statementGroupMap = new Map();
    purposeKey;
    regionName;
    isBlockStatement = false;
    constructor(iterable) {
        if (iterable) {
            for (const [fieldName, statementGroup, statements] of iterable) {
                this.set(fieldName, statementGroup, statements);
            }
        }
    }
    /**
     * The number of elements in this collection.
     * @returns The element count.
     */
    get size() {
        return this.#map.size;
    }
    /**
     * Clear the collection.
     */
    clear() {
        this.#map.clear();
        this.#statementGroupMap.clear();
    }
    /**
     * Delete an element from the collection by the given key sequence.
     *
     * @param fieldName - The class field name for the statements.
     * @param statementGroup - The statement group owning the statements.
     * @returns True if we found the statements and deleted it.
     */
    delete(fieldName, statementGroup) {
        [fieldName, statementGroup] = ClassFieldStatementsMap.normalizeKeys(fieldName, statementGroup);
        const rv = this.#map.delete(ClassFieldStatementsMap.#hashKey(fieldName, statementGroup));
        this.#statementGroupMap.get(statementGroup)?.delete(fieldName);
        return rv;
    }
    /**
     * Yield the key-statements tuples of the collection.
     */
    *entries() {
        const iterator = this.#map.entries();
        for (const [hashed, statements] of iterator) {
            const { fieldName, statementGroup } = ClassFieldStatementsMap.#parseKey(hashed);
            yield [fieldName, statementGroup, statements];
        }
    }
    /**
     * Iterate over the keys and statementss.
     * @param __callback__ - A function to invoke for each iteration.
     * @param __thisArg__ -  statements to use as this when executing callback.
     */
    forEach(__callback__, __thisArg__) {
        this.#map.forEach((statements, hashed) => {
            const { fieldName, statementGroup } = ClassFieldStatementsMap.#parseKey(hashed);
            __callback__.apply(__thisArg__, [
                statements,
                fieldName,
                statementGroup,
                this,
            ]);
        });
    }
    /**
     * Get a statements for a key set.
     *
     * @param fieldName - The class field name for the statements.
     * @param statementGroup - The statement group owning the statements.
     * @returns The statements.  Undefined if it isn't in the collection.
     */
    get(fieldName, statementGroup) {
        [fieldName, statementGroup] = ClassFieldStatementsMap.normalizeKeys(fieldName, statementGroup);
        return this.#map.get(ClassFieldStatementsMap.#hashKey(fieldName, statementGroup));
    }
    /**
     * Report if the collection has a statements for a key set.
     *
     * @param fieldName - The class field name for the statements.
     * @param statementGroup - The statement group owning the statements.
     * @returns True if the key set refers to a statements in the collection.
     */
    has(fieldName, statementGroup) {
        [fieldName, statementGroup] = ClassFieldStatementsMap.normalizeKeys(fieldName, statementGroup);
        return this.#map.has(ClassFieldStatementsMap.#hashKey(fieldName, statementGroup));
    }
    /**
     * Yield the key sets of the collection.
     */
    *keys() {
        const iterator = this.#map.keys();
        for (const hashed of iterator) {
            const { fieldName, statementGroup } = ClassFieldStatementsMap.#parseKey(hashed);
            yield [fieldName, statementGroup];
        }
    }
    /**
     * Set a statements for a key set.
     *
     * @param fieldName - The class field name for the statements.
     * @param statementGroup - The statement group owning the statements.
     * @param statements - The statements.
     * @returns This collection.
     */
    set(fieldName, statementGroup, statements) {
        [fieldName, statementGroup] = ClassFieldStatementsMap.normalizeKeys(fieldName, statementGroup);
        this.#map.set(ClassFieldStatementsMap.#hashKey(fieldName, statementGroup), statements);
        let subMap = this.#statementGroupMap.get(statementGroup);
        if (!subMap) {
            subMap = new Map();
            this.#statementGroupMap.set(statementGroup, subMap);
        }
        subMap.set(fieldName, statements);
        return this;
    }
    /**
     * Yield the statementss of the collection.
     */
    values() {
        return this.#map.values();
    }
    [Symbol.iterator]() {
        return this.entries();
    }
    [Symbol.toStringTag] = "ClassFieldStatementsMap";
    groupKeys() {
        return Array.from(this.#statementGroupMap.keys());
    }
    /**
     * Get the current set of statements for each statement group, sorted by field name.
     * @param statementGroup - The statement group owning the statements.
     */
    groupStatementsMap(statementGroup) {
        const iterator = this.#statementGroupMap.get(statementGroup)?.entries();
        if (!iterator)
            return undefined;
        const entries = Array.from(iterator);
        entries.sort((a, b) => ClassFieldStatementsMap.fieldComparator(a[0], b[0]));
        //TODO: try wrapping all in one WriterFunction?  May impact initializers.
        if (this.isBlockStatement) {
            entries.unshift(["(isBlock head)", ["{"]]);
            entries.push(["(isBlock tail)", ["}"]]);
        }
        if (this.regionName) {
            entries.unshift(["(regionName head)", [`//#region ${this.regionName}`]]);
            entries.push(["(regionName tail)", [`//#endregion ${this.regionName}`]]);
        }
        return new Map(entries);
    }
}

var _a$1;
/**
 * A map for class methods, properties, accessors and a constructor.  This doesn't
 * replace `ClassDeclarationImpl`, rather, it _feeds_ `ClassDeclarationImpl`.
 *
 * @example
 *
 * const map = new ClassMembersMap;
 * const foo = new PropertyDeclarationImpl(false, "foo");
 * map.addMembers([foo]);
 * // ...
 * const classDecl = new ClassDeclarationImpl;
 * classDecl.name = "FooClass";
 * map.moveMembersToClass(classDecl);
 * // classDecl.properties === [foo];
 */
class ClassMembersMap extends Map {
    /**
     * Get a map key from a potential class member.
     * @param member - the class member
     */
    static keyFromMember(member) {
        if (member.kind === StructureKind.Constructor)
            return "constructor";
        return this.keyFromName(member.kind, member.isStatic, member.name);
    }
    /**
     * @param kind - the structure kind.
     * @param isStatic - true if the class member should be static.
     * @param name - the name of the class member.
     * @returns the map key to use.
     */
    static keyFromName(kind, isStatic, name) {
        if (kind === StructureKind.Constructor)
            return "constructor";
        let rv = "";
        if (isStatic)
            rv = "static ";
        if (kind === StructureKind.GetAccessor)
            rv += "get ";
        else if (kind === StructureKind.SetAccessor)
            rv += "set ";
        rv += name;
        return rv;
    }
    /**
     * Create a `ClassMembersMap` from a class declaration.
     * @param classDecl - the class declaration.
     * @returns the class members map.
     */
    static fromClassDeclaration(classDecl) {
        const map = new _a$1();
        const members = [
            ...classDecl.ctors,
            ...classDecl.getAccessors,
            ...classDecl.methods,
            ...classDecl.properties,
            ...classDecl.setAccessors,
        ];
        map.addMembers(members);
        return map;
    }
    /**
     * Creata an array of class members from an array of type members,
     * @param isStatic - true if the class members should be static, false if they should not be.
     * @param typeMembers - the type members to convert.
     * @param map - for defining which type member a class member comes from.
     */
    static convertTypeMembers(isStatic, typeMembers, map) {
        return typeMembers.map((typeMember) => _a$1.#convertTypeMemberToClassMember(isStatic, typeMember, map));
    }
    static #convertTypeMemberToClassMember(isStatic, typeMember, map) {
        let classMember;
        switch (typeMember.kind) {
            case StructureKind.GetAccessor: {
                classMember = GetAccessorDeclarationImpl.clone(typeMember);
                classMember.isStatic = isStatic;
                break;
            }
            case StructureKind.SetAccessor: {
                classMember = SetAccessorDeclarationImpl.clone(typeMember);
                classMember.isStatic = isStatic;
                break;
            }
            case StructureKind.MethodSignature:
                classMember = MethodDeclarationImpl.fromSignature(isStatic, typeMember);
                break;
            case StructureKind.PropertySignature:
                classMember = PropertyDeclarationImpl.fromSignature(isStatic, typeMember);
                break;
        }
        if (map)
            map.set(classMember, typeMember);
        return classMember;
    }
    /**
     * Add class members as values of this map, using standard keys.
     *
     * @param members - the class members to add.
     */
    addMembers(members) {
        members.forEach((member) => {
            this.set(_a$1.keyFromMember(member), member);
        });
    }
    /**
     * Get class members of a particular kind.
     *
     * @param kind - the structure kind to get.
     * @returns all current members of that kind.
     */
    arrayOfKind(kind) {
        let items = Array.from(this.values());
        items = items.filter((item) => item.kind === kind);
        return items;
    }
    /** Get a clone of this map. */
    clone() {
        let members = Array.from(this.values());
        members = members.map((member) => StructuresClassesMap.clone(member));
        const newMap = new _a$1();
        newMap.addMembers(members);
        return newMap;
    }
    /**
     * Convert get and/or set accessors to a property.  This may be lossy, but we try to be faithful.
     * @param isStatic - true if the property is static (and the accessors should be)
     * @param name - the property name
     */
    convertAccessorsToProperty(isStatic, name) {
        const getter = this.getAsKind(StructureKind.GetAccessor, isStatic, name);
        const setter = this.getAsKind(StructureKind.SetAccessor, isStatic, name);
        if (!getter && !setter) {
            throw new Error((isStatic ? "static " : "") + name + " accessors not found!");
        }
        if (getter?.decorators.length ?? setter?.decorators.length) {
            throw new Error("accessors have decorators, converting to property decorators is not yet supported");
        }
        const prop = new PropertyDeclarationImpl(isStatic, getter?.name ?? setter.name);
        // This is a merge operation: prefer getter fields over setter fields
        const docs = getter?.docs ?? setter.docs;
        if (docs) {
            prop.docs.push(...cloneStructureOrStringArray(docs, StructureKind.JSDoc));
        }
        prop.leadingTrivia.push(...(getter?.leadingTrivia ?? setter.leadingTrivia));
        prop.scope = getter?.scope ?? setter?.scope;
        prop.trailingTrivia.push(...(getter?.leadingTrivia ?? setter.leadingTrivia));
        if (getter?.returnTypeStructure) {
            prop.typeStructure = TypeStructureClassesMap$1.clone(getter.returnTypeStructure);
        }
        else if (setter) {
            const setterParam = setter.parameters[0];
            if (setterParam.typeStructure) {
                prop.typeStructure = TypeStructureClassesMap$1.clone(setterParam.typeStructure);
            }
        }
        this.addMembers([prop]);
        if (getter) {
            this.delete(_a$1.keyFromMember(getter));
        }
        if (setter) {
            this.delete(_a$1.keyFromMember(setter));
        }
    }
    /**
     * Convert a property to get and/or set accessors.  This may be lossy, but we try to be faithful.
     * @param isStatic - true if the property is static (and the accessors should be)
     * @param name - the property name
     * @param toGetter - true if the caller wants a getter
     * @param toSetter - true if the caller wants a setter
     */
    convertPropertyToAccessors(isStatic, name, toGetter, toSetter) {
        if (!toGetter && !toSetter)
            throw new Error("You must request either a get accessor or a set accessor!");
        const prop = this.getAsKind(StructureKind.Property, isStatic, name);
        if (!prop) {
            throw new Error((isStatic ? "static " : "") + name + " property not found!");
        }
        if (prop.decorators.length) {
            throw new Error("property has decorators, converting to accessor decorators is not yet supported");
        }
        if (toGetter) {
            const getter = new GetAccessorDeclarationImpl(prop.isStatic, prop.name, prop.typeStructure);
            if (prop.docs) {
                getter.docs.push(...cloneStructureOrStringArray(prop.docs, StructureKind.JSDoc));
            }
            if (prop.isAbstract) {
                getter.isAbstract = true;
            }
            getter.leadingTrivia.push(...prop.leadingTrivia);
            getter.scope = prop.scope;
            getter.trailingTrivia.push(...prop.trailingTrivia);
            this.addMembers([getter]);
        }
        if (toSetter) {
            const param = new ParameterDeclarationImpl("value");
            if (prop.typeStructure)
                param.typeStructure = TypeStructureClassesMap$1.clone(prop.typeStructure);
            const setter = new SetAccessorDeclarationImpl(prop.isStatic, prop.name, param);
            if (prop.docs) {
                setter.docs.push(...cloneStructureOrStringArray(prop.docs, StructureKind.JSDoc));
            }
            if (prop.isAbstract) {
                setter.isAbstract = true;
            }
            setter.leadingTrivia.push(...prop.leadingTrivia);
            setter.scope = prop.scope;
            setter.trailingTrivia.push(...prop.trailingTrivia);
            this.addMembers([setter]);
        }
        this.delete(_a$1.keyFromMember(prop));
    }
    /**
     * A typed call to `this.get()` for a given kind.
     * @param kind - the structure kind.
     * @param isStatic - true if the member is static.
     * @param name - the name of the member.
     * @returns - the class member, as the right type, or undefined if the wrong type.
     *
     * @see `ClassMembersMap::keyFromName`
     */
    getAsKind(kind, isStatic, name) {
        const key = _a$1.keyFromName(kind, isStatic, name);
        const rv = this.get(key);
        if (rv?.kind === kind)
            return rv;
        return undefined;
    }
    /**
     * Move class members from this map to a class declaration, and clear this map.
     * @param classSettings - a dictionary of optional `ClassDeclarationStructure` properties which this cannot otherwise cover.
     * @returns the new class declaration.
     */
    moveMembersToClass(classDecl) {
        this.#validateSettersHaveOneArgumentEach();
        this.forEach((member) => this.#moveMemberToClass(classDecl, member));
        this.clear();
        return classDecl;
    }
    #moveMemberToClass(classDecl, member) {
        if (member.kind !== StructureKind.Constructor && member.isAbstract)
            classDecl.isAbstract = true;
        switch (member.kind) {
            case StructureKind.Constructor:
                classDecl.ctors.push(member);
                return;
            case StructureKind.Property:
                classDecl.properties.push(member);
                return;
            case StructureKind.GetAccessor:
                classDecl.getAccessors.push(member);
                return;
            case StructureKind.SetAccessor:
                classDecl.setAccessors.push(member);
                return;
            case StructureKind.Method:
                classDecl.methods.push(member);
                return;
            default:
                throw new Error("unreachable");
        }
    }
    /**
     * Move statements from a sequence of statement maps to the class members.
     * @param statementsMaps - the statements to apply to each member, ordered by purpose.
     */
    moveStatementsToMembers(statementsMaps) {
        this.#validateSettersHaveOneArgumentEach();
        this.forEach((member) => this.#moveStatementToMember(member, statementsMaps));
    }
    #moveStatementToMember(member, statementsMaps) {
        switch (member.kind) {
            case StructureKind.Constructor:
                statementsMaps.forEach((map) => this.#addStatementsToConstructor(member, map));
                return;
            case StructureKind.Property:
                statementsMaps.forEach((map) => this.#addPropertyInitializer(member, map));
                return;
            case StructureKind.GetAccessor:
                statementsMaps.forEach((map) => this.#addStatementsToGetter(member, map));
                return;
            case StructureKind.SetAccessor:
                statementsMaps.forEach((map) => this.#addStatementsToSetter(member, map));
                return;
            case StructureKind.Method:
                statementsMaps.forEach((map) => this.#addStatementsToMethod(member, map));
                return;
            default:
                throw new Error("unreachable");
        }
    }
    #validateSettersHaveOneArgumentEach() {
        const setters = this.arrayOfKind(StructureKind.SetAccessor);
        const missedNames = [];
        setters.forEach((setter) => {
            if (setter.parameters.length !== 1) {
                missedNames.push(setter.name);
            }
        });
        if (missedNames.length > 0) {
            throw new Error("The following setters do not have exactly one parameter: " +
                missedNames.join(", "));
        }
    }
    #addStatementsToConstructor(member, statementsMap) {
        const statementsDictionary = statementsMap.groupStatementsMap(_a$1.keyFromMember(member));
        if (statementsDictionary) {
            const statements = Array.from(statementsDictionary.values());
            member.statements.push(...statements.flat());
        }
    }
    #addPropertyInitializer(member, statementsMap) {
        if (member.isAbstract)
            return;
        const statementsDictionary = statementsMap.groupStatementsMap(ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY);
        if (!statementsDictionary) {
            return;
        }
        const initializer = statementsDictionary.get(_a$1.keyFromMember(member));
        if (!initializer)
            return;
        if (initializer.length === 1 && typeof initializer[0] !== "object") {
            member.initializer = initializer[0];
            return;
        }
        throw new Error("initializer cannot be more than one statement for property " +
            member.name);
    }
    #addStatementsToGetter(member, statementsMap) {
        if (member.isAbstract)
            return;
        const groupName = _a$1.keyFromMember(member);
        let statementsDictionary = statementsMap.groupStatementsMap(ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY);
        if (statementsDictionary) {
            const initializer = statementsDictionary.get(groupName.replace("get ", ""));
            if (initializer && initializer.length > 0) {
                member.statements.push(`return ${initializer.join(" ")};`);
                return;
            }
        }
        statementsDictionary = statementsMap.groupStatementsMap(groupName);
        if (statementsDictionary) {
            const statementsArray = Array.from(statementsDictionary.values()).flat();
            member.statements.push(...statementsArray);
        }
    }
    #addStatementsToSetter(member, statementsMap) {
        if (member.isAbstract)
            return;
        const groupName = _a$1.keyFromMember(member);
        let statementsDictionary = statementsMap.groupStatementsMap(ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY);
        if (statementsDictionary) {
            const initializer = statementsDictionary.get(groupName.replace("set ", ""));
            if (initializer && initializer.length > 0) {
                member.statements.push(`${initializer[0]} = ${member.parameters[0].name};`);
                return;
            }
        }
        statementsDictionary = statementsMap.groupStatementsMap(groupName);
        if (statementsDictionary) {
            const statementsArray = Array.from(statementsDictionary.values()).flat();
            member.statements.push(...statementsArray);
        }
    }
    #addStatementsToMethod(member, statementsMap) {
        if (member.isAbstract)
            return;
        const groupName = _a$1.keyFromMember(member);
        const statementsDictionary = statementsMap.groupStatementsMap(groupName);
        if (statementsDictionary) {
            const statements = Array.from(statementsDictionary.values());
            member.statements.push(...statements.flat());
        }
    }
}
_a$1 = ClassMembersMap;

// #region preamble
// #endregion preamble
/**
 * This manages export declarations and specifiers, for including in a source file.
 *
 * @example
 * ```typescript
 * publicExports.addExports({
 *   absolutePathToModule: path.join(distDir, "source/toolbox/ExportManager.ts"),
 *   exportNames: ["ExportManager"],
 *   isDefaultExport: true,
 *   isType: false,
 * });
 * // ...
 * sourceFile.statements.push(...publicExports.getDeclarations());
 * ```
 */
class ExportManager {
    static #compareDeclarations(a, b) {
        return a[0].localeCompare(b[0]);
    }
    static #compareSpecifiers(a, b) {
        return a.name.localeCompare(b.name);
    }
    /** Where the file will live on the file system. */
    absolutePathToExportFile;
    #pathToDeclarationMap = new DefaultMap();
    #declarationToNamesMap = new DefaultWeakMap();
    /**
     * @param absolutePathToExportFile - Where the file will live on the file system.
     */
    constructor(absolutePathToExportFile) {
        this.absolutePathToExportFile = absolutePathToExportFile;
    }
    /**
     * @param context - a description of the exports to add.
     */
    addExports(context) {
        const { pathToExportedModule, exportNames, isDefaultExport, isType } = context;
        if (!pathToExportedModule.endsWith(".ts"))
            throw new Error("path to module must end with .ts");
        if (isDefaultExport && exportNames.length !== 1) {
            throw new Error("at most one default export name");
        }
        const declaration = this.#pathToDeclarationMap.getDefault(pathToExportedModule, () => this.#buildDeclaration(pathToExportedModule));
        if (!isType && declaration.isTypeOnly) {
            declaration.namedExports.forEach((specifier) => {
                specifier.isTypeOnly = true;
            });
            declaration.isTypeOnly = false;
        }
        const specifiers = [];
        const namesMap = this.#declarationToNamesMap.getDefault(declaration, () => new Map());
        exportNames.forEach((exportName) => {
            let specifier = namesMap.get(exportName);
            if (specifier) {
                if (specifier.isTypeOnly && !isType) {
                    specifier.isTypeOnly = false;
                }
            }
            else {
                specifier = new ExportSpecifierImpl(exportName);
                if (isType && !declaration.isTypeOnly)
                    specifier.isTypeOnly = true;
                namesMap.set(exportName, specifier);
                specifiers.push(specifier);
            }
        });
        if (isDefaultExport) {
            specifiers[0].name = "default";
            specifiers[0].alias = exportNames[0];
        }
        declaration.namedExports.push(...specifiers);
    }
    #buildDeclaration(pathToExportedModule) {
        const decl = new ExportDeclarationImpl();
        decl.moduleSpecifier = path.relative(path.dirname(this.absolutePathToExportFile), pathToExportedModule.replace(/(\.d)?\.(m?)ts$/, ".$2js"));
        if (!decl.moduleSpecifier.startsWith("../"))
            decl.moduleSpecifier = "./" + decl.moduleSpecifier;
        decl.isTypeOnly = true;
        return decl;
    }
    /** Get the export declarations, sorted by path to file, then internally by specified export values. */
    getDeclarations() {
        const declarationEntries = Array.from(this.#pathToDeclarationMap.entries());
        declarationEntries.sort(ExportManager.#compareDeclarations);
        const declarations = declarationEntries.map((entry) => entry[1]);
        declarations.forEach((decl) => {
            decl.namedExports.sort(ExportManager.#compareSpecifiers);
        });
        return declarations;
    }
}

/*
export function forEachStructureChild<TStructure>(
  structure: Structures | ReadonlyArray<Structures>,
  callback: (child: Structures) => TStructure | void
): TStructure | undefined
*/
/**
 * Iterates over the children of a structure (or type structure), or the elements of an array of structures and type structures.
 * @param structureOrArray - Structure or array of structures to iterate over.
 * @param callback - Callback to do on each structure, until the callback returns a truthy result.
 * @returns the first truthy result from the callback.
 *
 * @see {@link https://ts-morph.com/manipulation/structures#codeforeachstructurechildcode}
 */
function forEachAugmentedStructureChild(structureOrArray, callback) {
    if (Array.isArray(structureOrArray)) {
        for (const element of structureOrArray) {
            const rv = callback(element);
            if (rv)
                return rv;
        }
        return;
    }
    const structureOrType = structureOrArray;
    if (structureOrType instanceof StructureBase) {
        const rv = forEachStructureChild(structureOrType, callback);
        if (rv)
            return rv;
    }
    const iterator = structureOrType[STRUCTURE_AND_TYPES_CHILDREN]();
    for (const child of iterator) {
        const rv = callback(child);
        if (rv)
            return rv;
    }
    return undefined;
}

/**
 * This manages import declarations and specifiers, for including in a source file.
 *
 * @example
 * ```typescript
 * importsManager.addImports({
 *   pathToImportedModule: "ts-morph",
 *   isPackageImport: true,
 *   importNames: ["Structure", "StructureKind"],
 *   isDefaultImport: false,
 *   isTypeOnly: true
 * });
 * // ...
 * sourceFile.statements.unshift(...importsManager.getDeclarations());
 * ```
 */
class ImportManager {
    static #compareDeclarations(a, b) {
        return a[0].localeCompare(b[0]);
    }
    static #compareSpecifiers(a, b) {
        return a.name.localeCompare(b.name);
    }
    /** Where the file will live on the file system. */
    absolutePathToModule;
    #declarationsMap = new Map();
    #knownSpecifiers = new Set();
    /**
     * @param absolutePathToModule - Where the file will live on the file system.
     */
    constructor(absolutePathToModule) {
        if (!absolutePathToModule.endsWith(".ts")) {
            throw new Error("path to module must end with .ts");
        }
        if (!path.isAbsolute(absolutePathToModule))
            throw new Error("path to module must be absolute");
        this.absolutePathToModule = path.normalize(absolutePathToModule);
    }
    /**
     * @param context - a description of the imports to add.
     */
    addImports(context) {
        const { isPackageImport, isDefaultImport, isTypeOnly } = context;
        let { pathToImportedModule } = context;
        if (!isPackageImport) {
            if (!pathToImportedModule.endsWith(".ts")) {
                throw new Error("path to module must end with .ts, or use isPackageImport: true to specify package import");
            }
            if (!isPackageImport && !path.isAbsolute(pathToImportedModule)) {
                throw new Error("path to module must be absolute, or use isPackageImport: true to specify package import");
            }
        }
        pathToImportedModule = path.normalize(pathToImportedModule.replace(/(\.d)?\.(m?)ts$/, ".$2js"));
        if (!isPackageImport) {
            pathToImportedModule = path.relative(path.dirname(this.absolutePathToModule), pathToImportedModule);
            if (!pathToImportedModule.startsWith("../"))
                pathToImportedModule = "./" + pathToImportedModule;
        }
        const importNames = context.importNames.filter((nameToImport) => !this.#knownSpecifiers.has(nameToImport));
        if (importNames.length === 0)
            return;
        let importDecl = this.#declarationsMap.get(pathToImportedModule);
        if (!importDecl) {
            importDecl = new ImportDeclarationImpl(pathToImportedModule);
            importDecl.isTypeOnly = true;
            this.#declarationsMap.set(pathToImportedModule, importDecl);
        }
        if (isDefaultImport) {
            if (importDecl.defaultImport) {
                throw new Error("You already have a default import.");
            }
            if (importNames.length !== 1) {
                throw new Error("There must be one import name for a default import!");
            }
            this.#moveTypeOnlyToSpecifiers(importDecl);
            importDecl.defaultImport = importNames[0];
        }
        else {
            if (!isTypeOnly) {
                this.#moveTypeOnlyToSpecifiers(importDecl);
            }
            importNames.forEach((nameToImport) => {
                const specifier = new ImportSpecifierImpl(nameToImport);
                if (isTypeOnly && !importDecl.isTypeOnly)
                    specifier.isTypeOnly = isTypeOnly;
                importDecl.namedImports.push(specifier);
                this.#knownSpecifiers.add(nameToImport);
            });
        }
    }
    #moveTypeOnlyToSpecifiers(importDecl) {
        if (!importDecl.isTypeOnly)
            return;
        importDecl.namedImports.forEach((namedImport) => {
            namedImport.isTypeOnly = true;
        });
        importDecl.isTypeOnly = false;
    }
    /** Get the import declarations, sorted by path to file, then internally by specified import values. */
    getDeclarations() {
        const entries = Array.from(this.#declarationsMap);
        entries.sort(ImportManager.#compareDeclarations);
        return entries.map((entry) => {
            entry[1].namedImports.sort(ImportManager.#compareSpecifiers);
            return entry[1];
        });
    }
}

/** Convert type members to a class members map, including statements. */
class MemberedTypeToClass {
    #aggregateStaticTypesMap = new TypeMembersMap$1();
    #aggregateTypeMembersMap = new TypeMembersMap$1();
    #classMemberToTypeMemberMap = new WeakMap();
    #memberKeyToClassMember = new Map();
    #classMembersMap;
    #classFieldStatementsByPurpose = new Map();
    #classConstructor = new ConstructorDeclarationImpl();
    #statementsGetter;
    #indexSignatureResolver;
    #isAbstractCallback;
    #isAsyncCallback;
    #isGeneratorCallback;
    #scopeCallback;
    /**
     * @param constructorArguments - parameters to define on the constructor.
     * @param statementsGetter - a callback to get statements for each individual statement purpose, field name and statement group name.
     */
    constructor(constructorArguments, statementsGetter) {
        this.#classConstructor.parameters.push(...constructorArguments);
        this.#statementsGetter = statementsGetter;
    }
    #requireNotStarted() {
        if (this.#classMembersMap)
            throw new Error("You have already called buildClassDeclaration()");
    }
    /**
     * An interface to get names which match an index signature's key name.
     */
    get indexSignatureResolver() {
        return this.#indexSignatureResolver;
    }
    set indexSignatureResolver(value) {
        this.#requireNotStarted();
        this.#indexSignatureResolver = value;
    }
    get isAbstractCallback() {
        return this.#isAbstractCallback;
    }
    set isAbstractCallback(value) {
        this.#requireNotStarted();
        this.#isAbstractCallback = value;
    }
    get isAsyncCallback() {
        return this.#isAsyncCallback;
    }
    set isAsyncCallback(value) {
        this.#requireNotStarted();
        this.#isAsyncCallback = value;
    }
    get isGeneratorCallback() {
        return this.#isGeneratorCallback;
    }
    set isGeneratorCallback(value) {
        this.#requireNotStarted();
        this.#isGeneratorCallback = value;
    }
    get scopeCallback() {
        return this.#scopeCallback;
    }
    set scopeCallback(value) {
        this.#requireNotStarted();
        this.#scopeCallback = value;
    }
    /**
     *
     * @param purposeKey - The purpose of the statmeent group (validation, preconditions, body, postconditions, etc.)
     * @param isBlockStatement - true if the statement block should be enclosed in curly braces.
     * @param regionName - an optional #region / #endregion comment name.
     *
     * Call this in the order of statement purpose groups you intend.
     */
    defineStatementsByPurpose(purposeKey, isBlockStatement, regionName) {
        this.#requireNotStarted();
        if (this.#classFieldStatementsByPurpose.has(purposeKey))
            throw new Error("You have already defined a statements purpose with the key: " +
                purposeKey);
        const statementsMap = new ClassFieldStatementsMap();
        this.#classFieldStatementsByPurpose.set(purposeKey, statementsMap);
        statementsMap.purposeKey = purposeKey;
        statementsMap.isBlockStatement = isBlockStatement;
        if (regionName) {
            statementsMap.regionName = regionName;
        }
    }
    //#region type members
    /**
     * Get the current type members in our cache.
     *
     * @internal This is for debugging and testing purposes only.
     */
    getCurrentTypeMembers(isStatic) {
        return Array.from(isStatic
            ? this.#aggregateStaticTypesMap.values()
            : this.#aggregateTypeMembersMap.values());
    }
    /**
     * Define a class member for a given type member (constructor, property, method, getter, setter).
     * @param isStatic - true if the class member is static.
     * @param member - the type member to convert to a class member.
     */
    addTypeMember(isStatic, member) {
        this.#requireNotStarted();
        const typeMembersMap = new TypeMembersMap$1([
            [TypeMembersMap$1.keyFromMember(member), member],
        ]);
        const temporaryTypeMembers = new TypeMembersMap$1();
        this.#importFromTypeMembers(isStatic, typeMembersMap, temporaryTypeMembers);
        this.#adoptTypeMembers(isStatic, temporaryTypeMembers);
    }
    /**
     * Define class members for a map of given type members (constructor, property, method, getter, setter).
     * @param isStatic - true if the class members are static.
     * @param membersMap - the type members map for conversion to class members.
     */
    importFromTypeMembersMap(isStatic, membersMap) {
        this.#requireNotStarted();
        const temporaryTypeMembers = new TypeMembersMap$1();
        this.#importFromTypeMembers(isStatic, membersMap, temporaryTypeMembers);
        this.#adoptTypeMembers(isStatic, temporaryTypeMembers);
    }
    /**
     * Define class members for a membered object type or interface.
     * @param isStatic - true if the class members are static.
     * @param membered - the interface or membered object type.
     */
    importFromMemberedType(isStatic, membered) {
        return this.importFromTypeMembersMap(isStatic, TypeMembersMap$1.fromMemberedObject(membered));
    }
    #importFromTypeMembers(isStatic, membersMap, temporaryTypeMembers) {
        for (const member of membersMap.values()) {
            this.#validateTypeMember(isStatic, member, temporaryTypeMembers);
        }
    }
    #validateTypeMember(isStatic, member, temporaryTypeMembers) {
        switch (member.kind) {
            case StructureKind.CallSignature:
                throw new Error("Call signatures are not allowed");
            case StructureKind.ConstructSignature:
                throw new Error("Construct signatures are not allowed");
            case StructureKind.IndexSignature: {
                if (isStatic) {
                    //TODO: rethink this.  Maybe this is doable via a `satisfies` statement.
                    throw new Error("index signatures cannot be static");
                }
                if (!this.#indexSignatureResolver) {
                    throw new Error("Index signature found, but no index signature resolver is available");
                }
                const names = this.#indexSignatureResolver.resolveIndexSignature(member);
                names.forEach((name) => {
                    if (this.#aggregateTypeMembersMap.has(name) ||
                        temporaryTypeMembers.has(name)) {
                        throw new Error(`Index signature resolver requested the name "${name}", but this field already exists.`);
                    }
                });
                temporaryTypeMembers.addMembers([member]);
                const newMembers = temporaryTypeMembers.resolveIndexSignature(member, names);
                newMembers.forEach((newMember) => temporaryTypeMembers.delete(TypeMembersMap$1.keyFromMember(newMember)));
                newMembers.forEach((newMember) => this.#validateTypeMember(isStatic, newMember, temporaryTypeMembers));
                return;
            }
            default: {
                const key = TypeMembersMap$1.keyFromMember(member);
                const aggregateMembers = isStatic
                    ? this.#aggregateStaticTypesMap
                    : this.#aggregateTypeMembersMap;
                if (aggregateMembers.has(key)) {
                    throw new Error(`You already have a class member with the key "${key}".`);
                }
                if (temporaryTypeMembers.has(key)) {
                    throw new Error(`You already have a class member with the key "${key}", possibly through an index signature resolution.`);
                }
                temporaryTypeMembers.addMembers([member]);
            }
        }
    }
    #adoptTypeMembers(isStatic, temporaryTypeMembers) {
        const map = isStatic
            ? this.#aggregateStaticTypesMap
            : this.#aggregateTypeMembersMap;
        map.addMembers(Array.from(temporaryTypeMembers.values()));
    }
    //#endregion type members
    //#region build the class members map
    /**
     * Convert cached type members to a ClassMembersMap, complete with statements.
     */
    buildClassMembersMap() {
        this.#requireNotStarted();
        this.#classMembersMap = new ClassMembersMap();
        const members = this.#addClassMembersToMap();
        const keyClassArray = this.#buildKeyClassArray(members);
        const errors = [];
        keyClassArray.forEach((keyClass) => {
            try {
                this.#callStatementGetter(keyClass);
            }
            catch (ex) {
                errors.push(ex instanceof Error ? ex : new Error(String(ex)));
            }
        });
        if (errors.length)
            throw new AggregateError(errors);
        this.#classMembersMap.moveStatementsToMembers(Array.from(this.#classFieldStatementsByPurpose.values()));
        if (this.#classConstructor.statements.length === 0) {
            this.#classMembersMap.delete(ClassMembersMap.keyFromMember(this.#classConstructor));
        }
        return this.#classMembersMap;
    }
    #addClassMembersToMap() {
        const staticTypeMembers = Array.from(this.#aggregateStaticTypesMap.values());
        const typeMembers = Array.from(this.#aggregateTypeMembersMap.values());
        const staticMembers = ClassMembersMap.convertTypeMembers(true, staticTypeMembers, this.#classMemberToTypeMemberMap);
        const classMembers = ClassMembersMap.convertTypeMembers(false, typeMembers, this.#classMemberToTypeMemberMap);
        const members = [
            ...staticMembers,
            this.#classConstructor,
            ...classMembers,
        ];
        this.#classMembersMap.addMembers(members);
        if (this.#isAbstractCallback) {
            classMembers.forEach((member) => {
                member.isAbstract = this.#isAbstractCallback.isAbstract(member.kind, member.name);
            });
        }
        if (this.#scopeCallback) {
            members.forEach((member) => {
                const [isStatic, name] = member.kind === StructureKind.Constructor
                    ? [false, "constructor"]
                    : [member.isStatic, member.name];
                member.scope = this.#scopeCallback.getScope(isStatic, member.kind, name);
            });
        }
        if (this.#isAsyncCallback ?? this.#isGeneratorCallback) {
            const methods = members.filter((member) => member.kind === StructureKind.Method);
            methods.forEach((method) => {
                if (this.#isAsyncCallback) {
                    method.isAsync = this.#isAsyncCallback.isAsync(method.isStatic, method.kind, method.name);
                }
                if (this.#isGeneratorCallback) {
                    method.isGenerator = this.#isGeneratorCallback.isGenerator(method.isStatic, method.kind, method.name);
                }
            });
        }
        return members;
    }
    #buildKeyClassArray(members) {
        const keyClassMap = new Map();
        const purposeKeys = Array.from(this.#classFieldStatementsByPurpose.keys());
        const membersByKind = this.#sortMembersByKind(members);
        membersByKind.properties.forEach((property) => this.#addPropertyInitializerKeys(keyClassMap, purposeKeys, property));
        let propertyNames = [
            ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL,
            ...membersByKind.properties.map((property) => ClassMembersMap.keyFromMember(property)),
            ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN,
        ];
        propertyNames = Array.from(new Set(propertyNames));
        this.#addStatementKeysForMethodOrCtor(this.#classConstructor, keyClassMap, purposeKeys, propertyNames);
        membersByKind.methods.forEach((method) => this.#addStatementKeysForMethodOrCtor(method, keyClassMap, purposeKeys, propertyNames));
        membersByKind.getAccessors.forEach((getter) => {
            this.#addAccessorInitializerKey(getter, keyClassMap, purposeKeys);
            this.#addStatementKeysForAccessor(getter, keyClassMap, purposeKeys, propertyNames);
        });
        membersByKind.setAccessors.forEach((setter) => {
            this.#addAccessorInitializerKey(setter, keyClassMap, purposeKeys);
            this.#addStatementKeysForAccessor(setter, keyClassMap, purposeKeys, propertyNames);
        });
        return Array.from(keyClassMap.values());
    }
    #sortMembersByKind(members) {
        const rv = {
            ctors: [],
            getAccessors: [],
            methods: [],
            properties: [],
            setAccessors: [],
        };
        members.forEach((member) => {
            switch (member.kind) {
                case StructureKind.Constructor:
                    rv.ctors.push(member);
                    return;
                case StructureKind.GetAccessor:
                    rv.getAccessors.push(member);
                    return;
                case StructureKind.Method:
                    rv.methods.push(member);
                    return;
                case StructureKind.Property:
                    rv.properties.push(member);
                    return;
                case StructureKind.SetAccessor:
                    rv.setAccessors.push(member);
                    return;
                default:
                    assert(false, "not reachable");
            }
        });
        return rv;
    }
    #addPropertyInitializerKeys(keyClassMap, purposeKeys, property) {
        if (property.isAbstract)
            return;
        const [formattedFieldName, formattedGroupName] = ClassFieldStatementsMap.normalizeKeys(ClassMembersMap.keyFromMember(property), ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY);
        if (!this.#memberKeyToClassMember.has(formattedFieldName))
            this.#memberKeyToClassMember.set(formattedFieldName, property);
        for (const purposeKey of purposeKeys) {
            this.#addKeyClass(formattedFieldName, formattedGroupName, purposeKey, keyClassMap);
        }
    }
    #addStatementKeysForMethodOrCtor(methodOrCtor, keyClassMap, purposeKeys, propertyNames) {
        if (methodOrCtor.kind === StructureKind.Method && methodOrCtor.isAbstract)
            return;
        const groupName = ClassMembersMap.keyFromMember(methodOrCtor);
        if (!this.#memberKeyToClassMember.has(groupName))
            this.#memberKeyToClassMember.set(groupName, methodOrCtor);
        for (const fieldName of propertyNames) {
            const [formattedFieldName, formattedGroupName] = ClassFieldStatementsMap.normalizeKeys(fieldName, groupName);
            for (const purposeKey of purposeKeys) {
                this.#addKeyClass(formattedFieldName, formattedGroupName, purposeKey, keyClassMap);
            }
        }
    }
    #addAccessorInitializerKey(accessor, keyClassMap, purposeKeys) {
        if (accessor.isAbstract)
            return;
        const accessorName = ClassMembersMap.keyFromMember(accessor).replace(/\b[gs]et /, "");
        if (!this.#memberKeyToClassMember.has(accessorName))
            this.#memberKeyToClassMember.set(accessorName, accessor);
        purposeKeys.forEach((purposeKey) => this.#addKeyClass(accessorName, ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, purposeKey, keyClassMap));
    }
    #addStatementKeysForAccessor(accessor, keyClassMap, purposeKeys, propertyNames) {
        if (accessor.isAbstract)
            return;
        const accessorName = ClassMembersMap.keyFromMember(accessor).replace(/\b[gs]et /, "");
        if (!this.#memberKeyToClassMember.has(accessorName))
            this.#memberKeyToClassMember.set(accessorName, accessor);
        for (const purposeKey of purposeKeys) {
            for (const propertyName of propertyNames) {
                this.#addKeyClass(propertyName, accessorName, purposeKey, keyClassMap);
            }
        }
    }
    #addKeyClass(fieldName, groupName, purposeKey, keyClassMap) {
        const compositeKey = JSON.stringify({ fieldName, groupName, purposeKey });
        if (keyClassMap.has(compositeKey))
            return;
        const fieldClassMember = this.#memberKeyToClassMember.get(fieldName);
        const groupClassMember = this.#memberKeyToClassMember.get(groupName);
        const fieldTypeMember = fieldClassMember
            ? this.#classMemberToTypeMemberMap.get(fieldClassMember)
            : undefined;
        const groupTypeMember = groupClassMember
            ? this.#classMemberToTypeMemberMap.get(groupClassMember)
            : undefined;
        const isFieldStatic = fieldClassMember && fieldClassMember.kind !== StructureKind.Constructor
            ? fieldClassMember.isStatic
            : false;
        const isGroupStatic = groupClassMember && groupClassMember.kind !== StructureKind.Constructor
            ? groupClassMember.isStatic
            : false;
        keyClassMap.set(compositeKey, new MemberedStatementsKeyClass(fieldName, groupName, purposeKey, fieldTypeMember ? [isFieldStatic, fieldTypeMember] : undefined, groupTypeMember ? [isGroupStatic, groupTypeMember] : undefined));
    }
    #callStatementGetter(keyClass) {
        const statementsArray = this.#statementsGetter.getStatements(keyClass);
        if (statementsArray.length === 0)
            return;
        const statementsMap = this.#classFieldStatementsByPurpose.get(keyClass.purpose);
        statementsMap.set(keyClass.fieldKey, keyClass.statementGroupKey, statementsArray.slice());
    }
}

var _a;
/**
 * A map for members of `InterfaceDeclarationImpl` and `MemberedObjectTypeStructureImpl`.  This
 * doesn't replace the structures, rather it _feeds_ them.
 *
 * @example
 *
 * const map = new TypeMembersMap;
 * const foo = new PropertySignatureImpl(false, "foo");
 * map.addMembers([foo]);
 * // ...
 * const interfaceDecl = new InterfaceDeclarationImpl("FooInterface");
 * map.moveMembersToType(interfaceDecl);
 * // interfaceDecl.properties === [foo];
 */
class TypeMembersMap extends Map {
    static #uniqueKey = new WeakMap();
    static #uniqueKeyCounter = 0;
    /**
     * Get a map key from a potential type member.
     * @param member - the type member
     */
    static keyFromMember(member) {
        let key = _a.#uniqueKey.get(member);
        if (key)
            return key;
        key = _a.#keyFromMember(member);
        _a.#uniqueKey.set(member, key);
        return key;
    }
    static #keyFromMember(member) {
        if (member.kind === StructureKind.ConstructSignature)
            return "constructor";
        if (member.kind === StructureKind.IndexSignature)
            return `(index ${_a.#uniqueKeyCounter++})`;
        if (member.kind === StructureKind.CallSignature)
            return `(callsignature ${_a.#uniqueKeyCounter++})`;
        return this.keyFromName(member.kind, member.name);
    }
    /**
     * @param kind - the structure kind.
     * @param name - the name of the type member.
     * @returns the map key to use.
     */
    static keyFromName(kind, name) {
        let rv = "";
        if (kind === StructureKind.GetAccessor)
            rv += "get ";
        else if (kind === StructureKind.SetAccessor)
            rv += "set ";
        rv += name;
        return rv;
    }
    /**
     * Create a `TypeMembersMap` from an interface or membered object.
     * @param membered - the membered object.
     * @returns the type members map.
     */
    static fromMemberedObject(membered) {
        const map = new _a();
        const members = [
            ...membered.callSignatures,
            ...membered.constructSignatures,
            ...membered.getAccessors,
            ...membered.indexSignatures,
            ...membered.methods,
            ...membered.properties,
            ...membered.setAccessors,
        ];
        map.addMembers(members);
        return map;
    }
    static #convertParameterFromTypeToImpl(source) {
        const impl = new ParameterDeclarationImpl(source.name);
        if (source.typeStructure)
            impl.typeStructure = TypeStructureClassesMap$1.clone(source.typeStructure);
        return impl;
    }
    /**
     * Add type members as values of this map, using standard keys.
     *
     * @param members - the type members to add.
     */
    addMembers(members) {
        members.forEach((member) => {
            this.set(_a.keyFromMember(member), member);
        });
    }
    /**
     * Get type members of a particular kind.
     *
     * @param kind - the structure kind to get.
     * @returns all current members of that kind.
     */
    arrayOfKind(kind) {
        let items = Array.from(this.values());
        items = items.filter((item) => item.kind === kind);
        return items;
    }
    /** Get a clone of this map. */
    clone() {
        let members = Array.from(this.values());
        members = members.map((member) => StructuresClassesMap.clone(member));
        const newMap = new _a();
        newMap.addMembers(members);
        return newMap;
    }
    /**
     * Convert get and/or set accessors to a property.  This may be lossy, but we try to be faithful.
     * @param name - the property name
     */
    convertAccessorsToProperty(name) {
        const getter = this.getAsKind(StructureKind.GetAccessor, name);
        const setter = this.getAsKind(StructureKind.SetAccessor, name);
        if (!getter && !setter) {
            throw new Error(name + " accessors not found!");
        }
        const prop = new PropertySignatureImpl(getter?.name ?? setter.name);
        // This is a merge operation: prefer getter fields over setter fields
        const docs = getter?.docs ?? setter.docs;
        if (docs) {
            prop.docs.push(...cloneStructureOrStringArray(docs, StructureKind.JSDoc));
        }
        prop.leadingTrivia.push(...(getter?.leadingTrivia ?? setter.leadingTrivia));
        prop.trailingTrivia.push(...(getter?.leadingTrivia ?? setter.leadingTrivia));
        if (getter?.returnTypeStructure) {
            prop.typeStructure = TypeStructureClassesMap$1.clone(getter.returnTypeStructure);
        }
        else if (setter) {
            const setterParam = setter.parameters[0];
            if (setterParam.typeStructure) {
                prop.typeStructure = TypeStructureClassesMap$1.clone(setterParam.typeStructure);
            }
        }
        this.addMembers([prop]);
        if (getter) {
            this.delete(_a.keyFromMember(getter));
        }
        if (setter) {
            this.delete(_a.keyFromMember(setter));
        }
    }
    /**
     * Convert a property signature to get and/or set accessors.  This may be lossy, but we try to be faithful.
     * @param name - the property name
     * @param toGetter - true if the caller wants a getter
     * @param toSetter - true if the caller wants a setter
     */
    convertPropertyToAccessors(name, toGetter, toSetter) {
        if (!toGetter && !toSetter)
            throw new Error("You must request either a get accessor or a set accessor!");
        const prop = this.getAsKind(StructureKind.PropertySignature, name);
        if (!prop) {
            throw new Error(name + " property not found!");
        }
        if (toGetter) {
            const getter = new GetAccessorDeclarationImpl(false, prop.name, prop.typeStructure);
            if (prop.docs) {
                getter.docs.push(...cloneStructureOrStringArray(prop.docs, StructureKind.JSDoc));
            }
            getter.leadingTrivia.push(...prop.leadingTrivia);
            getter.trailingTrivia.push(...prop.trailingTrivia);
            this.addMembers([getter]);
        }
        if (toSetter) {
            const param = new ParameterDeclarationImpl("value");
            if (prop.typeStructure)
                param.typeStructure = TypeStructureClassesMap$1.clone(prop.typeStructure);
            const setter = new SetAccessorDeclarationImpl(false, prop.name, param);
            if (prop.docs) {
                setter.docs.push(...cloneStructureOrStringArray(prop.docs, StructureKind.JSDoc));
            }
            setter.leadingTrivia.push(...prop.leadingTrivia);
            setter.trailingTrivia.push(...prop.trailingTrivia);
            this.addMembers([setter]);
        }
        this.delete(_a.keyFromMember(prop));
    }
    /**
     * A typed call to `this.get()` for a given kind.
     * @param kind - the structure kind.
     * @param name - the key to get.
     * @returns - the type member, as the right type, or undefined if the wrong type.
     *
     * @see `TypeMembersMap::keyFromName`
     */
    getAsKind(kind, name) {
        const key = _a.keyFromName(kind, name);
        const rv = this.get(key);
        if (rv?.kind === kind)
            return rv;
        return undefined;
    }
    /**
     * Move type members from this map to an interface or type literal, and clear this map.
     *
     * @param owner - the target interface or type literal declaration.
     */
    moveMembersToType(owner) {
        this.forEach((member) => this.#moveMemberToOwner(owner, member));
        this.clear();
    }
    #moveMemberToOwner(owner, member) {
        switch (member.kind) {
            case StructureKind.CallSignature:
                owner.callSignatures.push(member);
                return;
            case StructureKind.ConstructSignature:
                owner.constructSignatures.push(member);
                return;
            case StructureKind.GetAccessor:
                owner.getAccessors.push(member);
                return;
            case StructureKind.IndexSignature:
                owner.indexSignatures.push(member);
                return;
            case StructureKind.MethodSignature:
                owner.methods.push(member);
                return;
            case StructureKind.PropertySignature:
                owner.properties.push(member);
                return;
            case StructureKind.SetAccessor:
                owner.setAccessors.push(member);
                return;
            default:
                throw new Error("unreachable");
        }
    }
    /**
     * Replace an index signature with other methods/properties matching the signature's return type.
     *
     * It is up to you to ensure the names match the key type of the index signature.
     *
     * @param signature - the signature (which must be a member of this) to resolve.
     * @param names - the names to replace the signature's key with.
     */
    resolveIndexSignature(signature, names) {
        const indexKey = _a.keyFromMember(signature);
        if (!this.has(indexKey))
            throw new Error("index signature is not part of this");
        if (typeof signature.returnTypeStructure === "object" &&
            signature.returnTypeStructure?.kind === TypeStructureKind.Function &&
            !signature.isReadonly) {
            return this.#resolveIndexSignatureToMethods(signature, names, indexKey);
        }
        return this.#resolveIndexSignatureToProperties(signature, names, indexKey);
    }
    #resolveIndexSignatureToMethods(signature, names, indexKey) {
        const baseMethodSignature = new MethodSignatureImpl("");
        const { returnTypeStructure } = signature;
        assert(returnTypeStructure instanceof FunctionTypeStructureImpl, "how'd we get here?");
        returnTypeStructure.typeParameters.forEach((typeParam) => {
            baseMethodSignature.typeParameters.push(typeParam);
        });
        returnTypeStructure.parameters.forEach((param) => {
            baseMethodSignature.parameters.push(_a.#convertParameterFromTypeToImpl(param));
        });
        if (returnTypeStructure.restParameter) {
            const restParameter = _a.#convertParameterFromTypeToImpl(returnTypeStructure.restParameter);
            restParameter.isRestParameter = true;
            baseMethodSignature.parameters.push(restParameter);
        }
        if (returnTypeStructure.returnType)
            baseMethodSignature.returnTypeStructure = returnTypeStructure.returnType;
        const addedMembers = [];
        names.forEach((name) => {
            const methodSignature = MethodSignatureImpl.clone(baseMethodSignature);
            methodSignature.name = name;
            addedMembers.push(methodSignature);
        });
        this.addMembers(addedMembers);
        this.delete(indexKey);
        return addedMembers;
    }
    #resolveIndexSignatureToProperties(signature, names, indexKey) {
        const baseProp = new PropertySignatureImpl("");
        if (signature.isReadonly)
            baseProp.isReadonly = true;
        if (signature.returnTypeStructure)
            baseProp.typeStructure = signature.returnTypeStructure;
        const addedMembers = [];
        names.forEach((name) => {
            const prop = PropertySignatureImpl.clone(baseProp);
            prop.name = name;
            addedMembers.push(prop);
        });
        this.addMembers(addedMembers);
        this.delete(indexKey);
        return addedMembers;
    }
}
_a = TypeMembersMap;
var TypeMembersMap$1 = TypeMembersMap;

export { ArrayTypeStructureImpl, CallSignatureDeclarationImpl, ClassDeclarationImpl, ClassFieldStatementsMap, ClassMembersMap, ClassStaticBlockDeclarationImpl, ConditionalTypeStructureImpl, ConstructSignatureDeclarationImpl, ConstructorDeclarationImpl, ConstructorDeclarationOverloadImpl, DecoratorImpl, EnumDeclarationImpl, EnumMemberImpl, ExportAssignmentImpl, ExportDeclarationImpl, ExportManager, ExportSpecifierImpl, FunctionDeclarationImpl, FunctionDeclarationOverloadImpl, FunctionTypeStructureImpl, FunctionWriterStyle, GetAccessorDeclarationImpl, ImportAttributeImpl, ImportDeclarationImpl, ImportManager, ImportSpecifierImpl, IndexSignatureDeclarationImpl, IndexedAccessTypeStructureImpl, InferTypeStructureImpl, InterfaceDeclarationImpl, IntersectionTypeStructureImpl, JSDocImpl, JSDocTagImpl, JsxAttributeImpl, JsxElementImpl, JsxSelfClosingElementImpl, JsxSpreadAttributeImpl, LiteralTypeStructureImpl, MappedTypeStructureImpl, MemberedObjectTypeStructureImpl, MemberedTypeToClass, MethodDeclarationImpl, MethodDeclarationOverloadImpl, MethodSignatureImpl, ModuleDeclarationImpl, ParameterDeclarationImpl, ParameterTypeStructureImpl, ParenthesesTypeStructureImpl, PrefixOperatorsTypeStructureImpl, PropertyAssignmentImpl, PropertyDeclarationImpl, PropertySignatureImpl, QualifiedNameTypeStructureImpl, SetAccessorDeclarationImpl, ShorthandPropertyAssignmentImpl, SourceFileImpl, SpreadAssignmentImpl, StringTypeStructureImpl, TemplateLiteralTypeStructureImpl, TupleTypeStructureImpl, TypeAliasDeclarationImpl, TypeArgumentedTypeStructureImpl, TypeMembersMap$1 as TypeMembersMap, TypeParameterDeclarationImpl, TypeStructureKind, UnionTypeStructureImpl, VariableDeclarationImpl, VariableStatementImpl, VoidTypeNodeToTypeStructureConsole, WriterTypeStructureImpl, forEachAugmentedStructureChild, getTypeAugmentedStructure };
