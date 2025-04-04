/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useContext, useState } from "react";
import {
  REMEMBER_DA_SUBJECTS,
  REMEMBER_FAVORITE_NODES,
  REMEMBER_LMA_SUBJECTS,
  REMEMBER_QUALITY,
  REMEMBER_SA_SUBJECTS,
} from "../../constants";
import { useLocalStorageBooleanState } from "../WelcomePage/hooks/storedFilterHooks";

interface Preferences {
  showFavorites: boolean;
  setShowFavorites: (v: boolean) => void;
  showLmaSubjects: boolean;
  setShowLmaSubjects: (v: boolean) => void;
  showDaSubjects: boolean;
  setShowDaSubjects: (v: boolean) => void;
  showSaSubjects: boolean;
  setShowSaSubjects: (v: boolean) => void;
  showQuality: boolean;
  setShowQuality: (v: boolean) => void;
  showMatomoStats: boolean;
  setShowMatomoStats: (v: boolean) => void;
}

const PreferencesContext = createContext<Preferences | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const PreferencesProvider = ({ children }: Props) => {
  const [showFavorites, setShowFavorites] = useLocalStorageBooleanState(REMEMBER_FAVORITE_NODES);
  const [showLmaSubjects, setShowLmaSubjects] = useLocalStorageBooleanState(REMEMBER_LMA_SUBJECTS);
  const [showDaSubjects, setShowDaSubjects] = useLocalStorageBooleanState(REMEMBER_DA_SUBJECTS);
  const [showSaSubjects, setShowSaSubjects] = useLocalStorageBooleanState(REMEMBER_SA_SUBJECTS);
  const [showQuality, setShowQuality] = useLocalStorageBooleanState(REMEMBER_QUALITY);
  const [showMatomoStats, setShowMatomoStats] = useState(false);

  return (
    <PreferencesContext
      value={{
        showFavorites,
        setShowFavorites,
        showLmaSubjects,
        setShowLmaSubjects,
        showDaSubjects,
        setShowDaSubjects,
        showSaSubjects,
        setShowSaSubjects,
        showQuality,
        setShowQuality,
        showMatomoStats,
        setShowMatomoStats,
      }}
    >
      {children}
    </PreferencesContext>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};
