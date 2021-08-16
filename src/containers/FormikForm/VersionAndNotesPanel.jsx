/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
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
import { ArticleShape } from '../../shapes';
import handleError from '../../util/handleError';
import AddNotesField from './AddNotesField';
import formatDate from '../../util/formatDate';
import { fetchAuth0Users } from '../../modules/auth0/auth0Api';
import { transformArticleFromApiVersion } from '../../util/articleUtil';
import VersionActionbuttons from './VersionActionButtons';
import * as articleApi from '../../modules/article/articleApi';
import Spinner from '../../components/Spinner';

const paddingPanelStyleInside = css`
  background: ${colors.brand.greyLightest};
  padding: 0 ${spacing.normal};
`;

const getUser = (userId, allUsers) => {
  const user = allUsers.find(user => user.id === userId) || {};
  return user.name || '';
};

const getUsersFromNotes = async (notes, setUsers) => {
  const userIds = notes.map(note => note.user).filter(user => user !== 'System');
  const uniqueUserIds = Array.from(new Set(userIds)).join(',');
  const users = await fetchAuth0Users(uniqueUserIds);
  const systemUser = { id: 'System', name: 'System' };
  setUsers(
    users && !users.error
      ? [
          ...users.map(user => ({
            id: user.app_metadata.ndla_id,
            name: user.name,
          })),
          systemUser,
        ]
      : [systemUser],
  );
};

const VersionAndNotesPanel = ({
  article,
  getInitialValues,
  setValues,
  createMessage,
  getArticle,
}) => {
  const {t} = useTranslation();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getVersions = async () => {
      try {
        setLoading(true);
        const versions = await draftApi.fetchDraftHistory(article.id, article.language);
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
      const notes = versions.reduce((acc, v) => [...acc, ...v.notes], []);
      getUsersFromNotes(notes, setUsers);
    }
  }, [versions]);

  const cleanupNotes = notes =>
    notes.map(note => ({
      ...note,
      author: getUser(note.user, users),
      date: formatDate(note.timestamp),
      status: t(`form.status.${note.status.current.toLowerCase()}`),
    }));

  const resetVersion = async (version, language, showFromArticleApi) => {
    try {
      let article = version;
      if (showFromArticleApi) {
        article = await articleApi.getArticle(article.id, article.language);
      }
      const newValues = getInitialValues(
        transformArticleFromApiVersion({ ...article, status: version.status }, language),
      );

      setValues(newValues);
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
        {({ getPanelProps, getBarProps }) => (
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

VersionAndNotesPanel.propTypes = {
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  createMessage: PropTypes.func.isRequired,
  getArticle: PropTypes.func.isRequired,
  article: ArticleShape,
  formIsDirty: PropTypes.bool,
  history: PropTypes.object,
  getInitialValues: PropTypes.func,
  setValues: PropTypes.func,
};

VersionAndNotesPanel.defaultProps = {
  articleStatus: {
    current: '',
    other: [],
  },
  article: {},
};

export default VersionAndNotesPanel;
