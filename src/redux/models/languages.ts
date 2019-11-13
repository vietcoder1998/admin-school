export interface ILanguage {
    id: number;
    name: string;
}

export interface ILanguages {
    items: Array<ILanguage>;
    pageIndex: number;
    pageSize: number;
    totalItems: number;
}