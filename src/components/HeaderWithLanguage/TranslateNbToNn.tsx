/**
 * Copyright (C) 2020 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StyledFilledButton from '../../components/StyledFilledButton';

const StyledLink = StyledFilledButton.withComponent(Link);

interface Props {
  translateToNN: () => void;
  editUrl: (lang: string) => string;
  setTranslateOnContinue?: (translateOnContinue: boolean) => void;
  formIsDirty: boolean;
}

const TranslateNbToNn = ({
  formIsDirty,
  translateToNN,
  setTranslateOnContinue,
  editUrl,
}: Props) => {
  const { t } = useTranslation();
  return (
    <StyledLink
      to={editUrl('nn')}
      onClick={() => (formIsDirty ? setTranslateOnContinue?.(true) : translateToNN())}>
      {t('form.variant.translate')}
    </StyledLink>
  );
};

export default TranslateNbToNn;
