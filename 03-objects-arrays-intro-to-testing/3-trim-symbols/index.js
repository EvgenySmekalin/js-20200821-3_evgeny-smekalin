/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (string === '' || size === 0) {
    return '';
  }

  if (size === undefined) {
    return string;
  }

  let resultString = string[0];
  let repeatCount = 0;

  for (let i = 1; i < string.length; i++) {
    if (string[i] == string[i - 1]) {
      repeatCount++;
    } else {
      repeatCount = 0;
    }

    if (repeatCount < size) {
      resultString += string[i];
    }
  }

  return resultString;
}
