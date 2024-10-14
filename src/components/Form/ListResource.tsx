/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { DeleteForever, ImageLine, Link } from "@ndla/icons/editor";
import { IconButton, ListItemContent, ListItemHeading, ListItemImage, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { IRelatedContentLink } from "@ndla/types-backend/article-api";
import { resourceToLinkProps } from "../../util/resourceHelpers";

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

const StyledIconButton = styled(IconButton, {
  base: {
    position: "relative",
  },
});

interface DeleteButtonProps {
  onClick: () => void;
  removeElementTranslation?: string;
}
const DeleteButton = ({ onClick, removeElementTranslation }: DeleteButtonProps) => {
  const { t } = useTranslation();
  const deleteButtonText = removeElementTranslation ?? t("form.relatedContent.removeArticle");
  return (
    <StyledIconButton
      size="small"
      variant="danger"
      onClick={() => onClick()}
      aria-label={deleteButtonText}
      title={deleteButtonText}
      data-testid="elementListItemDeleteButton"
    >
      <DeleteForever />
    </StyledIconButton>
  );
};

export type ExternalElementType = IRelatedContentLink & { isExternal?: boolean };

interface ExternalListResourceProps {
  element: ExternalElementType;
  onDelete?: () => void;
  removeElementTranslation?: string;
}

export const ExternalListResource = ({ element, onDelete, removeElementTranslation }: ExternalListResourceProps) => {
  return (
    <StyledListItemRoot context="list" variant="subtle" data-testid="elementListItem">
      <BigListItemImage src="" alt="" fallbackElement={<Link />} fallbackWidth={136} />
      <ListItemContent>
        <ListItemHeading asChild consumeCss>
          <SafeLink to={element.url} target="_blank">
            {element.title}
          </SafeLink>
        </ListItemHeading>
        {onDelete && <DeleteButton onClick={onDelete} removeElementTranslation={removeElementTranslation} />}
      </ListItemContent>
    </StyledListItemRoot>
  );
};

export interface ElementType {
  id: number;
  articleType?: string;
  metaImage?: { alt?: string; url?: string };
  title?: { title: string; language: string };
  supportedLanguages?: string[];
  contexts?: { contextType: string }[];
  learningResourceType?: string;
}

interface Props {
  element: ElementType;
  onDelete?: () => void;
  removeElementTranslation?: string;
  articleType?: string;
}

const ListResource = ({ element, onDelete, removeElementTranslation, articleType }: Props) => {
  const { i18n } = useTranslation();

  const linkProps = resourceToLinkProps(element, element.articleType ?? articleType ?? "learning-path", i18n.language);

  return (
    <StyledListItemRoot context="list" variant="subtle" data-testid="elementListItem">
      <BigListItemImage
        src={element.metaImage?.url ?? ""}
        alt={element?.metaImage?.alt ?? ""}
        fallbackElement={<ImageLine />}
        fallbackWidth={136}
      />
      <ListItemContent>
        <ListItemHeading asChild consumeCss>
          <SafeLink to={linkProps.to ? linkProps.to : linkProps.href!} unstyled css={linkOverlay.raw()}>
            {element.title?.title}
          </SafeLink>
        </ListItemHeading>
        {onDelete && <DeleteButton onClick={onDelete} removeElementTranslation={removeElementTranslation} />}
      </ListItemContent>
    </StyledListItemRoot>
  );
};

export default ListResource;
