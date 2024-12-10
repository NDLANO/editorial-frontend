/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Table } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

type Props = {
  notes: {
    author: string;
    date: string;
    note: string;
    status?: string;
    id: number;
  }[];
};

const StyledTable = styled(Table, {
  base: {
    tableLayout: "fixed",
    width: "100%",
    display: "inline-table",
  },
});

const VersionHistory = ({ notes }: Props) => {
  const { t } = useTranslation();
  const hasStatus = notes.some((n) => n.status !== undefined);
  return (
    <StyledTable>
      <thead>
        <tr>
          <th>{t("editor.versionHistory.who")}</th>
          <th>{t("editor.versionHistory.when")}</th>
          <th>{t("editor.versionHistory.message")}</th>
          {!!hasStatus && <th>{t("editor.versionHistory.status")}</th>}
        </tr>
      </thead>
      <tbody>
        {notes.map(({ author, date, note, status, id }) => (
          <tr key={id}>
            <td>{author}</td>
            <td>{date}</td>
            <td>{note}</td>
            {!!hasStatus && <td>{status}</td>}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default VersionHistory;
