import { describe, expect, it } from "vitest";
import { manifestTotalUqor, parseManifest } from "../src/manifest.js";

const P = "qor1" + "a".repeat(38);
const line = (id: string, amt = "5") => ({ invoiceId: id, payee: P, amountUqor: amt });

describe("parseManifest", () => {
  it("accepts a good manifest and sums it", () => {
    const m = parseManifest(JSON.stringify({ runId: "r", lines: [line("a", "2"), line("b", "3")] }));
    expect(manifestTotalUqor(m)).toBe(5n);
  });
  it("rejects a duplicate invoice id", () => expect(() => parseManifest(JSON.stringify({ runId: "r", lines: [line("a"), line("a")] }))).toThrow(/duplicate/));
  it("rejects a bad amount", () => expect(() => parseManifest(JSON.stringify({ runId: "r", lines: [line("a", "-1")] }))).toThrow(/amount/));
  it("drops names and other extra fields", () => {
    const m = parseManifest(JSON.stringify({ runId: "r", lines: [{ ...line("a"), name: "Ann" }] }));
    expect(JSON.stringify(m)).not.toMatch(/Ann/);
  });
});
