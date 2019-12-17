export interface IEmController {
    id?: string,
    employerName?: string,
    logoUrl?: string,
    profileVerified?: number,
    createdDate?: number,
}

export interface IEmControllerFilter {
    employerName?: string,
    taxCode?: string,
    regionID?: number,
    profileVerified?: number,
    ids?: Array<string>
}

export interface IEmControllers {
    items?: Array<IEmController>;
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
}