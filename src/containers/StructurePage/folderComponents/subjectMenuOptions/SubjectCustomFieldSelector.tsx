/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import sortBy from "lodash/sortBy";
import TaxonomyMetadataDropdown from "./TaxonomyMetadataDropdown";
import { DRAFT_RESPONSIBLE } from "../../../../constants";
import { useAuth0Responsibles } from "../../../../modules/auth0/auth0Queries";

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
  field: string;
  messages: Record<string, string>;
}

const SubjestCustomFieldSelector = ({ customFields, updateCustomFields, field, messages }: Props) => {
  const { data: responsibles } = useAuth0Responsibles(
    { permission: DRAFT_RESPONSIBLE },
    {
      select: (users) =>
        sortBy(
          users.map((u) => ({
            id: `${u.app_metadata.ndla_id}`,
            name: u.name,
          })),
          (u) => u.name,
        ),
      placeholderData: [],
    },
  );
  const options =
    responsibles?.map((responsible) => ({
      key: responsible.id,
      value: responsible.name,
    })) || [];

  return (
    <TaxonomyMetadataDropdown
      field={field}
      options={options}
      customFields={customFields}
      updateCustomFields={updateCustomFields}
      messages={messages}
    />
  );
};

export default SubjestCustomFieldSelector;
