/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldErrorMessage, FieldRoot } from "@ndla/primitives";
import { memo } from "react";
import { FormField } from "../../../components/FormField";
import { DRAFT_ADMIN_SCOPE } from "../../../constants";
import { useSession } from "../../Session/SessionProvider";
import ConceptsField from "./ConceptsField";
import ContentField from "./ContentField";

const RelatedContentFieldGroup = () => {
  const { userPermissions } = useSession();

  return (
    <>
      <FormField name="conceptIds">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <ConceptsField field={field} />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
      {!!userPermissions?.includes(DRAFT_ADMIN_SCOPE) && (
        <FormField name="relatedContent">
          {({ field, meta }) => (
            <FieldRoot invalid={!!meta.error}>
              <ContentField field={field} />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </FieldRoot>
          )}
        </FormField>
      )}
    </>
  );
};

export default memo(RelatedContentFieldGroup);
