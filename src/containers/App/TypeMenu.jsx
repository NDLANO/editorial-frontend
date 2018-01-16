import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Link, withRouter } from 'react-router-dom';

const classes = new BEMHelper({
  name: 'type-masthead',
  prefix: 'c-',
});

const colorType = {
  media: 'brand-color',
  'subject-matter': 'article-color',
};

const TypeMenu = ({ subtypes, activeSubtype, type }) => (
  <div {...classes('container', colorType[type])}>
    <div {...classes('items')}>
      {subtypes.map(subtype => (
        <Link
          to={subtype.url}
          {...classes('item', subtype.type === activeSubtype ? 'active' : '')}>
          {subtype.icon}
          <span>{subtype.title}</span>
        </Link>
      ))}
    </div>
  </div>
);

TypeMenu.propTypes = {
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

export default withRouter(TypeMenu);
