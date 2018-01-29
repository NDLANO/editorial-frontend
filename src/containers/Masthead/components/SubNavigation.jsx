import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { classes } from './Navigation';

const colorType = {
  media: 'brand-color',
  'subject-matter': 'article-color',
};

const SubNavigation = ({ subtypes, type }) => (
  <div {...classes('container', colorType[type])}>
    <div {...classes('items')}>
      {subtypes.map(subtype => (
        <NavLink
          key={`typemenu_${subtype.type}`}
          to={subtype.url}
          {...classes('item')}
          activeClassName="c-navigation__item--active">
          {subtype.icon}
          <span>{subtype.title}</span>
        </NavLink>
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
  type: PropTypes.string.isRequired,
};

export default withRouter(SubNavigation);
