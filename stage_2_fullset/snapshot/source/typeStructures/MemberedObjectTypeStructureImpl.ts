import { CodeBlockWriter, Writers } from "ts-morph";

import {
  CallSignatureDeclarationImpl,
  ConstructSignatureDeclarationImpl,
  IndexSignatureDeclarationImpl,
  MethodSignatureImpl,
  PropertySignatureImpl,
} from "../exports.js";

import { TypeStructureKind } from "../base/TypeStructureKind.js";

import TypeStructureClassesMap from "../base/TypeStructureClassesMap.js";
import TypeStructuresBase from "./TypeStructuresBase.js";

import type { CloneableTypeStructure } from "../types/CloneableStructure.js";

/**
 * ```typescript
 * {
 *    (callSignatureArgument) => string;
 *    new (constructSignatureArgument) => ClassName;
 *    [indexSignatureKey: string]: boolean;
 *    property: number;
 *    method(): void;
 * }
 * ```
 *
 * @see `MappedTypeStructureImpl` for `{ readonly [key in keyof Foo]: boolean }`
 */
export default class MemberedObjectTypeStructureImpl extends TypeStructuresBase<TypeStructureKind.MemberedObject> {
  static clone(
    other: MemberedObjectTypeStructureImpl,
  ): MemberedObjectTypeStructureImpl {
    const membered = new MemberedObjectTypeStructureImpl();

    membered.callSignatures.push(
      ...other.callSignatures.map((signature) =>
        CallSignatureDeclarationImpl.clone(signature),
      ),
    );
    membered.constructSignatures.push(
      ...other.constructSignatures.map((signature) =>
        ConstructSignatureDeclarationImpl.clone(signature),
      ),
    );
    membered.indexSignatures.push(
      ...other.indexSignatures.map((signature) =>
        IndexSignatureDeclarationImpl.clone(signature),
      ),
    );
    membered.properties.push(
      ...other.properties.map((signature) =>
        PropertySignatureImpl.clone(signature),
      ),
    );
    membered.methods.push(
      ...other.methods.map((signature) => MethodSignatureImpl.clone(signature)),
    );

    return membered;
  }

  readonly kind = TypeStructureKind.MemberedObject;

  readonly callSignatures: CallSignatureDeclarationImpl[] = [];
  readonly constructSignatures: ConstructSignatureDeclarationImpl[] = [];
  readonly indexSignatures: IndexSignatureDeclarationImpl[] = [];
  readonly methods: MethodSignatureImpl[] = [];
  readonly properties: PropertySignatureImpl[] = [];

  constructor() {
    super();
    this.registerCallbackForTypeStructure();
  }

  #writerFunction(writer: CodeBlockWriter): void {
    Writers.objectType(this)(writer);
  }

  writerFunction = this.#writerFunction.bind(this);
}
MemberedObjectTypeStructureImpl satisfies CloneableTypeStructure<MemberedObjectTypeStructureImpl>;
TypeStructureClassesMap.set(
  TypeStructureKind.MemberedObject,
  MemberedObjectTypeStructureImpl,
);
