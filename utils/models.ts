export function translateModel(model: string | undefined | null) {
  if (!model) return null;
  switch (model.toLowerCase()) {
    case "aom":
      return "AOM3";
    case "anything":
      return "Anything V4.5";
    case "counterfeit":
      return "Counterfeit V3";
    case "pastel":
      return "Pastel Mix";
    default:
      return null;
  }
}
