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
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { colors, spacing } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { AlertCircle, Check, DeleteForever, Link } from "@ndla/icons/editor";
import { Modal, ModalContent } from "@ndla/modal";
import { SafeLinkIconButton } from "@ndla/safelink";
import { IConcept, IConceptSummary } from "@ndla/types-backend/concept-api";
import { ConceptEmbedData, ConceptMetaData } from "@ndla/types-embed";
import { ConceptEmbed, InlineConcept } from "@ndla/ui";
import { ConceptInlineElement } from "./interfaces";
import { TYPE_CONCEPT_INLINE } from "./types";
import { PUBLISHED } from "../../../../../constants";
import { ConceptType } from "../../../../../containers/ConceptPage/conceptInterfaces";
import { useFetchConceptData } from "../../../../../containers/FormikForm/formikConceptHooks";
import { useConceptVisualElement } from "../../../../../modules/embed/queries";
import parseMarkdown from "../../../../../util/parseMarkdown";
import ConceptModalContent from "../ConceptModalContent";
import EditGlossExamplesModal from "../EditGlossExamplesModal";
import { getGlossDataAttributes } from "../utils";

const getConceptDataAttributes = (concept: IConcept | IConceptSummary, title: string): ConceptEmbedData => ({
  contentId: concept.id.toString(),
  linkText: title,
  resource: "concept",
  type: "inline",
  ...(concept.conceptType === "gloss" && concept.glossData?.examples.length
    ? getGlossDataAttributes(concept.glossData)
    : {}),
});

interface Props {
  element: ConceptInlineElement;
  locale: string;
  editor: Editor;
  attributes: RenderElementProps["attributes"];
  children: ReactNode;
}

const StyledIconWrapper = styled.div`
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

const ConceptWrapper = styled.div`
  position: relative;
  display: inline;
`;

const HiddenChildren = styled.div`
  position: absolute;
  left: 0;
  display: none;
`;

const InlineWrapper = (props: Props) => {
  const { t } = useTranslation();
  const { children, element, locale, editor, attributes } = props;
  const nodeText = Node.string(element).trim();
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const { concept, subjects, loading, fetchSearchTags, conceptArticles, createConcept, updateConcept } =
    useFetchConceptData(parseInt(element.data.contentId), locale);

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
      return parse(parseMarkdown({ markdown: embed.data.concept.content.content }));
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
    const data = getConceptDataAttributes(addedConcept, nodeText);
    if (element) {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        { data },
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

  return (
    <Modal open={isEditing}>
      <ConceptWrapper {...attributes}>
        {/* Without a hidden clone of children, inserting a new concept will crash the app, as ConceptEmbed won't render it yet*/}
        <HiddenChildren>{children}</HiddenChildren>
        {!embed ? (
          <Spinner />
        ) : embed.status === "error" ? (
          <ConceptEmbed embed={embed} />
        ) : (
          <InlineConcept
            title={embed.data.concept.title}
            content={parsedContent}
            metaImage={embed.data.concept.metaImage}
            copyright={embed.data.concept.copyright}
            source={embed.data.concept.source}
            visualElement={embed.data.visualElement}
            // This is where we expect children to exist, but it only exists after data has been fetched.
            linkText={children}
            conceptType={embed.data.concept.conceptType}
            glossData={embed.data.concept.glossData}
            exampleIds={embed.embedData.exampleIds}
            exampleLangs={embed.embedData.exampleLangs}
            headerButtons={
              <>
                {concept?.status.current === PUBLISHED ||
                  (concept?.status.other.includes(PUBLISHED) && (
                    <StyledIconWrapper
                      data-color="green"
                      aria-label={t("form.workflow.published")}
                      title={t("form.workflow.published")}
                    >
                      <Check />
                    </StyledIconWrapper>
                  ))}
                {concept?.status.current !== PUBLISHED && (
                  <StyledIconWrapper
                    data-color="red"
                    aria-label={t("form.workflow.currentStatus", {
                      status: t(`form.status.${concept?.status.current.toLowerCase()}`),
                    })}
                    title={t("form.workflow.currentStatus", {
                      status: t(`form.status.${concept?.status.current.toLowerCase()}`),
                    })}
                  >
                    <AlertCircle />
                  </StyledIconWrapper>
                )}
                <IconButtonV2
                  colorTheme="danger"
                  variant="ghost"
                  onClick={handleRemove}
                  aria-label={t(`form.${concept?.conceptType}.remove`)}
                  title={t(`form.${concept?.conceptType}.remove`)}
                >
                  <DeleteForever />
                </IconButtonV2>
                {concept && (
                  <EditGlossExamplesModal concept={concept} editor={editor} element={element} embed={embed} />
                )}
                <SafeLinkIconButton
                  to={`/${concept?.conceptType}/${concept?.id}/edit/${concept?.content?.language}`}
                  target="_blank"
                  colorTheme="lighter"
                  variant="ghost"
                  title={t(`form.${concept?.conceptType}.edit`)}
                  aria-label={t(`form.${concept?.conceptType}.edit`)}
                >
                  <Link />
                </SafeLinkIconButton>
              </>
            }
          />
        )}
      </ConceptWrapper>
      <ModalContent size={{ width: "large", height: "large" }}>
        <ConceptModalContent
          onClose={onClose}
          addConcept={addConcept}
          locale={locale}
          concept={concept}
          subjects={subjects}
          handleRemove={handleRemove}
          selectedText={nodeText}
          fetchSearchTags={fetchSearchTags}
          createConcept={createConcept}
          updateConcept={updateConcept}
          conceptArticles={conceptArticles}
          conceptType={(concept?.conceptType ?? element.conceptType) as ConceptType}
        />
      </ModalContent>
    </Modal>
  );
};

export default InlineWrapper;
