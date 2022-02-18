import sortTable from "../Table/DataTable/SortTable/SortTable"
import { sortTableNumerically } from "../Table/DataTable/SortTable/SortTable"

const fetchHeaders = (type) => {

    switch (type) {
        case "mentor":
            return <tr className="bg-primary text-white">
                <th className="cursor-pointer" onClick={() => sortTable(0)}>Name </th>
                <th className="cursor-pointer" onClick={() => sortTable(1)}>E-mail </th>
                <th className="cursor-pointer" onClick={() => sortTableNumerically(2)}>Phone</th>
                <th className="cursor-pointer" onClick={() => sortTable(3)}>Current Company </th>
                <th className="cursor-pointer" onClick={() => sortTable(4)}>Designation</th>
                <th className="cursor-pointer" onClick={() => sortTableNumerically(5)}>Experience (Years) </th>
                <th >LinkedIn</th>
                <th className="cursor-pointer" onClick={() => sortTable(6)}>Status </th>
                <th className='text-center'>Actions</th>
            </tr>
        case "mentee":
            return <tr className="bg-primary text-white">
                <th className="cursor-pointer" onClick={() => sortTable(0)}>Name</th>
                <th className="cursor-pointer" onClick={() => sortTable(1)}>E-mail</th>
                <th className="cursor-pointer" onClick={() => sortTableNumerically(2)}>Phone</th>
                <th className="cursor-pointer" onClick={() => sortTable(3)}>Current Company </th>
                <th className="cursor-pointer" onClick={() => sortTable(4)}>Designation</th>
                <th className="cursor-pointer" onClick={() => sortTableNumerically(5)}>Experience (Years) </th>
                <th >LinkedIn</th>
                <th >Action</th>
            </tr>
        case "event":
            return <tr className="bg-primary text-white">
                <th className="cursor-pointer" onClick={() => sortTable(0)}>Name</th>
                <th className="cursor-pointer" onClick={() => sortTableNumerically(1)}>Number of Lectures</th>
                <th className="cursor-pointer">Explore</th>
                <th className="cursor-pointer">Edit</th>
                <th className="cursor-pointer" onClick={() => sortTable(4)}>Status</th>
                <th className="cursor-pointer text-center">Actions</th>
            </tr>
        case "session":
            return <tr className="bg-primary text-white">
                {/* session id, mentee id, mentor id, start time, status, payment */}
                <th className="cursor-pointer" onClick={() => sortTable(0)}>Session ID</th>
                <th className="cursor-pointer" onClick={() => sortTable(1)}>Mentor ID</th>
                <th className="cursor-pointer" onClick={() => sortTable(2)}>Mentee ID</th>
                <th className="cursor-pointer" onClick={() => sortTable(3)}>Start Time</th>
                <th className="cursor-pointer" onClick={() => sortTable(4)}>Status</th>
                <th className="cursor-pointer" onClick={() => sortTableNumerically(5)}>Amount</th>
                <th className="cursor-pointer text-center">Actions</th>
            </tr>
        case "order":
            return <tr className="bg-primary text-white">
                <th className="cursor-pointer" onClick={() => sortTable(0)} scope="col">ORDER ID</th>
                <th className="cursor-pointer" onClick={() => sortTable(1)} scope="col">MENTEE ID</th>
                <th className="cursor-pointer" onClick={() => sortTable(2)} scope="col">ORDER TYPE</th>
                <th className="cursor-pointer" onClick={() => sortTableNumerically(3)} scope="col">PAYABLE AMOUNT</th>
                <th className="cursor-pointer" onClick={() => sortTable(3)} scope="col">ORDERED DATE</th>
                <th className="cursor-pointer" onClick={() => sortTable(4)} scope="col">STATUS</th>

            </tr>
        case "course":
            return <tr className="bg-primary text-white">
                <th className="cursor-pointer" onClick={() => sortTable(0)}>Mentor ID</th>
                <th className="cursor-pointer" onClick={() => sortTable(1)}>Course Name</th>
                <th className="cursor-pointer" onClick={() => sortTableNumerically(2)}>Lectures</th>
                <th className="cursor-pointer" onClick={() => sortTable(3)}>Free</th>
                <th className="cursor-pointer" onClick={() => sortTableNumerically(4)}>Fee</th>
                <th className="cursor-pointer" onClick={() => sortTable(5)}>Status</th>
                <th className='text-center' >Actions</th>

            </tr>
        case "courseRegistration":
            return <tr className="bg-primary text-white">
                <th className="cursor-pointer" onClick={() => sortTable(0)}>Name</th>
                <th className="cursor-pointer" onClick={() => sortTable(1)}>Email</th>
                <th className="cursor-pointer" onClick={() => sortTable(2)}>Content Type</th>
                <th className="cursor-pointer" onClick={() => sortTable(3)}>Ordered Date</th>
                <th className="cursor-pointer" onClick={() => sortTableNumerically(4)}>Amount</th>
                <th className="cursor-pointer" onClick={() => sortTable(5)}>Status</th>
            </tr>
        case "query":
            return <tr className="bg-primary text-white">
                {/* <th className="cursor-pointer" onClick={() => sortTable(0)}>ID</th> */}
                <th className="cursor-pointer" onClick={() => sortTable(0)}>Name </th>
                <th className="cursor-pointer" onClick={() => sortTable(1)}>E-mail </th>
                <th className="cursor-pointer" onClick={() => sortTableNumerically(2)}>Phone</th>
                <th className="cursor-pointer" onClick={() => sortTable(3)}>Message </th>
                <th className="cursor-pointer" onClick={() => sortTable(4)}>Status </th>
                <th className='text-center'>Actions</th>
            </tr>
        case "bootcampRegistration":
            return <tr className="bg-primary text-white">
                {/* <th className="cursor-pointer" onClick={() => sortTable(0)}>ID</th> */}
                <th className="cursor-pointer" onClick={() => sortTable(0)}>Program ID </th>
                <th className="cursor-pointer" onClick={() => sortTable(1)}>Mentee Name </th>
                <th className="cursor-pointer" onClick={() => sortTable(2)}>E-mail </th>
                <th className="cursor-pointer" onClick={() => sortTableNumerically(3)}>Phone</th>
                <th className="cursor-pointer" onClick={() => sortTable(4)}>Status </th>
                <th className='text-center'>Actions</th>
            </tr>

        default: return
    }


}
export default fetchHeaders