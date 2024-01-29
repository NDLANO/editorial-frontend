/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { IconButtonV2 } from "@ndla/button";
import { Pencil } from "@ndla/icons/action";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { IConcept, IConceptSummary } from "@ndla/types-backend/concept-api";
import { ConceptMetaData } from "@ndla/types-embed";
import { ConceptBlockElement } from "./block/interfaces";
import EditGlossExamplesModalContent from "./EditGlossExamplesModalContent";
import { ConceptInlineElement } from "./inline/interfaces";

interface Props {
  concept: IConcept | IConceptSummary;
  editor: Editor;
  element: ConceptBlockElement | ConceptInlineElement;
  embed: ConceptMetaData;
}

const EditGlossExamplesModal = ({ concept, editor, element, embed }: Props) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Modal open={modalOpen} onOpenChange={setModalOpen}>
      {concept.conceptType === "gloss" && concept.glossData?.examples.length ? (
        <ModalTrigger>
          <IconButtonV2
            title={t("form.gloss.editExamples")}
            aria-label={t("form.gloss.editExamples")}
            variant="ghost"
            colorTheme="light"
          >
            <Pencil />
          </IconButtonV2>
        </ModalTrigger>
      ) : null}
      <ModalContent>
        <EditGlossExamplesModalContent
          originalLanguage={concept.glossData?.originalLanguage}
          examples={concept.glossData?.examples ?? []}
          editor={editor}
          element={element}
          embed={embed}
          close={() => setModalOpen(false)}
        />
      </ModalContent>
    </Modal>
  );
};

export default EditGlossExamplesModal;
