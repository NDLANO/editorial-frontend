/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import { Home } from "@ndla/icons/common";
import { Node } from "@ndla/types-taxonomy";

import RoundIcon from "../../../../components/RoundIcon";
import { toCreateSubjectpage, toEditSubjectpage } from "../../../../util/routeHelpers";
import { getIdFromUrn } from "../../../../util/subjectHelpers";
import MenuItemButton from "../sharedMenuOptions/components/MenuItemButton";

interface Props {
  node: Node;
}

const StyledLink = styled(Link)`
  color: ${colors.brand.greyDark};
  &:hover {
    color: ${colors.brand.primary};
  }
`;

const EditSubjectpageOption = ({ node }: Props) => {
  const { t, i18n } = useTranslation();

  const link = node.contentUri
    ? toEditSubjectpage(node.id, i18n.language, getIdFromUrn(node.contentUri))
    : toCreateSubjectpage(node.id, i18n.language);

  return (
    <StyledLink state={{ elementName: node?.name }} to={{ pathname: link }}>
      <MenuItemButton data-testid="editSubjectpageOption">
        <RoundIcon small icon={<Home />} />
        {t("taxonomy.editSubjectpage")}
      </MenuItemButton>
    </StyledLink>
  );
};

export default EditSubjectpageOption;
