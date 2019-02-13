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
import { colors, spacing, fonts } from '@ndla/core';
import { uuid } from '@ndla/util';
import Tooltip from '@ndla/tooltip';
import { injectT } from '@ndla/i18n';
import styled from 'react-emotion';
import { Field } from '../../../components/Fields';
import formatDate from '../../../util/formatDate';
import { fetchAuth0Users } from '../../../modules/auth0/auth0Api';
import { NoteShape } from '../../../shapes';

const StyledTable = styled.table`
  margin: ${spacing.normal} 0;
  color: ${colors.text.primary};
  ${fonts.sizes(16, 1.1)};
  width: 100%;

  th {
    font-weight: ${fonts.weight.semibold};
    border-bottom: 2px solid ${colors.brand.tertiary};

    &:nth-child(1) {
      width: 21%;
    }

    &:nth-child(2) {
      width: 15%;
    }

    &:nth-child(3) {
      width: 45%;
    }

    &:nth-child(4) {
      width: 19%;
    }
  }

  td,
  th {
    padding: 9.5px ${spacing.normal} 9.5px 0;

    &:first-child {
      padding-left: ${spacing.small};
    }
  }

  tr {
    &:nth-child(even) {
      background: ${colors.brand.greyLighter};
    }
  }

  td {
    vertical-align: top;

    &:first-child {
      color: ${colors.brand.primary};
    }
  }
`;

const shortenName = name => {
  name.split(' ').map((namePart, index) => {
    if (index === 0) return namePart;
    return ` ${namePart.substring(0, 1).toUpperCase()}.`;
  });
};

class FormNotes extends React.Component {
  static async getDerivedStateFromProps(props, state) {
    const userIds = props.notes.map(note => note.user);
    const uniqueUserIds = Array.from(new Set(userIds)).join(',');

    if (state.users.length !== uniqueUserIds) {
      const users = await fetchAuth0Users(uniqueUserIds);
      return { users };
    }
    return undefined;
  }

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
    const users = await fetchAuth0Users(uniqueUserIds);
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

  componentDidUpdate() {}

  getUsername(userId) {
    const { users } = this.state;
    const noteUser = users.find(user => user.id === userId);
    return noteUser ? noteUser.name : '';
  }

  render() {
    const { notes, t } = this.props;

    return (
      <Field>
        <FormHeader title={t('form.notes.history.heading')} />
        {notes && notes.length > 0 ? (
          <StyledTable>
            <thead>
              <th>{t('form.notes.history.user')}</th>
              <th>{t('form.notes.history.time')}</th>
              <th>{t('form.notes.history.note')}</th>
              <th>{t('form.notes.history.status')}</th>
            </thead>
            <tbody>
              {notes.map(note => (
                <tr key={uuid()}>
                  <td>
                    <Tooltip tooltip={note.user || this.getUsername(note.user)}>
                      {shortenName(note.user || this.getUsername(note.user))}
                    </Tooltip>
                  </td>
                  <td>{formatDate(note.timestamp, 'nb')}</td>
                  <td>{note.note}</td>
                  <td>
                    {note.status
                      ? t(`form.status.${note.status.current.toLowerCase()}`)
                      : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
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
