/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'ndla-button';
import { Pencil } from '@ndla/icons/action';
import { injectT } from 'ndla-i18n';
import { DeleteForever } from '@ndla/icons/editor';
import RoundIcon from '../../../components/RoundIcon';
import InlineEditField from '../../../components/InlineEditField';

const EditFilterList = ({
  filters,
  editMode,
  classes,
  t,
  setEditState,
  showDeleteWarning,
  editFilter,
}) => (
  <React.Fragment>
    {filters.map(
      filter =>
        editMode === filter.id ? (
          <InlineEditField
            key={filter.id}
            classes={classes}
            messages={{ errorMessage: t('taxonomy.errorMessage') }}
            currentVal={filter.name}
            onClose={() => setEditState('')}
            onSubmit={e => editFilter(filter.id, e)}
          />
        ) : (
          <div key={filter.id} {...classes('filterItem')}>
            {filter.name}
            <div style={{ display: 'flex' }}>
              <Button
                stripped
                data-testid={`editFilter${filter.id}`}
                onClick={() => setEditState(filter.id)}>
                <RoundIcon small icon={<Pencil />} />
              </Button>
              <Button
                stripped
                data-testid="deleteFilter"
                onClick={() => showDeleteWarning(filter.id)}>
                <RoundIcon small icon={<DeleteForever />} />
              </Button>
            </div>
          </div>
        ),
    )}
  </React.Fragment>
);

EditFilterList.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.object),
  editMode: PropTypes.string,
  classes: PropTypes.func,
  setEditState: PropTypes.func,
  showDeleteWarning: PropTypes.func,
  editFilter: PropTypes.func,
};

export default injectT(EditFilterList);
