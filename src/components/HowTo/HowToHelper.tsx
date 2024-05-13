/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing, colors } from "@ndla/core";
import { InformationOutline } from "@ndla/icons/common";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { Text } from "@ndla/typography";
import { StoryType, stories } from "./stories";

const HelpIcon = styled(InformationOutline)`
  color: ${colors.brand.tertiary};

  &:hover,
  &:focus {
    color: ${colors.brand.primary};
  }
`;

const StyledModalTitle = styled(ModalTitle)`
  display: flex;
  gap: ${spacing.xsmall};
  align-items: center;
  color: ${colors.brand.primary} !important;
`;

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
    <Modal>
      <ModalTrigger>
        <ButtonV2 variant="stripped" aria-label={tooltip} title={tooltip}>
          <HelpIcon size="normal" />
        </ButtonV2>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <StyledModalTitle>
            <InformationOutline size="large" />
            {story.title}
          </StyledModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Text margin="none">{story.lead}</Text>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default memo(HowToHelper);
