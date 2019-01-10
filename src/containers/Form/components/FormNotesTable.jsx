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
import { Field } from '../../../components/Fields';
import formatDate from '../../../util/formatDate';
import {
  resolveJsonOrRejectWithError,
  fetchAuthorized,
} from '../../../util/apiHelpers';
import { NoteShape } from '../../../shapes';

const StyledTable = styled('table')`
  border: 1px solid ${colors.brand.grey};
  width: 75%;
`;

const StyledTableHeaderRow = styled('tr')`
  border-bottom: 2px solid ${colors.brand.secondary};
`;

const StyledTableHeaderCell = styled('th')`
  padding: ${spacing.small};
`;

const StyledTableRow = styled('tr')`
  border: 1px solid ${colors.brand.grey};
`;

const StyledTableCell = styled('td')`
  border: 1px solid ${colors.brand.grey};
  padding: ${spacing.small};
`;

class FormNotesTable extends React.Component {
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
      users: users.map(user => ({
        id: user.app_metadata.ndla_id,
        name: user.name,
      })),
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
        <FormHeader title={t('form.notes.table.heading')} width={3 / 4} />
        <StyledTable>
          <thead>
            <StyledTableHeaderRow>
              <StyledTableHeaderCell>
                {t('form.notes.table.note')}
              </StyledTableHeaderCell>
              <StyledTableHeaderCell>
                {t('form.notes.table.status')}
              </StyledTableHeaderCell>
              <StyledTableHeaderCell>
                {t('form.notes.table.user')}
              </StyledTableHeaderCell>
              <StyledTableHeaderCell>
                {t('form.notes.table.timestamp')}
              </StyledTableHeaderCell>
            </StyledTableHeaderRow>
          </thead>
          <tbody>
            {notes && notes.length > 0 ? (
              notes.map(note => {
                return (
                  <StyledTableRow>
                    <StyledTableCell
                      css={css`
                        min-width: 60%;
                      `}>
                      {note.note}
                    </StyledTableCell>
                    <StyledTableCell>
                      {note.status
                        ? t(`form.status.${note.status.current.toLowerCase()}`)
                        : ''}
                    </StyledTableCell>
                    <StyledTableCell>
                      {this.getUsername(note.user)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {formatDate(note.timestamp, 'nb')}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <StyledTableCell colspan="4">Ingen merknader</StyledTableCell>
              </StyledTableRow>
            )}
          </tbody>
        </StyledTable>
      </Field>
    );
  }
}

FormNotesTable.propTypes = {
  notes: PropTypes.arrayOf(NoteShape),
};

export default injectT(FormNotesTable);
