import AwaitedMap, {
  AwaitedMapError,
} from "#utilities/source/AwaitedMap.js";

describe("AwaitedMap", () => {
  it(".allSettled() converts promises to promise-settled results", async () => {
    const rejectTwoError = new Error("reject two");
    const map = new AwaitedMap<string, number>([
      ["one", Promise.resolve(1)],
      ["two", Promise.reject(rejectTwoError)],
    ]);

    const results = await map.allSettled();
    const entries = Array.from(results.entries());
    expect(entries).toEqual([
      ["one", { status: "fulfilled", value: 1}],
      ["two", { status: "rejected", reason: rejectTwoError}],
    ]);
  });

  it(".allResolved() converts resolvable promises to their resolved values", async () => {
    const map = new AwaitedMap<string, number>([
      ["one", Promise.resolve(1)],
      ["two", Promise.resolve(2)]
    ]);

    const results = await map.allResolved();
    const entries = Array.from(results.entries());

    expect(entries).toEqual([
      ["one", 1],
      ["two", 2]
    ]);
  });

  it(".allResolved() rejects with an AwaitedMapError for all errors that failed", async () => {
    const rejectOneError = new Error("reject one");
    const rejectThreeError = new Error("reject three");
    const map = new AwaitedMap<string, number>([
      ["one", Promise.reject(rejectOneError)],
      ["two", Promise.resolve(2)],
      ["three", Promise.reject(rejectThreeError)],
    ]);

    await expectAsync(map.allResolved()).toBeRejectedWithError(AwaitedMapError);
    try {
      await map.allResolved()
    }
    catch (ex) {
      const entries = Array.from(
        (ex as AwaitedMapError<string>).errorMap.entries()
      );
      expect(entries).toEqual([
        ["one", rejectOneError],
        ["three", rejectThreeError],
      ]);
    }
  });
});
