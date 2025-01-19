// Returns hash in hex encoding with a log key so there is no tampering
export function generateLogHash(data: Record<any, any>): string {
  const hasher = new Bun.CryptoHasher("sha256", process.env.LOG_HASH_KEY!);
  hasher.update(JSON.stringify(data));
  return hasher.digest("hex");
}
