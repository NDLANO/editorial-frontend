/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, InputHTMLAttributes, forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, misc, spacing, fonts } from "@ndla/core";
import { Search } from "@ndla/icons/common";
import { isValidLocale } from "../../../i18n";
import { fetchNewArticleId } from "../../../modules/draft/draftApi";
import { fetchNode } from "../../../modules/nodes/nodeApi";
import { resolveUrls } from "../../../modules/taxonomy/taxonomyApi";
import { isNDLAFrontendUrl } from "../../../util/htmlHelpers";
import { toEditArticle, to404 } from "../../../util/routeHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

const StyledForm = styled.form`
  display: flex;
  flex-grow: 1;
  border-radius: ${misc.borderRadius};
  border: 1px solid transparent;
  ${fonts.sizes(16, 1.2)};
  padding: ${spacing.xsmall};
  height: ${spacing.large};
  align-items: center;
  transition: all 100ms ease-in-out;
  min-width: 180px;

  &:focus-within {
    background: ${colors.white};
    border: 1px solid ${colors.brand.tertiary};
  }

  &:hover {
    cursor: pointer;
    border: 1px solid ${colors.brand.tertiary};
  }

  input {
    padding: ${spacing.xsmall};
    background: transparent;
    border: 0;
    outline: none;
    color: ${colors.brand.primary};
    transition: all 300ms ease-in-out;

    &:not(:focus-within) {
      ::placeholder {
        color: ${colors.brand.primary};
        font-weight: ${fonts.weight.semibold};
        opacity: 1;
      }
    }
  }

  & > button {
    color: ${colors.brand.grey};
  }
`;

const StyledSearch = styled(Search)`
  margin: 0 ${spacing.small};
  width: 24px;
  height: 24px;
`;

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  onSearchQuerySubmit: (query: string) => void;
  setQuery: (query: string) => void;
  query: string;
  setMenuOpen: (value: boolean) => void;
}

export const MastheadSearchForm = forwardRef<HTMLInputElement, Props>(
  ({ onSearchQuerySubmit, setQuery, query, setMenuOpen, ...rest }, ref) => {
    const { t, i18n } = useTranslation();
    const { taxonomyVersion } = useTaxonomyVersion();
    const navigate = useNavigate();

    const handleNodeId = async (nodeId: number) => {
      try {
        const newArticle = await fetchNewArticleId(nodeId);
        navigate(toEditArticle(newArticle.id, "standard"));
      } catch (error) {
        navigate(to404());
      }
    };

    const handleTaxonomyId = async (taxId: string) => {
      try {
        const taxElement = await fetchNode({ id: taxId, taxonomyVersion });
        const arr = taxElement.contentUri?.split(":");
        if (arr) {
          const id = arr[arr.length - 1];
          navigate(toEditArticle(parseInt(id), "standard"));
        }
      } catch (error) {
        navigate(to404());
      }
    };

    const handleUrlPaste = (frontendUrl: string) => {
      // Removes search queries before split
      const ndlaUrl = frontendUrl.split(/\?/)[0];
      // Strip / from end if topic
      const cleanUrl = ndlaUrl.endsWith("/")
        ? ndlaUrl.replace("/subjects", "").slice(0, -1)
        : ndlaUrl.replace("/subjects", "");
      const splittedNdlaUrl = cleanUrl.split("/");

      const urlId = splittedNdlaUrl[splittedNdlaUrl.length - 1];

      if (
        !urlId.includes("urn:topic") &&
        Number.isNaN(parseFloat(urlId)) &&
        !splittedNdlaUrl.find((e) => e.match(/subject:*/)) === undefined
      ) {
        return;
      }
      setQuery("");
      if (urlId.includes("urn:topic")) {
        handleTopicUrl(urlId);
      } else if (splittedNdlaUrl.includes("node")) {
        handleNodeId(parseInt(urlId));
      } else if (splittedNdlaUrl.find((e) => e.match(/subject:*/))) {
        handleFrontendUrl(cleanUrl);
      } else {
        navigate(toEditArticle(parseInt(urlId), "standard"));
      }
    };

    const handleTopicUrl = async (urlId: string) => {
      try {
        const topicArticle = await fetchNode({
          id: urlId,
          language: i18n.language,
          taxonomyVersion,
        });
        const arr = topicArticle.contentUri?.split(":") ?? [];
        const id = arr[arr.length - 1];
        navigate(toEditArticle(parseInt(id), "topic-article"));
      } catch {
        navigate(to404());
      }
    };

    const handleFrontendUrl = async (url: string) => {
      const { pathname } = new URL(url);
      const paths = pathname.split("/");
      const path = isValidLocale(paths[1]) ? paths.slice(2).join("/") : pathname;

      try {
        const newArticle = await resolveUrls({
          path,
          taxonomyVersion: "default",
        });
        const splittedUri = newArticle.contentUri.split(":");
        const articleId = splittedUri[splittedUri.length - 1];
        navigate(toEditArticle(parseInt(articleId), "standard"));
      } catch {
        navigate(to404());
      }
    };

    const handleSubmit = (evt: FormEvent) => {
      evt.preventDefault();
      const isNDLAUrl = isNDLAFrontendUrl(query);
      const isNodeId = query.length > 2 && /#\d+/g.test(query) && !Number.isNaN(parseFloat(query.substring(1)));

      const isTaxonomyId = query.length > 2 && /#urn:(resource|topic)[:\da-fA-F-]+/g.test(query);

      if (isNDLAUrl) {
        handleUrlPaste(query);
      } else if (isNodeId) {
        handleNodeId(parseInt(query.substring(1)));
      } else if (isTaxonomyId) {
        handleTaxonomyId(query.substring(1));
      } else {
        onSearchQuerySubmit(query);
      }
    };
    const [focused, setFocused] = useState(false);

    return (
      <StyledForm onSubmit={handleSubmit}>
        <ButtonV2 type="submit" variant="stripped">
          <StyledSearch color={colors.brand.primary} />
        </ButtonV2>

        <input
          {...rest}
          ref={ref}
          type="text"
          value={query}
          placeholder={focused ? t("searchForm.placeholder") : t("searchPage.searchButton")}
          onFocus={() => {
            setFocused(true);
            setMenuOpen(true);
          }}
          onBlur={() => {
            setFocused(false);
            setMenuOpen(false);
          }}
        />
      </StyledForm>
    );
  },
);

export default MastheadSearchForm;
