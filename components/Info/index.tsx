import { Accordion, Footer, Text } from "@mantine/core";
import Link from "next/link";

export default function Info() {
  return (
    <>
      <Footer height={100}>
        <Accordion defaultValue="Info">
          <Accordion.Item value="promptingInfo">
            <Accordion.Control>Prompting Info</Accordion.Control>
            <Accordion.Panel>
              <Text size="sm">
                - To generate random image, leave prompts blank
              </Text>
              <Text size="sm">
                - Separate individual prompts with commas (i.e prompt1, prompt2,
                prompt with space)
              </Text>
              <Text size="sm">
                - Emphasize certain prompts by wrapping them in layers of
                paraenthesis. i.e. (some emphasis), ((more emphasis))
              </Text>
              <Text size="sm">
                - Number notation works for emphasis as well (i.e. prompt:1.5)
              </Text>
              <Text size="sm">- Be specific with your prompts</Text>
              <Text size="sm">
                - Add as many tags as you can{" "}
                <Link target="_blank" href="https://danbooru.donmai.us/">
                  (Search tags here)
                </Link>
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="siteInfo">
            <Accordion.Control>Site Info</Accordion.Control>
            <Accordion.Panel>
              <Text size="sm">
                - Model used:{" "}
                <Link
                  target="_blank"
                  href="https://huggingface.co/andite/anything-v4.0"
                >
                  Anything V4
                </Link>
              </Text>
              <Text size="sm">
                - Site and server run by:{" "}
                <Link target="_blank" href="https://twitter.com/nemusonaUwU">
                  @nemusonaUwU
                </Link>{" "}
                and their loyal RTX 4090
              </Text>
              <Text size="sm">
                - If you wanna donate magic internet money, you can donate to
                nemusona.eth
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="disclaimer">
            <Accordion.Control>Disclaimer</Accordion.Control>
            <Accordion.Panel>
              <Text size="sm">
                {`- You can't use the model to deliberately produce nor share illegal or
          harmful outputs or content`}
              </Text>
              <Text size="sm">
                - The authors claims no rights on the outputs you generate, you
                are free to use them and are accountable for their use which
                must not go against the provisions set in the license
              </Text>
              <Text size="sm">
                - You may re-distribute the weights and use the model
                commercially and/or as a service. If you do, please be aware you
                have to include the same use restrictions as the ones in the
                license and share a copy of the CreativeML OpenRAIL-M to all
                your users (please read the license entirely and carefully){" "}
                <Link
                  target="_blank"
                  href="https://huggingface.co/spaces/CompVis/stable-diffusion-license"
                >
                  Please read the full license here
                </Link>
              </Text>{" "}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Footer>
    </>
  );
}
