/**
 * Copyright (C) 2020 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StyledFilledButton from '../../components/StyledFilledButton';
import { useTranslateToNN } from '../NynorskTranslateProvider';

const StyledLink = StyledFilledButton.withComponent(Link);

interface Props {
  editUrl: (lang: string) => string;
}

const TranslateNbToNn = ({ editUrl }: Props) => {
  const { setShouldTranslate } = useTranslateToNN();
  const { t } = useTranslation();
  return (
    <StyledLink to={editUrl('nn')} onClick={() => setShouldTranslate(true)}>
      {t('form.variant.translate')}
    </StyledLink>
  );
};

export default TranslateNbToNn;
