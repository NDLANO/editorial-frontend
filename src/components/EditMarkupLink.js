/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { css } from '@emotion/core';
import { Code } from '@ndla/icons/editor';
import { spacing, colors } from '@ndla/core';

export const EditMarkupLink = ({ title, to, inHeader }) => {
  const linkStyle = css`
    box-shadow: none;

    svg {
      width: ${inHeader ? '20px' : spacing.normal};
      height: ${inHeader ? '20px' : spacing.normal};
      padding: 2px;
      border-radius: 50%;
      border: 2px solid ${colors.brand.light};

      path:last-child {
        stroke: ${colors.brand.light};
        fill: ${colors.brand.light};
      }

      &:hover,
      &:focus {
        border-color: ${colors.brand.primary};

        path:last-child {
          stroke: ${colors.brand.primary};
          fill: ${colors.brand.primary};
        }
      }
      margin: ${inHeader ? '1.7rem 0.5em 0.3rem' : ''};
    }
  `;

  return (
    <Link css={linkStyle} to={to}>
      <Code title={title} />
    </Link>
  );
};

EditMarkupLink.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  inHeader: PropTypes.bool,
};
