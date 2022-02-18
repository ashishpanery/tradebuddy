import { useState } from 'react'
import { connect } from 'react-redux'
import $ from "jquery"
import { default as Component } from '../../components/AdminPortal/Table/DataTable/CommonDataTable'


function OrderDataTable({ currentUser }) {
    const [orderList, setOrderList] = useState([])
    const [loading, setLoading] = useState(true)
    const [orderData, setOrderData] = useState('')

    // apply active className to the below_nav item
    $(function () {
        $("#belownav_orders_item").addClass("fw-bold text-primary");
        $("#belownav_datatable_toggler").text("Orders");

    });

    const options = [
        { value: "OrderID", label: "Order ID" },
        { value: "MenteeID", label: "Mentee ID" },
        { value: "orderType", label: "Order Type" },
        { value: "amount", label: "Amount" },
        { value: "status", label: "Status" },
    ]
    return (
        <Component
            dataType="order"
            options={options}
            filename="order"
            data={orderData}
            setData={setOrderData}
            loading={loading}
            // for pagination
            url={process.env.REACT_APP_ADMIN_PAGINATED_ORDERS}
            dataList={orderList}
            setDataList={setOrderList}
            setLoading={setLoading}
        >
        </Component>
    )
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(OrderDataTable)