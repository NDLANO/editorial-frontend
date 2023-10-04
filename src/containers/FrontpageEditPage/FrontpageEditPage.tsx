/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetWithTracker } from '@ndla/tracker';
import { OneColumn } from '@ndla/ui';
import { Heading } from '@ndla/typography';
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ndla/icons';
import { colors, misc, spacing } from '@ndla/core';
import { useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import SafeLink from '@ndla/safelink';
import { IconButtonV2 } from '@ndla/button';
import { Pencil, Plus } from '@ndla/icons/action';
import { FieldArray, Formik, useField, useFormikContext } from 'formik';
import { IArticleSummaryV2 } from '@ndla/types-backend/build/article-api';
import { useFrontpage } from '../../modules/frontpage/frontpageQueries';
import { useUpdateFrontpageMutation } from '../../modules/frontpage/frontpageMutations';
import { useArticleSearch } from '../../modules/article/articleQueries';
import FrontpageArticleSearch from './FrontpageArticleSearch';
import {
  addArticlesToAboutMenu,
  extractArticleIds,
  menuWithArticleToIMenu,
} from './frontpageHelpers';
import { MenuWithArticle } from './types';
import FrontpageNodeList from './FrontpageNodeList';
import { toEditFrontPageArticle } from '../../util/routeHelpers';
import SaveButton from '../../components/SaveButton';
import { AlertModalWrapper } from '../FormikForm';
import validateFormik, { RulesType } from '../../components/formikValidationSchema';
import { useSession } from '../Session/SessionProvider';
import { FRONTPAGE_ADMIN_SCOPE } from '../../constants';
import NotFound from '../NotFoundPage/NotFoundPage';

const FrontpageArticleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.small};
  background-color: ${colors.brand.lighter};
  color: ${colors.brand.primary};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const ArticleTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
  span {
    display: inline-flex;
    gap: ${spacing.xsmall};
  }
`;

const StyledSafeLink = styled(SafeLink)`
  color: ${colors.brand.primary};
  text-decoration: underline;
  text-underline-offset: ${spacing.xsmall};
  box-shadow: none;
  &:hover,
  &:focus-visible {
    text-decoration: none;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
`;

const frontpageRules: RulesType<MenuWithArticle> = {
  articleId: {
    required: true,
  },
};

const FrontpageEditPage = () => {
  const { t } = useTranslation();
  const frontpageQuery = useFrontpage();
  const { userPermissions } = useSession();

  const articleIds = useMemo(
    () => (frontpageQuery.data ? extractArticleIds(frontpageQuery.data) : []),
    [frontpageQuery.data],
  );

  const articlesQuery = useArticleSearch(
    { ids: articleIds.join(',') },
    { enabled: !!articleIds.length },
  );

  const transformedMenu: MenuWithArticle | undefined = useMemo(() => {
    if (frontpageQuery.isInitialLoading || articlesQuery.isInitialLoading || !articlesQuery.data) {
      return undefined;
    }
    return addArticlesToAboutMenu(frontpageQuery.data, articlesQuery.data);
  }, [
    articlesQuery.data,
    articlesQuery.isInitialLoading,
    frontpageQuery.data,
    frontpageQuery.isInitialLoading,
  ]);

  const postFrontpageMutation = useUpdateFrontpageMutation();

  const onSubmit = useCallback(
    async (values: MenuWithArticle) => {
      if (!values.articleId) return;
      await postFrontpageMutation.mutateAsync(menuWithArticleToIMenu(values));
    },
    [postFrontpageMutation],
  );

  const validate = useCallback(
    (values: MenuWithArticle) => validateFormik(values, frontpageRules, t),
    [t],
  );

  if (!userPermissions?.includes(FRONTPAGE_ADMIN_SCOPE)) {
    return <NotFound />;
  }

  return (
    <OneColumn>
      <HelmetWithTracker title={t('htmlTitles.editFrontpage')} />
      {frontpageQuery.isInitialLoading || articlesQuery.isInitialLoading ? (
        <Spinner />
      ) : transformedMenu ? (
        <Formik
          initialValues={transformedMenu}
          onSubmit={onSubmit}
          validate={validate}
          validateOnMount
          enableReinitialize
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <RootFields />
              <FieldArray
                name="menu"
                render={(props) => <FrontpageNodeList {...props} level={0} />}
              />
            </form>
          )}
        </Formik>
      ) : (
        <p>{t('frontpageMenu.error')}</p>
      )}
    </OneColumn>
  );
};

const RootFields = () => {
  const { t, i18n } = useTranslation();
  const { isSubmitting, dirty } = useFormikContext();
  const [idField, , idHelpers] = useField<number>('articleId');
  const [articleField, , articleHelpers] = useField<IArticleSummaryV2>('article');
  const [menuField, , menuHelpers] = useField<MenuWithArticle[]>('menu');

  const onAddNew = useCallback(
    (val: IArticleSummaryV2) => {
      const newMenuItem: MenuWithArticle = {
        articleId: val.id,
        article: val,
        menu: [],
      };
      menuHelpers.setValue(menuField.value.concat(newMenuItem));
    },
    [menuField.value, menuHelpers],
  );

  const onChange = useCallback(
    (val: IArticleSummaryV2) => {
      idHelpers.setValue(val.id);
      articleHelpers.setValue(val);
    },
    [articleHelpers, idHelpers],
  );

  return (
    <FrontpageArticleWrapper>
      <Heading element="h1" headingStyle="h3" margin="none">
        {t('htmlTitles.editFrontpage')}
      </Heading>
      <Wrapper>
        <ArticleTitle>
          <span>
            {articleField.value ? (
              <>
                {t('frontpageForm.frontpageArticle')}
                <StyledSafeLink
                  to={toEditFrontPageArticle(articleField.value.id, i18n.language)}
                  target="_blank"
                >
                  {articleField.value.title.title}
                </StyledSafeLink>
              </>
            ) : (
              t('frontpageForm.noFrontpageArticle')
            )}
          </span>
          <FrontpageArticleSearch articleId={idField.value} onChange={onChange}>
            <IconButtonV2
              colorTheme="primary"
              variant="outline"
              aria-label={t('frontpageForm.changeFrontpageArticle')}
              title={t('frontpageForm.changeFrontpageArticle')}
            >
              <Pencil />
            </IconButtonV2>
          </FrontpageArticleSearch>
        </ArticleTitle>
        <ButtonWrapper>
          <FrontpageArticleSearch onChange={onAddNew}>
            <IconButtonV2
              colorTheme="primary"
              variant="outline"
              aria-label={t('frontpageForm.addArticleToMenu')}
              title={t('frontpageForm.addArticleToMenu')}
            >
              <Plus />
            </IconButtonV2>
          </FrontpageArticleSearch>
          <SaveButton type="submit" disabled={!dirty} isSaving={isSubmitting}>
            {t('save')}
          </SaveButton>
        </ButtonWrapper>
      </Wrapper>
      <AlertModalWrapper
        isSubmitting={isSubmitting}
        formIsDirty={dirty}
        severity="danger"
        text={t('alertModal.notSaved')}
      />
    </FrontpageArticleWrapper>
  );
};

export default FrontpageEditPage;
