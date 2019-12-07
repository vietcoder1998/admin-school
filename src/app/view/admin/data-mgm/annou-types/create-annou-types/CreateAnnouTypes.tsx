import React, { PureComponent, Fragment } from 'react'
import { connect } from 'react-redux';
import { Divider, Button, Icon, Select, InputNumber } from 'antd';
import { InputTitle } from '../../../../layout/input-tittle/InputTitle';
import { _requestToServer } from '../../../../../../services/exec';
import { ANNOU_TYPES } from '../../../../../../services/api/private.api';
import { POST } from '../../../../../../common/const/method';
import { REDUX_SAGA } from '../../../../../../common/const/actions';
import { Link } from 'react-router-dom';
import { TYPE } from '../../../../../../common/const/type';

interface ICreateAnnouTypesState {
    name?: string;
    targets?: Array<string>;
    priority?: number;
}

interface ICreateAnnouTypesProps extends StateProps, DispatchProps {
    match: Readonly<any>;
    history: Readonly<any>;
    getListAnnouTypes: Function;
}

class CreateAnnouTypes extends PureComponent<ICreateAnnouTypesProps, ICreateAnnouTypesState> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: "",
            targets: [TYPE.ALL],
            priority: 1,
        }
    }

    createNewData = async () => {
        let { name, targets, priority } = this.state;

        if (typeof targets === "string" || targets[0] === TYPE.ALL) {
            targets = [TYPE.CANDIDATE, TYPE.EMPLOYER, TYPE.SCHOOL, TYPE.PUBLIC, TYPE.STUDENT]
        }

        if (name) {
            await _requestToServer(
                POST, ANNOU_TYPES,
                {
                    name: name.trim(),
                    targets,
                    priority
                }
            ).then((res: any) => {
                this.props.getListAnnouTypes();
                this.props.history.push('/admin/data/annou-types/list');
            })
        }
    };

    onChange = (event: any) => {
        this.setState({ name: event })
    };


    list_option = () => {
        let list_type = [
            { id: 1, name: TYPE.CANDIDATE },
            { id: 2, name: TYPE.EMPLOYER },
            { id: 3, name: TYPE.SCHOOL },
            { id: 4, name: TYPE.PUBLIC },
            { id: 5, name: TYPE.STUDENT },
            { id: 5, name: TYPE.ALL },
        ];
        return list_type.map(
            (item: { id: number, name: string }, index: number) => (<Select.Option key={item.id + index} value={item.name}> {item.name}</Select.Option>)
        );
    };

    handleSampleValue = (event: any) => {
        if (event && event.length !== 0 && event[1] !== TYPE.ALL && event.length !== 5) {
            let targets = []
            event.forEach((item: string) => {
                if (item !== TYPE.ALL) {
                    if (item && item.includes(",")) {
                        let newItem = item.split(",");
                        item = newItem[0];
                    }

                    targets.push(item)
                }
            })

            return this.setState({ targets })
        } else {
            return this.setState({ targets: [TYPE.ALL] })
        }
    }


    render() {
        let { name, targets } = this.state;
        return (
            <Fragment>
                <div>
                    <h5>Thêm nhóm bài viết  mới</h5>
                    <Divider orientation="left">Chi tiết nhóm bài viết </Divider>
                </div>
                <InputTitle
                    type={TYPE.INPUT}
                    title="Tên nhóm bài viết  mới"
                    placeholder="Nhập tên nhóm bài viết "
                    widthInput="400px"
                    value={name}
                    style={{ padding: "10px 30px" }}
                    onChange={(event: any) => this.setState({ name: event })}
                />
                <InputTitle
                    title="Chọn tên công việc"
                    widthLabel="100px"
                    style={{ padding: "10px 30px" }}
                >
                    <Select
                        mode="multiple"
                        size="default"
                        placeholder="Nhập loại đối tượng"
                        value={targets}
                        style={{ width: 400, margin: "10px 0px" }}
                        onChange={(event: any) => this.handleSampleValue(event)}
                    >
                        {this.list_option()}
                    </Select>
                </InputTitle>
                <InputTitle
                    title="Chọn độ ưu tiên"
                    widthLabel="100px"
                    style={{ padding: "10px 30px" }}
                >
                    <InputNumber min={-10000000} max={1000000} defaultValue={0} onChange={(priority: number) => this.setState({ priority })} />
                </InputTitle>
                <Button
                    type="primary"
                    icon="plus"
                    style={{ float: "right", margin: "10px 5px" }}
                    onClick={this.createNewData}
                    disabled={!name}
                >
                    Tạo nhóm bài viết  mới
                </Button>
                <Button
                    type="danger"
                    style={{ float: "right", margin: "10px 5px" }}
                >
                    <Link to='/admin/data/annou-types/list'>
                        <Icon type="close" />
                        Hủy
                    </Link>
                </Button>
            </Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
    getListAnnouTypes: () => dispatch({ type: REDUX_SAGA.ANNOU_TYPES.GET_ANNOU_TYPES })
});

const mapStateToProps = (state: any, ownProps: any) => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(CreateAnnouTypes)