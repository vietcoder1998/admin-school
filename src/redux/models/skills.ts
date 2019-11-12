export interface ISkill {
    id: number;
    name: string;
}

export interface ISkills {
    items: Array<ISkill>;
    pageIndex: number;
pageSize: number;
    pageSize: number;
    totalItems: number;
}