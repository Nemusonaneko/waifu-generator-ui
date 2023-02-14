import { Accordion, Box, Footer, Text } from "@mantine/core";
import Link from "next/link";

export default function Info() {
  return (
    <>
      <Footer height={100}>
        <Box pl={5} pt={5}>
          <Text size="sm">
            - Due to some weird stuff with the 4000 series, I can only generate
            30 waifus at once (mfw $2000 gpu and can only get 20it/s max with
            tweaks)
          </Text>
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
            -
            <Link target="_blank" href="https://discord.gg/nbEN88q6dw">
              Discord
            </Link>{" "}
            to make it easier to reach me
          </Text>
          <Text size="sm">
            - If you wanna donate magic internet money, you can donate to
            nemusona.eth
          </Text>
        </Box>
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
          <Accordion.Item value="privacy">
            <Accordion.Control>Privacy</Accordion.Control>
            <Accordion.Panel>
              <Text size="sm">
                - Only time prompt information is stored is when it is in the
                queue and it is removed when request is finalized
              </Text>
              <Text size="sm">
                - Images generated nor prompts from this generator are not
                stored on my server or my pc
              </Text>
              <Text size="sm">- I do use Cloudflare and Vultr tho</Text>
              <Text size="sm">
                <Link
                  target="_blank"
                  href="https://github.com/Nemusonaneko/waifus-api"
                >
                  Shitty API Code
                </Link>
              </Text>
              <Text size="sm">
                <Link
                  target="_blank"
                  href="https://github.com/Nemusonaneko/waifu-generator-ui"
                >
                  Shitty Frontend Code
                </Link>
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
