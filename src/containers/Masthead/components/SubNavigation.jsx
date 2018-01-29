import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { classes } from './Navigation';

const colorType = {
  media: 'brand-color',
  'subject-matter': 'article-color',
};

const SubNavigation = ({ subtypes, activeSubtype, type }) => (
  <div {...classes('container', colorType[type])}>
    <div {...classes('items')}>
      {subtypes.map(subtype => (
        <Link
          key={`typemenu_${subtype.type}`}
          to={subtype.url}
          {...classes('item', subtype.type === activeSubtype ? 'active' : '')}>
          {subtype.icon}
          <span>{subtype.title}</span>
        </Link>
      ))}
    </div>
  </div>
);

SubNavigation.propTypes = {
  subtypes: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
    }),
  ),
  activeSubtype: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default withRouter(SubNavigation);
