/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { toUnicode } from "punycode";
import { useEffect, useRef, useState, ReactNode, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { DialogOpenChangeDetails, Portal } from "@ark-ui/react";
import { PencilFill, DeleteBinLine } from "@ndla/icons";
import { DialogContent, DialogRoot, DialogTrigger, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { RelatedContentEmbedData, RelatedContentMetaData } from "@ndla/types-embed";
import { EmbedWrapper, RelatedArticleList, RelatedContentEmbed } from "@ndla/ui";
import EditRelated from "./EditRelated";
import { RelatedElement } from "./types";
import { useTaxonomyVersion } from "../../../../containers/StructureVersion/TaxonomyVersionProvider";
import { fetchDraft } from "../../../../modules/draft/draftApi";
import { fetchNodes } from "../../../../modules/nodes/nodeApi";
import { toEditFrontPageArticle, toEditLearningResource, toEditTopicArticle } from "../../../../util/routeHelpers";

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: RelatedElement;
  children: ReactNode;
}

const ButtonWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

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
  const parsedId = parseInt(embedData.articleId ?? "");
  let article: IArticleDTO | undefined;
  if (!isNaN(parsedId)) {
    article = await fetchDraft(parsedId, language).catch(() => undefined);
  }

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
          url: func(article.id, language),
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

const RelatedArticleBox = ({ attributes, editor, element, children }: Props) => {
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

  const setNodeData = useCallback(
    (data: RelatedContentEmbedData[]) => {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes<RelatedElement>(editor, { data }, { at: path, voids: true });
    },
    [editor, element],
  );

  const insertInternal = useCallback(
    async (articleId: string) => {
      const existingNodes = element.data;
      const exists = existingNodes.some((embed) => embed.articleId === articleId);
      if (exists) {
        return;
      }
      const newEmbed: RelatedContentEmbedData = {
        resource: "related-content",
        articleId,
      };
      const embed = await internalEmbedToMeta(
        { resource: "related-content", articleId },
        i18n.language,
        taxonomyVersion,
      );
      setEmbeds((embeds) => embeds.concat(embed));
      setNodeData(existingNodes.concat(newEmbed));
    },
    [element.data, i18n.language, setNodeData, taxonomyVersion],
  );

  const deleteElement = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.removeNodes(editor, { at: path });
    }, 0);
  }, [editor, element]);

  const updateArticles = useCallback(
    (newEmbeds: RelatedContentMetaData[]) => {
      setEmbeds(newEmbeds.filter((a) => !!a));
      setNodeData(newEmbeds.map((embed) => embed.embedData));
    },
    [setNodeData],
  );

  const onOpenChange = useCallback((details: DialogOpenChangeDetails) => {
    setEditMode(details.open);
  }, []);

  return (
    <DialogRoot open={editMode} onOpenChange={onOpenChange}>
      <EmbedWrapper contentEditable={false} {...attributes}>
        <Portal>
          <DialogContent data-testid="editRelated">
            <EditRelated
              embeds={embeds}
              insertExternal={insertExternal}
              onInsertBlock={insertInternal}
              updateArticles={updateArticles}
            />
          </DialogContent>
        </Portal>
        <RelatedArticleList
          data-testid="relatedWrapper"
          headingButtons={
            <ButtonWrapper>
              <DialogTrigger asChild>
                <IconButton aria-label={t("form.edit")} variant="tertiary" size="small" title={t("form.edit")}>
                  <PencilFill />
                </IconButton>
              </DialogTrigger>

              <IconButton
                onClick={deleteElement}
                aria-label={t("delete")}
                variant="danger"
                title={t("delete")}
                size="small"
              >
                <DeleteBinLine />
              </IconButton>
            </ButtonWrapper>
          }
        >
          {embeds.map((embed, index) => (
            <RelatedContentEmbed key={`related-${index}`} embed={embed} />
          ))}
        </RelatedArticleList>
        {children}
      </EmbedWrapper>
    </DialogRoot>
  );
};

export default RelatedArticleBox;
