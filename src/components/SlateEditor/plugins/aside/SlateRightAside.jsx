/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import BEMHelper from 'react-bem-helper';
import { colors } from '@ndla/core';
import { ChevronLeft } from '@ndla/icons/common';
import { css } from 'react-emotion';
import darken from 'polished/lib/color/darken';
import DeleteButton from '../../../DeleteButton';

const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const moveContentButtonStyle = css`
  position: absolute;
  top: 0.1rem;
  right: 1.2rem;
  color: ${colors.support.green};
  &:hover,
  &:focus {
    color: ${darken(0.2, colors.support.green)};
  }
`;

const SlateRightAside = props => {
  const { children, onRemoveClick, onMoveContent, t, attributes } = props;

  return (
    <aside {...classes('right-aside', '', 'c-aside expanded')} {...attributes}>
      <div {...classes('aside-type')} contentEditable={false}>
        {t('learningResourceForm.fields.rightAside.title')}
      </div>
      <div className="c-aside__content">{children}</div>
      <DeleteButton
        title={t('learningResourceForm.fields.rightAside.delete')}
        stripped
        onClick={onRemoveClick}
      />
      <Button
        css={moveContentButtonStyle}
        title={t('learningResourceForm.fields.rightAside.moveContent')}
        stripped
        onClick={onMoveContent}>
        <ChevronLeft />
      </Button>
    </aside>
  );
};

SlateRightAside.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  onRemoveClick: PropTypes.func.isRequired,
  onMoveContent: PropTypes.func.isRequired,
};

export default injectT(SlateRightAside);
