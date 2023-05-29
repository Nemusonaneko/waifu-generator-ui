import Link from "next/link";
import Layout from "../layout";
import { Center, Text, Box } from "@mantine/core";

export default function Dislaimers() {
  return (
    <Layout>
      <Center>
        <Box w={1024}>
          <Text size={36} fw={700}>
            Disclaimers:
          </Text>
          <Text size="md">
            {`- You can't use the models to deliberately produce nor share illegal or
          harmful outputs or content`}
          </Text>
          <Text size="md">
            - The authors claims no rights on the outputs you generate, you are
            free to use them and are accountable for their use which must not go
            against the provisions set in the license
          </Text>
          <Text size="md">
            - You may re-distribute the weights and use the model commercially
            and/or as a service. If you do, please be aware you have to include
            the same use restrictions as the ones in the license and share a
            copy of the CreativeML OpenRAIL-M to all your users (please read the
            license entirely and carefully){" "}
            <Link
              target="_blank"
              href="https://huggingface.co/spaces/CompVis/stable-diffusion-license"
            >
              Please read the full license here
            </Link>
          </Text>
        </Box>
      </Center>
    </Layout>
  );
}
