import React, { useState, useEffect } from 'react'
import "./PersonalCourses.css"
import sortTable from '../AdminPortal/Table/DataTable/SortTable/SortTable'
import SearchTable from '../AdminPortal/Table/DataTable/SearchTable/SearchTable'
import { useHistory } from 'react-router-dom'
import axios from "axios"
import Spinner from "../Spinner/Spinner"
import Select from 'react-select'
import pencil from "../../images/Pencil Icon.png"

export default function PersonalCourses({ mentorId, token }) {
    const [PersonalCourses, setPersonalEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('')
    const history = useHistory()

    const editPersonalCourse = (id) => {
        history.push(`/edit_personal_course/${id}`)
    }

    useEffect(() => {
        const getPersonalCourses = async () => {
            await axios.get(`${process.env.REACT_APP_GET_ALL_COURSE_BY_MENTOR_ID}/${mentorId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(resp => setPersonalEvents(resp.data.model))
            setLoading(false)
        }
        getPersonalCourses()
    }, [])

    const options = [
        { value: "ID", label: "ID" },
        { value: "Name", label: "Course Name" },
        { value: "lectures", label: "Number of Lectures" },
        { value: "free", label: "Free/Paid" },
        { value: "fee", label: "Fee" },
    ]
    return (
        <div>
            {
                loading ? <div style={{ minHeight: "50vh" }} className="d-flex align-items-center justify-content-center">
                    <Spinner />
                </div>
                    :
                    <>
                        <div className="rounded">
                            <div className="content-wrapper rounded bg-white ">

                                <div className="card-body">
                                    {/* Create new COURSE */}
                                    <div>
                                        <button onClick={() => history.push(`/edit_personal_course/${'new'}`)} className="btn create_event_button">Create Course</button>
                                    </div>
                                    {/* Search box */}
                                    {PersonalCourses.length > 0 &&
                                        <div className="d-flex justify-content-end  flex-column flex-sm-row  table_search">

                                            < Select
                                                options={options}
                                                onChange={setCategory}
                                                value={category}
                                                className="select_box_table"
                                            />
                                            <input readOnly={category !== "" ? false : true} className={`px-3 py-2 ${category !== "" ? null : 'cursor_not_allowed'}`} id="table_search" type="text" placeholder="Search table" onKeyUp={() => SearchTable(category.value, "personalCourse")} />
                                        </div>}
                                    {
                                        PersonalCourses.length === 0 ?
                                            <div>
                                                <h3 className='py-3'>You have not created a course yet.</h3>
                                            </div>

                                            :
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="table-responsive">
                                                        <table id="order-listing" className="table">
                                                            <thead>
                                                                {/* Table headers */}
                                                                <tr className="bg_mentor_theme text-white">
                                                                    <th className="cursor-pointer" onClick={() => sortTable(0)} scope="col">COURSE ID</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(1)} scope="col">COURSE TITLE</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(2)} scope="col">LECTURES</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(3)} scope="col">FREE</th>
                                                                    <th className="cursor-pointer" onClick={() => sortTable(4)} scope="col">FEE</th>
                                                                    <th scope="col">SUBSCRIPTIONS</th>
                                                                    <th scope="col">EDIT</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    PersonalCourses.length > 0 ? PersonalCourses.map((personalCourse, index) => {
                                                                        const { id, title, lectureList, free, fee } = personalCourse
                                                                        console.log(personalCourse)
                                                                        return <tr key={index}>
                                                                            <td>{id}</td>
                                                                            <td className='cursor-pointer' onClick={() => history.push(`/courses/${id}/${title.split(" ").join("-")}`)}>{title}</td>
                                                                            <td>{lectureList.length}</td>
                                                                            <td>{free ? "Yes" : "No"}</td>
                                                                            <td>{free ? "NA" : fee}</td>
                                                                            <td onClick={() => history.push(`/subscriptions/${id}`)} className="cursor-pointer"><u>View Subscriptions</u></td>
                                                                            <td onClick={() => editPersonalCourse(id)} className="cursor-pointer "><img src={pencil} style={{ width: "25px", height: "25px" }} alt="edit" /></td>
                                                                        </tr>

                                                                    })
                                                                        :
                                                                        <tr>
                                                                            <td className='pt-3 border-0'>You have not created any courses.</td>
                                                                        </tr>
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>

                        </div>
                    </>
            }
        </div>
    )
}