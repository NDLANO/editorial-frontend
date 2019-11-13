import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { Input, StyledButtonWrapper } from '@ndla/forms';
import Button from '@ndla/button';
import { isEmpty } from '../../../validators';

export const StyledInputWrapper = styled.div`
  background: ${colors.brand.greyLightest};
  padding: ${spacing.normal};
  position: relative;
  z-index: 20;
`;

function FigureInput({
  t,
  caption,
  alt,
  submitted,
  madeChanges,
  onChange,
  onAbort,
  onSave,
}) {
  return (
    <StyledInputWrapper>
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
        warningText={
          !submitted && isEmpty(alt) ? t('form.image.alt.noText') : ''
        }
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
}

FigureInput.propTypes = {
  caption: PropTypes.string,
  alt: PropTypes.string,
  submitted: PropTypes.bool,
  isEmpty: PropTypes.func,
  madeChanges: PropTypes.bool,
  onChange: PropTypes.func,
  onAbort: PropTypes.func,
  onSave: PropTypes.func,
};

export default FigureInput;
