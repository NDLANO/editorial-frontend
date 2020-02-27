import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from "react-router-dom";
import { injectT } from '@ndla/i18n';

import StyledFilledButton from '../../components/StyledFilledButton';

const TranslateNbToNn = ({ translateArticle, editUrl, t }) => {
  const history = useHistory();

  const handleClick = () => {
    translateArticle();
    history.push(editUrl('nn'));
  }

  return (
    <StyledFilledButton type="button" onClick={handleClick}>
      {t('form.variant.translate')}
    </StyledFilledButton>
  )
}

TranslateNbToNn.propTypes = {
  translateArticle: PropTypes.func.isRequired,
  editUrl: PropTypes.func.isRequired
}

export default injectT(TranslateNbToNn);