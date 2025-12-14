export interface DataSuffixCapability {
  dataSuffix: string; // hex-encoded bytes to append as suffix
}

export function toDataSuffix({ codes }: { codes: string[] }): string {
  // Simple implementation: join codes with comma, encode as ASCII, and append a fixed ercSuffix.
  const ercSuffix = "80218021802180218021802180218021";
  const schemaId = "00";
  const codesStr = codes.join(",");
  const schemaData = Buffer.from(codesStr, "ascii").toString("hex");
  return `0x${schemaData}${schemaId}${ercSuffix}`;
}
