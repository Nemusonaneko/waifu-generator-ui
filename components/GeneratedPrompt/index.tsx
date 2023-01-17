import { Box, Center, Text } from "@mantine/core";

export default function GeneratedPrompt({
  positive,
  negative,
}: {
  positive: string | null | undefined;
  negative: string | null | undefined;
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
        </Box>
      </Center>
    </>
  );
}
