/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { css } from '@emotion/core';
import { Code } from '@ndla/icons/editor';
import { spacing, colors } from '@ndla/core';

export const EditMarkupLink = ({ title, to, inHeader }) => {
  let location = useLocation();

  const linkStyle = css`
    box-shadow: none;
    
    width: ${inHeader ? '25px;' : ''}
    padding-left: ${inHeader ? '0.4em' : ''};
    padding-right: ${inHeader ? '1.2em' : ''};
    
    &:hover svg,
    &:focus svg {
      border-color: ${colors.brand.primary};
      path:last-child {
        stroke: ${colors.brand.primary};
        fill: ${colors.brand.primary};
      }
    }
    
    svg {
      width: ${inHeader ? '18px' : spacing.normal};
      height: ${inHeader ? '18px' : spacing.normal};
      padding: 2px;
      border-radius: 50%;
      border: 2px solid ${colors.brand.light};

      path:last-child {
        stroke: ${colors.brand.light};
        fill: ${colors.brand.light};
      }

      margin-bottom: ${inHeader ? '0.18em' : ''};
    }
  `;
  return (
    <Link
      css={linkStyle}
      to={{
        pathname: to,
        state: {
          backUrl: location.pathname + location.search,
        },
      }}>
      <Code title={title} />
    </Link>
  );
};

EditMarkupLink.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  inHeader: PropTypes.bool,
};
