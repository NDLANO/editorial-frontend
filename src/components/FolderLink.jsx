import React from 'react';
import PropTypes from 'prop-types';
import { Folder } from 'ndla-icons/editor';
import { Link as RouterLink } from 'react-router-dom';
import { classes } from '../containers/StructurePage/folderComponents/FolderItem';

const FolderLink = ({ toLink, name, active, grayedOut }) => (
  <RouterLink
    to={toLink}
    {...classes(
      'link',
      `${active ? 'active' : ''} ${grayedOut ? 'grayedOut' : ''}`,
    )}>
    <Folder {...classes('folderIcon')} color="#70A5DA" />
    {name}
  </RouterLink>
);

FolderLink.propTypes = {
  toLink: PropTypes.string,
  name: PropTypes.string,
  active: PropTypes.bool,
  grayedOut: PropTypes.bool,
};

export default FolderLink;
