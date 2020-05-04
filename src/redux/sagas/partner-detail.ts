import { PARTNER } from './../../services/api/private.api';
import { IPartner } from './../../models/partner';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getPartnerDetailData(action: any) {
    let res = yield call(callPartnerDetail, action);
    let data: IPartner = {
        id: null,
        firstName: null,
        lastName: null,
        birthday: null,
        avatarUrl: null,
        email: null,
        phone: null,
        gender: null,
        region: null,
        address: null,
        lat: null,
        lon: null,
        createdDate: -1,
    };

    if (res.code === 200) {
        data = res.data;
    }

    yield put({
        type: REDUX.PARTNER.GET_PARTNER_DETAIL,
        data
    });
}

function callPartnerDetail(action: any) {
    if (action.id) {
        try {
            let res = _requestToServer(
                GET,
                PARTNER + `/${action.id}/profile`,
                action.body ? action.body : null,
                undefined,
                undefined,
                undefined,
                false,
                false,
            )
            return res;
        } catch (error) {
            throw error
        }
    }
}

export function* PartnerDetailWatcher() {
    yield takeEvery(
        REDUX_SAGA.PARTNER.GET_PARTNER_DETAIL,
        getPartnerDetailData
    )
}