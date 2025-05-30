/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { SECTION_ELEMENT_TYPE } from "@ndla/editor";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { CONTACT_BLOCK_ELEMENT_TYPE } from "../types";

const editor: Descendant[] = [
  {
    type: SECTION_ELEMENT_TYPE,
    children: [
      {
        type: CONTACT_BLOCK_ELEMENT_TYPE,
        data: {
          resource: "contact-block",
          imageId: "65750",
          jobTitle: "Daglig leder og ansvarlig redaktør, Vestland fylkeskommune",
          description:
            "Sigurd har variert ledererfaring fra utdanningssektoren, både fra videregående skole, nasjonalt senter og fra universitets/høgskolesektoren. Ansvarsområdene dekker bl.a. utdanning/opplæring/studiekvalitet, økonomi, HR, stratgi og IT-utvikling/-drift.",
          name: "Sigurd Trageton",
          email: "sigurd@ndla.no",
          background: "subtle",
        },
        children: [{ text: "" }],
      },
    ],
  },
];

const html =
  '<section><ndlaembed data-resource="contact-block" data-image-id="65750" data-job-title="Daglig leder og ansvarlig redakt&#xF8;r, Vestland fylkeskommune" data-description="Sigurd har variert ledererfaring fra utdanningssektoren, b&#xE5;de fra videreg&#xE5;ende skole, nasjonalt senter og fra universitets/h&#xF8;gskolesektoren. Ansvarsomr&#xE5;dene dekker bl.a. utdanning/oppl&#xE6;ring/studiekvalitet, &#xF8;konomi, HR, stratgi og IT-utvikling/-drift." data-name="Sigurd Trageton" data-email="sigurd@ndla.no" data-background="subtle"></ndlaembed></section>';

describe("codeblock serializing tests", () => {
  test("serializing", () => {
    const res = blockContentToHTML(editor);
    expect(res).toMatch(html);
  });

  test("deserializing", () => {
    const res = blockContentToEditorValue(html);
    expect(res).toEqual(editor);
  });
});
