/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormHeader } from '@ndla/forms';
import { colors, spacing } from '@ndla/core';
import { injectT } from '@ndla/i18n';
import styled, { css } from 'react-emotion';
import { User, Time } from '@ndla/icons/common';
import { Field } from '../../../components/Fields';
import formatDate from '../../../util/formatDate';
import {
  resolveJsonOrRejectWithError,
  fetchAuthorized,
} from '../../../util/apiHelpers';
import { NoteShape } from '../../../shapes';
import Tag from '../../../components/Tag';

const StyledFormNote = styled('div')`
  display: flex;
  width: 75%;
  flex-direction: column;
  border-bottom: 3px solid ${colors.brand.secondary};
  padding: ${spacing.normal} 0;
  &:last-child {
    border: 0;
  }
`;

const StyledFormNoteHeader = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const StyledFormNoteHeaderText = styled('span')`
  color: ${colors.brand.grey};
`;

const iconStyle = css`
  height: 20px;
  width: 20px;
`;

class FormNotes extends React.Component {
  constructor() {
    super();
    this.getUsername = this.getUsername.bind(this);
    this.state = {
      users: [],
    };
  }

  async componentDidMount() {
    const { notes } = this.props;
    const userIds = notes.map(note => note.user);
    const uniqueUserIds = Array.from(new Set(userIds)).join(',');
    const users = await fetchAuthorized(
      `/get_note_users?userIds=${uniqueUserIds}`,
    ).then(resolveJsonOrRejectWithError);
    this.setState({
      users:
        users && !users.error
          ? users.map(user => ({
              id: user.app_metadata.ndla_id,
              name: user.name,
            }))
          : [],
    });
  }
  getUsername(userId) {
    const { users } = this.state;
    const noteUser = users.find(user => user.id === userId);
    return noteUser ? noteUser.name : '';
  }

  render() {
    const { notes, t } = this.props;

    return (
      <Field>
        <FormHeader title={t('form.notes.history.heading')} width={3 / 4} />
        {notes && notes.length > 0 ? (
          notes.map((note, index) => {
            return (
              <StyledFormNote
                key={
                  /* eslint-disable */ `show_notes_${index}` /* eslint-enable */
                }>
                <StyledFormNoteHeader>
                  <StyledFormNoteHeaderText>
                    <User css={iconStyle} />
                    {this.getUsername(note.user)}
                  </StyledFormNoteHeaderText>
                  <StyledFormNoteHeaderText>
                    <Time css={iconStyle} />
                    {formatDate(note.timestamp, 'nb')}
                  </StyledFormNoteHeaderText>
                  <Tag>
                    {note.status
                      ? t(`form.status.${note.status.current.toLowerCase()}`)
                      : ''}
                  </Tag>
                </StyledFormNoteHeader>
                <b>{t('form.notes.history.note')}</b>
                <div>{note.note}</div>
              </StyledFormNote>
            );
          })
        ) : (
          <span>{t('form.notes.history.empty')}</span>
        )}
      </Field>
    );
  }
}

FormNotes.propTypes = {
  notes: PropTypes.arrayOf(NoteShape),
};

FormNotes.defaultProps = {
  notes: [],
};

export default injectT(FormNotes);
