import { Footer, Text } from "@mantine/core";
import Link from "next/link";

export default function Disclaimer() {
  return (
    <>
      <Footer height={100}>
        <Link
          target="_blank"
          href="https://huggingface.co/spaces/CompVis/stable-diffusion-license"
        >
          By using this you agree to the terms of The CreativeML OpenRAIL
          License
        </Link>
      </Footer>
    </>
  );
}
