import React from 'react';
import { Empty, Avatar, Pagination } from "antd";
import { IJobSuitableCandidate } from "../../../../models/job-suitable-candidate";
import CanProProp from "./../can-pro-pop/CanProProp";

interface IState {

}

interface IProps {
    job_suitable_candidates?: Array<IJobSuitableCandidate>,
    pageIndex?: number;
    pageSize?: number;
    totalItems?: number;
    onGetCanDetail?: (id?: string) => any;
    onGetListJobSuitableCandidate?: (pagIndex?: number, pageSize?: number) => any;
}

export default function JobSuitableCandidate(props?: IProps) {
    let { job_suitable_candidates } = props;

    return (
        <>
            <ul>
                {
                    job_suitable_candidates &&
                        job_suitable_candidates.length > 0 ?
                        job_suitable_candidates.map((item?: IJobSuitableCandidate) => (
                            <li
                                className='test'
                                style={{ 
                                    padding: '5px 10px', 
                                    margin: 2,
                                    backgroundColor: 'white',
                                }}
                                onClick={() => props.onGetCanDetail(item.id)}
                            >
                                <Avatar src={item.avatarUrl} style={{marginBottom: 10}} />
                                <CanProProp data={item} disabled={true}>
                                    {item.lastName + " " + item.firstName}
                                </CanProProp>
                            </li>
                        )
                        ) :
                        <Empty description={"Không có ứng viên nào phù hợp"} />
                }
            </ul>
            <Pagination pageSize={props.pageSize} total={props.totalItems} onChange={(page, pageSize) => props.onGetListJobSuitableCandidate(page, pageSize)} />
        </>
    )
}