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

/**
 * This is a one-way diff, 
 * meaning that it will return keys/values from object2 that are not identical to their counterparts in object1
 */
export const oneWayDiff = (object1, object2) => {
  return Object.keys(object2).reduce((diff, key) => {
    if (object1[key] === object2[key]) return diff;
    return {
      ...diff,
      [key]: object2[key],
    };
  }, {});
};

/* Does not work as expected */
export const uniqEs6 = (arrArg) => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) === pos;
  });
}

/**
 * A lot of times it's difficult to get the ISO date
 * out of the various date types we have
 * Thus this function
 */
export const getISODateString = date => {
  if (date.__type === 'Date') {
    return date.iso;
  } else if (date instanceof Date) {
    return date.toISOString();
  } else {
    return date;
  }
};
