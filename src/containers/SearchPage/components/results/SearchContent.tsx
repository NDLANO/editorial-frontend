/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ErrorWarningFill, CheckLine, CodeView, GlobalLine, InfoI } from "@ndla/icons";
import { Badge, ListItemContent, ListItemHeading, ListItemRoot, Text } from "@ndla/primitives";
import { SafeLink, SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IMultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { constants } from "@ndla/ui";
import SearchHighlight from "./SearchHighlight";
import { SearchListItemImage } from "./SearchListItemImage";
import HeaderFavoriteStatus from "../../../../components/HeaderWithLanguage/HeaderFavoriteStatus";
import config from "../../../../config";
import { DRAFT_HTML_SCOPE, PUBLISHED, RESOURCE_TYPE_LEARNING_PATH } from "../../../../constants";
import { getContentTypeFromResourceTypes, resourceToLinkProps } from "../../../../util/resourceHelpers";
import { isLearningpath, routes } from "../../../../util/routeHelpers";
import { useSession } from "../../../Session/SessionProvider";

interface Props {
  content: IMultiSearchSummaryDTO;
  locale: string;
  responsibleName?: string;
}

const SubjectBreadcrumb = ({ content }: { content: IMultiSearchSummaryDTO }) => {
  const breadcrumbs = useMemo(() => {
    return content.contexts?.[0]?.breadcrumbs ?? [];
  }, [content.contexts]);

  if (!breadcrumbs) return null;

  return (
    <BreadcrumbText textStyle="label.xsmall" color="text.subtle">
      {breadcrumbs.join(" > ")}
    </BreadcrumbText>
  );
};

const BreadcrumbText = styled(Text, {
  base: {
    justifySelf: "flex-end",
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "5xsmall",
  },
});

const StyledListItemContent = styled(ListItemContent, {
  base: {
    flexDirection: "column",
    gap: "4xsmall",
    alignItems: "flex-start",
  },
});

const StatusWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    alignSelf: "flex-end",
  },
});

const StyledSpan = styled("span", {
  base: {
    whiteSpace: "nowrap",
  },
});

const StyledSearchListItemImage = styled(SearchListItemImage, {
  base: {
    tabletDown: {
      display: "none",
    },
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    tabletDown: {
      gap: "0",
    },
  },
});

const InfoWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

const ListItemHeadingContent = styled(ListItemContent, {
  base: {
    flexWrap: "wrap",
  },
});

const ListItemFooterContent = styled(ListItemContent, {
  base: {
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
});

const ListItemMainContent = styled(ListItemContent, {
  base: {
    alignItems: "flex-start",
    tabletDown: {
      flexWrap: "wrap",
    },
  },
});

const StyledText = styled(Text, {
  base: {
    lineClamp: "2",
  },
});

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  base: {
    fill: "icon.subtle",
  },
});

const conceptTypes = ["concept", "gloss"];

const SearchContent = ({ content, locale, responsibleName }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();

  const contentType = useMemo(() => {
    const resourceTypes = content.contexts[0]?.resourceTypes;
    if (resourceTypes?.length) {
      return getContentTypeFromResourceTypes(resourceTypes);
    } else if (isLearningpath(content.url)) {
      return getContentTypeFromResourceTypes([{ id: RESOURCE_TYPE_LEARNING_PATH }]);
    } else if (["concept", "gloss"].includes(content.learningResourceType)) {
      return content.learningResourceType;
    }
    return undefined;
  }, [content.url, content.contexts, content.learningResourceType]);

  const imageData = useMemo(() => {
    if (content.learningResourceType === "gloss") {
      return { icon: <GlobalLine />, imageUrl: "" };
    } else if (content.learningResourceType === "concept") {
      return { icon: <InfoI />, imageUrl: "" };
    } else {
      return { icon: undefined, imageUrl: content.metaImage?.url ?? "/placeholder.png" };
    }
  }, [content.learningResourceType, content.metaImage?.url]);

  const linkProps = resourceToLinkProps(content, content.resultType, locale);

  const statusType = () => {
    const status = content.status?.current.toLowerCase();
    const isLearningpath = contentType === constants.contentTypes.LEARNING_PATH;
    return t(`form.status.${isLearningpath ? "learningpath_statuses." + status : status}`);
  };

  const metaDescription = content.metaDescription.metaDescription ?? "";

  return (
    <StyledListItemRoot context="list" variant="subtle" data-testid="content-search-result">
      <StyledSearchListItemImage
        src={imageData.imageUrl}
        imageLanguage={locale}
        alt={content.metaImage?.alt ?? ""}
        fallbackElement={imageData.icon}
        sizes="56px"
        fallbackWidth={56}
      />
      <StyledListItemContent>
        <ListItemHeadingContent>
          <ListItemHeading asChild consumeCss>
            <SafeLink asAnchor={!!linkProps.href} to={linkProps.to ?? linkProps.href} unstyled>
              {content.title.title}
            </SafeLink>
          </ListItemHeading>
          <InfoWrapper>
            {content.contexts.length > 1 && (
              <StyledErrorWarningFill title={t("searchForm.multiTaxonomy", { count: content.contexts.length })} />
            )}
            {!!contentType && <Badge>{t(`contentTypes.${contentType}`)}</Badge>}
            {content.learningResourceType !== "frontpage-article" && (
              <HeaderFavoriteStatus
                id={content.id}
                type={content.learningResourceType}
                favoriteCount={content.favorited}
              />
            )}
          </InfoWrapper>
        </ListItemHeadingContent>
        <ListItemMainContent>
          <ContentWrapper>
            <SearchHighlight content={content} locale={locale} />
            {!!metaDescription.length && <StyledText textStyle="body.small">{metaDescription}</StyledText>}
          </ContentWrapper>
          <InfoWrapper>
            {!conceptTypes.includes(contentType ?? "") &&
            content.id &&
            content.resultType === "draft" &&
            userPermissions?.includes(DRAFT_HTML_SCOPE) ? (
              <SafeLinkIconButton
                size="small"
                variant="secondary"
                title={t("editMarkup.linkTitle")}
                aria-label={t("editMarkup.linkTitle")}
                to={routes.editMarkup(
                  content.id,
                  content.supportedLanguages.includes(locale) ? locale : content.supportedLanguages[0],
                )}
              >
                <CodeView />
              </SafeLinkIconButton>
            ) : null}
            {!!(content.status?.current === PUBLISHED || content.status?.other.includes(PUBLISHED)) && (
              <SafeLinkIconButton
                size="small"
                variant="success"
                target="_blank"
                aria-label={t("form.workflow.published")}
                title={t("form.workflow.published")}
                to={`${config.ndlaFrontendDomain}/${content.learningResourceType === "concept" || content.learningResourceType === "gloss" ? "concept" : "article"}/${
                  content.id
                }`}
              >
                <CheckLine />
              </SafeLinkIconButton>
            )}
          </InfoWrapper>
        </ListItemMainContent>
        <ListItemFooterContent>
          <SubjectBreadcrumb content={content} />
          <StatusWrapper>
            <StyledSpan>
              <Text asChild consumeCss fontWeight="bold" textStyle="label.xsmall">
                <span>{`${t("form.responsible.label")}: `}</span>
              </Text>
              <Text asChild consumeCss textStyle="label.xsmall">
                <span>{responsibleName || t("form.responsible.noResponsible")}</span>
              </Text>
            </StyledSpan>
            <StyledSpan>
              <Text asChild consumeCss fontWeight="bold" textStyle="label.xsmall">
                <span>{`${t("form.workflow.statusLabel")}: `}</span>
              </Text>
              <Text asChild consumeCss textStyle="label.xsmall">
                <span>{statusType() || t("form.status.new")}</span>
              </Text>
            </StyledSpan>
          </StatusWrapper>
        </ListItemFooterContent>
      </StyledListItemContent>
    </StyledListItemRoot>
  );
};

export default SearchContent;
