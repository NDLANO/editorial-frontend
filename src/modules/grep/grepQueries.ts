import { GREP_CODE } from '../../queryKeys';
import { useQueriesTyped } from '../../util/queryUtils';
import { fetchGrepCodeTitle } from './grepApi';
import { GrepCode } from './grepApiInterfaces';

const grepToGrepCodeObject = (grepCode: string, grepCodeTitle: string | undefined): GrepCode => ({
  code: grepCode,
  title: grepCodeTitle ? `${grepCode} - ${grepCodeTitle}` : grepCode,
});

export const useGrepCodes = (grepCodes: string[]) => {
  return useQueriesTyped(
    grepCodes.map(grepCode => {
      return {
        queryKey: [GREP_CODE, grepCode],
        queryFn: () => fetchGrepCodeTitle(grepCode),
        select: (grepCodeTitle: any) => grepToGrepCodeObject(grepCode, grepCodeTitle as string),
      };
    }),
  );
};
