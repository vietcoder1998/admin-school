import { IApiFunctions, IApi, IApis } from './../models/api-controller';
import  randomID  from './randomID';

export interface ITreeParent {
    value?: any;
    key?: string;
    title?: string;
    children?: Array<any>;
};

export interface ITreeChildren {
    value?: any;
    key?: string;
    title?: string;
};

export interface ITreeDetail {
    value?: Array<number>;
    treeData?: Array<ITreeParent>;
}

function childrenApi(data: IApi, param?: string): ITreeChildren {
    let children: ITreeChildren = {
        key: randomID(16),
        value: data.id,
        title: data.description,
    }

    return children;
}

function parentApi(data: IApis, param?: string): ITreeParent {
    let listValue = [];
    let list_children = [];
    data.apis.forEach(item => {
        let item_data = childrenApi(item);
        list_children.push(item_data);
        listValue.push(item_data.value);
    });

    let parent: ITreeParent = {
        key: data.description,
        value: listValue,
        title: data.description,
        children: list_children
    }

    return parent;
}

function rootApi(data: IApiFunctions, param?: string): ITreeParent {
    let listValue = [];
    let list_children = [];
    data.apiFunctions.forEach(item => {
        let item_data = parentApi(item);
        let item_data_value = item_data.value;
        item_data_value.forEach(element => {
            listValue.push(element)
        });
        list_children.push(item_data);
    });

    let root: ITreeParent = {
        key: data.description,
        value: listValue,
        title: data.description,
        children: list_children
    }

    return root;
}

export function renderTreeApi(data: Array<IApiFunctions>): ITreeDetail {
    let treeData: Array<ITreeParent> = data.map(item => {
        return rootApi(item)
    });
    let value = [];
    treeData.forEach(item => {
        let listValue = item.value;

        if (Array.isArray(listValue)) {
            listValue.forEach(element => {
                value.push(element);
            });
        } else {
            value.push(listValue);
        }
    });

    return {
        value,
        treeData
    };
}