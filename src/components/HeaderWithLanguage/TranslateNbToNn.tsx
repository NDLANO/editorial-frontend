/**
 * Copyright (C) 2020 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { injectT, tType } from '@ndla/i18n';
import StyledFilledButton from '../../components/StyledFilledButton';

const StyledLink = StyledFilledButton.withComponent(Link);

interface Props {
  translateFunc: () => void;
  editUrl: (lang: string) => string;
  setTranslateOnContinue: (translateOnContinue: boolean) => void;
  formIsDirty: boolean;
}

const TranslateNbToNn = ({
  formIsDirty,
  translateFunc,
  setTranslateOnContinue,
  editUrl,
  t,
}: Props & tType) => {
  return (
    <StyledLink
      to={editUrl('nn')}
      onClick={() => (formIsDirty ? setTranslateOnContinue(true) : translateFunc())}>
      {t('form.variant.translate')}
    </StyledLink>
  );
};

export default injectT(TranslateNbToNn);
