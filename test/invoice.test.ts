import { describe, expect, it } from "vitest";
import { generateSealKeys } from "@qorechain/qoreseal";
import { commitManifest, openInvoice, recipientOf, sealInvoice, type Invoice } from "../src/index.js";

const inv: Invoice = { id: "inv-1", payer: "qor1payer", payee: "qor1payee", amountUqor: "2500000", memo: "Nov", dueUnix: 1796000000 };

describe("sealed invoice", () => {
  const payee = generateSealKeys();
  const auditor = generateSealKeys();
  const stranger = generateSealKeys();
  const sealed = sealInvoice(inv, [recipientOf(payee), recipientOf(auditor)]);

  it("payee and auditor can open it", () => {
    expect(openInvoice(sealed, payee, inv.id).amountUqor).toBe("2500000");
    expect(openInvoice(sealed, auditor, inv.id).payee).toBe("qor1payee");
  });
  it("a stranger cannot open it", () => {
    expect(() => openInvoice(sealed, stranger, inv.id)).toThrow();
  });
  it("a wrong invoice id (aad) is refused", () => {
    expect(() => openInvoice(sealed, payee, "inv-2")).toThrow();
  });
  it("a tampered envelope is refused", () => {
    const bad = { ...sealed, envelope: sealed.envelope.slice() };
    bad.envelope[bad.envelope.length - 1] ^= 1;
    expect(() => openInvoice(bad, payee, inv.id)).toThrow();
  });
  it("a swapped commitment is refused", () => {
    expect(() => openInvoice({ ...sealed, commitment: "00".repeat(32) }, payee, inv.id)).toThrow(/commitment/);
  });
  it("manifest commitment is order independent", () => {
    expect(commitManifest(["b", "a"])).toBe(commitManifest(["a", "b"]));
  });
});
