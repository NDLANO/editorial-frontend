/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Table, Text } from "@ndla/primitives";

const markdownSyntax = [
  { md: "**Bold**", html: <b>Bold</b> },
  { md: "*Italics*", html: <i>Italics</i> },
  {
    md: "super^script^",
    html: (
      <span>
        super<sup>script</sup>
      </span>
    ),
  },
  {
    md: "sub~script~",
    html: (
      <span>
        sub<sub>script</sub>
      </span>
    ),
  },
];

export const MarkdownExample = () => {
  return (
    <div>
      <Text>
        Markdown er et språk som brukes til å formatere tekst. Nedenfor er en tabell som viser den mest nyttige
        syntaksen. Fullstendig syntaks finnes <a href="https://commonmark.org/help/">her</a>.
      </Text>
      <Table>
        <thead>
          <tr>
            <th>Syntaks</th>
            <th>Resultat</th>
          </tr>
        </thead>
        <tbody>
          {markdownSyntax.map((item) => (
            <tr key={item.md}>
              <td>{item.md}</td>
              <td>
                <span>{item.html}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
