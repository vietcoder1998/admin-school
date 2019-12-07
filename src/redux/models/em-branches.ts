export interface IEmBranch {
    id?: string,
    branchName?: string,
    contactEmail?: string,
    contactPhone?: string,
    region?: {
        id?: number,
        name?: string
    },
    address?: string,
    lat?: number,
    lon?: number,
    headquarters?: boolean,
    createdDate?: number,
    totalJob?: number
}

export interface IEmBranches {
    pageIndex?: number,
    pageSize?: number,
    totalItems?: number,
    items?: Array<IEmBranch>
}

export interface IEmBranchesFilter {
    headquarters: boolean | undefined | null,
    regionID: number | undefined | null,
}