import { ITypeManagements } from '../models/type-management';
import { REDUX } from '../../common/const/actions';

export const getAnnouncementDetail = (data: ITypeManagements) => ({
    type: REDUX.ANNOUNCEMENT_DETAIL.GET_ANNOUNCEMENT_DETAIL, 
    data
});