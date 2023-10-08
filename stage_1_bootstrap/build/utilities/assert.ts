export default function assert(
  condition: boolean,
  message: string
): void
{
  if (!condition)
    throw new Error("assertion failure: " + message);
}