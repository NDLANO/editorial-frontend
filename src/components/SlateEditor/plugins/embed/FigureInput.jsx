import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import Button from '@ndla/button';
import { Input, StyledButtonWrapper } from '@ndla/forms';

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
  isEmpty,
  madeChanges,
  onEdit,
  onAbort,
  onSave,
}) {
  return (
    <StyledInputWrapper>
      <Input
        name="caption"
        label={`${t('form.image.caption.label')}:`}
        value={caption}
        onChange={e => onEdit('caption', e.target.value)}
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
        onChange={e => onEdit('alt', e.target.value)}
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
        <Button disabled={!madeChanges} onClick={onSave}>
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
  onEdit: PropTypes.func,
  onAbort: PropTypes.func,
  onSave: PropTypes.func,
};

export default FigureInput;
