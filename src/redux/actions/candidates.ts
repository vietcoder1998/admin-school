import { ICandidates } from './../models/candidates';
import { REDUX } from '../../../../employer-web-admin/src/const/actions';

export const getAnnouncementDetail = (data?: ICandidates) => ({
    type: REDUX.CANDIDATES.GET_CANDIDATES, 
    data
});