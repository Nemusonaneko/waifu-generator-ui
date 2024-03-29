import { Button, Group, ScrollArea, Text } from "@mantine/core";
import useGetHistory from "../../queries/useGetHistory";
import HistoryImage from "./HistoryImage";
import { useQueryClient } from "react-query";
import { SubmitValues } from "../../types";
import { UseFormReturnType } from "@mantine/form";

export default function History({
  setModel,
  setSeed,
  form,
}: {
  setModel: React.Dispatch<React.SetStateAction<string | null>>;
  setSeed: React.Dispatch<React.SetStateAction<number>>;
  form: UseFormReturnType<SubmitValues>;
}) {
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

          <ScrollArea style={{ width: "100%" }} pt={5}>
            {historyData.map((x, i) => {
              return <HistoryImage setModel={setModel} setSeed={setSeed} form={form} key={i} index={Number(i)} historyData={x} />;
            })}
          </ScrollArea>
        </>
      )}
    </>
  );
}
