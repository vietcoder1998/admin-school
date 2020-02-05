import { SKILLS } from '../../services/api/private.api';
import { ISkills } from './../../models/skills';
import { GET } from '../../const/method';
import { takeEvery, put, call, } from 'redux-saga/effects';
import { _requestToServer } from '../../services/exec';
import { REDUX_SAGA, REDUX } from '../../const/actions'

function* getListSkillsData(action: any) {
    let res = yield call(callSkills, action);
    let data: ISkills = {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalItems: 0,
    };

    if (res.code === 200) {
        data = res.data
    }

    yield put({
        type: REDUX.SKILLS.GET_SKILLS,
        data
    });
}

function callSkills(action: any) {
    try {
        let pageIndex;
        let pageSize;
        if (action.pageIndex) {
            pageIndex = action.pageIndex;
        }

        if (action.pageSize) {
            pageSize = action.pageSize;
        }

        return _requestToServer(
            GET, SKILLS,
            null,
            {
                pageIndex: pageIndex ? pageIndex : 0,
                pageSize: pageSize ? pageSize : 10,
                name: action.name
            },
            undefined, undefined, false, false
        )
    } catch (e) {
        throw e;
    };

}

export function* SkillsWatcher() {
    yield takeEvery(
        REDUX_SAGA.SKILLS.GET_SKILLS,
        getListSkillsData
    )
}