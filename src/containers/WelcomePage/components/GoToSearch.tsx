/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { useTranslation } from "react-i18next";
import { SafeLinkButton } from "@ndla/safelink";

interface Props {
  ndlaId?: string;
  filterSubject?: string;
  searchEnv: "content" | "concept";
  revisionDateTo?: string;
}

const GoToSearch = ({ ndlaId, filterSubject, searchEnv, revisionDateTo }: Props) => {
  const { t } = useTranslation();

  const onSearch = () => {
    const query = queryString.stringify({
      subjects: filterSubject,
      ...(ndlaId ? { "responsible-ids": ndlaId } : {}),
      ...(revisionDateTo ? { "revision-date-to": revisionDateTo } : {}),
    });

    return `/search/${searchEnv}?${query}`;
  };

  return (
    <SafeLinkButton to={onSearch()} size="small">
      {t("welcomePage.goToSearch")}
    </SafeLinkButton>
  );
};

export default GoToSearch;
