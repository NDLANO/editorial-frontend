/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { toUnicode } from "punycode";
import { useEffect, useRef, useState, MouseEvent, ReactNode, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { Root, Anchor, Portal } from "@radix-ui/react-popover";
import { spacing } from "@ndla/core";
import { Pencil } from "@ndla/icons/action";
import { DeleteForever } from "@ndla/icons/editor";
import { IconButton } from "@ndla/primitives";
import { RelatedContentEmbedData, RelatedContentMetaData } from "@ndla/types-embed";
import { RelatedArticleList, RelatedContentEmbed } from "@ndla/ui";
import { RelatedElement } from ".";
import EditRelated from "./EditRelated";
import { useTaxonomyVersion } from "../../../../containers/StructureVersion/TaxonomyVersionProvider";
import { fetchDraft } from "../../../../modules/draft/draftApi";
import { fetchNodes } from "../../../../modules/nodes/nodeApi";
import { toEditFrontPageArticle, toEditLearningResource, toEditTopicArticle } from "../../../../util/routeHelpers";
import Overlay from "../../../Overlay";

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: RelatedElement;
  onRemoveClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

const ButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
`;

const externalEmbedToMeta = async (embedData: RelatedContentEmbedData): Promise<RelatedContentMetaData> => {
  return {
    resource: "related-content",
    embedData,
    status: "success",
    data: undefined,
  };
};

const internalEmbedToMeta = async (
  embedData: RelatedContentEmbedData,
  language: string,
  taxonomyVersion: string,
): Promise<RelatedContentMetaData> => {
  const article = await fetchDraft(embedData.articleId!, language).catch(() => undefined);
  const nodes = await fetchNodes({
    taxonomyVersion,
    contentURI: `urn:article:${embedData.articleId}`,
    language: language,
  }).catch(() => undefined);

  if (!!article && !!nodes?.length) {
    const func =
      article.articleType === "frontpage-article"
        ? toEditFrontPageArticle
        : article.articleType === "topic-article"
          ? toEditTopicArticle
          : toEditLearningResource;
    return {
      resource: "related-content",
      embedData,
      status: "success",
      data: {
        article,
        resource: {
          ...nodes[0],
          path: func(article.id, language),
          // Overriding paths is required in order to make ed links work
          paths: [],
        },
      },
    };
  } else {
    return {
      resource: "related-content",
      embedData,
      status: "error",
      message: "Failed to fetch data",
    };
  }
};

const embedsToMeta = async (embeds: RelatedContentEmbedData[], language: string, taxonomyVersion: string) => {
  const promises = embeds.map((embed) => {
    if (embed.articleId) {
      return internalEmbedToMeta(embed, language, taxonomyVersion);
    } else {
      return externalEmbedToMeta(embed);
    }
  });
  return await Promise.all(promises);
};

const RelatedArticleBox = ({ attributes, editor, element, onRemoveClick, children }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [editMode, setEditMode] = useState(false);
  const [embeds, setEmbeds] = useState<RelatedContentMetaData[]>([]);
  const firstRender = useRef(true);

  useEffect(() => {
    if (!firstRender.current) {
      return;
    }
    if (!!element?.data?.length && firstRender.current) {
      embedsToMeta(element.data, i18n.language, taxonomyVersion).then(setEmbeds);
      firstRender.current = false;
    } else {
      setTimeout(() => setEditMode(true), 0);
    }
  }, [element.data, i18n.language, taxonomyVersion]);

  const insertExternal = async (title: string, url: string) => {
    const newEmbed: RelatedContentEmbedData = {
      resource: "related-content",
      title,
      url,
      urlDomain: toUnicode(new URL(url).hostname),
    };
    const nodeData = (element.data ?? []).concat(newEmbed);
    setNodeData(nodeData);
    const newMetaData = await externalEmbedToMeta(newEmbed);
    setEmbeds((embeds) => embeds.concat(newMetaData));
  };

  const insertInternal = async (articleId: string) => {
    const existingNodes = element.data;
    const exists = existingNodes.some((embed) => embed.articleId === articleId);
    if (exists) {
      return;
    }
    const newEmbed: RelatedContentEmbedData = {
      resource: "related-content",
      articleId,
    };
    const embed = await internalEmbedToMeta({ resource: "related-content", articleId }, i18n.language, taxonomyVersion);
    setEmbeds((embeds) => embeds.concat(embed));
    setNodeData(existingNodes.concat(newEmbed));
  };

  const setNodeData = (data: RelatedContentEmbedData[]) => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes<RelatedElement>(editor, { data }, { at: path, voids: true });
  };

  const deleteElement = () => {
    const path = ReactEditor.findPath(editor, element);
    ReactEditor.focus(editor);
    Transforms.select(editor, path);
    Transforms.removeNodes(editor, { at: path });
  };

  const updateArticles = (newEmbeds: RelatedContentMetaData[]) => {
    setEmbeds(newEmbeds.filter((a) => !!a));
    setNodeData(newEmbeds.map((embed) => embed.embedData));
  };

  const onOpenChange = useCallback(() => {
    setEditMode(false);
  }, []);

  return (
    <div contentEditable={false} {...attributes}>
      {editMode && <Overlay />}
      <Root open={editMode} onOpenChange={onOpenChange}>
        <Anchor />
        <Portal>
          <EditRelated
            data-testid="editRelated"
            onRemoveClick={onRemoveClick}
            embeds={embeds}
            insertExternal={insertExternal}
            onInsertBlock={insertInternal}
            updateArticles={updateArticles}
          />
        </Portal>
      </Root>
      <RelatedArticleList
        data-testid="relatedWrapper"
        headingButtons={
          <ButtonWrapper>
            <IconButton
              onClick={() => setEditMode(true)}
              aria-label={t("form.edit")}
              variant="tertiary"
              size="small"
              title={t("form.edit")}
            >
              <Pencil />
            </IconButton>

            <IconButton
              onClick={deleteElement}
              aria-label={t("delete")}
              variant="danger"
              title={t("delete")}
              size="small"
            >
              <DeleteForever />
            </IconButton>
          </ButtonWrapper>
        }
      >
        {embeds.map((embed, index) => (
          <RelatedContentEmbed key={`related-${index}`} embed={embed} />
        ))}
      </RelatedArticleList>
      {children}
    </div>
  );
};

export default RelatedArticleBox;
