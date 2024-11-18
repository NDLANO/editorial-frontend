/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArrayHelpers, FieldArray, useField } from "formik";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing, colors, fonts } from "@ndla/core";
import { AddLine, DeleteBinLine } from "@ndla/icons/action";
import { ArrowRightShortLine } from "@ndla/icons/common";
import { EyeFill } from "@ndla/icons/editor";
import { IconButton } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { IArticleSummaryV2 } from "@ndla/types-backend/article-api";
import FrontpageArticleSearch from "./FrontpageArticleSearch";
import FrontpageNodeList, { FRONTPAGE_DEPTH_LIMIT } from "./FrontpageNodeList";
import { MenuWithArticle } from "./types";
import { toEditFrontPageArticle } from "../../util/routeHelpers";

interface Props extends Pick<ArrayHelpers, "remove" | "replace"> {
  level: number;
  name: string;
  index: number;
}

const NodeContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${spacing.small};
  color: ${colors.brand.primary};
  align-items: center;
  border-bottom: 1px solid ${colors.brand.greyLight};
  width: 100%;
`;

const NodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TitleLink = styled(SafeLink)`
  color: ${colors.brand.primary};
  box-shadow: none;
  justify-content: flex-start;
  font-weight: ${fonts.weight.semibold};
  &:hover,
  &:focus-visible {
    box-shadow: inset 0 -1px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const OpenButton = styled("button")`
  cursor: pointer;
  min-width: ${spacing.normal};
  svg {
    transform: rotate(0deg);
    transition: all 200ms;
    width: ${spacing.normal};
    height: ${spacing.normal};
  }
  &[hidden] {
    cursor: default;
  }
  &[data-open="true"] {
    svg {
      transform: rotate(90deg);
    }
  }
`;

const EditButtonWrapper = styled.div`
  display: flex;
  align-self: flex-end;
  gap: ${spacing.xsmall};
`;

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

  const openLabel = useMemo(
    () => (isOpen ? t("frontpageForm.openChildren") : t("frontpageForm.closeChildren")),
    [isOpen, t],
  );

  if (!field.value) {
    return null;
  }

  return (
    <NodeWrapper>
      <NodeContentWrapper>
        <TitleWrapper>
          {level < FRONTPAGE_DEPTH_LIMIT && (
            <OpenButton
              data-open={isOpen}
              type="button"
              onClick={() => setIsOpen((p) => !p)}
              aria-label={openLabel}
              hidden={!field.value.menu.length}
              title={openLabel}
            >
              {!!field.value.menu.length && <ArrowRightShortLine />}
            </OpenButton>
          )}
          <TitleLink to={toEditFrontPageArticle(field.value.articleId, i18n.language)} target="_blank">
            {field.value.article?.title.title ?? t("frontpageForm.failedTitle")}
          </TitleLink>
        </TitleWrapper>
        <EditButtonWrapper>
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
        </EditButtonWrapper>
      </NodeContentWrapper>
      {!!field.value.menu.length && isOpen && (
        <FieldArray name={`${name}.menu`} render={(props) => <FrontpageNodeList {...props} level={level + 1} />} />
      )}
    </NodeWrapper>
  );
};

export default FrontpageNode;
