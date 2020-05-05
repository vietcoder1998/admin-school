import { IMutilBox } from '../../models/mutil-box';
import { REDUX } from '../../const/actions';

let initState: IMutilBox = {
    drawerState: {
        title: "",
        openDrawer: false,
        children: null,
        type_drawer: null,
    },
    modalState: {
        title: null,
        msg: null,
        open_modal: false,
        type_modal: null,
        children: null,
    },
    // mapState: {
    //     marker: {
    //         lat: 21.038693,
    //         lng: 105.782235,
    //     },
    //     location: "Hà Nội"
    // },
    // loading: false,
};

export const MutilBox = (state: typeof initState = initState, action: any) => {
    switch (action.type) {
        case REDUX.HANDLE_DRAWER:
            return {
                ...state,
                drawerState: {
                    openDrawer:
                        action.drawerState &&
                            action.drawerState.openDrawer ?
                            action.drawerState.openDrawer :
                            !state.drawerState.openDrawer
                },
            };

        case REDUX.HANDLE_MODAL:
            return {
                ...state,
                modalState: {
                    ...action.modalState,
                    open_modal:
                        action.modalState &&
                            action.modalState.open_modal ?
                            action.modalState.open_modal :
                            !state.modalState.open_modal,

                    msg:
                        action.modalState &&
                            action.modalState.msg ?
                            action.modalState.msg :
                            "",
                },
            };

        // case REDUX.MAP.SET_MAP_STATE:
        //     return {
        //         ...state,
        //         mapState: {
        //             ...action.mapState,
        //             marker:
        //                 action.mapState &&
        //                     action.mapState.marker ?
        //                     action.mapState.marker :
        //                     {
        //                         lat: 21.038693,
        //                         lng: 105.782235,
        //                     }
        //         }
        //     };

        case REDUX.HANDLE_LOADING:
            return {
                ...state,
                loading: action.loading 
            }

        default:
            return state;
    }
}