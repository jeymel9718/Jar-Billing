export function formatCurrency(
  value: string,
  locale: string = "es-CR",
  currency: string = "CRC"
): string {
  // Convert the string to a number
  const numberValue = parseFloat(value);

  // Check if the conversion was successful
  if (isNaN(numberValue)) {
    return "";
  }

  // Create a NumberFormat object with the specified locale and currency
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  });

  // Format the number as a currency string
  return formatter.format(numberValue);
}
