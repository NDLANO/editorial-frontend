/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, ElementType } from "react";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { ModalCloseButton, ModalHeader, ModalSizeType, Modal, ModalTrigger, ModalContent } from "@ndla/modal";
import { ConceptPreviewProps, PreviewConcept } from "./PreviewConcept";
import { CompareConceptPreviewProps, PreviewConceptCompare } from "./PreviewConceptCompare";
import { MarkupPreviewProps, PreviewMarkup } from "./PreviewMarkup";
import { PreviewVersion, VersionPreviewProps } from "./PreviewVersion";

export interface PreviewBaseProps {
  type: "markup" | "version" | "conceptCompare" | "concept";
  language: string;
  activateButton?: ReactElement;
}

type Props = MarkupPreviewProps | VersionPreviewProps | CompareConceptPreviewProps | ConceptPreviewProps;

export const StyledPreviewWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  display: inline-flex;
  justify-content: center;
  & .c-article {
    padding: 0;
    margin-top: 20px;
    line-height: unset;
    font-family: unset;
    > section {
      width: unset !important;
      left: unset !important;
    }
    & .c-article__header {
      margin-bottom: unset;
    }
  }
`;

export const TwoArticleWrapper = styled(StyledPreviewWrapper)`
  > div {
    margin: 0 2.5%;
    width: 40%;
    > h2 {
      margin: 0;
      margin-left: ${spacing.large};
    }
    > article {
      max-width: unset;
    }
  }
`;

const components: Record<Props["type"], ElementType> = {
  markup: PreviewMarkup,
  version: PreviewVersion,
  conceptCompare: PreviewConceptCompare,
  concept: PreviewConcept,
};

const PreviewDraftLightboxV2 = (props: Props) => {
  const Component = components[props.type];
  const size: ModalSizeType = props.type === "version" ? "full" : { width: "large", height: "full" };
  return (
    <Modal>
      <ModalTrigger>{props.activateButton}</ModalTrigger>
      <ModalContent size={size}>
        <ModalHeader>
          <ModalCloseButton />
        </ModalHeader>
        <Component {...props} />
      </ModalContent>
    </Modal>
  );
};

export default PreviewDraftLightboxV2;
