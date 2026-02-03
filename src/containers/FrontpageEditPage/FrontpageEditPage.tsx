/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AddLine, PencilFill } from "@ndla/icons";
import { Heading, IconButton, PageContainer, Spinner, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleSummaryV2DTO } from "@ndla/types-backend/article-api";
import { FieldArray, Formik, useField, useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { useSession } from "../Session/SessionProvider";
import FrontpageArticleSearch from "./FrontpageArticleSearch";
import { addArticlesToAboutMenu, extractArticleIds, menuWithArticleToIMenu } from "./frontpageHelpers";
import FrontpageNodeList from "./FrontpageNodeList";
import { MenuWithArticle } from "./types";

const FrontpageArticleWrapper = styled("div", {
  base: {
    backgroundColor: "surface.brand.2.subtle",
    padding: "small",
    borderRadius: "xsmall",
    border: "1px solid",
    borderColor: "stroke.subtle",
    marginBlockEnd: "xsmall",
  },
});

const Wrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
});

const EditFrontpageWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

const frontpageRules: RulesType<MenuWithArticle> = {
  articleId: {
    required: true,
  },
};

export const Component = () => <PrivateRoute component={<FrontpageEditPage />} />;

const FrontpageEditPage = () => {
  const { t } = useTranslation();
  const frontpageQuery = useFrontpage();
  const { userPermissions } = useSession();

  const articleIds = useMemo(
    () => (frontpageQuery.data ? extractArticleIds(frontpageQuery.data) : []),
    [frontpageQuery.data],
  );

  const articlesQuery = useArticleSearch({ ids: articleIds, license: "all" }, { enabled: !!articleIds.length });

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
    <PageContainer asChild consumeCss>
      <main>
        <title>{t("htmlTitles.editFrontpage")}</title>
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
          <Text>{t("frontpageMenu.error")}</Text>
        )}
      </main>
    </PageContainer>
  );
};

const RootFields = () => {
  const { t, i18n } = useTranslation();
  const { isSubmitting, dirty } = useFormikContext();
  const [idField, , idHelpers] = useField<number>("articleId");
  const [articleField, , articleHelpers] = useField<ArticleSummaryV2DTO>("article");
  const [menuField, , menuHelpers] = useField<MenuWithArticle[]>("menu");

  const onAddNew = useCallback(
    (val: ArticleSummaryV2DTO) => {
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
    (val: ArticleSummaryV2DTO) => {
      idHelpers.setValue(val.id);
      articleHelpers.setValue(val);
    },
    [articleHelpers, idHelpers],
  );
  return (
    <FrontpageArticleWrapper>
      <Heading textStyle="title.large">{t("htmlTitles.editFrontpage")}</Heading>
      <Wrapper>
        <EditFrontpageWrapper>
          {articleField.value ? (
            <>
              <Text>{t("frontpageForm.frontpageArticle")}</Text>
              <SafeLink to={toEditFrontPageArticle(articleField.value.id, i18n.language)} target="_blank">
                {articleField.value.title.title}
              </SafeLink>
            </>
          ) : (
            <Text>{t("frontpageForm.noFrontpageArticle")}</Text>
          )}
          <FrontpageArticleSearch articleId={idField.value} onChange={onChange}>
            <IconButton
              variant="secondary"
              size="small"
              aria-label={t("frontpageForm.changeFrontpageArticle")}
              title={t("frontpageForm.changeFrontpageArticle")}
            >
              <PencilFill />
            </IconButton>
          </FrontpageArticleSearch>
        </EditFrontpageWrapper>
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
        text={t("alertDialog.notSaved")}
      />
    </FrontpageArticleWrapper>
  );
};
