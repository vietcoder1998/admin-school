import { ICandidateDetail } from './../models/candidates-detail';
import { REDUX } from '../../../../employer-web-admin/src/const/actions';

export const getCandidateDetail = (data?: ICandidateDetail) => ({
    type: REDUX.CANDIDATE_DETAIL.GET_CANDIDATE_DETAIL, 
    data
});