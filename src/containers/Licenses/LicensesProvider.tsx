import { getLicenseByAbbreviation } from '@ndla/licenses';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { License } from '../../interfaces';
import { fetchLicenses } from '../../modules/draft/draftApi';
import { draftLicensesToImageLicenses } from '../../modules/draft/draftApiUtils';
import { ImageApiLicense } from '../../modules/image/imageApiInterfaces';

const LicenseContext = createContext<
  [LicenseState, Dispatch<SetStateAction<LicenseState>>] | undefined
>(undefined);

interface Props {
  children?: ReactNode;
  initialValue?: LicenseState;
}

interface LicenseState {
  licenses: License[];
  isFetching: boolean;
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

const initValue: LicenseState = {
  licenses: [],
  isFetching: false,
};

export const LicensesProvider = ({ children, initialValue = initValue }: Props) => {
  const licenseState = useState<LicenseState>(initialValue);
  return <LicenseContext.Provider value={licenseState}>{children}</LicenseContext.Provider>;
};

export const useLicenses = (): LicenseFunctions => {
  const licenseContext = useContext(LicenseContext);
  const [loading, setLoading] = useState(false);
  if (licenseContext === undefined) {
    throw new Error('useLicenses must be used within a LicensesProvider');
  }
  const [licenseState, setLicenseState] = licenseContext;

  const refetch = useCallback(async () => {
    setLoading(true);
    setLicenseState(s => ({ ...s, isFetching: true }));
    const fetchedLicenses = await fetchLicenses();
    setLicenseState({ licenses: fetchedLicenses, isFetching: false });
    setLoading(false);
  }, [setLicenseState]);

  useEffect(() => {
    (async () => {
      if (!licenseState.isFetching && licenseState.licenses.length < 1) {
        await refetch();
      }
    })();
  }, [licenseState.isFetching, licenseState.licenses.length, refetch]);

  const getTranslatedLicenses = (language: string, enableLicenseNA: boolean = false) =>
    licenseState.licenses
      .filter(license => license.license !== 'N/A' || enableLicenseNA)
      .map(license => ({
        ...license,
        ...getLicenseByAbbreviation(license.license, language),
      }));

  return {
    licenses: licenseState.licenses,
    refetchLicenses: refetch,
    licensesLoading: loading,
    getTranslatedLicenses,
    imageLicenses: draftLicensesToImageLicenses(licenseState.licenses),
  };
};
