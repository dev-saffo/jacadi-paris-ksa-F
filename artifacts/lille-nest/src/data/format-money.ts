const formatters = new Map<string, Intl.NumberFormat>();

export const formatMoney = (amount: number, currency: string): string => {
  let formatter = formatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    });
    formatters.set(currency, formatter);
  }
  return formatter.format(amount);
};