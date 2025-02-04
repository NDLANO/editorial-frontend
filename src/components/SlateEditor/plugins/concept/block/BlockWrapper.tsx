/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, ReactNode, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Transforms, Path } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import { DeleteBinLine, ErrorWarningFill, CheckLine, LinkMedium } from "@ndla/icons";
import { DialogContent, DialogRoot, IconButton } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IConceptDTO, IConceptSummaryDTO } from "@ndla/types-backend/concept-api";
import { ConceptEmbedData, ConceptMetaData } from "@ndla/types-embed";
import { ConceptEmbed, EmbedWrapper } from "@ndla/ui";
import { ConceptBlockElement } from "./interfaces";
import { TYPE_CONCEPT_BLOCK } from "./types";
import { PUBLISHED } from "../../../../../constants";
import { ConceptType } from "../../../../../containers/ConceptPage/conceptInterfaces";
import { useFetchConceptData } from "../../../../../containers/FormikForm/formikConceptHooks";
import { useConceptVisualElement } from "../../../../../modules/embed/queries";
import { useArticleLanguage } from "../../../ArticleLanguageProvider";
import ConceptModalContent from "../ConceptModalContent";
import EditGlossExamplesModal from "../EditGlossExamplesModal";
import { getGlossDataAttributes } from "../utils";

const getConceptDataAttributes = (concept: IConceptSummaryDTO | IConceptDTO, locale: string): ConceptEmbedData => ({
  contentId: concept.id.toString(),
  resource: "concept",
  type: "block",
  linkText: "",
  ...(concept.conceptType === "gloss" && concept.glossData?.examples.length
    ? getGlossDataAttributes(concept.glossData, locale)
    : {}),
});

interface Props {
  element: ConceptBlockElement;
  editor: Editor;
  attributes: RenderElementProps["attributes"];
  children: ReactNode;
}

const StyledEmbedWrapper = styled(EmbedWrapper, {
  variants: {
    selected: {
      true: {
        outline: "2px solid",
        outlineColor: "stroke.default",
      },
    },
  },
});

const BlockWrapper = ({ element, editor, attributes, children }: Props) => {
  const isSelected = useSelected();
  const locale = useArticleLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const { concept, subjects, loading, ...conceptHooks } = useFetchConceptData(parseInt(element.data.contentId), locale);

  useEffect(() => {
    setIsEditing(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

  const visualElementQuery = useConceptVisualElement(
    concept?.id ?? -1,
    concept?.visualElement?.visualElement ?? "",
    locale,
    {
      enabled: !!concept?.id && !!concept?.visualElement?.visualElement.length,
    },
  );

  const embed: ConceptMetaData | undefined = useMemo(() => {
    if (!element.data || !concept) return undefined;

    return {
      status: !concept && !loading ? "error" : "success",
      data: {
        concept: {
          ...concept,
          content: concept.content
            ? {
                ...concept.content,
                content: concept.content.content,
              }
            : undefined,
        },
        visualElement: visualElementQuery.data,
      },
      embedData: element.data,
      resource: "concept",
    };
  }, [element.data, concept, loading, visualElementQuery.data]);

  const addConcept = useCallback(
    (addedConcept: IConceptSummaryDTO | IConceptDTO) => {
      setIsEditing(false);
      const data = getConceptDataAttributes(addedConcept, locale);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        { data },
        {
          at: path,
          match: (node) => Element.isElement(node) && node.type === TYPE_CONCEPT_BLOCK,
        },
      );
    },
    [locale, editor, element],
  );

  const handleRemove = useCallback(
    () =>
      Transforms.removeNodes(editor, {
        at: ReactEditor.findPath(editor, element),
        voids: true,
      }),
    [editor, element],
  );

  const onClose = useCallback(() => {
    ReactEditor.focus(editor);
    setIsEditing(false);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, {
        at: ReactEditor.findPath(editor, element),
        voids: true,
      });
    }
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  }, [editor, element]);

  return (
    <DialogRoot size="large" open={isEditing} onOpenChange={({ open }) => setIsEditing(open)}>
      <StyledEmbedWrapper {...attributes} data-solid-border={isSelected} contentEditable={false}>
        {!!concept && !!embed && (
          <>
            <ConceptButtonContainer
              concept={concept}
              handleRemove={handleRemove}
              language={locale}
              editor={editor}
              element={element}
              embed={embed}
            />
            <ConceptEmbed embed={embed} />
          </>
        )}
        <DialogContent>
          <ConceptModalContent
            onClose={onClose}
            addConcept={addConcept}
            locale={locale}
            concept={concept}
            subjects={subjects}
            handleRemove={handleRemove}
            conceptType={(concept?.conceptType ?? element.conceptType) as ConceptType}
            {...conceptHooks}
          />
        </DialogContent>
        {children}
      </StyledEmbedWrapper>
    </DialogRoot>
  );
};

interface ButtonContainerProps {
  concept: IConceptDTO | IConceptSummaryDTO;
  handleRemove: () => void;
  language: string;
  editor: Editor;
  element: ConceptBlockElement;
  embed: ConceptMetaData;
}

const ButtonContainer = styled("div", {
  base: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3xsmall",
    right: "-xlarge",
  },
});

const StyledCheckLine = styled(CheckLine, {
  base: {
    fill: "surface.success",
  },
});

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  base: {
    fill: "icon.subtle",
  },
});

const ConceptButtonContainer = ({ concept, handleRemove, language, editor, element, embed }: ButtonContainerProps) => {
  const { t } = useTranslation();
  const translatedCurrent = t(`form.status.${concept?.status.current?.toLowerCase()}`);

  return (
    <ButtonContainer>
      <IconButton
        title={t(`form.${concept?.conceptType}.remove`)}
        aria-label={t(`form.${concept?.conceptType}.remove`)}
        variant="danger"
        size="small"
        onClick={handleRemove}
      >
        <DeleteBinLine />
      </IconButton>
      <EditGlossExamplesModal concept={concept} editor={editor} element={element} embed={embed} />
      <SafeLinkIconButton
        arial-label={t(`form.${concept?.conceptType}.edit`)}
        title={t(`form.${concept?.conceptType}.edit`)}
        variant="tertiary"
        size="small"
        to={`/${concept.conceptType}/${concept.id}/edit/${language}`}
        target="_blank"
      >
        <LinkMedium />
      </SafeLinkIconButton>
      {!!(concept?.status.current === PUBLISHED || concept?.status.other.includes(PUBLISHED)) && (
        <StyledCheckLine aria-label={t("form.workflow.published")} title={t("form.workflow.published")} />
      )}
      {concept?.status.current !== PUBLISHED && (
        <StyledErrorWarningFill
          aria-label={t("form.workflow.currentStatus", {
            status: translatedCurrent,
          })}
          title={t("form.workflow.currentStatus", {
            status: translatedCurrent,
          })}
        />
      )}
    </ButtonContainer>
  );
};

export default BlockWrapper;
