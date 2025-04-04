export function formatPhoneNumber(phoneNumber: string): string {
  const match = phoneNumber.match(/^\+(\d)(\d{3})(\d{3})(\d{4})$/);
  if (!match) {
    throw new Error("Invalid phone number format");
  }

  const [, countryCode, areaCode, firstPart, secondPart] = match;
  return `+${countryCode} (${areaCode}) ${firstPart} ${secondPart}`;
}
