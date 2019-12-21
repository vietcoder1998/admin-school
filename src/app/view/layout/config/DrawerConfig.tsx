import React from 'react';
import { Drawer } from 'antd';
import { connect } from 'react-redux';
import { IAppState } from '../../../../redux/store/reducer';
import { REDUX } from '../../../../common/const/actions';

interface IDrawerConfigProps extends StateProps, DispatchProps {
    open: boolean;
    children?: any;
    title?: any;
    width?: string | number;
    handleDrawer: () => void;
}

interface IDrawerConfigState {

}

class DrawerConfig extends React.Component<IDrawerConfigProps, IDrawerConfigState> {
    render() {
        let {
            handleDrawer,
            drawerState,
            width,
            children,
            title,
        } = this.props;
        return (
            <Drawer
                title={title ? title : "Danh mục"}
                visible={drawerState && drawerState.open_drawer}
                width={width}
                onClose={() => handleDrawer()}
                destroyOnClose={true}
            >
                {children }
            </Drawer>
        )
    }
}

const mapStateToProps = (state: IAppState, ownProps: any) => ({
    drawerState: state.MutilBox.drawerState
})
const mapDispatchToProps = (dispatch: any, ownProps) => ({
    handleDrawer: (drawerState) => dispatch({ type: REDUX.HANDLE_DRAWER, drawerState }),
})

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = ReturnType<typeof mapDispatchToProps>

export default connect(mapStateToProps, mapDispatchToProps)(DrawerConfig);
