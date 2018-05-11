/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { ResourceShape } from '../../../shapes';
import Resource from './Resource';
import { deleteTopicResource } from '../../../modules/taxonomy';
import WarningModal from '../../../components/WarningModal';
import { classes } from './ResourceGroup';

class ResourceItems extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
    this.onDelete = this.onDelete.bind(this);
    this.toggleDelete = this.toggleDelete.bind(this);
  }

  async onDelete(id) {
    try {
      this.setState({ deleteId: '' });
      await deleteTopicResource(id);
      this.props.refreshResources();
    } catch (error) {
      console.log(error);
    }
  }

  toggleDelete(id) {
    this.setState({ deleteId: id });
  }

  render() {
    const { contentType, resources, t } = this.props;
    return (
      <ul {...classes('list')}>
        <li {...classes('item')}>
          {resources.map(resource => (
            <Resource
              key={resource.id}
              contentType={contentType}
              name={resource.name}
              onDelete={() => this.toggleDelete(resource.connectionId)}
            />
          ))}
        </li>
        {this.state.deleteId && (
          <WarningModal
            confirmDelete
            text={t('taxonomy.resource.confirmDelete')}
            onContinue={() => this.onDelete(this.state.deleteId)}
            onCancel={() => this.toggleDelete('')}
          />
        )}
      </ul>
    );
  }
}

ResourceItems.propTypes = {
  contentType: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(ResourceShape),
  classes: PropTypes.func,
  refreshResources: PropTypes.func,
};

export default injectT(ResourceItems);
