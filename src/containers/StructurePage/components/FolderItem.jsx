/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { string, bool, arrayOf, object } from 'prop-types';
import { Folder } from 'ndla-icons/editor';
import { Link } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import SettingsMenu from './SettingsMenu';

const classes = new BEMHelper({
  name: 'folder',
  prefix: 'c-',
});

class FolderItem extends React.PureComponent {
  render() {
    const { name, path, active, topics = [], params } = this.props;
    return (
      <React.Fragment>
        <div {...classes('wrapper')}>
          <Link
            to={active ? '/structure' : `/structure${path}`}
            {...classes('link')}>
            <Folder color={'#70A5DA'} />
            <span {...classes('title', active && 'active')}>{name}</span>
          </Link>
          {active && <SettingsMenu />}
        </div>
        <div {...classes('subFolders')}>
          {active &&
            topics.map(topic => (
              <FolderItem
                {...topic}
                key={topic.id}
                path={topic.path}
                active={
                  params.topic1 === topic.id.replace('urn:', '') ||
                  params.topic2 === topic.id.replace('urn:', '')
                }
                params={params}
              />
            ))}
        </div>
      </React.Fragment>
    );
  }
}

FolderItem.propTypes = {
  name: string.isRequired,
  path: string.isRequired,
  active: bool,
  topics: arrayOf(object),
};

export default FolderItem;
