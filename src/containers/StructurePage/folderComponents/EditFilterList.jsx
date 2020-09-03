/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { DeleteForever } from '@ndla/icons/editor';
import { Home } from '@ndla/icons/common';
import { Pencil } from '@ndla/icons/action';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import RoundIcon from '../../../components/RoundIcon';
import MenuItemEditField from './menuOptions/MenuItemEditField';
import MenuItemButton from './menuOptions/MenuItemButton';
import {
  toEditSubjectpage,
  toCreateSubjectpage,
} from '../../../util/routeHelpers';
import { getIdFromUrn } from '../../../util/subjectHelpers';

const StyledFilterItem = styled('div')`
  display: flex;
  justify-content: space-between;
  margin: calc(var(--spacing--small) / 2);
`;

const StyledLink = styled(Link)`
  box-shadow: inset 0 0px;
`;

const EditFilterList = ({
  filters,
  editMode,
  t,
  setEditState,
  showDeleteWarning,
  editFilter,
  locale,
  history,
}) => (
  <React.Fragment>
    {filters.map(filter => {
      const link = filter?.contentUri
        ? toEditSubjectpage(filter.id, locale, getIdFromUrn(filter.contentUri))
        : toCreateSubjectpage(filter.id, locale);
      return editMode === filter.id ? (
        <MenuItemEditField
          key={filter.id}
          messages={{ errorMessage: t('taxonomy.errorMessage') }}
          currentVal={filter.name}
          onClose={() => setEditState('')}
          onSubmit={e => editFilter(filter.id, e, filter.contentUri)}
        />
      ) : (
        <StyledFilterItem key={filter.id}>
          {filter.name}
          <div style={{ display: 'flex' }}>
            <Button
              stripped
              data-testid={`editFilter${filter.id}`}
              onClick={() => setEditState(filter.id)}>
              <Tooltip tooltip={t('taxonomy.editFilter')}>
                <RoundIcon small icon={<Pencil />} />
              </Tooltip>
            </Button>
            <StyledLink
              className={'link'}
              to={{
                pathname: link,
                state: {
                  elementName: filter?.name,
                },
              }}>
              <MenuItemButton stripped>
                <Tooltip tooltip={t('taxonomy.editSubjectpage')}>
                  <RoundIcon small icon={<Home />} />
                </Tooltip>
              </MenuItemButton>
            </StyledLink>
            <Button
              stripped
              data-testid="deleteFilter"
              onClick={() => showDeleteWarning(filter.id)}>
              <Tooltip tooltip={t('taxonomy.deleteFilter')}>
                <RoundIcon small icon={<DeleteForever />} />
              </Tooltip>
            </Button>
          </div>
        </StyledFilterItem>
      );
    })}
  </React.Fragment>
);

EditFilterList.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object),
  editMode: PropTypes.string,
  setEditState: PropTypes.func,
  showDeleteWarning: PropTypes.func,
  editFilter: PropTypes.func,
  locale: PropTypes.string,
  history: PropTypes.shape({ push: PropTypes.func }),
};

export default injectT(EditFilterList);
