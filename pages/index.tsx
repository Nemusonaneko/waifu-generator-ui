import Info from "../components/Info";
import Top from "../components/Top";
import Waifu from "../components/Waifu";
import Layout from "../layout";

export default function Home() {
  return (
    <Layout>
      <Top />
      <Waifu />
      <Info />
    </Layout>
  );
}
