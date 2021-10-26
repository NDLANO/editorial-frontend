import { Callback, i18n, TFunction } from 'i18next';
import {
  DefaultNamespace,
  Namespace,
  UseTranslationResponse,
  WithTranslation,
} from 'react-i18next';
import { LocaleType } from '../interfaces';

interface CustomI18n extends Omit<i18n, 'language' | 'changeLanguage'> {
  language: LocaleType;
  changeLanguage: (lng: LocaleType, callback?: Callback) => Promise<TFunction>;
}

interface CustomUseTranslationResponse<N extends Namespace = DefaultNamespace>
  extends Omit<UseTranslationResponse<N>, 'i18n'> {
  i18n: CustomI18n;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CustomWithTranslation<N extends Namespace = DefaultNamespace>
  extends Omit<WithTranslation, 'i18n'> {
  i18n: CustomI18n;
}

declare module 'react-i18next' {
  function useTranslation<N extends Namespace = DefaultNamespace>(
    ns?: N | Readonly<N>,
    options?: UseTranslationOptions,
  ): CustomUseTranslationResponse<N>;

  function withTranslation<N extends Namespace = DefaultNamespace>(
    ns?: N,
    options?: {
      withRef?: boolean;
    },
  ): <
    C extends React.ComponentType<React.ComponentProps<C> & WithTranslationProps>,
    ResolvedProps = JSX.LibraryManagedAttributes<
      C,
      Subtract<React.ComponentProps<C>, WithTranslationProps>
    >
  >(
    component: C,
  ) => React.ComponentType<
    Omit<ResolvedProps, keyof CustomWithTranslation<N>> & WithTranslationProps
  >;
}
