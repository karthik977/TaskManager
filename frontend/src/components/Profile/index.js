import {useState,useEffect} from 'react'
import Cookies from 'js-cookie'

import './index.css'


const Profile = () =>{
   const [signedUsername,setSignedUsername] = useState("")
   const jwtToken1 = Cookies.get("jwtToken")
   const getProfileDetails = async () =>{
       const profileResponse = await fetch("http://localhost:5000/profile",{
        method:'GET',
        headers:{
            Authorization: `Bearer ${jwtToken1}`
        }
       })
       const data = await profileResponse.json()

       setSignedUsername(data.username);
   }
   useEffect(()=>{
    getProfileDetails()
   },[])

    return(
        <div className="profile-container-100">
           <p className="username-signed-100">Hey! {signedUsername} Welcome</p>
        </div>
    )
}

export default Profile