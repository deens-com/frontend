export default class Utils {
  static getBaseSymbol(currency = "USD") {
    switch (currency) {
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "JPY":
        return "¥";
      case "USD":
        return "$";
      case "BTC":
        return "Ƀ";
      case "ETH":
        return "Ξ";
      case "PLS":
        return "🄿";
      default:
        return "$";
    }
  }
}

export const removeKey = (obj, propToDelete) => {
  const { [propToDelete]: deleted, ...objectWithoutDeletedProp } = obj;
  return objectWithoutDeletedProp;
};

// Comparator for sort function, that sorts the array while keeping all null/undefined values at the end
export const comparatorWithNullValues = (valueA, valueB) => {
  if (!valueA) return 1;
  else if (!valueB) return -1;
  else if (valueA === valueB) return 0; // because a & b both could be null/undefined
  else return valueA - valueB;
};

/* Does not work as expected */
export const uniqEs6 = (arrArg) => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) === pos;
  });
}
