/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ResourceToLinkContent, resourceToLinkProps } from "../../../../util/resourceHelpers";

interface Props {
  content: ResourceToLinkContent;
  language: string;
  contentType?: string;
  includeCurrent?: boolean;
}

const LinksWrapper = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "3xsmall",
  },
});

const LinkWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

export const SearchLanguages = ({ content, contentType, language, includeCurrent }: Props) => {
  const { t } = useTranslation();
  const languages = includeCurrent
    ? content.supportedLanguages
    : content.supportedLanguages?.filter((lang) => lang !== language);

  if (!languages?.length) {
    return null;
  }

  return (
    <LinksWrapper>
      {languages.map((language, index) => {
        const linkProps = resourceToLinkProps(content, contentType, language);
        return (
          <LinkWrapper key={language}>
            <SafeLink asAnchor={!!linkProps.href} to={linkProps.to ?? linkProps.href}>
              {t(`languages.${language}`)}
            </SafeLink>
            {index !== languages.length - 1 && <span> / </span>}
          </LinkWrapper>
        );
      })}
    </LinksWrapper>
  );
};
