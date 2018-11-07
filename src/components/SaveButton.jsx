import React from 'react';
import { bool } from 'prop-types';
import Button from 'ndla-button';
import { injectT } from '@ndla/i18n';
import BEMHelper from 'react-bem-helper';
import { Check } from '@ndla/icons/editor';

const SaveButton = ({ isSaving, showSaved, t, ...rest }) => {
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
    <Button
      {...classes('', getModifier())}
      disabled={isSaving || showSaved}
      submit
      {...rest}>
      <span>
        {t(`form.${getModifier()}`)}
        {showSaved && <Check />}
      </span>
    </Button>
  );
};

SaveButton.propTypes = {
  isSaving: bool,
  showSaved: bool,
};

export default injectT(SaveButton);
