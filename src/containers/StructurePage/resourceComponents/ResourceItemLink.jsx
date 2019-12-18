/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import config from '../../../config';
import { classes } from './ResourceGroup';
import { toEditArticle } from '../../../util/routeHelpers';

const ResourceItemLink = ({ contentType, contentUri, locale, name }) => {
  const linkTo = contentUri && contentUri.split(':').pop();

  if (linkTo) {
    if (contentType === 'learning-path') {
      const linkProps = {
        href: `${config.learningpathFrontendDomain}/${locale}/learningpaths/${linkTo}/first-step`,
        target: '_blank',
        rel: 'noopener noreferrer',
      };
      return <a {...linkProps}>{name}</a>;
    }
    return (
      <Link to={toEditArticle(linkTo, contentType)}>
        <h1 {...classes('title')}>{name}</h1>
      </Link>
    );
  }
  return <h1 {...classes('title')}>{name}</h1>;
};

ResourceItemLink.propTypes = {
  contentType: PropTypes.string.isRequired,
  contentUri: PropTypes.string,
  locale: PropTypes.string.isRequired,
  name: PropTypes.string,
};

export default ResourceItemLink;
