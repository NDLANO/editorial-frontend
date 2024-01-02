/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";

const StyleMetaInformation = styled.div`
  display: flex;
  gap: 2rem;
  margin-left: ${spacing.normal};
`;

const StyledStrong = styled.strong`
  display: block;
`;

interface Props {
  title?: string;
  copyright?: string;
  alt?: string;
  translations: {
    title: string;
    copyright: string;
    alt: string;
  };
  action: ReactNode;
}

const MetaInformation = ({ title, copyright, translations, action, alt }: Props) => (
  <StyleMetaInformation>
    <div>{action || null}</div>
    <div>
      <StyledStrong>{title ? translations.title : ""}</StyledStrong>
      <span>{title}</span>
      <StyledStrong>{copyright ? translations.copyright : ""}</StyledStrong>
      <span>{copyright}</span>
      {!!alt && (
        <>
          <StyledStrong>{translations.alt}</StyledStrong>
          <span>{alt}</span>
        </>
      )}
    </div>
  </StyleMetaInformation>
);

export default MetaInformation;
