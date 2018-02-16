import React from 'react';
import { bool } from 'prop-types';
import { Button as UiButton } from 'ndla-ui';
import BEMHelper from 'react-bem-helper';
import { Check } from 'ndla-icons/editor';

const Button = ({ isSaving, showSaved, t, ...rest }) => {
  const classes = new BEMHelper({
    name: 'save-button',
    prefix: 'c-',
  });
  const getModifier = () => {
    if (isSaving) return 'saving';
    if (showSaved) return 'saved';
    return 'save';
  };
  return (
    <UiButton
      {...classes('', getModifier())}
      disabled={isSaving || showSaved}
      submit
      {...rest}>
      <span>
        {t(`form.${getModifier()}`)}
        {showSaved && <Check />}
      </span>
    </UiButton>
  );
};

Button.propTypes = {
  isSaving: bool,
  showSaved: bool,
};

export default Button;
