/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useEffect, useState, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { ArrowDownShortLine } from "@ndla/icons";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  Badge,
  Button,
  Text,
  Spinner,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleRevisionHistoryDTO, IArticleDTO, IEditorNoteDTO } from "@ndla/types-backend/draft-api";
import AddNotesField from "./AddNotesField";
import { ArticleFormType } from "./articleFormHooks";
import VersionActionbuttons from "./VersionActionButtons";
import { FormField } from "../../components/FormField";
import VersionHistory from "../../components/VersionHistory/VersionHistory";
import { useSession } from "../../containers/Session/SessionProvider";
import * as articleApi from "../../modules/article/articleApi";
import { fetchAuth0UsersFromUserIds, SimpleUserType } from "../../modules/auth0/auth0Api";
import { fetchDraft } from "../../modules/draft/draftApi";
import formatDate from "../../util/formatDate";
import { isFormikFormDirty } from "../../util/formHelper";
import handleError from "../../util/handleError";
import {
  draftApiTypeToLearningResourceFormType,
  draftApiTypeToTopicArticleFormType,
} from "../ArticlePage/articleTransformers";
import { useMessages } from "../Messages/MessagesProvider";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const StyledAccordionRoot = styled(AccordionRoot, {
  base: {
    gap: "0",
  },
});

const AccordionHeadingWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "space-between",
    paddingInline: "xsmall",
    paddingBlock: "xsmall",
    background: "surface.brand.1.moderate",
  },
});

const InfoGrouping = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

const HeaderWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    alignItems: "flex-end",
  },
});

const StyledAccordionItem = styled(AccordionItem, {
  base: {
    overflow: "hidden",
    _first: {
      borderTopRadius: "xsmall",
    },
    _last: {
      borderBottomRadius: "xsmall",
    },
  },
});

const StyledAccordionItemTrigger = styled(AccordionItemTrigger, {
  base: {
    background: "transparent",
    minWidth: "3xlarge",
    gap: "3xsmall",
    justifyContent: "flex-start",
  },
});

const getUser = (userId: string, allUsers: SimpleUserType[]) => {
  const user = allUsers.find((user) => user.id === userId);
  return user?.name || "";
};

interface Props {
  article: IArticleDTO;
  articleRevisionHistory: ArticleRevisionHistoryDTO | undefined;
  type: "standard" | "topic-article";
  currentLanguage: string;
  articleChanged: boolean;
}

const VersionAndNotesPanel = ({ article, articleRevisionHistory, type, currentLanguage, articleChanged }: Props) => {
  const { t } = useTranslation();
  const { ndlaId } = useSession();
  const [users, setUsers] = useState<SimpleUserType[]>([]);
  const { createMessage } = useMessages();
  const { initialValues, values, dirty, isSubmitting, status, setStatus, setValues, resetForm } =
    useFormikContext<ArticleFormType>();

  const loading = !articleRevisionHistory;

  const formIsDirty = useMemo(
    () =>
      isFormikFormDirty({
        values,
        initialValues,
        dirty,
        changed: articleChanged,
      }) || isSubmitting,
    [values, initialValues, dirty, articleChanged, isSubmitting],
  );

  useEffect(() => {
    if (articleRevisionHistory?.revisions.length) {
      const notes = articleRevisionHistory.revisions.reduce((acc: IEditorNoteDTO[], v) => [...acc, ...v.notes], []);
      const userIds = notes.map((note) => note.user).filter((user) => user !== "System");
      fetchAuth0UsersFromUserIds(userIds, setUsers);
    }
  }, [articleRevisionHistory]);

  const cleanupNotes = (notes: IEditorNoteDTO[]) =>
    notes.map((note, idx) => ({
      ...note,
      id: idx,
      author: getUser(note.user, users),
      date: formatDate(note.timestamp),
      status: t(`form.status.${note.status.current.toLowerCase()}`),
    }));

  const resetVersion = async (version: IArticleDTO, language: string, showFromArticleApi: boolean) => {
    try {
      let newArticle: IArticleDTO = version;
      if (showFromArticleApi) {
        const articleApiArticle = await articleApi.getArticle(article.id, language);
        newArticle = {
          ...articleApiArticle,
          notes: [],
          editorLabels: [],
          relatedContent: [],
          revisions: [],
          status: { current: "PUBLISHED", other: [] },
          comments: [],
          priority: "unspecified",
          started: false,
        };
      }
      const transform =
        type === "standard" ? draftApiTypeToLearningResourceFormType : draftApiTypeToTopicArticleFormType;
      const newValues = transform(
        {
          ...newArticle,
          status: article.status,
          responsible: article.responsible,
        },
        language,
        ndlaId,
      );

      setValues(newValues);
      setStatus({ ...status, status: "revertVersion" });
      createMessage({
        message: t("form.resetToProd.success"),
        severity: "success",
      });
    } catch (e) {
      handleError(e);
    }
  };

  const fetchAndResetFormValues = async () => {
    try {
      const language = article.title!.language;
      const draft = await fetchDraft(article.id, language);
      const transform =
        type === "standard" ? draftApiTypeToLearningResourceFormType : draftApiTypeToTopicArticleFormType;
      const values = transform(draft, language, ndlaId);
      resetForm({
        values,
        status: { ...status, status: "revertVersion" },
      });
    } catch (e) {
      handleError(e);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Wrapper>
      <FormField name="notes">
        {({ field, meta, helpers }) => (
          <AddNotesField
            showError={!!meta.error}
            labelWarningNote={meta.error}
            {...field}
            onChange={helpers.setValue}
          />
        )}
      </FormField>
      <StyledAccordionRoot multiple defaultValue={["0"]} variant="clean" lazyMount unmountOnExit>
        {articleRevisionHistory.revisions.map((version, index) => {
          const isLatestVersion = index === 0;
          const published =
            version.status.current === "PUBLISHED" || version.status.other.some((s) => s === "PUBLISHED");

          return (
            <StyledAccordionItem value={index.toString()} key={index}>
              <AccordionHeadingWrapper>
                <HeaderWrapper>
                  <StyledAccordionItemTrigger asChild>
                    <Button variant="link">
                      <AccordionItemIndicator asChild>
                        <ArrowDownShortLine />
                      </AccordionItemIndicator>
                      {version.revision}
                    </Button>
                  </StyledAccordionItemTrigger>
                  <Text textStyle="label.small" asChild consumeCss>
                    <span>{formatDate(version.updated)}</span>
                  </Text>
                </HeaderWrapper>
                <InfoGrouping>
                  <VersionActionbuttons
                    showFromArticleApi={articleRevisionHistory.revisions.length === 1 && published}
                    current={isLatestVersion}
                    version={version}
                    resetVersion={resetVersion}
                    article={article}
                    currentLanguage={currentLanguage}
                    canDeleteCurrentRevision={articleRevisionHistory.canDeleteCurrentRevision}
                    formIsDirty={formIsDirty}
                    fetchAndResetFormValues={fetchAndResetFormValues}
                  />
                  {!!isLatestVersion && <Badge colorTheme="brand2">{t("form.notes.areHere")}</Badge>}
                  {!!published && (!isLatestVersion || articleRevisionHistory.revisions.length === 1) && (
                    <Badge colorTheme="brand3">{t("form.notes.published")}</Badge>
                  )}
                </InfoGrouping>
              </AccordionHeadingWrapper>
              <AccordionItemContent>
                <VersionHistory notes={cleanupNotes(version.notes)} />
              </AccordionItemContent>
            </StyledAccordionItem>
          );
        })}
      </StyledAccordionRoot>
    </Wrapper>
  );
};

export default memo(VersionAndNotesPanel);
