/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { toPreviewDraft } from '../../util/routeHelpers';

const StyledSelect = styled.select`
  max-width: 972px;
  margin: 0 auto;
  width: 100%;
  display: block;
`;

interface MatchProps {
  draftId: string;
  language: string;
}

interface Props extends RouteComponentProps<MatchProps> {
  supportedLanguages: string[];
}

const LanguageSelector = ({
  supportedLanguages,
  history,
  match: {
    params: { draftId, language },
  },
}: Props) => {
  const { t } = useTranslation();
  if (supportedLanguages.length === 0) {
    return null;
  }
  return (
    <StyledSelect
      onChange={evt => history.push(toPreviewDraft(parseInt(draftId), evt.target.value))}
      value={language}>
      {supportedLanguages.map(supportedLanguage => (
        <option key={supportedLanguage} value={supportedLanguage}>
          {t(`language.${supportedLanguage}`)}
        </option>
      ))}
    </StyledSelect>
  );
};

export default withRouter(LanguageSelector);
