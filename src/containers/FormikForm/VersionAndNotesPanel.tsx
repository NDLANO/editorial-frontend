/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState, Fragment } from 'react';
import { spacing, colors } from '@ndla/core';
import { css } from '@emotion/core';
import { useTranslation } from 'react-i18next';
import Accordion, {
  AccordionWrapper,
  AccordionPanel,
  StyledAccordionsPanelItemsWrapper,
  AccordionBar,
} from '@ndla/accordion';
import { VersionLogTag, VersionHistory } from '@ndla/editor';

import FormikField from '../../components/FormikField';
import * as draftApi from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import AddNotesField from './AddNotesField';
import formatDate from '../../util/formatDate';
import { fetchAuth0UsersFromUserIds, SimpleUserType } from '../../modules/auth0/auth0Api';
import VersionActionbuttons from './VersionActionButtons';
import * as articleApi from '../../modules/article/articleApi';
import Spinner from '../../components/Spinner';
import { Note } from '../../interfaces';
import { DraftApiType, UpdatedDraftApiType } from '../../modules/draft/draftApiInterfaces';
import { ArticleFormType } from './articleFormHooks';
import { useMessages } from '../Messages/MessagesProvider';
import {
  draftApiTypeToLearningResourceFormType,
  draftApiTypeToTopicArticleFormType,
} from '../ArticlePage/articleTransformers';

const paddingPanelStyleInside = css`
  background: ${colors.brand.greyLightest};
  padding: 0 ${spacing.normal};
`;

const getUser = (userId: string, allUsers: SimpleUserType[]) => {
  const user = allUsers.find(user => user.id === userId);
  return user?.name || '';
};

interface Props {
  article: DraftApiType;
  setValues(values: ArticleFormType, shouldValidate?: boolean): void;
  getArticle: (preview: boolean) => UpdatedDraftApiType;
  setStatus: (status?: any) => void;
  type: 'standard' | 'topic-article';
}

const VersionAndNotesPanel = ({ article, setValues, getArticle, setStatus, type }: Props) => {
  const { t } = useTranslation();
  const [versions, setVersions] = useState<DraftApiType[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<SimpleUserType[]>([]);
  const { createMessage } = useMessages();
  useEffect(() => {
    const getVersions = async () => {
      try {
        setLoading(true);
        const versions = await draftApi.fetchDraftHistory(article.id, article.title?.language);
        setVersions(versions);
        setLoading(false);
      } catch (e) {
        handleError(e);
        setLoading(false);
      }
    };
    getVersions();
  }, [article]);

  useEffect(() => {
    if (versions.length) {
      const notes = versions.reduce((acc: Note[], v) => [...acc, ...v.notes], []);
      const userIds = notes.map(note => note.user).filter(user => user !== 'System');
      fetchAuth0UsersFromUserIds(userIds, setUsers);
    }
  }, [versions]);

  const cleanupNotes = (notes: Note[]) =>
    notes.map((note, idx) => ({
      ...note,
      id: idx,
      author: getUser(note.user, users),
      date: formatDate(note.timestamp),
      status: t(`form.status.${note.status.current.toLowerCase()}`),
    }));

  const resetVersion = async (
    version: DraftApiType,
    language: string,
    showFromArticleApi: boolean,
  ) => {
    try {
      let newArticle: DraftApiType = version;
      if (showFromArticleApi) {
        const articleApiArticle = await articleApi.getArticle(article.id, language);
        newArticle = {
          ...articleApiArticle,
          notes: [],
          editorLabels: [],
          relatedContent: [],
          status: { current: 'PUBLISHED', other: [] },
        };
      }
      const transform =
        type === 'standard'
          ? draftApiTypeToLearningResourceFormType
          : draftApiTypeToTopicArticleFormType;
      const newValues = transform({ ...newArticle, status: version.status }, language);
      setValues(newValues);
      setStatus('revertVersion');
      createMessage({
        message: t('form.resetToProd.success'),
        severity: 'success',
      });
    } catch (e) {
      handleError(e);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <FormikField name="notes" showError={false}>
        {({ field, form: { errors, touched } }) => (
          <AddNotesField
            showError={!!errors[field.name]}
            labelAddNote={t('form.notes.add')}
            labelRemoveNote={t('form.notes.remove')}
            labelWarningNote={errors[field.name]}
            {...field}
          />
        )}
      </FormikField>
      <Accordion openIndexes={[0]} tiny>
        {({
          getPanelProps,
          getBarProps,
        }: {
          getPanelProps: (index: number) => object;
          getBarProps: (index: number) => object;
        }) => (
          <AccordionWrapper>
            {versions.map((version, index) => {
              const {
                revision,
                updated,
                status: { current, other },
                notes,
              } = version;
              const isLatestVersion = index === 0;
              const published = current === 'PUBLISHED' || other.some(s => s === 'PUBLISHED');
              const showFromArticleApi = versions.length === 1 && published;
              return (
                <Fragment key={revision}>
                  <AccordionBar {...getBarProps(index)} title={revision}>
                    <StyledAccordionsPanelItemsWrapper>
                      <div>{formatDate(updated)}</div>
                      <div>
                        <VersionActionbuttons
                          showFromArticleApi={showFromArticleApi}
                          current={isLatestVersion}
                          version={version}
                          resetVersion={resetVersion}
                          article={article}
                          getArticle={getArticle}
                        />
                        {isLatestVersion && (
                          <VersionLogTag color="yellow" label={t('form.notes.areHere')} />
                        )}
                        {published && (!isLatestVersion || versions.length === 1) && (
                          <VersionLogTag color="green" label={t('form.notes.published')} />
                        )}
                      </div>
                    </StyledAccordionsPanelItemsWrapper>
                  </AccordionBar>
                  <AccordionPanel {...getPanelProps(index)} css={paddingPanelStyleInside}>
                    <VersionHistory notes={cleanupNotes(notes)} />
                  </AccordionPanel>
                </Fragment>
              );
            })}
          </AccordionWrapper>
        )}
      </Accordion>
    </>
  );
};

export default VersionAndNotesPanel;
