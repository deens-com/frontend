import * as icons from "../shared_components/icons";

export default class Utils {
  static getBaseSymbol(currency = "EUR") {
    switch (currency) {
      case "AUD":
        return "$";
      case "CAD":
        return "C$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "JPY":
        return "¥";
      case "USD":
        return "$";
      default:
        return "$";
    }
  }
}
