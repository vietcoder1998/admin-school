export interface IApi {
    id?: 0;
    method?: string;
    route?: string;
    description?: string
};

export interface IApis {
    name?: string;
    description?: string;
    apis?: Array<IApi>
};

export interface IApiFunction {
    name?: string;
    description?: string;
    apis?: IApis
};

export interface IApiFunctions {
    name?: string;
    description?: string;
    priority?: number;
    apiFunctions?: Array<IApiFunction>
}

export interface IApiController {
    data?: Array<IApiFunctions>
}