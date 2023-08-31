import { useEffect } from "react"
import * as Realm from 'realm-web'
import { isAnon } from "../utils"
import { useNavigate } from 'react-router-dom'

function Logout ({app, handleLogout}) {
    const navigate = useNavigate();


    useEffect(() => {

            
            handleLogout();
            navigate('/')

    }, [app])

    return (<>Logging out</>
    )
}

export default Logout