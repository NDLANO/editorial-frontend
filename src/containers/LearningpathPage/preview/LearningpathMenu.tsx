/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { Heading, OrderedList } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { toPreviewLearningpath } from "../../../util/routeHelpers";

interface Props {
  learningpath: ILearningPathV2DTO;
  language: string;
}

export const LearningpathMenu = ({ learningpath, language }: Props) => {
  const id = useId();
  return (
    <nav aria-labelledby={id}>
      <Heading id={id} textStyle="title.medium" asChild consumeCss>
        <h2>Læringssteg</h2>
      </Heading>
      <OrderedList>
        {learningpath.learningsteps.map((step) => (
          <li key={step.id}>
            <SafeLink to={toPreviewLearningpath(learningpath.id, language, step.id)}>{step.title.title}</SafeLink>
          </li>
        ))}
      </OrderedList>
    </nav>
  );
};
