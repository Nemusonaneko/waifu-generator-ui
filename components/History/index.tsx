import { ScrollArea, Text } from "@mantine/core";
import useGetHistory from "../../queries/useGetHistory";
import HistoryImage from "./HistoryImage";

export default function History() {
  const { data: historyData } = useGetHistory();
  return (
    <>
      {historyData && historyData.length > 0 && (
        <>
          <Text>History</Text>
          <ScrollArea style={{ height: 132 }}>
            {historyData.map((x, i) => {
              return <HistoryImage key={i} index={Number(i)} historyData={x} />;
            })}
          </ScrollArea>
        </>
      )}
    </>
  );
}
