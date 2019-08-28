import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, NavLink } from 'react-router-dom';
import { classes } from './Navigation';
import { LocationShape } from '../../../shapes';

const colorType = {
  media: 'brand-color',
  'subject-matter': 'article-color',
};

const isCurrentTab = (match, location, subtype) => {
  const locations =
    location && location.pathname ? location.pathname.split('/') : [];
  if (locations.length > 2 && locations[2] === subtype.type) {
    return true;
  }
  return false;
};

const SubNavigation = ({ subtypes, type, match, location }) => (
  <div {...classes('container', colorType[type])}>
    <div {...classes('items')}>
      {subtypes.map(subtype => (
        <NavLink
          key={`typemenu_${subtype.type}`}
          id={subtype.type}
          to={subtype.url}
          isActive={() => isCurrentTab(match, location, subtype)}
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
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  location: LocationShape,
};

export default withRouter(SubNavigation);
