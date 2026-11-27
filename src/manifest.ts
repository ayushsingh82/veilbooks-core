/** One line of a payment run. Amounts are uqor decimal strings. */
export interface ManifestLine {
  invoiceId: string;
  payee: string; // qor1...
  amountUqor: string;
}

export interface Manifest {
  runId: string;
  lines: ManifestLine[];
}

/** Check a payment manifest (as exported by Desk, read by Rail). Throws on the first problem; extra fields are dropped. */
export function parseManifest(json: string): Manifest {
  const m = JSON.parse(json) as Manifest;
  if (typeof m.runId !== "string" || !m.runId) throw new Error("manifest: missing runId");
  if (!Array.isArray(m.lines) || m.lines.length === 0) throw new Error("manifest: no lines");
  const seen = new Set<string>();
  for (const [i, l] of m.lines.entries()) {
    if (!l.invoiceId || seen.has(l.invoiceId)) throw new Error(`manifest line ${i + 1}: missing or duplicate invoiceId`);
    seen.add(l.invoiceId);
    if (!/^qor1[0-9a-z]{20,}$/.test(l.payee)) throw new Error(`manifest line ${i + 1}: bad payee`);
    if (!/^[1-9]\d*$/.test(l.amountUqor)) throw new Error(`manifest line ${i + 1}: bad amount`);
  }
  return { runId: m.runId, lines: m.lines.map((l) => ({ invoiceId: l.invoiceId, payee: l.payee, amountUqor: l.amountUqor })) };
}

/** Sum of a manifest in uqor. */
export function manifestTotalUqor(m: Manifest): bigint {
  return m.lines.reduce((t, l) => t + BigInt(l.amountUqor), 0n);
}
