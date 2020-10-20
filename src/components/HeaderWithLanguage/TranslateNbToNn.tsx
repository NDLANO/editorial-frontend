import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { injectT, tType } from '@ndla/i18n';
import StyledFilledButton from '../../components/StyledFilledButton';

const StyledLink = StyledFilledButton.withComponent(Link);

interface Props {
  translateArticle: Function;
  editUrl: (lang: string) => string;
  setTranslateOnContinue: (translateOnContinue: Boolean) => void;
  formIsDirty: Boolean;
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
      onClick={() =>
        formIsDirty ? setTranslateOnContinue(true) : translateArticle()
      }>
      {t('form.variant.translate')}
    </StyledLink>
  );
};

export default injectT(TranslateNbToNn);
