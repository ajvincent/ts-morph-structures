import type { Simplify } from "type-fest";

export type RequiredOmit<
  ObjectType extends object,
  Keys extends keyof ObjectType = never,
> = Simplify<ObjectType & Required<Omit<ObjectType, Keys>>>;
