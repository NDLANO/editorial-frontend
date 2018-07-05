import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'filter-view',
  prefix: 'c-',
});

const Filter = ({ name, id, toggleFilter, active }) => (
  <label {...classes('item')}>
    <input
      {...classes('checkbox')}
      checked={!!active}
      onChange={() => toggleFilter(id)}
      type="checkbox"
    />
    <span>{name}</span>
  </label>
);

Filter.propTypes = {
  name: PropTypes.string,
  toggleFilter: PropTypes.func,
  id: PropTypes.string,
  active: PropTypes.string,
};

const FilterView = ({ subjectFilters, activeFilters, toggleFilter }) => (
  <div {...classes('wrapper')}>
    {subjectFilters.map(filter => (
      <Filter
        {...filter}
        key={filter.id}
        toggleFilter={toggleFilter}
        active={activeFilters.find(filterId => filterId === filter.id)}
      />
    ))}
  </div>
);

FilterView.propTypes = {
  subjectFilters: PropTypes.arrayOf(PropTypes.object),
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  toggleFilter: PropTypes.func,
};

export default FilterView;
