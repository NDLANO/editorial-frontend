/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";

interface AllowListEntry {
  name: string;
  url: string[];
}

interface Props {
  allowList: AllowListEntry[];
}

const StyledTable = styled.table`
  display: table;
  margin-right: auto !important;
  margin-left: auto !important;
`;

const sortEntries = (a: AllowListEntry, b: AllowListEntry) => a.name.localeCompare(b.name);

const UrlAllowList = ({ allowList }: Props) => {
  const { t } = useTranslation();

  const filteredAllowList = allowList.sort(sortEntries);
  return (
    <StyledTable className="c-table">
      <thead>
        <tr>
          <th>{t("form.content.link.name")}</th>
          <th>{t("form.content.link.domains")}</th>
        </tr>
      </thead>
      <tbody>
        {filteredAllowList.map((provider, trIndex) => (
          <tr key={`tr-${trIndex}`}>
            <td>{provider.name}</td>
            <td>
              {provider.url.map((url, index) => (
                <div key={`cell-${trIndex}-${index}`}>{url}</div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default UrlAllowList;
