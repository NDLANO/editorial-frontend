/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Badge, Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { constants } from "@ndla/ui";
import HeaderStatusInformation from "./HeaderStatusInformation";
import {
  FormHeaderHeading,
  FormHeaderHeadingContainer,
  FormHeaderSegment,
} from "../../containers/FormHeader/FormHeader";
import { useMessages } from "../../containers/Messages/MessagesProvider";
import { useAuth0Users } from "../../modules/auth0/auth0Queries";
import * as draftApi from "../../modules/draft/draftApi";
import handleError from "../../util/handleError";
import { getContentTypeFromResourceTypes } from "../../util/resourceHelpers";
import { toEditArticle } from "../../util/routeHelpers";

export const StyledSplitter = styled("div", {
  base: {
    width: "1px",
    background: "stroke.default",
    height: "medium",
    marginInline: "3xsmall",
  },
});

const { contentTypes } = constants;

const contentTypeMapping: Record<string, string> = {
  standard: contentTypes.SUBJECT_MATERIAL,
  "topic-article": contentTypes.TOPIC,
  subjectpage: contentTypes.SUBJECT,
  "frontpage-article": "frontpage-article",
  filmfrontpage: contentTypes.SUBJECT,
  programme: "programme",
};

interface Props {
  statusText?: string;
  published?: boolean;
  type: string;
  isNewLanguage: boolean;
  title?: string;
  formIsDirty?: boolean;
  id?: number;
  language: string;
  expirationDate?: string;
  responsibleId?: string;
  slug?: string;
  nodes: Node[] | undefined;
}

const HeaderInformation = ({
  type,
  id,
  statusText,
  published = false,
  isNewLanguage,
  title,
  formIsDirty,
  expirationDate,
  responsibleId,
  language,
  slug,
  nodes,
}: Props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { createMessage } = useMessages();
  const navigate = useNavigate();
  const responsibleQuery = useAuth0Users({ uniqueUserIds: responsibleId ?? "" }, { enabled: !!responsibleId });

  const contentType = useMemo(() => {
    const taxonomy = nodes?.flatMap((node) => node.contexts) ?? [];
    if (taxonomy[0]?.resourceTypes.length) {
      return getContentTypeFromResourceTypes(taxonomy[0].resourceTypes);
    }
    return contentTypeMapping[type];
  }, [nodes, type]);

  const onSaveAsNew = useCallback(async () => {
    if (!id) return;
    try {
      if (formIsDirty) {
        createMessage({
          translationKey: "form.mustSaveFirst",
          severity: "danger",
          timeToLive: 0,
        });
      } else {
        setLoading(true);
        const newArticle = await draftApi.cloneDraft(id, language);
        // we don't set loading to false as the redirect will unmount this component anyway
        navigate(toEditArticle(newArticle.id, newArticle.articleType, language));
      }
    } catch (e) {
      handleError(e);
      setLoading(false);
    }
  }, [createMessage, formIsDirty, id, language, navigate]);

  return (
    <FormHeaderSegment>
      <FormHeaderHeadingContainer>
        <Badge>{t(`contentTypes.${contentType ?? contentTypes.SUBJECT_MATERIAL}`)}</Badge>
        <FormHeaderHeading contentType={contentType ?? contentTypes.SUBJECT_MATERIAL}>{title}</FormHeaderHeading>
        {(type === "standard" || type === "topic-article") && id ? (
          <Button size="small" variant="tertiary" onClick={onSaveAsNew} data-testid="saveAsNew" loading={loading}>
            {t("form.workflow.saveAsNew")}
          </Button>
        ) : null}
      </FormHeaderHeadingContainer>
      <HeaderStatusInformation
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        published={published}
        slug={slug}
        nodes={nodes}
        type={type}
        id={id}
        expirationDate={expirationDate}
        responsibleName={responsibleQuery.data?.[0]?.name}
      />
    </FormHeaderSegment>
  );
};

export default memo(HeaderInformation);
