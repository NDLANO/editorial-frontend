/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { toPreviewDraft } from '../../util/routeHelpers';

const StyledSelect = styled.select`
  max-width: 972px;
  margin: 0 auto;
  width: 100%;
  display: block;
`;

interface Props {
  supportedLanguages: string[];
}

const LanguageSelector = ({ supportedLanguages }: Props) => {
  const { t } = useTranslation();
  const { draftId, language } = useParams<'draftId' | 'language'>();
  const navigate = useNavigate();
  if (supportedLanguages.length === 0) {
    return null;
  }
  return (
    <StyledSelect
      onChange={evt => navigate(toPreviewDraft(Number(draftId), evt.target.value))}
      value={language}>
      {supportedLanguages.map(supportedLanguage => (
        <option key={supportedLanguage} value={supportedLanguage}>
          {t(`language.${supportedLanguage}`)}
        </option>
      ))}
    </StyledSelect>
  );
};

export default LanguageSelector;
