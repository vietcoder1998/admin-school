import {REDUX} from '../../const/actions';
import IConnectEmSchools from '../../models/connect-em-school';

export const getListConnectEmSchools = (data: IConnectEmSchools) => ({
    type: REDUX.CONNECT_EM_SCHOOL.GET_CONNECT_EM_SCHOOL,
    data
});
