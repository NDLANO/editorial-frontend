/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, SyntheticEvent, useCallback, useEffect, useState, MouseEvent } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { uuid } from '@ndla/util';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import { compact } from 'lodash';
import { RelatedArticleList } from '@ndla/ui';
import { toggleRelatedArticles } from '@ndla/article-scripts';
import { IArticle } from '@ndla/types-draft-api';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import { fetchDraft } from '../../../../modules/draft/draftApi';
import { queryResources } from '../../../../modules/taxonomy';
import EditRelated from './EditRelated';
import handleError from '../../../../util/handleError';
import RelatedArticle from './RelatedArticle';
import { RelatedElement } from '.';
import { Resource } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { ARTICLE_EXTERNAL } from '../../../../constants';

interface Props {
  attributes: RenderElementProps['attributes'];
  editor: Editor;
  element: RelatedElement;
  locale?: string;
  onRemoveClick: (e: MouseEvent) => void;
  children: ReactNode;
}
export interface ExternalArticle {
  id: 'external-learning-resources';
  tempId: string;
  url: string;
  title: string;
  description: string;
}

interface InternalArticle extends Omit<IArticle, 'title' | 'id'> {
  resource: Resource[];
  id: string;
  title: string;
}

export type RelatedArticleType = InternalArticle | ExternalArticle;

const mapRelatedArticle = (article: IArticle, resource: Resource[]): InternalArticle => ({
  ...article,
  resource,
  id: article.id.toString(),
  title: convertFieldWithFallback(article as object, 'title', article.title?.title) || '',
});

const RelatedArticleBox = ({ attributes, editor, element, onRemoveClick, children }: Props) => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<RelatedArticleType[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const { data } = element;
    if (data && data.nodes) {
      const articleNodes = data.nodes;
      fetchArticles(articleNodes).then(articles => setArticles(compact(articles)));
    } else {
      setEditMode(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // need to re-add eventhandler on button
    if (!editMode && articles.length > 2) {
      toggleRelatedArticles();
    }
  }, [editMode, articles]);

  const fetchArticle = useCallback(
    async (id: number) => {
      try {
        const [article, resource] = await Promise.all([
          fetchDraft(id, i18n.language),
          queryResources(id, i18n.language),
        ]);
        if (article) {
          return mapRelatedArticle(article, resource);
        }
      } catch (error) {
        handleError(error);
      }
    },
    [i18n.language],
  );

  const fetchArticles = useCallback(
    async (nodes: RelatedElement['data']['nodes']) => {
      if (!nodes) {
        return;
      }
      const articleList = nodes.map(node => {
        if ('article-id' in node) {
          return fetchArticle(Number(node['article-id']));
        } else {
          return Promise.resolve(structureExternal(node.url, node.title));
        }
      });
      return Promise.all<RelatedArticleType | undefined>(articleList);
    },
    [fetchArticle],
  );

  useEffect(() => {
    const articleNodes = element.data.nodes;
    fetchArticles(articleNodes).then(articles => setArticles(compact(articles)));
  }, [element.data.nodes, fetchArticles]);

  const insertExternal = async (url: string, title: string) => {
    // await get description meta data
    const newArticles = [...articles, structureExternal(url, title)];
    setArticles(newArticles);
    setNodeData(newArticles);
  };

  const onInsertBlock = (newArticle: string) => {
    if (!articles.find(it => 'id' in it && it.id === newArticle) && Number(newArticle)) {
      // get resource and add to state
      fetchArticle(Number(newArticle)).then(article => {
        if (article) {
          const newArticles = [...articles, article];
          setArticles(newArticles);
          setNodeData(newArticles);
        }
      });
    }
  };

  const setNodeData = (newArticles: RelatedArticleType[]) => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(
      editor,
      {
        data: {
          nodes: newArticles.map(article => {
            if ('url' in article) {
              return {
                resource: 'related-content',
                url: article.url,
                title: article.title,
              };
            } else {
              return { resource: 'related-content', 'article-id': article.id.toString() };
            }
          }),
        },
      },
      { at: path, voids: true },
    );
  };

  const structureExternal = (url: string, title: string): ExternalArticle => {
    return {
      id: ARTICLE_EXTERNAL,
      tempId: uuid(),
      url,
      title,
      description: '',
    };
  };

  const updateArticles = (newArticles: RelatedArticleType[]) => {
    setArticles(newArticles.filter(a => !!a));
    setNodeData(newArticles);
  };

  const openEditMode = (e: SyntheticEvent) => {
    e.stopPropagation();
    setEditMode(true);
  };

  return (
    <>
      {editMode && (
        <EditRelated
          data-testid="editRelated"
          onRemoveClick={onRemoveClick}
          articles={articles}
          insertExternal={insertExternal}
          onInsertBlock={onInsertBlock}
          onExit={() => setEditMode(false)}
          updateArticles={updateArticles}
        />
      )}
      <div
        role="button"
        draggable
        contentEditable={false}
        tabIndex={0}
        data-testid="relatedWrapper"
        onClick={openEditMode}
        onKeyPress={openEditMode}
        css={css`
          & article > p {
            font-family: Source Sans Pro !important;
          }
        `}
        {...attributes}>
        <RelatedArticleList
          messages={{
            title: t('form.related.title'),
            showMore: t('form.related.showMore'),
            showLess: t('form.related.showLess'),
          }}
          articleCount={articles.length}>
          <>
            {articles.map((item, i) =>
              !('id' in item) ? (
                t('form.content.relatedArticle.invalidArticle')
              ) : (
                <RelatedArticle key={uuid()} numberInList={i} item={item} />
              ),
            )}
          </>
        </RelatedArticleList>
        {children}
      </div>
    </>
  );
};

export default RelatedArticleBox;
