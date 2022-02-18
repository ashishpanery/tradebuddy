import axios from "axios"
import { useState, useEffect } from "react"

const useHandleReq = () => {
    const [data, setData] = useState([])
    const [error, setError] = useState('')

    // const [loading, setLoading] = useState(true)
    let loading = true

    const getData = async (url) => {
        // console.log('loading: ', loading)
        // await axios.get(url)
        //     .then(resp => {
        //         console.log(resp.data.model)
        //         loading = false
        //     })

        // console.log('loading: ', loading)
        return
    }

    const postData = async () => {
        // await axios.get(url)
        console.log("post data called")
    }

    return { getData, postData }
}


export default useHandleReq