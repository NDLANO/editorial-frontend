/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useEffect } from "react";
import { useLearningpathContext } from "../LearningpathLayout";

export const LearningpathEnableClone = () => {
  const { setEnableClone, language, learningpath } = useLearningpathContext();
  const { dirty } = useFormikContext();

  useEffect(() => {
    setEnableClone(!dirty && learningpath.supportedLanguages.includes(language));

    return () => {
      setEnableClone(true);
    };
  }, [dirty, language, learningpath.supportedLanguages, setEnableClone]);

  return null;
};
