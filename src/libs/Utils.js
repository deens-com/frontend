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
