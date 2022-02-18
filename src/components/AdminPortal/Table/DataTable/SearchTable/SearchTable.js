export default function myFunction(category, type) {
    let categoryObj = {}
    switch (type) {
        case "mentor":
            categoryObj = {
                "Name": 0,
                "email": 1,
                "phone": 2,
                "currentCompany": 3,
                "Designation": 4,
                "experienceInYears": 5,
                "status": 6,
            }
            break
        case "mentee":
            categoryObj = {
                "Name": 0,
                "emailAddress": 1,
                "phonenumber": 2,
                "currentCompany": 3,
                "Designation": 4,
                "experienceInYears": 5,
                "status": 6,
            }
            break
        case "event":
            categoryObj = {
                "Name": 0,
                "NoOfLectures": 1,
                "status": 4,
            }
            break
        case "personalEvent":
            categoryObj = {
                "ID": 0,
                "Name": 1,
                "startDate": 2,
                "startTime": 3,
                "duration": 4,
            }
            break
        case "registrant":
            categoryObj = {
                "ID": 0,
                "name": 1,
                "emailAddress": 2,
                "phonenumber": 3,
                "paymentStatus": 4,
                "amount": 5,
            }
            break
        case "subscriber":
            categoryObj = {
                "ID": 0,
                "name": 1,
                "email": 2,
                "orderDate": 3,
                "amount": 4,
                "paymentStatus": 5,
            }
            break
        case "order":
            categoryObj = {
                "OrderID": 0,
                "MenteeID": 1,
                "orderType": 2,
                "amount": 3,
                "status": 5,
            }
            break
        case "course":
            categoryObj = {
                "ID": 0,
                "name": 1,
                "no_of_lectures": 2,
                "free": 3,
                "fee": 4,
                "status": 5
            }
            break
        case "courseRegistration":
            categoryObj = {
                "Name": 0,
                "email": 1,
                "content_type": 2,
                "ordered_date": 3,
                "amount": 4,
                "status": 5
            }
            break
        case "personalCourse":
            categoryObj = {
                "ID": 0,
                "Name": 1,
                "lectures": 2,
                "free": 3,
                "fee": 4,
            }
            break
        case "query":
            categoryObj = {
                "Name": 0,
                "email": 1,
                "phone": 2,
                "status": 3
            }
            break
        case "bootcampRegistration":
            categoryObj = {
                "programID": 0,
                "Name": 1,
                "email": 2,
                "phone": 3,
                "status": 4
            }
            break

        case "session":
            categoryObj = {
                "session_id": 0,
                "mentor_id": 1,
                "mentee_id": 2,
                "startTime": 3,
                "status": 4,
                "sessionAmout": 5,
            }
            break

        default:
            break
    }
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("table_search");
    filter = input.value.toUpperCase();
    table = document.getElementById("order-listing");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[categoryObj[`${category}`]];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}