/*
class Base<NType extends number> {
  constructor(x: number, y: string);
  constructor(x: NType);
  constructor(x: number) {
    void(x);
  }

  foo(x: number, y: string): void;
  foo<NType extends number>(x: NType): void;
  foo(x: number): void {
    void(x);
  }
}
*/
declare class Base<NType extends number> {
  constructor(x: number, y: string);
  constructor(x: NType);
  foo(x: number, y: string): void;
  foo<NType extends number>(x: NType): void;
}

/*
function foo(x: number, y: string): void
function foo<NType extends number>(x: NType): void;
function foo(x: number): void
{
  void(x);
}
*/
declare function foo(x: number, y: string): void;
declare function foo<NType extends number>(x: NType): void;

