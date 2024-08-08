export function formatCurrency(
  value: string | number,
  locale: string = "es-CR",
  currency: string = "CRC"
): string {
  // Convert the string to a number
  let numberValue: number;
  if (typeof value === "string") {
    numberValue = parseFloat(value);
  } else {
    numberValue = value;
  }

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
};


export function validateEmail(email: string): boolean {
  if (email === "") return true;
  // Regular expression to validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}