/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ExternalLinkLine } from "@ndla/icons";
import { SafeLinkButton } from "@ndla/safelink";
import { Node } from "@ndla/types-taxonomy";

import { toCreateSubjectpage, toEditSubjectpage } from "../../../../util/routeHelpers";
import { getIdFromUrn } from "../../../../util/subjectHelpers";

interface Props {
  node: Node;
}

const EditSubjectpageOption = ({ node }: Props) => {
  const { t, i18n } = useTranslation();

  const link = node.contentUri
    ? toEditSubjectpage(node.id, i18n.language, getIdFromUrn(node.contentUri))
    : toCreateSubjectpage(node.id, i18n.language);

  return (
    <SafeLinkButton
      to={{ pathname: link }}
      state={{ elementName: node?.name }}
      data-testid="editSubjectpageOption"
      size="small"
      variant="tertiary"
    >
      {t("taxonomy.editSubjectpage")}
      <ExternalLinkLine />
    </SafeLinkButton>
  );
};

export default EditSubjectpageOption;
