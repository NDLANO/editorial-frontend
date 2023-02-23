/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, MouseEventHandler } from 'react';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { StyledButtonWrapper, TextArea } from '@ndla/forms';
import { ButtonV2 } from '@ndla/button';
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
  caption?: string;
  alt: string;
  madeChanges: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onAbort: MouseEventHandler<HTMLButtonElement>;
  onSave: MouseEventHandler<HTMLButtonElement>;
}

const FigureInput = ({ caption, alt, madeChanges, onChange, onAbort, onSave }: Props) => {
  const { t } = useTranslation();
  const { submitted } = useSlateContext();

  return (
    <StyledInputWrapper>
      {caption !== undefined && (
        <TextArea
          name="caption"
          label={`${t('form.image.caption.label')}:`}
          value={caption}
          onChange={onChange}
          type="text"
          placeholder={t('form.image.caption.placeholder')}
          white
        />
      )}
      <TextArea
        name="alt"
        label={`${t('form.image.alt.label')}:`}
        value={alt}
        onChange={onChange}
        type="text"
        placeholder={t('form.image.alt.placeholder')}
        white
        warningText={!submitted && isEmpty(alt) ? t('form.image.alt.noText') : ''}
      />
      <StyledButtonWrapper paddingLeft>
        <ButtonV2 onClick={onAbort} variant="outline">
          {t('form.abort')}
        </ButtonV2>
        <ButtonV2 disabled={!madeChanges || isEmpty(alt)} onClick={onSave}>
          {t('form.image.save')}
        </ButtonV2>
      </StyledButtonWrapper>
    </StyledInputWrapper>
  );
};

export default FigureInput;
