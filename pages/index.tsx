import Info from "../components/Info";
import Top from "../components/Top";
import Waifu from "../components/Waifu";
import Layout from "../layout";
import History from "../components/History"

export default function Home() {
  return (
    <Layout>
      <Top />
      <Waifu />
      <History/>
      <Info />
    </Layout>
  );
}
