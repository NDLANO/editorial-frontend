/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { Portal } from "@ark-ui/react";
import { InformationLine } from "@ndla/icons";
import {
  Text,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";
import { StoryType, stories } from "./stories";
import { DialogCloseButton } from "../DialogCloseButton";

interface Props {
  pageId: StoryType;
  tooltip?: string;
}

const HowToHelper = ({ pageId, tooltip }: Props) => {
  const story = stories[pageId] ?? {
    title: `Fant ingen veiledningstekster "${pageId}"`,
    lead: "Sjekk key-names i stories.ts og propType pageId til <ArticleInModal />",
  };
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <IconButton size="small" variant="tertiary" aria-label={tooltip} title={tooltip}>
          <InformationLine />
        </IconButton>
      </DialogTrigger>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <HStack>
                <InformationLine />
                {story.title}
              </HStack>
            </DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <Text>{story.lead}</Text>
            {story.body?.map((block, index) => {
              if (block.type === "text") {
                return <p key={`${pageId}-${index}`}>{block.content}</p>;
              }
              if (block.type === "image") {
                return <img key={`${pageId}-${index}`} src={block.content} alt="example" />;
              }
              if (block.type === "component") {
                return <block.content key={`${pageId}-${index}`} />;
              }
              if (block.type === "link") {
                return (
                  <a key={`${pageId}-${index}`} href={block.content.href} target="_blank" rel="noopener noreferrer">
                    {block.content.text}
                  </a>
                );
              }
              return null;
            })}
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default memo(HowToHelper);
