import { Callback, i18n, TFunction } from 'i18next';
import { DefaultNamespace, Namespace, UseTranslationResponse } from 'react-i18next';
import { LocaleType } from '../interfaces';

interface CustomI18n extends Omit<i18n, 'language' | 'changeLanguage'> {
  language: LocaleType;
  changeLanguage: (lng: LocaleType, callback?: Callback) => Promise<TFunction>;
}

interface CustomUseTranslationResponse<N extends Namespace = DefaultNamespace>
  extends Omit<UseTranslationResponse<N>, 'i18n'> {
  i18n: CustomI18n;
}

declare module 'react-i18next' {
  function useTranslation<N extends Namespace = DefaultNamespace>(
    ns?: N | Readonly<N>,
    options?: UseTranslationOptions,
  ): CustomUseTranslationResponse<N>;
}
