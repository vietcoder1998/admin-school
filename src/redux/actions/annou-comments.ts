import {IAnnouComments} from '../models/annou-comments';
import {REDUX} from '../../common/const/actions';

export const getListAnnouComments = (data: IAnnouComments) => ({
    type: REDUX.ANNOU_COMMENTS.GET_ANNOU_COMMENTS,
    data
});