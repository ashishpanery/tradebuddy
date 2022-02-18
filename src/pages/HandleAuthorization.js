import { Footer } from "../components"
import { connect } from "react-redux"

function HandleAuthorization({ user = "a mentor", currentUser, children }) {

    return currentUser?.data.isMentor ?
        <div className="d-flex flex-column justify-content-between" style={{ minHeight: "100vh" }}>
            {children}
            <Footer />
        </div>
        :
        <div className={`${user === "an admin" && "bg-white"} d-flex flex-column justify-content-between`} style={{ minHeight: "100vh" }}>
            <div className='pt-5 mt-5 text-center'>
                <h1 className="mt-5">403</h1>
                <p>Unathorized Access: You must be {user} to access this page. </p>
            </div>
            <Footer />
        </div>


}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(HandleAuthorization)
