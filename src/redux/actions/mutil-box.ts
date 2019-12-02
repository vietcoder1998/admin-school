import { REDUX } from './../../common/const/actions';
import { IModalState, IDrawerState } from './../models/mutil-box';
import { TYPE } from './../../common/const/type';
export const handleDrawer = (drawerState?: IDrawerState) => ({
    type: REDUX.HANDLE_DRAWER,
    drawerState
});

export const handleModal = (modalState?: IModalState) => ({
    type: REDUX.HANDLE_MODAL,
    modalState
});

// export const handleMapMarker = (mapState?: IMapState) => ({
//     type: REDUX.MAP.SET_MAP_STATE,
//     mapState
// });

export const handleLoading = (loading: boolean) => ({
    type: REDUX.HANDLE_LOADING, loading
});
