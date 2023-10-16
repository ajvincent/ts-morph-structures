type PreferArray<MaybeArray> = (
	Extract<MaybeArray, readonly unknown[]> extends never ?
	MaybeArray : Extract<MaybeArray, readonly unknown[]>
);

export type PreferArrayFields<ObjectType extends object> = {
	[Key in keyof ObjectType]: PreferArray<ObjectType[Key]>;
}
