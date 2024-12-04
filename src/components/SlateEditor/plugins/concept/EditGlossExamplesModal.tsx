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
import { Portal } from "@ark-ui/react";
import { PencilFill } from "@ndla/icons";
import {
  DialogBackdrop,
  DialogPositioner,
  DialogRoot,
  DialogStandaloneContent,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
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

// We need to portal both the dialog and the surrounding popover in order to not render invalid HTML in the editor.
// This is a workaround to avoid the popover being rendered above the dialog.
const StyledDialogBackdrop = styled(DialogBackdrop, {
  base: {
    zIndex: "popover",
  },
});

const StyledDialogPositioner = styled(DialogPositioner, {
  base: {
    zIndex: "popover",
  },
});

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
    <DialogRoot open={modalOpen} onOpenChange={(details) => setModalOpen(details.open)}>
      {concept.conceptType === "gloss" && concept.glossData?.examples.length ? (
        <DialogTrigger asChild>
          <IconButton
            title={t("form.gloss.editExamples")}
            aria-label={t("form.gloss.editExamples")}
            variant="tertiary"
            size="small"
          >
            <PencilFill />
          </IconButton>
        </DialogTrigger>
      ) : null}
      <Portal>
        <StyledDialogBackdrop />
        <StyledDialogPositioner>
          <DialogStandaloneContent>
            <EditGlossExamplesModalContent
              originalLanguage={concept.glossData?.originalLanguage}
              examples={concept.glossData?.examples ?? []}
              editor={editor}
              element={element}
              embed={embed}
              close={() => setModalOpen(false)}
            />
          </DialogStandaloneContent>
        </StyledDialogPositioner>
      </Portal>
    </DialogRoot>
  );
};

export default EditGlossExamplesModal;
