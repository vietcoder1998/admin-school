export interface IPartnersFilter {
    username?: string,
    email?: string,
    phone?: string,
    gender?: "FEMALE"|"MALE",
    regionID?: number,
    ids?: Array<string>,
    createdDate?: number
}

export interface IPartner {
    id?:string,
    firstName?:string,
    lastName?:string,
    birthday?:number,
    avatarUrl?:string,
    email?:string,
    phone?:string,
    gender?:'MALE' | 'FEMALE',
    region?:{
        id?:number,
        name?:string
    },
    address?:string,
    lat?:number,
    lon?:number,
    createdDate?:number
}

export interface IPartners {
    items?:Array<IPartner>
    pageIndex?:number;
    pageSize?:number;
    totalItems?:number;
}

export interface IPartnerAccount {

}