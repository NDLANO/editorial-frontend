/**
 * Copyright (C) 2020 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { injectT, tType } from '@ndla/i18n';
import StyledFilledButton from '../../components/StyledFilledButton';

const StyledLink = StyledFilledButton.withComponent(Link);

interface Props {
  translateArticle: () => void;
  editUrl: (lang: string) => string;
  setTranslateOnContinue: (translateOnContinue: boolean) => void;
  formIsDirty: boolean;
}

const TranslateNbToNn: FC<Props & tType> = ({
  formIsDirty,
  translateArticle,
  setTranslateOnContinue,
  editUrl,
  t,
}) => {
  return (
    <StyledLink
      to={editUrl('nn')}
      onClick={() => (formIsDirty ? setTranslateOnContinue(true) : translateArticle())}>
      {t('form.variant.translate')}
    </StyledLink>
  );
};

export default injectT(TranslateNbToNn);
