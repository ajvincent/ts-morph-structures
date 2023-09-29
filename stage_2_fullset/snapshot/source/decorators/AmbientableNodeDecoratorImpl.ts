//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type { MixinClass, StaticAndInstance, SubclassDecorator } from "mixin-decorators";
import type { AmbientableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const AmbientableNodeStructureKey: unique symbol
;
export type AmbientableNodeStructureFields = RightExtendsLeft<StaticAndInstance<typeof AmbientableNodeStructureKey>, {
        staticFields: object;
        instanceFields: Required<AmbientableNodeStructure>;
        symbolKey: typeof AmbientableNodeStructureKey;
    }>;

export default function AmbientableNode(baseClass: typeof StructureBase, context: ClassDecoratorContext): MixinClass<AmbientableNodeStructureFields["staticFields"], AmbientableNodeStructureFields["instanceFields"], typeof StructureBase> {
    void(context);

    class AmbientableNodeDecoratorImpl extends baseClass {
        hasDeclareKeyword = false;

        public static copyFields(source: AmbientableNodeStructure & Structures, target: Required<AmbientableNodeDecoratorImpl> & Structures): void {
            super.copyFields(source, target);
            target.hasDeclareKeyword = source.hasDeclareKeyword ?? false;
        }
    }

    return AmbientableNodeDecoratorImpl;
}

AmbientableNode satisfies SubclassDecorator<AmbientableNodeStructureFields, typeof StructureBase, false>;
