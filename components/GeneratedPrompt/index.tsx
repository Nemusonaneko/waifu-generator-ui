import { Box, Center, Text } from "@mantine/core";

export default function GeneratedPrompt({
  positive,
  negative,
  cfgScale,
  denoiseStrength,
}: {
  positive: string | null | undefined;
  negative: string | null | undefined;
  cfgScale: number | null | undefined;
  denoiseStrength: number | null | undefined;
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
          <Text size="sm">{`Denoise Strength: ${denoiseStrength ?? 0}`}</Text>
        </Box>
      </Center>
    </>
  );
}
