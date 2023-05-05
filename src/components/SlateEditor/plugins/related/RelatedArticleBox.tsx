/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef, useState, MouseEvent, ReactNode } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { RelatedContentEmbedData, RelatedContentMetaData } from '@ndla/types-embed';
import { RelatedArticleListV2, RelatedContentEmbed } from '@ndla/ui';
import { IconButtonV2 } from '@ndla/button';
import { Pencil, TrashCanOutline } from '@ndla/icons/action';
import { fetchDraft } from '../../../../modules/draft/draftApi';
import EditRelated from './EditRelated';
import { RelatedElement } from '.';
import { useTaxonomyVersion } from '../../../../containers/StructureVersion/TaxonomyVersionProvider';
import { fetchNodes } from '../../../../modules/nodes/nodeApi';

interface Props {
  attributes: RenderElementProps['attributes'];
  editor: Editor;
  element: RelatedElement;
  onRemoveClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

const externalEmbedToMeta = async (
  embedData: RelatedContentEmbedData,
  seq: number,
): Promise<RelatedContentMetaData> => {
  return {
    resource: 'related-content',
    embedData,
    seq,
    status: 'success',
    data: undefined,
  };
};

const internalEmbedToMeta = async (
  embedData: RelatedContentEmbedData,
  seq: number,
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
    return {
      resource: 'related-content',
      seq,
      embedData,
      status: 'success',
      data: {
        article,
        resource: nodes[0]!,
      },
    };
  } else {
    return {
      resource: 'related-content',
      seq,
      embedData,
      status: 'error',
      message: 'Failed to fetch data',
    };
  }
};

const embedsToMeta = async (
  embeds: RelatedContentEmbedData[],
  language: string,
  taxonomyVersion: string,
) => {
  const promises = embeds.map((embed, i) => {
    if (embed.articleId) {
      return internalEmbedToMeta(embed, i, language, taxonomyVersion);
    } else {
      return externalEmbedToMeta(embed, i);
    }
  });
  return await Promise.all(promises);
};

const StyledIconButton = styled(IconButtonV2)`
  width: 40px;
  height: 40px;
`;

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
      setEditMode(true);
    }
  }, [element.data, i18n.language, taxonomyVersion]);

  const insertExternal = async (title: string, url: string) => {
    const newEmbed: RelatedContentEmbedData = {
      resource: 'related-content',
      title,
      url,
    };
    const nodeData = (element.data ?? []).concat(newEmbed);
    setNodeData(nodeData);
    const newMetaData = await externalEmbedToMeta(newEmbed, embeds.length + 1);
    setEmbeds((embeds) => embeds.concat(newMetaData));
  };

  const insertInternal = async (articleId: string) => {
    const existingNodes = element.data;
    const exists = existingNodes.some((embed) => embed.articleId === articleId);
    if (exists) {
      return;
    }
    const newEmbed: RelatedContentEmbedData = { resource: 'related-content', articleId };
    const embed = await internalEmbedToMeta(
      { resource: 'related-content', articleId },
      existingNodes.length + 1,
      i18n.language,
      taxonomyVersion,
    );
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

  return (
    <div contentEditable={false} {...attributes}>
      {editMode && (
        <EditRelated
          data-testid="editRelated"
          onRemoveClick={onRemoveClick}
          embeds={embeds}
          insertExternal={insertExternal}
          onInsertBlock={insertInternal}
          onExit={() => setEditMode(false)}
          updateArticles={updateArticles}
        />
      )}
      <RelatedArticleListV2
        data-testid="relatedWrapper"
        headingButtons={
          <div>
            <StyledIconButton
              onClick={() => setEditMode(true)}
              aria-label={t('form.edit')}
              variant="ghost"
            >
              <Pencil />
            </StyledIconButton>
            <StyledIconButton
              onClick={deleteElement}
              aria-label={t('delete')}
              variant="ghost"
              colorTheme="danger"
            >
              <TrashCanOutline />
            </StyledIconButton>
          </div>
        }
      >
        {embeds.map((embed) => (
          <RelatedContentEmbed key={`related-${embed.seq}`} embed={embed} />
        ))}
      </RelatedArticleListV2>
      {children}
    </div>
  );
};

export default RelatedArticleBox;
