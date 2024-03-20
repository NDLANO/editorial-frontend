/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { IconButtonV2 } from "@ndla/button";
import { Pencil } from "@ndla/icons/action";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { IConcept, IConceptSummary } from "@ndla/types-backend/concept-api";
import { ConceptMetaData } from "@ndla/types-embed";
import { ConceptBlockElement } from "./block/interfaces";
import EditGlossExamplesModalContent from "./EditGlossExamplesModalContent";
import { ConceptInlineElement } from "./inline/interfaces";
import { getGlossDataAttributes } from "./utils";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { useIsNewArticleLanguage } from "../../IsNewArticleLanguageProvider";

interface Props {
  concept: IConcept | IConceptSummary;
  editor: Editor;
  element: ConceptBlockElement | ConceptInlineElement;
  embed: ConceptMetaData;
}

const EditGlossExamplesModal = ({ concept, editor, element, embed }: Props) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const locale = useArticleLanguage();
  const isNewArticleLanguage = useIsNewArticleLanguage();

  // When new language version of article is created, we want to automatically update gloss language when article language is "nb" or "nn"
  // We only update gloss language automatically once, to not overwrite changes made in the gloss examples update modal
  const embedDataLangsShouldAutoUpdate = useRef((locale === "nb" || locale === "nn") && isNewArticleLanguage);

  useEffect(() => {
    if (!concept?.glossData) return;

    if (embedDataLangsShouldAutoUpdate.current) {
      Transforms.setNodes(
        editor,
        {
          data: {
            ...embed.embedData,
            ...getGlossDataAttributes(concept.glossData, locale, ["exampleIds"]),
          },
        },
        { at: ReactEditor.findPath(editor, element) },
      );
    }
    embedDataLangsShouldAutoUpdate.current = false;
  }, [concept.glossData, editor, element, embed.embedData, isNewArticleLanguage, locale]);

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
