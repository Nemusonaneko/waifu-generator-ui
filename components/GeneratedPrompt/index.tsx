import { Box, Center, ScrollArea, Text } from "@mantine/core";

export default function GeneratedPrompt({
  positive,
  negative,
  cfgScale,
  denoiseStrength,
  model,
  seed,
}: {
  positive: string | null | undefined;
  negative: string | null | undefined;
  cfgScale: number | null | undefined;
  denoiseStrength: number | null | undefined;
  model: string | null | undefined;
  seed: number | null | undefined;
}) {
  return (
    <>
      <Center>
        <Box sx={{ width: 512 }}>
          {positive && positive.length > 0 && (
            <Text size="sm">{`Positive: ${positive}`}</Text>
          )}
          {negative && negative.length > 0 && (
            <Text size="sm">{`Negative: ${negative}`}</Text>
          )}
          <Text size="sm">{`CFG Scale: ${cfgScale ?? 0}`}</Text>
          <Text size="sm">{`Denoise Strength: ${
            denoiseStrength?.toFixed(2) ?? 0
          }`}</Text>
          {model && model.length > 0 && (
            <Text size="sm">{`Model: ${translateModel(model)}`}</Text>
          )}
          {seed && <Text size="sm">{`Seed: ${seed}`}</Text>}
        </Box>
      </Center>
    </>
  );
}

export function translateModel(model: string) {
  switch (model.toLowerCase()) {
    case "aom":
      return "AOM3";
    case "anything":
      return "Anything V4.5";
    case "counterfeit":
      return "Counterfeit V2.5";
    case "pastel":
      return "Pastel Mix";
    default:
      return null;
  }
}
