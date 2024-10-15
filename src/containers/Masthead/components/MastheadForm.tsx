/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithRef, FormEvent, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { styled } from "@ndla/styled-system/jsx";
import { isValidLocale } from "../../../i18n";
import { fetchNewArticleId } from "../../../modules/draft/draftApi";
import { fetchNode } from "../../../modules/nodes/nodeApi";
import { resolveUrls } from "../../../modules/taxonomy/taxonomyApi";
import { isNDLAFrontendUrl } from "../../../util/htmlHelpers";
import { routes } from "../../../util/routeHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

interface Props extends ComponentPropsWithRef<"form"> {
  query: string;
  onSubmit: () => void;
}

const StyledForm = styled("form", {
  base: {
    width: "100%",
  },
});

export const MastheadForm = forwardRef<HTMLFormElement, Props>(({ children, query, onSubmit, ...props }, ref) => {
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const navigate = useNavigate();
  const handleNodeId = async (nodeId: number) => {
    try {
      const newArticle = await fetchNewArticleId(nodeId);
      navigate(routes.editArticle(newArticle.id, "standard"));
    } catch (error) {
      navigate(routes.notFound);
    }
  };

  const handleTaxonomyId = async (taxId: string) => {
    try {
      const taxElement = await fetchNode({ id: taxId, taxonomyVersion });
      const arr = taxElement.contentUri?.split(":");
      if (arr) {
        const id = arr[arr.length - 1];
        navigate(routes.editArticle(parseInt(id), "standard"));
      }
    } catch (error) {
      navigate(routes.notFound);
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
    if (urlId.includes("urn:topic")) {
      handleTopicUrl(urlId);
    } else if (splittedNdlaUrl.includes("node")) {
      handleNodeId(parseInt(urlId));
    } else if (splittedNdlaUrl.find((e) => e.match(/subject:*/))) {
      handleFrontendUrl(cleanUrl);
    } else {
      navigate(routes.editArticle(parseInt(urlId), "standard"));
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
      navigate(routes.editArticle(parseInt(id), "topic-article"));
    } catch {
      navigate(routes.notFound);
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
      navigate(routes.editArticle(parseInt(articleId), "standard"));
    } catch {
      navigate(routes.notFound);
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
      onSubmit();
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit} {...props} ref={ref}>
      {children}
    </StyledForm>
  );
});
