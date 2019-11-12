export interface ITypeSchool  {
    id: number;
    name: string;
    priority: number;
}

export interface ITypeSchools {
    items: Array<ITypeSchool>;
    pageIndex: number;
pageSize: number;
    pageSize: number;
    totalItems: number;
}