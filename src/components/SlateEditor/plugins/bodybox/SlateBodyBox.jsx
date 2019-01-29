/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Button from '@ndla/button';
import Types from 'slate-prop-types';
import { injectT } from '@ndla/i18n';
import { colors } from '@ndla/core';
import { ChevronLeft } from '@ndla/icons/common';
import darken from 'polished/lib/color/darken';
import { css } from 'react-emotion';
import DeleteButton from '../../../DeleteButton';
import { EditorShape } from '../../../../shapes';

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

const StyledBodyBox = styled('div')`
  position: relative;
`;

const SlateBodyBox = props => {
  const { node, editor, t, attributes, children } = props;

  const onRemoveClick = () => {
    editor.removeNodeByKey(node.key);
  };

  const onMoveContent = () => {
    editor.unwrapBlockByKey(node.key, node.type);
  };
  return (
    <StyledBodyBox {...attributes}>
      {children}
      <DeleteButton stripped onClick={onRemoveClick} />
      <Button
        css={moveContentButtonStyle}
        title={t('learningResourceForm.fields.rightAside.moveContent')}
        stripped
        onClick={onMoveContent}>
        <ChevronLeft />
      </Button>
    </StyledBodyBox>
  );
};

SlateBodyBox.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: Types.node.isRequired,
  editor: EditorShape,
};

export default injectT(SlateBodyBox);
