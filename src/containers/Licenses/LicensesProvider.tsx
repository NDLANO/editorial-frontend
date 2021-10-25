import React, { createContext, useContext, useEffect, useState } from 'react';
import { License } from '../../interfaces';
import { fetchLicenses } from '../../modules/draft/draftApi';

const LicenseContext = createContext<
  [License[], React.Dispatch<React.SetStateAction<License[]>>] | undefined
>(undefined);

interface Props {
  children: React.ReactNode;
  initialValue?: License[];
}

export const LicensesProvider = ({ children, initialValue = [] }: Props) => {
  const licenseState = useState(initialValue);
  return <LicenseContext.Provider value={licenseState}>{children}</LicenseContext.Provider>;
};

export const useLicenses = () => {
  const licenseContext = useContext(LicenseContext);
  if (licenseContext === undefined) {
    throw new Error('useLicenses must be used within a LicensesProvider');
  }
  const [licenses, setLicenses] = licenseContext;

  useEffect(() => {
    (async () => {
      const fetchedLicenses = await fetchLicenses();
      setLicenses(fetchedLicenses);
    })();
  }, []);

  const refetch = async () => {
    const fetchedLicenses = await fetchLicenses();
    setLicenses(fetchedLicenses);
  };

  return {
    licenses,
    refetch,
  };
};
