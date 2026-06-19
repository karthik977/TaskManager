import {useState,useEffect} from 'react'
import { FcEmptyTrash } from "react-icons/fc";
import './index.css' 
import Cookies from 'js-cookie'

function Bullets() {
    const [bullet,setBullet] = useState("")
    const [totalBullets,setTotalBullets] = useState([])
    const jwtToken = Cookies.get("jwtToken")

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line
    useEffect(()=>{
       getTotalBullets()
    },[])

    const getTotalBullets = async () =>{
        const response = await fetch("https://taskmanager-backend-project.onrender.com/get-bullet",{
             method:"GET",
            headers:{
                Authorization:`Bearer ${jwtToken}`
            }
        })

        const bulletData = await response.json()
        setTotalBullets(bulletData)
    }
    const addBullet = async() =>{
         const bulletDetails = {titles:bullet} 
         await fetch("https://taskmanager-backend-project.onrender.com/bullet",{
            method:'POST',
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${jwtToken}`
            },
            body:JSON.stringify(bulletDetails)
         })
         setBullet("")
         getTotalBullets()


    }

    const changeAddBullet = (event) =>{
        setBullet(event.target.value)
    }

    const backHome = ()=>{
        window.location.replace("/home")
    }
   return (

    <div className="bullet-container">
        <p className="bullet-points">Bullet Points</p>
        <div className="bullet-input-container">
        <input type="text" onChange={changeAddBullet} placeholder="Unable to remember short point make note here..." className="bullet-input" />
        <br />
        <button className="add-bullet-btn" onClick={addBullet}>Add Bullet</button>
        </div>
        {totalBullets.length === 0 ? <div className="empty-bullet-container">
            <FcEmptyTrash  className="empty-bin" />
            <h1 className="bullet-points">No Bullets Points Found</h1>
        </div>
            : <div className="bullets-to-show-ordered-list">
           {totalBullets.map((eachBullet) =>(<p className="bullet-item">{eachBullet.titles}</p>)
           )}
        </div> }
        
        <div className="back-btn-container">
        <button className="add-bullet-btn" onClick={backHome}>Back</button>
        </div>
    </div>
   )
}

export default Bullets