import Info from "../components/Info";
import Top from "../components/Top";
import Waifu from "../components/Waifu";
import Layout from "../layout";
import useGetStatus from "../queries/useGetStatus";

export default function Home() {
  useGetStatus();

  return (
    <Layout>
      <Top />
      <Waifu />
      <Info />
    </Layout>
  );
}
