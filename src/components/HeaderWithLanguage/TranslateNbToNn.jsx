import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import StyledFilledButton from '../../components/StyledFilledButton';


const TranslateNbToNn = ({ translateArticle, editUrl }) => {

  return (
    <StyledFilledButton type="button" onClick={translateArticle}>
      <Link
        to={editUrl('nn')}
      >
        Translate
      </Link>
    </StyledFilledButton>
  )
}

TranslateNbToNn.propTypes = {
  translateArticle: PropTypes.func.isRequired,
  editUrl: PropTypes.func.isRequired
}

export default TranslateNbToNn;