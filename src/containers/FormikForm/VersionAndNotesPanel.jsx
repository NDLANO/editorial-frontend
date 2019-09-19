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
import { injectT } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import Accordion, {
  AccordionWrapper,
  AccordionPanel,
  StyledAccordionsPanelItemsWrapper,
  StyledAccordionsPanelIconButton,
  AccordionBar,
} from '@ndla/accordion';
import { VersionLogTag, VersionHistory } from '@ndla/editor';
import FormikField from '../../components/FormikField';
import * as draftApi from '../../modules/draft/draftApi';
import { ArticleShape } from '../../shapes';
import handleError from '../../util/handleError';
import FormikAddNotes from './FormikAddNotes';
import formatDate from '../../util/formatDate';
import { fetchAuth0Users } from '../../modules/auth0/auth0Api';

const paddingPanelStyleInside = css`
  background: ${colors.brand.greyLightest};
  padding: 0 ${spacing.normal};
`;

const getUser = (userId, allUsers) => {
  const user = allUsers.find(user => user.id === userId) || {};
  return user.name || '';
};

const getUsersFromNotes = async (notes, setUsers) => {
  const userIds = notes
    .map(note => note.user)
    .filter(user => user !== 'System');
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

const VersionAndNotesPanel = ({ t, article }) => {
  const [versions, setVersions] = useState([]);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getVersions = async () => {
      try {
        const versions = await draftApi.fetchDraftHistory(
          article.id,
          article.language,
        );
        setVersions(versions);
      } catch (e) {
        handleError(e);
      }
    };
    getVersions();
  }, [article]);

  useEffect(() => {
    if (versions.length) {
      getUsersFromNotes(versions[0].notes, setUsers);
    }
  }, [versions]);

  const cleanupNotes = notes =>
    notes.map(note => ({
      ...note,
      author: getUser(note.user, users),
      date: formatDate(note.timestamp),
      status: note.status.current,
    }));

  return (
    <Accordion openIndexes={[0]} tiny>
      {({ getPanelProps, getBarProps }) => (
        <AccordionWrapper>
          {versions.map(({ revision, updated, published, notes }, index) => {
            const current = index === 0;
            return (
              <Fragment key={revision}>
                <AccordionBar {...getBarProps(index)} title={revision}>
                  <StyledAccordionsPanelItemsWrapper>
                    <div>{formatDate(updated)}</div>
                    <div>
                      {!current && (
                        <>
                          <Tooltip tooltip="Se versjon">
                            <StyledAccordionsPanelIconButton
                              onClick={() => console.log('Preview version')} // eslint-disable-line no-console
                            >
                              {/* <Eye /> */}
                            </StyledAccordionsPanelIconButton>
                          </Tooltip>
                          <Tooltip tooltip="Tilbakestill til versjon">
                            <StyledAccordionsPanelIconButton
                              onClick={() =>
                                console.log(
                                  'Are you sure? (modal to confirm revert?)',
                                )
                              } // eslint-disable-line no-console
                            >
                              {/* <Restore /> */}
                            </StyledAccordionsPanelIconButton>
                          </Tooltip>
                        </>
                      )}
                      {current && (
                        <VersionLogTag color="yellow" label="Du er her" />
                      )}
                      {published && (
                        <VersionLogTag color="green" label="Publisert" />
                      )}
                    </div>
                  </StyledAccordionsPanelItemsWrapper>
                </AccordionBar>
                <AccordionPanel
                  {...getPanelProps(index)}
                  css={paddingPanelStyleInside}>
                  <VersionHistory notes={cleanupNotes(notes)}>
                    {current && (
                      <FormikField name="notes" showError={false}>
                        {({ field, form: { errors, touched } }) => (
                          <FormikAddNotes
                            showError={
                              touched[field.name] && !!errors[field.name]
                            }
                            labelAddNote={t('form.notes.add')}
                            labelRemoveNote={t('form.notes.remove')}
                            labelWarningNote={errors[field.name]}
                            {...field}
                          />
                        )}
                      </FormikField>
                    )}
                  </VersionHistory>
                </AccordionPanel>
              </Fragment>
            );
          })}
        </AccordionWrapper>
      )}
    </Accordion>
  );
};

VersionAndNotesPanel.propTypes = {
  values: PropTypes.shape({
    id: PropTypes.number,
    revision: PropTypes.number,
  }),
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  createMessage: PropTypes.func.isRequired,
  getArticle: PropTypes.func.isRequired,
  article: ArticleShape,
  formIsDirty: PropTypes.bool,
  history: PropTypes.object,
};

VersionAndNotesPanel.defaultProps = {
  articleStatus: {
    current: '',
    other: [],
  },
  article: {},
};

export default injectT(VersionAndNotesPanel);
