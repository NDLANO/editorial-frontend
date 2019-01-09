/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  FormHeader,
} from '@ndla/forms';
import { colors, spacing } from '@ndla/core';
import { injectT } from '@ndla/i18n';
import styled, { css } from 'react-emotion';
import { Field } from '../../../components/Fields';
import formatDate from '../../../util/formatDate';

const StyledTable = styled('table')`
    border: 1px solid ${colors.brand.grey};
    width: 75%;
`

const StyledTableHeaderRow = styled('tr')`
    border-bottom: 2px solid ${colors.brand.secondary};
`

const StyledTableHeaderCell = styled('th')`
    padding: ${spacing.small};
`

const StyledTableRow = styled('tr')`
    border: 1px solid ${colors.brand.grey};
`

const StyledTableCell = styled('td')`
    border: 1px solid ${colors.brand.grey};
    padding: ${spacing.small};
`

const FormNotesTable = ({ value, t }) => {
  return (
    <Field>
      <FormHeader title="Merknads historikk" width={3 / 4} />
      <StyledTable>
        <thead>
          <StyledTableHeaderRow>
            <StyledTableHeaderCell>Merknad</StyledTableHeaderCell>
            <StyledTableHeaderCell>Status</StyledTableHeaderCell>
            <StyledTableHeaderCell>Bruker</StyledTableHeaderCell>
            <StyledTableHeaderCell>Tidspunkt</StyledTableHeaderCell>
          </StyledTableHeaderRow>
        </thead>
        <tbody>
          {value && value.length > 0 ? value.map(note => {
            return (
              <StyledTableRow>
                <StyledTableCell css={css`min-width: 60%;`}>{note.note}</StyledTableCell>
                <StyledTableCell>{t(`form.status.${note.status.current.toLowerCase()}`)}</StyledTableCell>
                <StyledTableCell>{note.user}</StyledTableCell>
                <StyledTableCell>{formatDate(note.timestamp, 'nb')}</StyledTableCell>
              </StyledTableRow>
            );
          }) : <StyledTableRow><td colspan="4">Ingen merknader</td></StyledTableRow>}
        </tbody>
      </StyledTable>
    </Field>
  );
};

FormNotesTable.propTypes = {
  value: PropTypes.shape({}),
};

export default injectT(FormNotesTable);
