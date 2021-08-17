/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { HistoryShape } from '../../shapes';
import { toPreviewDraft } from '../../util/routeHelpers';

const StyledSelect = styled.select`
  max-width: 972px;
  margin: 0 auto;
  width: 100%;
  display: block;
`;

const LanguageSelector = ({
  supportedLanguages,
  history,
  match: {
    params: { draftId, language },
  },
}) => {
  const { t } = useTranslation();
  if (supportedLanguages.length === 0) {
    return null;
  }
  return (
    <StyledSelect
      onChange={evt => history.push(toPreviewDraft(draftId, evt.target.value))}
      value={language}>
      {supportedLanguages.map(supportedLanguage => (
        <option key={supportedLanguage} value={supportedLanguage}>
          {t(`language.${supportedLanguage}`)}
        </option>
      ))}
    </StyledSelect>
  );
};

LanguageSelector.propTypes = {
  supportedLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      draftId: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
    }),
  }),
  history: HistoryShape,
};

export default withRouter(LanguageSelector);
