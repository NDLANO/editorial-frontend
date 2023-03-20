import { Callback, i18n } from 'i18next';
import { ComponentType } from 'react';
import { LocaleType } from '../interfaces';

declare module 'react-i18next' {
  interface CustomI18n extends Omit<i18n, 'language' | 'changeLanguage'> {
    language: LocaleType;
    changeLanguage: (lng: LocaleType, callback?: Callback) => Promise<TFunction>;
  }

  export interface CustomWithTranslation<
    N extends Namespace = DefaultNamespace,
    TKPrefix extends KeyPrefix<N> = undefined,
  > {
    t: TFunction<N, TKPrefix>;
    i18n: CustomI18n;
    tReady: boolean;
  }

  interface CustomUseTranslationResponse<N extends Namespace = DefaultNamespace>
    extends Omit<UseTranslationResponse<N>, 'i18n'> {
    i18n: CustomI18n;
  }

  function useTranslation<N extends Namespace = DefaultNamespace>(
    ns?: N | Readonly<N>,
    options?: UseTranslationOptions,
  ): CustomUseTranslationResponse<N>;

  export interface CustomWithTranslationProps {
    i18n?: CustomI18n;
    useSuspense?: boolean;
  }

  export function withTranslation<
    N extends Namespace = DefaultNamespace,
    TKPrefix extends KeyPrefix<N> = undefined,
  >(
    ns?: N,
    options?: {
      withRef?: boolean;
      keyPrefix?: TKPrefix;
    },
  ): <T extends CustomWithTranslation>(
    component: ComponentType<T>,
  ) => ComponentType<Omit<T, keyof CustomWithTranslation<N>> & CustomWithTranslationProps>;
}
