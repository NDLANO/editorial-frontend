import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter, NavLink } from 'react-router-dom';
import * as actions from '../../../modules/search/search';
import { classes } from './Navigation';

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

const clearSearchOnSwitch = async (
  e,
  clearSearch,
  history,
  sameTab,
  subtype,
) => {
  e.stopPropagation();
  e.preventDefault();
  if (!sameTab) {
    await clearSearch();
    history.push(subtype.url);
  }
};

const SubNavigation = ({
  subtypes,
  type,
  clearSearch,
  history,
  match,
  location,
}) => (
  <div {...classes('container', colorType[type])}>
    <div {...classes('items')}>
      {subtypes.map(subtype => (
        <NavLink
          key={`typemenu_${subtype.type}`}
          id={subtype.type}
          to={subtype.url}
          isActive={() => isCurrentTab(match, location, subtype)}
          onClick={e =>
            clearSearchOnSwitch(
              e,
              clearSearch,
              history,
              isCurrentTab(match, location, subtype),
              subtype,
            )
          }
          onKeyPress={e =>
            clearSearchOnSwitch(
              e,
              clearSearch,
              history,
              isCurrentTab(match, location, subtype),
              subtype,
            )
          }
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
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  clearSearch: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  clearSearch: actions.clearSearchResult,
};

export default compose(connect(null, mapDispatchToProps), withRouter)(
  SubNavigation,
);
