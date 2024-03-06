/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType } from "react";
import { ModalCloseButton, ModalHeader, ModalSizeType, Modal, ModalTrigger, ModalContent } from "@ndla/modal";
import { ConceptPreviewProps, PreviewConcept } from "./PreviewConcept";
import { CompareConceptPreviewProps, PreviewConceptCompare } from "./PreviewConceptCompare";
import { MarkupPreviewProps, PreviewMarkup } from "./PreviewMarkup";
import { PreviewVersion, VersionPreviewProps } from "./PreviewVersion";

type Props = MarkupPreviewProps | VersionPreviewProps | CompareConceptPreviewProps | ConceptPreviewProps;

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
