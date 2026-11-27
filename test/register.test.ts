import { addressFromPublicKey, classicalKeyFromPrivate } from "@qorechain/qoresign";
import { describe, expect, it } from "vitest";
import { proofChecks, registerKemKeyMessage, registerPqKeyMessage, generateSealKeys } from "../src/index.js";

const seed = new Uint8Array(32).fill(5);
const ck = classicalKeyFromPrivate(new Uint8Array(32).fill(7));
const ACC = addressFromPublicKey(ck.publicKey, ck.type).bech32;
const classical = ck.publicKey;

describe("registration builders", () => {
  it("a proof of possession verifies for its own account", () => expect(proofChecks(ACC, seed)).toBe(true));
  it("builds the PQ registration message", () => {
    const m = registerPqKeyMessage(ACC, seed, classical);
    expect(m.typeUrl).toMatch(/RegisterPQCKeyV2/);
  });
  it("builds the KEM registration message", () => {
    const m = registerKemKeyMessage(ACC, generateSealKeys());
    expect(m.typeUrl).toMatch(/RegisterKEMKey/);
  });
});
