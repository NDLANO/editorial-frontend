/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState, memo } from 'react';

import { AccordionTrigger } from '@radix-ui/react-accordion';
import { ButtonV2 } from '@ndla/button';
import { spacing, colors, fonts } from '@ndla/core';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { AccordionRoot, AccordionItem, AccordionContent } from '@ndla/accordion';
import { VersionLogTag, VersionHistory } from '@ndla/editor';
import { Text } from '@ndla/typography';
import { ChevronRight } from '@ndla/icons/common';
import { IArticle, IEditorNote } from '@ndla/types-backend/draft-api';
import FormikField from '../../components/FormikField';
import { fetchDraftHistory } from '../../modules/draft/draftApi';
import handleError from '../../util/handleError';
import AddNotesField from './AddNotesField';
import formatDate from '../../util/formatDate';
import { fetchAuth0UsersFromUserIds, SimpleUserType } from '../../modules/auth0/auth0Api';
import VersionActionbuttons from './VersionActionButtons';
import * as articleApi from '../../modules/article/articleApi';
import Spinner from '../../components/Spinner';
import { FormikStatus } from '../../interfaces';
import { useMessages } from '../Messages/MessagesProvider';
import { useSession } from '../../containers/Session/SessionProvider';
import {
  draftApiTypeToLearningResourceFormType,
  draftApiTypeToTopicArticleFormType,
} from '../ArticlePage/articleTransformers';

const StyledAccordionBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacing.small};
  background-color: ${colors.brand.light};
  button {
    font-weight: ${fonts.weight.semibold};
  }
`;

const InfoGrouping = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const StyledAccordionItem = styled(AccordionItem)`
  border-radius: 0px;
  border: none;
  svg {
    transition: all 200ms;
  }
  &[data-state='open'] {
    svg[data-open-indicator] {
      transform: rotate(90deg);
    }
  }
`;

const StyledButton = styled(ButtonV2)`
  box-shadow: none;
  text-decoration: underline;
  &:hover,
  &:focus-visible,
  &:active {
    text-decoration: none;
  }
`;

const StyledAccordionRoot = styled(AccordionRoot)`
  gap: 0px;
  padding: ${spacing.normal} 0px;
`;

const StyledAccordionContent = styled(AccordionContent)`
  background-color: ${colors.brand.greyLightest};
`;

const getUser = (userId: string, allUsers: SimpleUserType[]) => {
  const user = allUsers.find((user) => user.id === userId);
  return user?.name || '';
};

interface Props {
  article: IArticle;
  type: 'standard' | 'topic-article';
  currentLanguage: string;
}

const VersionAndNotesPanel = ({ article, type, currentLanguage }: Props) => {
  const { t } = useTranslation();
  const { ndlaId } = useSession();
  const [versions, setVersions] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<SimpleUserType[]>([]);
  const { createMessage } = useMessages();
  const { setStatus, setValues } = useFormikContext();

  useEffect(() => {
    const getVersions = async () => {
      try {
        setLoading(true);
        const versions = await fetchDraftHistory(article.id, article.title?.language);
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
      const notes = versions.reduce((acc: IEditorNote[], v) => [...acc, ...v.notes], []);
      const userIds = notes.map((note) => note.user).filter((user) => user !== 'System');
      fetchAuth0UsersFromUserIds(userIds, setUsers);
    }
  }, [versions]);

  const cleanupNotes = (notes: IEditorNote[]) =>
    notes.map((note, idx) => ({
      ...note,
      id: idx,
      author: getUser(note.user, users),
      date: formatDate(note.timestamp),
      status: t(`form.status.${note.status.current.toLowerCase()}`),
    }));

  const resetVersion = async (version: IArticle, language: string, showFromArticleApi: boolean) => {
    try {
      let newArticle: IArticle = version;
      if (showFromArticleApi) {
        const articleApiArticle = await articleApi.getArticle(article.id, language);
        newArticle = {
          ...articleApiArticle,
          notes: [],
          editorLabels: [],
          relatedContent: [],
          revisions: [],
          status: { current: 'PUBLISHED', other: [] },
          comments: [],
          prioritized: false,
          started: false,
        };
      }
      const transform =
        type === 'standard'
          ? draftApiTypeToLearningResourceFormType
          : draftApiTypeToTopicArticleFormType;
      const newValues = transform(
        { ...newArticle, status: version.status, responsible: article.responsible },
        language,
        ndlaId,
      );

      setValues(newValues);
      setStatus((prevStatus: FormikStatus) => ({ ...prevStatus, status: 'revertVersion' }));
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
        {({ field, form: { errors } }) => (
          <AddNotesField
            showError={!!errors[field.name]}
            labelAddNote={t('form.notes.add')}
            labelRemoveNote={t('form.notes.remove')}
            labelWarningNote={errors[field.name]}
            {...field}
          />
        )}
      </FormikField>
      <StyledAccordionRoot type="multiple">
        {versions.map((version, index) => {
          const isLatestVersion = index === 0;
          const published =
            version.status.current === 'PUBLISHED' ||
            version.status.other.some((s) => s === 'PUBLISHED');
          return (
            <StyledAccordionItem value={version.revision.toString()} key={version.revision}>
              <StyledAccordionBar>
                <InfoGrouping>
                  <AccordionTrigger asChild>
                    <StyledButton variant="link">
                      <ChevronRight data-open-indicator="" />
                      {version.revision}
                    </StyledButton>
                  </AccordionTrigger>
                  <Text element="span" margin="none" textStyle="meta-text-small">
                    {formatDate(version.updated)}
                  </Text>
                </InfoGrouping>
                <InfoGrouping>
                  <VersionActionbuttons
                    showFromArticleApi={versions.length === 1 && published}
                    current={isLatestVersion}
                    version={version}
                    resetVersion={resetVersion}
                    article={article}
                    currentLanguage={currentLanguage}
                  />
                  {isLatestVersion && (
                    <VersionLogTag color="yellow" label={t('form.notes.areHere')} />
                  )}
                  {published && (!isLatestVersion || versions.length === 1) && (
                    <VersionLogTag color="green" label={t('form.notes.published')} />
                  )}
                </InfoGrouping>
              </StyledAccordionBar>
              <StyledAccordionContent>
                <VersionHistory notes={cleanupNotes(version.notes)} />
              </StyledAccordionContent>
            </StyledAccordionItem>
          );
        })}
      </StyledAccordionRoot>
    </>
  );
};

export default memo(VersionAndNotesPanel);
