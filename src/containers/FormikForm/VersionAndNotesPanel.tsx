/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useEffect, useState, memo } from "react";

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { AccordionTrigger } from "@radix-ui/react-accordion";
import { AccordionRoot, AccordionItem, AccordionContent } from "@ndla/accordion";
import { ButtonV2 } from "@ndla/button";
import { spacing, colors, fonts } from "@ndla/core";
import { ChevronRight } from "@ndla/icons/common";
import { IArticle, IEditorNote } from "@ndla/types-backend/draft-api";
import { Text } from "@ndla/typography";
import AddNotesField from "./AddNotesField";
import VersionActionbuttons from "./VersionActionButtons";
import FormikField from "../../components/FormikField";
import Spinner from "../../components/Spinner";
import VersionHistory from "../../components/VersionHistory/VersionHistory";
import VersionLogTag from "../../components/VersionHistory/VersionLogTag";
import { useSession } from "../../containers/Session/SessionProvider";
import * as articleApi from "../../modules/article/articleApi";
import { fetchAuth0UsersFromUserIds, SimpleUserType } from "../../modules/auth0/auth0Api";
import { fetchDraftHistory } from "../../modules/draft/draftApi";
import formatDate from "../../util/formatDate";
import handleError from "../../util/handleError";
import {
  draftApiTypeToLearningResourceFormType,
  draftApiTypeToTopicArticleFormType,
} from "../ArticlePage/articleTransformers";
import { useMessages } from "../Messages/MessagesProvider";

const StyledAccordionBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacing.small};
  background-color: ${colors.brand.light};
  button {
    font-weight: ${fonts.weight.semibold};
  }
`;

const InfoGrouping = styled.div`
  display: flex;
  gap: ${spacing.small};
`;

const StyledAccordionItem = styled(AccordionItem)`
  border-radius: 0px;
  border: none;
  svg {
    transition: all 200ms;
  }
  &[data-state="open"] {
    svg[data-open-indicator] {
      transform: rotate(90deg);
    }
  }
`;

const StyledButton = styled(ButtonV2)`
  box-shadow: none;
  text-decoration: underline;
  &:hover,
  &:focus-visible,
  &:active {
    text-decoration: none;
  }
`;

const StyledAccordionRoot = styled(AccordionRoot)`
  gap: 0px;
  padding: ${spacing.normal} 0px;
`;

const StyledAccordionContent = styled(AccordionContent)`
  background-color: ${colors.white};
  padding: 0px;
  padding-bottom: ${spacing.small};
`;

const VersionHistoryWrapper = styled.div`
  padding: 0px ${spacing.normal};
  background-color: ${colors.brand.greyLightest};
`;

const getUser = (userId: string, allUsers: SimpleUserType[]) => {
  const user = allUsers.find((user) => user.id === userId);
  return user?.name || "";
};

interface Props {
  article: IArticle;
  articleHistory: IArticle[] | undefined;
  type: "standard" | "topic-article";
  currentLanguage: string;
}

const VersionAndNotesPanel = ({ article, articleHistory, type, currentLanguage }: Props) => {
  const { t } = useTranslation();
  const { ndlaId } = useSession();
  const [users, setUsers] = useState<SimpleUserType[]>([]);
  const { createMessage } = useMessages();
  const { setStatus, setValues, status } = useFormikContext();

  const loading = !articleHistory;

  useEffect(() => {
    if (articleHistory?.length) {
      const notes = articleHistory.reduce((acc: IEditorNote[], v) => [...acc, ...v.notes], []);
      const userIds = notes.map((note) => note.user).filter((user) => user !== "System");
      fetchAuth0UsersFromUserIds(userIds, setUsers);
    }
  }, [articleHistory]);

  const cleanupNotes = (notes: IEditorNote[]) =>
    notes.map((note, idx) => ({
      ...note,
      id: idx,
      author: getUser(note.user, users),
      date: formatDate(note.timestamp),
      status: t(`form.status.${note.status.current.toLowerCase()}`),
    }));

  const resetVersion = async (version: IArticle, language: string, showFromArticleApi: boolean) => {
    try {
      let newArticle: IArticle = version;
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
          prioritized: false,
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

  if (loading) return <Spinner />;

  return (
    <>
      <FormikField name="notes" showError={false}>
        {({ field, form: { errors } }) => (
          <AddNotesField
            showError={!!errors[field.name]}
            labelAddNote={t("form.notes.add")}
            labelRemoveNote={t("form.notes.remove")}
            labelWarningNote={errors[field.name]}
            {...field}
          />
        )}
      </FormikField>
      <StyledAccordionRoot type="multiple" defaultValue={["0"]}>
        {articleHistory.map((version, index) => {
          const isLatestVersion = index === 0;
          const published =
            version.status.current === "PUBLISHED" || version.status.other.some((s) => s === "PUBLISHED");
          return (
            <StyledAccordionItem value={index.toString()} key={index}>
              <StyledAccordionBar>
                <InfoGrouping>
                  <AccordionTrigger asChild>
                    <StyledButton variant="link">
                      <ChevronRight data-open-indicator="" />
                      {version.revision}
                    </StyledButton>
                  </AccordionTrigger>
                  <Text element="span" margin="none" textStyle="meta-text-small">
                    {formatDate(version.updated)}
                  </Text>
                </InfoGrouping>
                <InfoGrouping>
                  <VersionActionbuttons
                    showFromArticleApi={articleHistory.length === 1 && published}
                    current={isLatestVersion}
                    version={version}
                    resetVersion={resetVersion}
                    article={article}
                    currentLanguage={currentLanguage}
                  />
                  {isLatestVersion && <VersionLogTag color="yellow" label={t("form.notes.areHere")} />}
                  {published && (!isLatestVersion || articleHistory.length === 1) && (
                    <VersionLogTag color="green" label={t("form.notes.published")} />
                  )}
                </InfoGrouping>
              </StyledAccordionBar>
              <StyledAccordionContent>
                <VersionHistoryWrapper>
                  <VersionHistory notes={cleanupNotes(version.notes)} />
                </VersionHistoryWrapper>
              </StyledAccordionContent>
            </StyledAccordionItem>
          );
        })}
      </StyledAccordionRoot>
    </>
  );
};

export default memo(VersionAndNotesPanel);
