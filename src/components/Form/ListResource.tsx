/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { DeleteBinLine, ImageLine } from "@ndla/icons";
import { IconButton, ListItemContent, ListItemHeading, ListItemImage, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    width: "100%",
  },
});

const BigListItemImage = styled(ListItemImage, {
  base: {
    tabletDown: {
      display: "none",
    },
    tabletWide: {
      minWidth: "102px",
      maxWidth: "102px",
      minHeight: "77px",
      maxHeight: "77px",
    },
  },
});

interface Props {
  title?: string;
  metaImage?: { alt?: string; url?: string };
  url: string;
  isExternal?: boolean;
  onDelete?: () => void;
  removeElementTranslation?: string;
  fallbackElement?: ReactNode;
}

const ListResource = ({
  title,
  metaImage,
  url,
  isExternal,
  onDelete,
  removeElementTranslation,
  fallbackElement,
}: Props) => {
  const { t } = useTranslation();
  return (
    <StyledListItemRoot data-testid="elementListItem">
      <BigListItemImage
        src={metaImage?.url ?? ""}
        alt={metaImage?.alt ?? ""}
        fallbackElement={fallbackElement ?? <ImageLine />}
        fallbackWidth={136}
      />
      <ListItemContent>
        <ListItemHeading asChild consumeCss>
          <SafeLink to={url} unstyled target={isExternal ? "_blank" : undefined}>
            {title}
          </SafeLink>
        </ListItemHeading>
        {!!onDelete && (
          <IconButton
            size="small"
            variant="danger"
            onClick={() => onDelete()}
            aria-label={removeElementTranslation ?? t("form.relatedContent.removeArticle")}
            title={removeElementTranslation ?? t("form.relatedContent.removeArticle")}
            data-testid="elementListItemDeleteButton"
          >
            <DeleteBinLine />
          </IconButton>
        )}
      </ListItemContent>
    </StyledListItemRoot>
  );
};

export default ListResource;
