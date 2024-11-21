/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArrayHelpers, FieldArray, useField } from "formik";
import { CSSProperties, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { AddLine, DeleteBinLine } from "@ndla/icons/action";
import { ArrowRightShortLine } from "@ndla/icons/common";
import { EyeFill } from "@ndla/icons/editor";
import { IconButton } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IArticleSummaryV2 } from "@ndla/types-backend/article-api";
import FrontpageArticleSearch from "./FrontpageArticleSearch";
import FrontpageNodeList, { FRONTPAGE_DEPTH_LIMIT } from "./FrontpageNodeList";
import { MenuWithArticle } from "./types";
import { toEditFrontPageArticle } from "../../util/routeHelpers";

const StyledNode = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    padding: "xsmall",
    borderRadius: "xsmall",
    background: "surface.default",
    _hover: {
      background: "surface.hover",
    },
  },
});

const StyledIconButton = styled(IconButton, {
  base: {
    marginInlineStart: "large",
    _open: {
      "& svg": {
        transform: "rotate(90deg)",
      },
    },
  },
  variants: {
    isHidden: { true: { visibility: "hidden" } },
  },
});

const NodeWrapper = styled("div", {
  base: {
    width: "100%",
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
    marginInlineStart: "calc(var(--level) * token(spacing.large))",
  },
});

interface Props extends Pick<ArrayHelpers, "remove" | "replace"> {
  level: number;
  name: string;
  index: number;
}

const FrontpageNode = ({ name, remove, index, level, replace }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [field] = useField<MenuWithArticle>(name);
  const { t, i18n } = useTranslation();

  const onRemove = useCallback(() => remove(index), [index, remove]);

  const onHide = useCallback(() => {
    const updatedExisting: MenuWithArticle = {
      ...field.value,
      hideLevel: !field.value.hideLevel,
    };
    replace(index, updatedExisting);
  }, [field.value, index, replace]);

  const onAdd = useCallback(
    (val: IArticleSummaryV2) => {
      const newMenu: MenuWithArticle = {
        articleId: val.id,
        article: val,
        menu: [],
      };
      const menu = field.value.menu.concat(newMenu);
      const updatedExisting: MenuWithArticle = {
        articleId: field.value.articleId,
        article: field.value.article,
        menu,
      };
      replace(index, updatedExisting);
    },
    [field.value, index, replace],
  );

  if (!field.value) {
    return null;
  }

  const openLabel = isOpen ? t("frontpageForm.openChildren") : t("frontpageForm.closeChildren");
  const hideToggleOpenButton = level >= FRONTPAGE_DEPTH_LIMIT || !field.value.menu.length;

  return (
    <NodeWrapper data-node-wrapper="">
      <StyledNode data-node="">
        <ContentWrapper style={{ "--level": level } as CSSProperties}>
          <StyledIconButton
            data-state={isOpen ? "open" : "closed"}
            size="small"
            variant="tertiary"
            aria-label={openLabel}
            title={openLabel}
            isHidden={hideToggleOpenButton}
            aria-hidden={hideToggleOpenButton}
            onClick={() => setIsOpen((p) => !p)}
          >
            <ArrowRightShortLine />
          </StyledIconButton>
          <SafeLink to={toEditFrontPageArticle(field.value.articleId, i18n.language)} target="_blank">
            {field.value.article?.title.title ?? t("frontpageForm.failedTitle")}
          </SafeLink>
        </ContentWrapper>
        <ContentWrapper>
          {level > 0 && (
            <IconButton
              aria-label={field.value.hideLevel ? t("frontpageForm.show") : t("frontpageForm.hide")}
              title={field.value.hideLevel ? t("frontpageForm.show") : t("frontpageForm.hide")}
              variant={field.value.hideLevel ? "primary" : "tertiary"}
              size="small"
              onClick={onHide}
            >
              <EyeFill />
            </IconButton>
          )}
          {!field.value.menu.length && (
            <IconButton
              aria-label={t("remove")}
              size="small"
              title={t("remove")}
              hidden={!!field.value.menu.length}
              variant="danger"
              onClick={onRemove}
            >
              <DeleteBinLine />
            </IconButton>
          )}
          <FrontpageArticleSearch onChange={onAdd}>
            <IconButton
              variant="tertiary"
              size="small"
              aria-label={t("frontpageForm.addArticle")}
              title={t("frontpageForm.addArticle")}
              disabled={level > FRONTPAGE_DEPTH_LIMIT - 1}
            >
              <AddLine />
            </IconButton>
          </FrontpageArticleSearch>
        </ContentWrapper>
      </StyledNode>
      {!!field.value.menu.length && !!isOpen && (
        <FieldArray name={`${name}.menu`} render={(props) => <FrontpageNodeList {...props} level={level + 1} />} />
      )}
    </NodeWrapper>
  );
};

export default FrontpageNode;
