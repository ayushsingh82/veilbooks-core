import { buildRegisterPqKeyMessage, pqKeyFromSeed, verifyProofOfPossession, signProofOfPossession } from "@qorechain/qoresign";
import { buildRegisterKemKeyMessage, generateSealKeys, sealKeysFromSeed, type SealKeyPair } from "@qorechain/qoreseal";

import { CHAIN_ID } from "./invoice.js";

/**
 * Message that registers an account's ML-DSA-87 key with its proof of possession (MsgRegisterPQCKeyV2).
 * Pass the account's secp256k1 public key (33 bytes, compressed). Sign and broadcast it as a hybrid transaction.
 */
export function registerPqKeyMessage(account: string, pqSeed: Uint8Array, classicalPublicKey: Uint8Array) {
  const pqKey = pqKeyFromSeed(pqSeed);
  return buildRegisterPqKeyMessage({ chainId: CHAIN_ID, account, pqKey, classicalPublicKey });
}

/** Message that registers an account's ML-KEM-1024 encryption key so others can seal to it. */
export function registerKemKeyMessage(account: string, keys: Pick<SealKeyPair, "mlkemPublicKey">) {
  return buildRegisterKemKeyMessage({ sender: account, mlkemPublicKey: keys.mlkemPublicKey });
}

/** Offline check of a proof of possession, for tests and for showing users what will be sent. */
export function proofChecks(account: string, pqSeed: Uint8Array): boolean {
  const pqKey = pqKeyFromSeed(pqSeed);
  const proof = signProofOfPossession({ chainId: CHAIN_ID, account, pqKey });
  return verifyProofOfPossession({ chainId: CHAIN_ID, account, publicKey: pqKey.publicKey, proof });
}

export { generateSealKeys, sealKeysFromSeed };
