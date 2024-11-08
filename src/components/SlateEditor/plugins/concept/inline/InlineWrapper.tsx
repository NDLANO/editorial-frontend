/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useState, ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Node, Transforms, Path } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
import { DeleteBinLine } from "@ndla/icons/action";
import { ErrorWarningFill } from "@ndla/icons/common";
import { CheckLine, Link } from "@ndla/icons/editor";
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  Figure,
  IconButton,
  DialogRoot,
  DialogContent,
} from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IConcept, IConceptSummary } from "@ndla/types-backend/concept-api";
import { ConceptEmbedData, ConceptMetaData } from "@ndla/types-embed";
import { ConceptEmbed, Concept, Gloss, ConceptInlineTriggerButton } from "@ndla/ui";
import { ConceptInlineElement } from "./interfaces";
import { TYPE_CONCEPT_INLINE } from "./types";
import { PUBLISHED } from "../../../../../constants";
import { ConceptType } from "../../../../../containers/ConceptPage/conceptInterfaces";
import { useFetchConceptData } from "../../../../../containers/FormikForm/formikConceptHooks";
import { useConceptVisualElement } from "../../../../../modules/embed/queries";
import { useArticleLanguage } from "../../../ArticleLanguageProvider";
import ConceptModalContent from "../ConceptModalContent";
import EditGlossExamplesModal from "../EditGlossExamplesModal";
import { getGlossDataAttributes } from "../utils";

const getConceptDataAttributes = (
  concept: IConcept | IConceptSummary,
  title: string,
  locale: string,
): ConceptEmbedData => ({
  contentId: concept.id.toString(),
  linkText: title,
  resource: "concept",
  type: "inline",
  ...(concept.conceptType === "gloss" && concept.glossData?.examples.length
    ? getGlossDataAttributes(concept.glossData, locale)
    : {}),
});

interface Props {
  element: ConceptInlineElement;
  editor: Editor;
  attributes: RenderElementProps["attributes"];
  children: ReactNode;
}

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    width: "surface.xlarge",
    maxHeight: "50vh",
    overflowY: "auto",
  },
});

const ButtonWrapper = styled("div", {
  base: {
    display: "inline-flex",
    gap: "3xsmall",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
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

const InlineWrapper = (props: Props) => {
  const { t } = useTranslation();
  const { children, element, editor, attributes } = props;
  const nodeText = Node.string(element).trim();
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const locale = useArticleLanguage();
  const { concept, subjects, loading, conceptArticles, createConcept, updateConcept } = useFetchConceptData(
    parseInt(element.data.contentId),
    locale,
  );

  const visualElementQuery = useConceptVisualElement(concept?.id!, concept?.visualElement?.visualElement!, locale, {
    enabled: !!concept?.id && !!concept?.visualElement?.visualElement.length,
  });

  const embed: ConceptMetaData | undefined = useMemo(() => {
    // This will be in an error state until the data is either fetched or fails, allowing
    // us to show normal text while loading. If the data is fetched, ConceptEmbed automatically updates.
    if (!element.data || !concept) return undefined;

    return {
      status: !concept && !loading ? "error" : "success",
      data: { concept, visualElement: visualElementQuery.data },
      embedData: element.data,
      resource: "concept",
    };
  }, [concept, element.data, loading, visualElementQuery.data]);

  const parsedContent = useMemo(() => {
    if (embed?.status === "success" && !!embed.data.concept.content) {
      return parse(embed.data.concept.content.content);
    }
  }, [embed]);

  const handleSelectionChange = (isNewConcept: boolean) => {
    ReactEditor.focus(editor);
    if (isNewConcept) {
      Transforms.select(editor, Path.next(ReactEditor.findPath(editor, element)));
      Transforms.collapse(editor, { edge: "start" });
    } else {
      Transforms.select(editor, ReactEditor.findPath(editor, element));
    }
  };

  const addConcept = (addedConcept: IConceptSummary | IConcept) => {
    setIsEditing(false);
    handleSelectionChange(true);
    const data = getConceptDataAttributes(addedConcept, nodeText, locale);
    if (element) {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes<ConceptInlineElement>(
        editor,
        { data, isFirstEdit: false },
        {
          at: path,
          match: (node) => Element.isElement(node) && node.type === TYPE_CONCEPT_INLINE,
        },
      );
    }
  };

  const handleRemove = () => {
    handleSelectionChange(false);
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_CONCEPT_INLINE,
    });
  };

  const onClose = () => {
    if (!element.data.contentId) {
      handleRemove();
    } else {
      handleSelectionChange(false);
    }
  };

  const maybeAudio =
    embed?.status === "success" &&
    embed.data.visualElement?.resource === "audio" &&
    embed.data.visualElement.status === "success"
      ? {
          src: embed.data.visualElement.data.audioFile.url,
          title: embed.data.visualElement.data.title.title,
        }
      : undefined;

  return (
    <>
      {!embed ? (
        children
      ) : embed.status === "error" ? (
        <ConceptEmbed embed={embed} />
      ) : (
        <PopoverRoot>
          <PopoverTrigger asChild {...attributes}>
            <ConceptInlineTriggerButton>{children}</ConceptInlineTriggerButton>
          </PopoverTrigger>
          <Portal>
            <StyledPopoverContent>
              <ButtonWrapper>
                {(concept?.status.current === PUBLISHED || concept?.status.other.includes(PUBLISHED)) && (
                  <StyledCheckLine aria-label={t("form.workflow.published")} title={t("form.workflow.published")} />
                )}
                {concept?.status.current !== PUBLISHED && (
                  <StyledErrorWarningFill
                    aria-label={t("form.workflow.currentStatus", {
                      status: t(`form.status.${concept?.status.current.toLowerCase()}`),
                    })}
                    title={t("form.workflow.currentStatus", {
                      status: t(`form.status.${concept?.status.current.toLowerCase()}`),
                    })}
                  />
                )}
                <IconButton
                  variant="danger"
                  size="small"
                  onClick={handleRemove}
                  aria-label={t(`form.${concept?.conceptType}.remove`)}
                  title={t(`form.${concept?.conceptType}.remove`)}
                >
                  <DeleteBinLine />
                </IconButton>
                {concept && (
                  <EditGlossExamplesModal concept={concept} editor={editor} element={element} embed={embed} />
                )}
                <SafeLinkIconButton
                  to={`/${concept?.conceptType}/${concept?.id}/edit/${concept?.content?.language}`}
                  target="_blank"
                  variant="tertiary"
                  size="small"
                  title={t(`form.${concept?.conceptType}.edit`)}
                  aria-label={t(`form.${concept?.conceptType}.edit`)}
                >
                  <Link />
                </SafeLinkIconButton>
              </ButtonWrapper>
              {concept?.glossData ? (
                <Figure>
                  <Gloss glossData={concept.glossData} title={concept.title} audio={maybeAudio} />
                </Figure>
              ) : (
                <Concept
                  copyright={embed.data.concept.copyright}
                  visualElement={embed.data.visualElement}
                  lang={locale}
                  title={embed.data.concept.title.title}
                  source={embed.data.concept.source}
                >
                  {parsedContent}
                </Concept>
              )}
            </StyledPopoverContent>
          </Portal>
        </PopoverRoot>
      )}
      <DialogRoot
        open={isEditing}
        onOpenChange={({ open }) => setIsEditing(open)}
        onEscapeKeyDown={(e) => e.stopPropagation()}
        onExitComplete={() => {
          if (!embed) {
            handleRemove();
          }
          ReactEditor.focus(editor);
        }}
        size="large"
      >
        <Portal>
          <DialogContent>
            <ConceptModalContent
              onClose={onClose}
              addConcept={addConcept}
              locale={locale}
              concept={concept}
              subjects={subjects}
              handleRemove={handleRemove}
              selectedText={nodeText}
              createConcept={createConcept}
              updateConcept={updateConcept}
              conceptArticles={conceptArticles}
              conceptType={(concept?.conceptType ?? element.conceptType) as ConceptType}
            />
          </DialogContent>
        </Portal>
      </DialogRoot>
    </>
  );
};

export default InlineWrapper;
