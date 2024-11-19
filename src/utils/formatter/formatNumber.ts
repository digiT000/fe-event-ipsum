export function formatNumber(number: number): string {
  const numStr = number.toString();

  // Handle cases where the number is 0 or less than 1000
  if (number === 0 || number < 1000) {
    return number.toString();
  }

  // Format numbers greater than or equal to 1000
  let formattedNumber = "";
  let count = 0;
  for (let i = numStr.length - 1; i >= 0; i--) {
    formattedNumber = numStr[i] + formattedNumber;
    count++;
    if (count % 3 === 0 && i !== 0) {
      formattedNumber = "." + formattedNumber;
    }
  }

  return formattedNumber;
}
