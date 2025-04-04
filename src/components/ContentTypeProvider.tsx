/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, createContext, useContext } from "react";
import { ContentType } from "@ndla/ui";

const ContentTypeContext = createContext<ContentType>("subject-material");

interface Props {
  children: ReactNode;
  value?: ContentType;
}

export const ContentTypeProvider = ({ children, value = "subject-material" }: Props) => {
  return <ContentTypeContext value={value}>{children}</ContentTypeContext>;
};

export const useArticleContentType = (fallback?: ContentType) => {
  const contentType = useContext(ContentTypeContext);

  return contentType ?? fallback;
};
