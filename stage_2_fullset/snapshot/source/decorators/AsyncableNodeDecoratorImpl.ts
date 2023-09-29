//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type { MixinClass, StaticAndInstance, SubclassDecorator } from "mixin-decorators";
import type { AsyncableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const AsyncableNodeStructureKey: unique symbol
;
export type AsyncableNodeStructureFields = RightExtendsLeft<StaticAndInstance<typeof AsyncableNodeStructureKey>, {
        staticFields: object;
        instanceFields: Required<AsyncableNodeStructure>;
        symbolKey: typeof AsyncableNodeStructureKey;
    }>;

export default function AsyncableNode(baseClass: typeof StructureBase, context: ClassDecoratorContext): MixinClass<AsyncableNodeStructureFields["staticFields"], AsyncableNodeStructureFields["instanceFields"], typeof StructureBase> {
    void(context);

    class AsyncableNodeDecoratorImpl extends baseClass {
        isAsync = false;

        public static copyFields(source: AsyncableNodeStructure & Structures, target: Required<AsyncableNodeDecoratorImpl> & Structures): void {
            super.copyFields(source, target);
            target.isAsync = source.isAsync ?? false;
        }
    }

    return AsyncableNodeDecoratorImpl;
}

AsyncableNode satisfies SubclassDecorator<AsyncableNodeStructureFields, typeof StructureBase, false>;
