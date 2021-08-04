export interface ContributorType {
  name: string;
  type: string;
  focusOnMount?: boolean | null;
}

export type ContributorFieldName = keyof ContributorType;
