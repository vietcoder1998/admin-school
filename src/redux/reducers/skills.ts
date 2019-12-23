import {ISkills} from '../models/skills';
import {REDUX} from '../../const/actions';

let initState: ISkills = {
    items: [],
    pageIndex: 0,
    pageSize: 0,
    totalItems: 0,
};

export const Skills = (state = initState, action: any) => {
    switch (action.type) {
        case REDUX.SKILLS.GET_SKILLS:
            return {
                ...state,
                items: action.data.items,
                pageIndex: action.data.pageIndex,
                pageSize: action.data.pageSize,
                totalItems: action.data.totalItems
            };

        default:
            return state;
    }
};