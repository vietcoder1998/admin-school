import {ILanguages} from '../models/languages';
import {REDUX} from '../../common/const/actions';

export const getListLanguages = (data: ILanguages) => ({
    type: REDUX.LANGUAGES.GET_LANGUAGES,
    data
});