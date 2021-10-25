import { getLicenseByAbbreviation } from '@ndla/licenses';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { License } from '../../interfaces';
import { fetchLicenses } from '../../modules/draft/draftApi';
import { draftLicensesToImageLicenses } from '../../modules/draft/draftApiUtils';
import { ImageApiLicense } from '../../modules/image/imageApiInterfaces';

const LicenseContext = createContext<
  [License[], React.Dispatch<React.SetStateAction<License[]>>] | undefined
>(undefined);

interface Props {
  children?: React.ReactNode;
  initialValue?: License[];
}

export interface LicenseFunctions {
  licenses: License[];
  refetchLicenses: () => Promise<void>;
  licensesLoading: boolean;
  getTranslatedLicenses: (
    language: string,
    enableLicenseNA?: boolean,
  ) => {
    rights: string[];
    abbreviation: string;
    short: string;
    title: string;
    userFriendlyTitle: string;
    url: string;
    linkText: string;
    description: string;
    license: string;
  }[];
  imageLicenses: ImageApiLicense[];
}

export const LicensesProvider = ({ children, initialValue = [] }: Props) => {
  const licenseState = useState(initialValue);
  return <LicenseContext.Provider value={licenseState}>{children}</LicenseContext.Provider>;
};

export const useLicenses = (): LicenseFunctions => {
  const licenseContext = useContext(LicenseContext);
  const [loading, setLoading] = useState(false);
  if (licenseContext === undefined) {
    throw new Error('useLicenses must be used within a LicensesProvider');
  }
  const [licenses, setLicenses] = licenseContext;

  const refetch = useCallback(async () => {
    setLoading(true);
    const fetchedLicenses = await fetchLicenses();
    setLicenses(fetchedLicenses);
    setLoading(false);
  }, [setLicenses]);

  useEffect(() => {
    (async () => {
      await refetch();
    })();
  }, [refetch]);

  const getTranslatedLicenses = (language: string, enableLicenseNA: boolean = false) =>
    licenses
      .filter(license => license.license !== 'N/A' || enableLicenseNA)
      .map(license => ({
        ...license,
        ...getLicenseByAbbreviation(license.license, language),
      }));

  return {
    licenses,
    refetchLicenses: refetch,
    licensesLoading: loading,
    getTranslatedLicenses,
    imageLicenses: draftLicensesToImageLicenses(licenses),
  };
};
