import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import './JobProperties.scss'
import { convertStringToArray } from './../../../../../common/utils/convertStringToArray';
import { IptLetter } from '../../../layout/common/Common';
import { weekDays } from './../../../../../common/utils/day';
import { timeConverter } from './../../../../../common/utils/convertTime';

interface JobPropertiesProps {
    job_detail?: any;
}

interface JobPropertiesState { }

export default class JobProperties extends PureComponent<JobPropertiesProps, JobPropertiesState> {
    render() {
        let { job_detail } = this.props;
        let list_des = job_detail && convertStringToArray(job_detail.data.description);

        return (
            <div className='job-detail'>
                <div className='detail-job b_b'>
                    <h6>MÔ TẢ CHUNG</h6>
                    <ul>
                        <li className='d_j_t'>
                            <Icon type="solution" style={{ color: 'blue' }} />
                            <IptLetter value={"Loại công việc:"} />

                            <label> {job_detail && job_detail.data.jobType}
                            </label>
                        </li>
                        <li className='d_j_t'>
                            <Icon type="calendar" style={{ color: 'green' }} />
                            <IptLetter value={"Ngày đăng: "} />
                            <label> {job_detail && timeConverter(job_detail.createdDate, 1000)}
                            </label>
                        </li>
                        <li className='d_j_t'>
                            <Icon type="calendar" style={{ color: 'red' }} />
                            <IptLetter value={"Ngày hết hạn: "} />
                            <label> {job_detail && timeConverter(job_detail.data.expirationDate, 1000)}
                            </label>
                        </li>
                    </ul>
                </div>
                {/* Description job */}
                <div className='description-job'>
                    <h6>MÔ TẢ CÔNG VIỆC</h6>
                    {list_des &&
                        list_des !== [] ?
                        list_des.map(
                            item => (<p key={item.index}>
                                {item.value[0] === '+' ||
                                    item.value[0] === '\n' ||
                                    item.value[0] === '-' ||
                                    item.value[0] === '=' ? "" : '-'}
                                {item.value}</p>)) :
                        <p>Vui lòng liên hệ chi tiết với nhà tuyển dụng</p>
                    }
                </div>
                {/* Time */}
                <div className='time-job b_t'>
                    <h6>CA LÀM VIỆC</h6>
                    <div>
                        {job_detail && job_detail.data && job_detail.data.shifts.map((item, index) => {
                            let maxSalary = '' + item.maxSalary && item.maxSalary === 0 ? '' : ('-' + item.maxSalary);
                            return (<div key={index} className='time-content b_b'>
                                <p>
                                    <label> Ca số {index + 1} </label>
                                </p>
                                <p>
                                    <Icon type="clock-circle" style={{ color: 'blue' }} />{' ' + item.startTime + '-' + item.endTime}
                                </p>
                                <p>
                                    <Icon type="dollar" style={{ color: 'rgb(224, 224, 34)' }} />
                                    {item.minSalary ? (<span>{' ' + item.minSalary ? item.minSalary : maxSalary + '/' + item.unit}  </span>) : " Thỏa thuận"}
                                </p>
                                <div className='week-day'>
                                    {weekDays.map((itemWeek, index) => {
                                        if (item[itemWeek] === true) {
                                            let day = 'T' + (index + 2);
                                            if (index === 6) {
                                                day = 'CN'
                                            }
                                            return (<label key={index} className='time-span'>
                                                {day}
                                            </label>)
                                        }
                                        else {
                                            return null
                                        }
                                    })}
                                </div>
                            </div>)
                        })}
                    </div>
                </div>
                {/* Skills job */}
                <div className='skills-job-detail '>
                    <h6>KỸ NĂNG CÔNG VIỆC</h6>
                    <div>
                        {job_detail &&
                            job_detail.requiredSkills &&
                            job_detail.requiredSkills.length > 0 ?
                            job_detail.requiredSkills.map(
                                (item, index) => (
                                    <label key={index} className='skills-detail'>{item.name}</label>
                                )) : <p>Ứng viên không cần đòi hỏi chuyên môn</p>
                        }
                    </div>
                </div>
            </div >
        )
    }
}
