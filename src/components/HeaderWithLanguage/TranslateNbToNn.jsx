import React from 'react';
import PropTypes from 'prop-types';

import StyledFilledButton from '../../components/StyledFilledButton';

const TranslateNbToNn = ({ getArticle }) => {

  const handleClick = () => {

  }

  return (
    <StyledFilledButton type="button" onClick={() => {}}>
      Translate
    </StyledFilledButton>
  )
}

TranslateNbToNn.propTypes = {
  getArticle: PropTypes.func.isRequired
}