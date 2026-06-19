import { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom"; 
import { FcEmptyTrash } from "react-icons/fc";
import "./index.css";
import Cookies from "js-cookie";

function Bullets() {
    const [bullet, setBullet] = useState("");
    const [totalBullets, setTotalBullets] = useState([]);
    const jwtToken = Cookies.get("jwtToken");
    const navigate = useNavigate(); 

    
    const getTotalBullets = useCallback(async () => {
        try {
            const response = await fetch(
                "https://taskmanager-backend-project.onrender.com/get-bullet",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            if (response.ok) {
                const bulletData = await response.json();
              
                setTotalBullets(Array.isArray(bulletData) ? bulletData : []);
            }
        } catch (error) {
            console.error("Failed to fetch bullets:", error);
        }
    }, [jwtToken]);

    
    useEffect(() => {
        getTotalBullets();
    }, [getTotalBullets]);

    const addBullet = async () => {
        if (bullet.trim() === "") return; 

        const bulletDetails = { titles: bullet };

        try {
            await fetch(
                "https://taskmanager-backend-project.onrender.com/bullet",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                    body: JSON.stringify(bulletDetails),
                }
            );
            setBullet("");
            getTotalBullets(); // Refresh the list
        } catch (error) {
            console.error("Failed to add bullet:", error);
        }
    };

    const changeAddBullet = (event) => {
        setBullet(event.target.value);
    };

    const backHome = () => {
        navigate("/home"); // Smooth Single Page Application routing
    };

    return (
        <div className="bullet-container">
            <p className="bullet-points">Bullet Points</p>

            <div className="bullet-input-container">
                <input
                    type="text"
                    value={bullet}
                    onChange={changeAddBullet}
                    placeholder="Unable to remember short point make note here..."
                    className="bullet-input"
                />
                <br />
                <button className="add-bullet-btn" onClick={addBullet}>
                    Add Bullet
                </button>
            </div>

            {totalBullets.length === 0 ? (
                <div className="empty-bullet-container">
                    <FcEmptyTrash className="empty-bin" />
                    <h1 className="bullet-points">No Bullet Points Found</h1>
                </div>
            ) : (
                <div className="bullets-to-show-ordered-list">
                    {totalBullets.map((eachBullet, index) => (
                        <p key={eachBullet.id || eachBullet._id || index} className="bullet-item">
                            {eachBullet.titles}
                        </p>
                    ))}
                </div>
            )}

            <div className="back-btn-container">
                <button className="add-bullet-btn" onClick={backHome}>
                    Back
                </button>
            </div>
        </div>
    );
}

export default Bullets;