import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux';
import {Divider, Button, Icon} from 'antd';
import {InputTitle} from '../../../../layout/input-tittle/InputTitle';
import {_requestToServer} from '../../../../../../services/exec';
import {LANGUAGES} from '../../../../../../services/api/private.api';
import {POST} from '../../../../../../common/const/method';
import {REDUX_SAGA} from '../../../../../../common/const/actions';
import {Link} from 'react-router-dom';
import {TYPE} from '../../../../../../common/const/type';

interface CreateLanguagesState {
    name?: string;
}

interface CreateLanguagesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListLanguages: Function;
}

class CreateLanguages extends PureComponent<CreateLanguagesProps, CreateLanguagesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: ""
        }
    }

    createNewData = async () => {
        let {name} = this.state;
        if (name) {
            await _requestToServer(
                POST, LANGUAGES,
                {
                    name: name.trim()
                }
            ).then((res: any) => {
                this.props.getListLanguages();
                this.props.history.push('/admin/data/languages/list');
            })
        }
    };

    onChange = (event: any) => {
        this.setState({name: event})
    };

    render() {
        let {name} = this.state;
        return (
            <Fragment>
                <div>
                    <h5>Thêm ngôn ngữ mới</h5>
                    <Divider orientation="left">Chi tiết ngôn ngữ</Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên ngôn ngữ mới"
                    placeholder="Nhập tên ngôn ngữ"
                    value={name}
                    style={{padding: "10px 30px"}}
                    widthInput="350px"
                    onChange={(event: any) => this.setState({name: event})}
                />
                <Button
                    type="primary"
                    icon="plus"
                    style={{float: "right", margin: "10px 5px"}}
                    onClick={this.createNewData}
                    disabled={!name}
                >
                    Tạo ngôn ngữ mới
                </Button>
                <Button
                    type="danger"
                    style={{float: "right", margin: "10px 5px"}}
                >
                    <Link to='/admin/data/languages/list'>
                        <Icon type="close"/>
                        Hủy
                    </Link>

                </Button>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListLanguages: () => dispatch({type: REDUX_SAGA.LANGUAGES.GET_LANGUAGES})
});

const mapStateToProps = (state: any, ownProps: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateLanguages)