import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

import './index.css'

function Login() {

    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [errorUserDetails,setErrorUserDetails] = useState("")
    const [showPasswordch,setShowPasswordch] = useState(true)

    const navigate = useNavigate()

    const onLogin = async () => {
      if(username !== "" && password !== ""){
        const userDetails = {
            username,
            password
        }

        const response = await fetch("https://taskmanager-backend-project.onrender.com/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(userDetails)

        })

        const data = await response.json()

        if(response.ok){

            Cookies.set("jwtToken",data.jwtToken,{expires:30})
            
            navigate("/home")

        }else{
            alert(data)
        }
        setErrorUserDetails("")

    }else{
        setErrorUserDetails("**Provide Valid User Detail!")
    }
}
    const onChangeUsername = (event) =>{
       setUsername(event.target.value)
    }

    const onChangePassword = (event) =>{
        setPassword(event.target.value)
    }

    const onChangeCheckbox = () =>{
       setShowPasswordch(prevState=>!prevState)
    }

     const passwordType = showPasswordch ? "password":"text"
    return(
        <div  className="task-manager-container">

            <h1 className="task-manager-heading">Task Manager</h1>
            <div className="login-container">
            <label htmlFor="username" className="login-username" >USERNAME</label>
            <input
                type="text"
                id="username"
                className="user-input-style"
                placeholder="Username"
                value={username}
                onChange={onChangeUsername}
            />

            <br/>
            <label htmlFor="password" className="login-username">PASSWORD</label>
            <input
                type={passwordType}
                id="password"
                className="user-input-style"
                placeholder="Password"
                value={password}
                onChange={onChangePassword}
            />
            <div className="show-password">
               <input type="checkbox" id="checkbox"  onChange={onChangeCheckbox}/> 
               <label htmlFor="checkbox" className="show-password-chk">Show Password</label>
            </div>

            <br/>
            <button type="button" className="btn-button" onClick={onLogin}>
                Login
            </button>
            <p className="user-details-error-msg">{errorUserDetails}</p>
        </div>

        </div>

    )

}

export default Login;