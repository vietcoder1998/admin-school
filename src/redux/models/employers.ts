export interface IEmployer {
    id?: any;
    employerName?: string;
    logoUrl?: string;
    profileVerified?: boolean;
}

export interface IEmployers {
    items?: Array<IEmployer>;
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
    single_data?: IEmployer
}

export interface IEmployerFilter {
    employerName?: string,
    taxCode?: string,
    regionID?: number,
    profileVerified?: boolean,
    ids?: Array<string>
}