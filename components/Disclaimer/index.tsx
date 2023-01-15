import { Footer, Text } from "@mantine/core";
import Link from "next/link";

export default function Disclaimer() {
  return (
    <>
      <Footer height={100}>
        <Text pb={5}>
          Model used:{" "}
          <Link
            target="_blank"
            href="https://huggingface.co/andite/anything-v4.0"
          >
            Anything V4
          </Link>
        </Text>

        <Text size="sm" pb={3}>
          {`You can't use the model to deliberately produce nor share illegal or
          harmful outputs or content`}
        </Text>
        <Text size="sm" pb={3}>
          The authors claims no rights on the outputs you generate, you are free
          to use them and are accountable for their use which must not go
          against the provisions set in the license
        </Text>
        <Text size="sm" pb={3}>
          You may re-distribute the weights and use the model commercially
          and/or as a service. If you do, please be aware you have to include
          the same use restrictions as the ones in the license and share a copy
          of the CreativeML OpenRAIL-M to all your users (please read the
          license entirely and carefully){" "}
          <Link
            target="_blank"
            href="https://huggingface.co/spaces/CompVis/stable-diffusion-license"
          >
            Please read the full license here
          </Link>
        </Text>
      </Footer>
    </>
  );
}
