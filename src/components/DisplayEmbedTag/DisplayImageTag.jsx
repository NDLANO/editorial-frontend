/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import config from '../../config';
import DeleteButton from '../DeleteButton';

const DisplayImageTag = ({ embedTag, className, onRemoveClick }) => {
  const src = `${config.ndlaApiUrl}/image-api/raw/id/${embedTag.resource_id}`;
  return (
    <figure className={className}>
      <img src={src} alt={embedTag.alt} />
      <figcaption>{embedTag.caption}</figcaption>
      <DeleteButton
        stripped
        onClick={onRemoveClick}
        style={css`
          right: -2rem;
        `}
      />
    </figure>
  );
};

DisplayImageTag.propTypes = {
  embedTag: PropTypes.shape({
    resource_id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    caption: PropTypes.string,
    alt: PropTypes.string,
  }),
  className: PropTypes.string,
  onRemoveClick: PropTypes.func.isRequired,
};

export default DisplayImageTag;
