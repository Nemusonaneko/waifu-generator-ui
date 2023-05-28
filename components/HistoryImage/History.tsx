import { Button, Group, ScrollArea, Text } from "@mantine/core";
import useGetHistory from "../../queries/useGetHistory";
import HistoryImage from "./HistoryImage";
import { useQueryClient } from "react-query";

export default function History() {
  const { data: historyData } = useGetHistory();
  const queryClient = useQueryClient();

  function onDeleteAll() {
    localStorage.removeItem("history");
    queryClient.invalidateQueries();
  }
  return (
    <>
      {historyData && historyData.length > 0 && (
        <>
          <Group position="left">
            <Text>History</Text>
            <Button radius="md" size="xs" color="red" onClick={onDeleteAll}>
              Delete All
            </Button>
          </Group>

          <ScrollArea style={{ height: 136, width: 768 }} pt={5}>
            {historyData.map((x, i) => {
              return <HistoryImage key={i} index={Number(i)} historyData={x} />;
            })}
          </ScrollArea>
        </>
      )}
    </>
  );
}