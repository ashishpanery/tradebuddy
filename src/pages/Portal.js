import React from 'react'
import "./Portal.css"
import Helmet from 'react-helmet'
import { Dashboard, Header } from '../components'
import { connect } from 'react-redux'
import { useLocation } from "react-router-dom"
import useRedirect from '../components/Redirect/Redirect'
import { HandleAuthorization } from "../pages"


function Portal({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    return (
        <>
            <header>
                <Helmet>
                    <title>Dashboard | Administrator  - TradeBuddy  </title>
                    <meta charSet="utf-8" />
                </Helmet>
                <Header />
            </header>
            <HandleAuthorization user="an admin">
                <Dashboard />
            </HandleAuthorization>
        </>
    )
}


const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(Portal)
