/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { string, bool } from 'prop-types';
import { Folder } from 'ndla-icons/editor';
import { Link } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'folder',
  prefix: 'c-',
});

const FolderItem = ({ title, path, active }) => (
  <Link to={path} {...classes('')}>
    <Folder color={'#70A5DA'} />
    <span {...classes('title', active && 'active')}>{title}</span>
  </Link>
);

FolderItem.propTypes = {
  title: string,
  path: string,
  active: bool,
};

export default FolderItem;
