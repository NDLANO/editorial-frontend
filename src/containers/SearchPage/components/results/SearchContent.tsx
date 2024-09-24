/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { fonts } from "@ndla/core";
import { Concept, Globe } from "@ndla/icons/editor";
import { IMultiSearchSummary } from "@ndla/types-backend/search-api";
import { Node } from "@ndla/types-taxonomy";
import { ContentTypeBadgeNew, constants } from "@ndla/ui";
import SearchContentLanguage from "./SearchContentLanguage";
import SearchHighlight from "./SearchHighlight";
import { EditMarkupLink } from "../../../../components/EditMarkupLink";
import HeaderStatusInformation from "../../../../components/HeaderWithLanguage/HeaderStatusInformation";
import { DRAFT_HTML_SCOPE, RESOURCE_TYPE_LEARNING_PATH } from "../../../../constants";
import { getContentTypeFromResourceTypes, resourceToLinkProps } from "../../../../util/resourceHelpers";
import { isLearningpath, toEditMarkup } from "../../../../util/routeHelpers";
import { getExpirationDate } from "../../../ArticlePage/articleTransformers";
import { useSession } from "../../../Session/SessionProvider";
import {
  NoShadowAnchor,
  StyledSearchBreadcrumb,
  StyledSearchBreadcrumbs,
  StyledSearchContent,
  StyledSearchDescription,
  StyledSearchImageContainer,
  StyledSearchResult,
  StyledSearchTitle,
} from "../form/StyledSearchComponents";

const FlexBoxWrapper = styled.div`
  display: flex;
  flex-flow: row;
  margin-right: 0.2rem;
  box-shadow: none;
  align-items: center;
`;

const ContentTypeWrapper = styled.div`
  margin-right: 0.2em;
  margin-top: 10px;
`;

const DescriptionTitle = styled.p`
  margin-bottom: 0;
  font-weight: ${fonts.weight.semibold};
`;

interface Props {
  content: IMultiSearchSummary;
  locale: string;
  responsibleName?: string;
  subjects: Node[];
}
const Title = StyledSearchTitle.withComponent("h2");
const NoShadowLink = NoShadowAnchor.withComponent(Link);
const MetaImageComponent = ({ content, locale }: { content: IMultiSearchSummary; locale: string }) => {
  const { url, alt } = content.metaImage || {};
  const imageUrl = url ? `${url}?width=200&language=${locale}` : null;

  if (!imageUrl) {
    if (content.learningResourceType === "gloss") return <Globe />;
    if (content.learningResourceType === "concept") return <Concept />;
    return <img src={"/placeholder.png"} alt={alt} />;
  }

  return <img src={imageUrl} alt={alt} />;
};

const SubjectBreadcrumb = ({ content, subjects }: { content: IMultiSearchSummary; subjects: Node[] }) => {
  if (content.learningResourceType === "gloss" || content.learningResourceType === "concept") {
    const breadcrumbs = subjects.filter((s) => content.conceptSubjectIds?.includes(s.id));
    return (
      <>
        {breadcrumbs?.map((breadcrumb) => (
          <StyledSearchBreadcrumb key={breadcrumb.id}>{breadcrumb.name}</StyledSearchBreadcrumb>
        )) || <StyledSearchBreadcrumb />}
      </>
    );
  }

  if (content.contexts && content.contexts.length > 0 && content.contexts[0].breadcrumbs) {
    return content.contexts[0].breadcrumbs.map((breadcrumb) => (
      <StyledSearchBreadcrumb key={breadcrumb} style={{ marginTop: "auto", marginBottom: "auto" }}>
        {breadcrumb}
      </StyledSearchBreadcrumb>
    ));
  } else {
    return <StyledSearchBreadcrumb style={{ marginRight: 0 }} />;
  }
};

const SearchContent = ({ content, locale, subjects, responsibleName }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { contexts, metaImage } = content;
  const { url, alt } = metaImage || {};
  const imageUrl = url ? `${url}?width=200&language=${locale}` : "/placeholder.png";
  let contentType: string | undefined;
  if ((contexts[0]?.resourceTypes?.length ?? 0) > 0) {
    contentType = getContentTypeFromResourceTypes(contexts[0].resourceTypes);
  } else if (isLearningpath(content.url)) {
    contentType = getContentTypeFromResourceTypes([{ id: RESOURCE_TYPE_LEARNING_PATH }]);
  }

  const linkProps = resourceToLinkProps(content, content.resultType, locale);

  const statusType = () => {
    const status = content.status?.current.toLowerCase();
    const isLearningpath = contentType === constants.contentTypes.LEARNING_PATH;
    return t(`form.status.${isLearningpath ? "learningpath_statuses." + status : status}`);
  };
  const EditMarkup = (
    <>
      {content.id && content.resultType === "draft" && userPermissions?.includes(DRAFT_HTML_SCOPE) && (
        <EditMarkupLink
          to={toEditMarkup(
            content.id,
            content.supportedLanguages.includes(locale) ? locale : content.supportedLanguages[0],
          )}
          title={t("editMarkup.linkTitle")}
          inHeader={true}
        />
      )}
    </>
  );

  const ContentType = (
    <>
      {contentType && (
        <ContentTypeWrapper>
          <ContentTypeBadgeNew contentType={contentType} />
        </ContentTypeWrapper>
      )}{" "}
    </>
  );

  const metaDescription = content.metaDescription.metaDescription ?? "";
  const expirationDate = getExpirationDate(content);

  return (
    <StyledSearchResult data-testid="content-search-result">
      <StyledSearchImageContainer>
        <MetaImageComponent content={content} locale={locale} />
      </StyledSearchImageContainer>
      <StyledSearchContent>
        <div>
          <FlexBoxWrapper>
            {ContentType}
            <Title>
              {linkProps && linkProps.href ? (
                <NoShadowAnchor {...linkProps}>{content.title.title}</NoShadowAnchor>
              ) : (
                <NoShadowLink to={linkProps.to ?? ""}>{content.title.title}</NoShadowLink>
              )}
              {EditMarkup}
            </Title>
          </FlexBoxWrapper>
          {content.supportedLanguages.map((lang) => (
            <SearchContentLanguage
              //@ts-ignore
              style={{ display: "flex" }}
              key={`${lang}_search_content`}
              language={lang}
              content={content}
              contentType={contentType}
            />
          ))}
        </div>
        <SearchHighlight content={content} locale={locale} />
        {metaDescription !== "" && <DescriptionTitle>{t("form.name.metaDescription")}</DescriptionTitle>}
        <StyledSearchDescription>{metaDescription}</StyledSearchDescription>
        <StyledSearchBreadcrumbs style={{ marginTop: "-25px" }}>
          <SubjectBreadcrumb content={content} subjects={subjects} />
          <HeaderStatusInformation
            id={content.id}
            statusText={statusType()}
            inSearch
            published={!!(content.status?.current === "PUBLISHED" || content.status?.other.includes("PUBLISHED"))}
            compact
            expirationDate={expirationDate}
            type={content.learningResourceType}
            responsibleName={responsibleName}
            favoriteCount={content.favorited}
          />
        </StyledSearchBreadcrumbs>
      </StyledSearchContent>
    </StyledSearchResult>
  );
};

export default SearchContent;
