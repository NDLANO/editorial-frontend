/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../../util/articleContentConverter";
import { TYPE_SECTION } from "../../section/types";
import { TYPE_CONTACT_BLOCK } from "../types";

const editor: Descendant[] = [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: TYPE_CONTACT_BLOCK,
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
  '<section><ndlaembed data-resource="contact-block" data-image-id="65750" data-job-title="Daglig leder og ansvarlig redaktør, Vestland fylkeskommune" data-description="Sigurd har variert ledererfaring fra utdanningssektoren, både fra videregående skole, nasjonalt senter og fra universitets/høgskolesektoren. Ansvarsområdene dekker bl.a. utdanning/opplæring/studiekvalitet, økonomi, HR, stratgi og IT-utvikling/-drift." data-name="Sigurd Trageton" data-email="sigurd@ndla.no" data-background="subtle"></ndlaembed></section>';

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
