import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectT } from '@ndla/i18n';

import StyledFilledButton from '../../components/StyledFilledButton';

const StyledLink = StyledFilledButton.withComponent(Link);

const TranslateNbToNn = ({
  formIsDirty,
  translateArticle,
  setTranslateOnContinue,
  editUrl,
  t,
}) => {
  return (
    <StyledLink
      to={editUrl('nn')}
      onClick={() =>
        formIsDirty ? setTranslateOnContinue(true) : translateArticle()
      }>
      {t('form.variant.translate')}
    </StyledLink>
  );
};

TranslateNbToNn.propTypes = {
  translateArticle: PropTypes.func.isRequired,
  editUrl: PropTypes.func.isRequired,
  setTranslateOnContinue: PropTypes.func.isRequired,
  formIsDirty: PropTypes.bool.isRequired,
};

export default injectT(TranslateNbToNn);
