/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldArray, Formik, useField, useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, misc, spacing } from "@ndla/core";
import { AddLine, PencilFill } from "@ndla/icons/action";
import { Heading, IconButton, PageContainer, Spinner } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { HelmetWithTracker } from "@ndla/tracker";
import { IArticleSummaryV2 } from "@ndla/types-backend/article-api";
import FrontpageArticleSearch from "./FrontpageArticleSearch";
import { addArticlesToAboutMenu, extractArticleIds, menuWithArticleToIMenu } from "./frontpageHelpers";
import FrontpageNodeList from "./FrontpageNodeList";
import { MenuWithArticle } from "./types";
import { FormActionsContainer } from "../../components/FormikForm";
import validateFormik, { RulesType } from "../../components/formikValidationSchema";
import SaveButton from "../../components/SaveButton";
import { FRONTPAGE_ADMIN_SCOPE } from "../../constants";
import { useArticleSearch } from "../../modules/article/articleQueries";
import { useUpdateFrontpageMutation } from "../../modules/frontpage/frontpageMutations";
import { useFrontpage } from "../../modules/frontpage/frontpageQueries";
import { toEditFrontPageArticle } from "../../util/routeHelpers";
import { AlertDialogWrapper } from "../FormikForm";
import NotFound from "../NotFoundPage/NotFoundPage";
import { useSession } from "../Session/SessionProvider";

const FrontpageArticleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.small};
  background-color: ${colors.brand.lighter};
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

  const articlesQuery = useArticleSearch({ ids: articleIds.join(",") }, { enabled: !!articleIds.length });

  const transformedMenu: MenuWithArticle | undefined = useMemo(() => {
    if (frontpageQuery.isLoading || articlesQuery.isLoading || !articlesQuery.data) {
      return undefined;
    }
    return addArticlesToAboutMenu(frontpageQuery.data, articlesQuery.data);
  }, [articlesQuery.data, articlesQuery.isLoading, frontpageQuery.data, frontpageQuery.isLoading]);
  const postFrontpageMutation = useUpdateFrontpageMutation();

  const initialFrontpageArticle = useMemo(() => {
    return articlesQuery.data?.results.find((article) => article.id === frontpageQuery.data?.articleId);
  }, [articlesQuery.data?.results, frontpageQuery.data?.articleId]);

  const onSubmit = useCallback(
    async (values: MenuWithArticle) => {
      if (!values.articleId) return;
      await postFrontpageMutation.mutateAsync(menuWithArticleToIMenu(values));
    },
    [postFrontpageMutation],
  );

  const validate = useCallback((values: MenuWithArticle) => validateFormik(values, frontpageRules, t), [t]);

  if (!userPermissions?.includes(FRONTPAGE_ADMIN_SCOPE)) {
    return <NotFound />;
  }

  return (
    <PageContainer>
      <HelmetWithTracker title={t("htmlTitles.editFrontpage")} />
      {frontpageQuery.isLoading || articlesQuery.isLoading ? (
        <Spinner />
      ) : transformedMenu ? (
        <Formik
          initialValues={{ ...transformedMenu, article: initialFrontpageArticle }}
          onSubmit={onSubmit}
          validate={validate}
          validateOnMount
          enableReinitialize
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <RootFields />
              <FieldArray name="menu" render={(props) => <FrontpageNodeList {...props} level={0} />} />
            </form>
          )}
        </Formik>
      ) : (
        <p>{t("frontpageMenu.error")}</p>
      )}
    </PageContainer>
  );
};

const RootFields = () => {
  const { t, i18n } = useTranslation();
  const { isSubmitting, dirty } = useFormikContext();
  const [idField, , idHelpers] = useField<number>("articleId");
  const [articleField, , articleHelpers] = useField<IArticleSummaryV2>("article");
  const [menuField, , menuHelpers] = useField<MenuWithArticle[]>("menu");

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
      <Heading textStyle="title.large">{t("htmlTitles.editFrontpage")}</Heading>
      <Wrapper>
        <ArticleTitle>
          <span>
            {articleField.value ? (
              <>
                {t("frontpageForm.frontpageArticle")}
                <StyledSafeLink to={toEditFrontPageArticle(articleField.value.id, i18n.language)} target="_blank">
                  {articleField.value.title.title}
                </StyledSafeLink>
              </>
            ) : (
              t("frontpageForm.noFrontpageArticle")
            )}
          </span>
          <FrontpageArticleSearch articleId={idField.value} onChange={onChange}>
            <IconButton
              variant="tertiary"
              size="small"
              aria-label={t("frontpageForm.changeFrontpageArticle")}
              title={t("frontpageForm.changeFrontpageArticle")}
            >
              <PencilFill />
            </IconButton>
          </FrontpageArticleSearch>
        </ArticleTitle>
        <FormActionsContainer>
          <FrontpageArticleSearch onChange={onAddNew}>
            <IconButton
              variant="secondary"
              size="small"
              aria-label={t("frontpageForm.addArticleToMenu")}
              title={t("frontpageForm.addArticleToMenu")}
            >
              <AddLine />
            </IconButton>
          </FrontpageArticleSearch>
          <SaveButton size="small" type="submit" disabled={!dirty} loading={isSubmitting}>
            {t("save")}
          </SaveButton>
        </FormActionsContainer>
      </Wrapper>
      <AlertDialogWrapper
        isSubmitting={isSubmitting}
        formIsDirty={dirty}
        severity="danger"
        text={t("alertModal.notSaved")}
      />
    </FrontpageArticleWrapper>
  );
};

export default FrontpageEditPage;
