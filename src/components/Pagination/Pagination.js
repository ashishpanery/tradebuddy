import { useEffect, useState } from "react"
import axios from "axios"
import { connect } from "react-redux"
// import { useLocation } from "react-router-dom"
// import useRedirect from '../Redirect/Redirect'
import Select from "react-select"
import useHandleError from "../Handlers/ErrorHandler/ErrorHandler"

const Pagination = ({ url, dataList, setDataList, setLoading, loadByStatus, activeButton, currentUser, AuthRequired = true, sort = "startDate" }) => {

    // const location = useLocation().pathname
    // const redirectWithLogin = useRedirect(location)
    // if (!currentUser && AuthRequired) redirectWithLogin()
    const { handleError } = useHandleError(window.location.pathname)
    const token = currentUser?.token
    const pageSize = 10
    const [hidden, setHidden] = useState(true)
    const [startValue, setStartValue] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectPage, setSelectPage] = useState({ label: 1, value: 1 })
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState([1])
    const [error, setError] = useState('')

    useEffect(() => {
        const getDataList = async () => {
            await axios.post(url,
                {
                    pageNo: currentPage,
                    pageSize: pageSize,
                    sort: sort
                },
                AuthRequired && {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ).then(resp => {
                setDataList(resp.data.model)
                if (resp.data.pagingDetail) {
                    setTotalPages(resp.data.pagingDetail.numberOfPages)
                    getPaginationValues(resp.data.pagingDetail.numberOfPages)
                }
                else {
                    setError(handleError(999, "Could not load pagination data"))
                }
                setHidden(false)

            }).catch(err => {
                // if (err.response)
                setError(handleError(err.response.status))
                // else setError(handleError(500))
            })
            setLoading(false)
        }
        getDataList()
    }, [currentPage, loadByStatus, activeButton])

    //render the pages on each pagination button click
    const getPaginationValues = (noOfPages) => {
        let updatedPages = []
        const upperLimit = (noOfPages >= pageSize) ? (startValue + pageSize) : noOfPages
        for (let i = startValue; i <= upperLimit; i++) {
            !(i > noOfPages) && updatedPages.push(i)
        }
        setPages(updatedPages)
    }

    //options for select page
    let options = []
    for (let i = 1; i <= totalPages; i++) {
        options.push({ value: i, label: i })
    }

    const getSelectCurrentPage = (value) => {
        setSelectPage({
            label: value, value: value
            // label: `${value} of ${totalPages}`, value: value
        })
    }

    const handleChange = (type, item) => {
        switch (type) {
            case "firstPage":
                setCurrentPage(1)
                setStartValue(1)
                getSelectCurrentPage(1)
                break

            case "prevPage":
                setCurrentPage(currentPage - 1)
                setStartValue((startValue - 1) <= 0 ? 1 : (startValue - 1))
                getSelectCurrentPage(currentPage - 1)
                break

            case "specificPage":
                setCurrentPage(item)
                getSelectCurrentPage(item)
                break

            case "nextPage":
                setCurrentPage(currentPage + 1)
                setStartValue((startValue + pageSize >= totalPages) ? startValue : (startValue + 1))
                getSelectCurrentPage(currentPage + 1)
                break

            case "lastPage":
                setCurrentPage(totalPages)
                setStartValue(totalPages < pageSize ? 1 : (totalPages - pageSize))
                getSelectCurrentPage(totalPages)
                break

            default:
                const startPage = selectPage.value - pageSize
                startPage >= 1 ? setStartValue(startPage) : setStartValue(1)
                // if (startPage >= 1)
                //     setStartValue(startPage)
                // else
                //     setStartValue(1)
                setCurrentPage(selectPage.value)
                getPaginationValues(totalPages)
                break

        }
    }
    //using useEffect so that previous value of select isn't taken
    useEffect(() => {
        // console.log({ selectPage })
        handleChange("selectPage")
    }, [selectPage])

    //handle changing of select page
    const handleSelect = (e) => {
        setSelectPage({ value: e.value, label: e.label })
        // setSelectPage({ value: e.value, label: `${e.label} of ${totalPages}` })
    }

    return (
        error ?
            error :
            <div className={`border-top pt-3 d-${hidden ? "none" : 'block'}`}>
                <ul className="d-flex gap-2 justify-content-center align-items-center flex-wrap">

                    {/* go to first page */}
                    <li
                        className={`cursor-pointer  ${currentPage === 1 ? 'disabled' : null} custom_box_shadow border px-3 py-2`}
                        onClick={() => handleChange("firstPage")} ><span>|</span>&laquo; First</li>

                    {/* go back */}
                    <li
                        className={`cursor-pointer  ${currentPage === 1 ? 'disabled' : null} custom_box_shadow border px-3 py-2`}
                        onClick={() => handleChange("prevPage")} >&laquo; Prev</li>

                    {/* go to specific page */}
                    {pages.map((item, index) => {
                        return <li key={index}
                            onClick={() => handleChange("specificPage", item)}
                            className={`cursor-pointer ${item === currentPage ? 'activePageNo' : null} custom_box_shadow border px-3 py-2`}>{item}</li>
                    })}

                    {/* go forward */}
                    <li
                        className={`cursor-pointer ${dataList.length < pageSize ? 'disabled' : null} custom_box_shadow border px-3 py-2`}
                        onClick={() => handleChange("nextPage")}
                    >
                        Next &raquo;
                    </li>

                    {/* go to last page */}
                    <li
                        className={`cursor-pointer  ${(currentPage === totalPages || totalPages === 0) ? 'disabled' : null} custom_box_shadow border px-3 py-2`}
                        onClick={() => handleChange("lastPage")} >Last &raquo;<span>|</span></li>

                </ul>
                {/* select page */}
                <div className="p-3 d-flex gap-2 justify-content-center align-items-center">
                    <p className="fs-6">Showing Page: </p>
                    <Select className="select_box_table"
                        options={options}
                        value={selectPage}
                        placeholder="Go to page"
                        onChange={(e) => handleSelect(e)} />

                </div>
            </div>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(Pagination)