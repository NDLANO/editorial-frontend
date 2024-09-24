/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, ReactNode, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Transforms, Path } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import styled from "@emotion/styled";
import { spacing, colors } from "@ndla/core";
import { Link as LinkIcon } from "@ndla/icons/common";
import { Check, AlertCircle, DeleteForever } from "@ndla/icons/editor";
import { Modal, ModalContent } from "@ndla/modal";
import { IconButton } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { IConcept, IConceptSummary } from "@ndla/types-backend/concept-api";
import { ConceptEmbedData, ConceptMetaData } from "@ndla/types-embed";
import { ConceptEmbed } from "@ndla/ui";
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

const getConceptDataAttributes = (concept: IConceptSummary | IConcept, locale: string): ConceptEmbedData => ({
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

const StyledWrapper = styled.div`
  position: relative;
  &[data-solid-border="true"] {
    outline: 2px solid ${colors.brand.primary};
  }
`;

const BlockWrapper = ({ element, editor, attributes, children }: Props) => {
  const isSelected = useSelected();
  const locale = useArticleLanguage();
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const { concept, subjects, loading, ...conceptHooks } = useFetchConceptData(parseInt(element.data.contentId), locale);

  const visualElementQuery = useConceptVisualElement(concept?.id!, concept?.visualElement?.visualElement!, locale, {
    enabled: !!concept?.id && !!concept?.visualElement?.visualElement.length,
  });

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
    (addedConcept: IConceptSummary | IConcept) => {
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
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <StyledWrapper {...attributes} data-solid-border={isSelected} draggable={true}>
        {concept && embed && (
          <div contentEditable={false}>
            <ConceptButtonContainer
              concept={concept}
              handleRemove={handleRemove}
              language={locale}
              editor={editor}
              element={element}
              embed={embed}
            />
            <ConceptEmbed embed={embed} />
          </div>
        )}
        <ModalContent size={{ width: "large", height: "large" }}>
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
        </ModalContent>
        {children}
      </StyledWrapper>
    </Modal>
  );
};

interface ButtonContainerProps {
  concept: IConcept | IConceptSummary;
  handleRemove: () => void;
  language: string;
  editor: Editor;
  element: ConceptBlockElement;
  embed: ConceptMetaData;
}

const ButtonContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.xsmall};
  right: -${spacing.large};
`;

const IconWrapper = styled.div`
  svg {
    height: ${spacing.normal};
    width: ${spacing.normal};
    fill: ${colors.brand.grey};
  }
  &[data-color="green"] {
    svg {
      fill: ${colors.support.green};
    }
  }
  &[data-color="red"] {
    svg {
      fill: ${colors.support.red};
    }
  }
`;

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
        <DeleteForever />
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
        <LinkIcon />
      </SafeLinkIconButton>
      {(concept?.status.current === PUBLISHED || concept?.status.other.includes(PUBLISHED)) && (
        <IconWrapper aria-label={t("form.workflow.published")} title={t("form.workflow.published")} data-color="green">
          <Check />
        </IconWrapper>
      )}
      {concept?.status.current !== PUBLISHED && (
        <IconWrapper
          aria-label={t("form.workflow.currentStatus", {
            status: translatedCurrent,
          })}
          title={t("form.workflow.currentStatus", {
            status: translatedCurrent,
          })}
          data-color="red"
        >
          <AlertCircle />
        </IconWrapper>
      )}
    </ButtonContainer>
  );
};

export default BlockWrapper;
