import {ISkills} from '../models/skills';
import {REDUX} from '../../common/const/actions';

export const getSkills = (data: ISkills) => ({
    type: REDUX.SKILLS.GET_SKILLS,
    data
});
