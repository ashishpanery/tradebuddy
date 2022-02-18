import { useHistory } from "react-router-dom"
const useRedirect = (url) => {
    const history = useHistory()

    const redirectWithLogin = () => {
        history.push({
            pathname: "/login",
            state: {
                redirectUrl: url
            }
        })
    }

    return redirectWithLogin
}
export default useRedirect