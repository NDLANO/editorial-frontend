/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { Input, StyledButtonWrapper } from '@ndla/forms';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import { useSlateContext } from '../../SlateContext';
import { isEmpty } from '../../../validators';

export const StyledInputWrapper = styled.div`
  background: ${colors.brand.greyLightest};
  padding: ${spacing.normal};
  position: relative;
  z-index: 20;
`;

interface Props {
  caption: string;
  alt: string;
  madeChanges: boolean;
  onChange: Function;
  onAbort: Function;
  onSave: Function;
}

const FigureInput = ({ caption, alt, madeChanges, onChange, onAbort, onSave }: Props) => {
  const { t } = useTranslation();
  const { submitted } = useSlateContext();

  return (
    <StyledInputWrapper>
      {caption !== undefined && (
        <Input
          name="caption"
          label={`${t('form.image.caption.label')}:`}
          value={caption}
          onChange={onChange}
          container="div"
          type="text"
          autoExpand
          placeholder={t('form.image.caption.placeholder')}
          white
        />
      )}
      <Input
        name="alt"
        label={`${t('form.image.alt.label')}:`}
        value={alt}
        onChange={onChange}
        container="div"
        type="text"
        autoExpand
        placeholder={t('form.image.alt.placeholder')}
        white
        warningText={!submitted && isEmpty(alt) ? t('form.image.alt.noText') : ''}
      />
      <StyledButtonWrapper paddingLeft>
        <Button onClick={onAbort} outline>
          {t('form.abort')}
        </Button>
        <Button disabled={!madeChanges || isEmpty(alt)} onClick={onSave}>
          {t('form.image.save')}
        </Button>
      </StyledButtonWrapper>
    </StyledInputWrapper>
  );
};

export default FigureInput;
