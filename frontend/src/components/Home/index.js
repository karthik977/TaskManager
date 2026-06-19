import { useEffect, useState, useCallback } from "react";
import { CgProfile } from "react-icons/cg";
import { BiSolidMinusCircle } from "react-icons/bi";
import { GiSilverBullet } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Profile from '../Profile';
import Cookies from 'js-cookie';
import './index.css';

function Home() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [tasks, setTasks] = useState([]);
    const [profileVisible, setProfileVisible] = useState(false);
    const jwtToken = Cookies.get("jwtToken");
    
    const navigate = useNavigate(); // Standardized casing to lowercase 'navigate'

    const getTasks = useCallback(async () => {
        try {
            const response = await fetch("https://taskmanager-backend-project.onrender.com/tasks", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Safe check to guarantee it's an array before setting state
                setTasks(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }, [jwtToken]);
    
    useEffect(() => {
        getTasks();
    }, [getTasks]);

    const addTask = async () => {
        if (title.trim() !== "" && description.trim() !== "") {
            const taskDetails = { title, description };
            
            try {
                await fetch("https://taskmanager-backend-project.onrender.com/add-task", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${jwtToken}`
                    },
                    body: JSON.stringify(taskDetails)
                });

                setTitle("");
                setDescription("");
                getTasks();
                setErrorMessage("");
            } catch (error) {
                console.error("Error adding task:", error);
            }
        } else {
            setErrorMessage("Make Note of Title and its Description!");
        }
    };

    const deleteTask = async (id) => {
        try {
            await fetch(`https://taskmanager-backend-project.onrender.com/delete-task/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });
            getTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const updateTask = async (id) => {
        const updatedTaskDetails = { title, description };
        try {
            await fetch(`https://taskmanager-backend-project.onrender.com/update-task/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`
                },
                body: JSON.stringify(updatedTaskDetails)
            }); 
            setTitle("");
            setDescription("");
            getTasks();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const onLogout = () => {
        Cookies.remove("jwtToken");
        navigate("/", { replace: true }); // Clean router redirect instead of page refresh
    };

    const onClickProfile = () => {
        setProfileVisible(prevState => !prevState);
    };

    const navigateBullet = () => {
        navigate("/bullet");
    };

    return (
        <div className="home-container-1">
            <div className="top-head">
                <div className="header-bar">
                    <h1 className="Task-home">Task Manager</h1>
                    <div className="sub-header-home">
                        <div className="profile-checkers">
                            <button className="profile-btn-home" onClick={onClickProfile}>
                                {profileVisible ? <BiSolidMinusCircle className="profile-react-icon" /> : <CgProfile className="profile-react-icon" />}
                            </button>
                            {/* Fixed the 'clasName' typo to 'className' below */}
                            <div className="profile-component-home">
                                {profileVisible ? <Profile /> : null}
                            </div>
                        </div>
                        <button className="bullet-btn" onClick={navigateBullet}>
                            <GiSilverBullet className="profile-react-icon"/>
                        </button>
                        <button onClick={onLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="input-title"
                    />
                    <br/>
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        className="textarea-description"
                    />
                </div>
            </div>
            <br/>
            <button onClick={addTask} className="add-task-btn">
                Add Task
            </button>
            <p className="error-message-add-task">{errorMessage}</p>
            
            <div>
                <div className="taskkk">
                    {tasks.length === 0 ? (
                        <div className="task-empty-container">
                            <h1 className="task-container-heading">No Tasks Found</h1> 
                        </div>
                    ) : (
                        tasks.map((eachTask, index) => (
                            // Safe fallback key check for MongoDB identifier configurations (_id)
                            <div className="task-container-for-task" key={eachTask.id || eachTask._id || index}>
                                <h3>{eachTask.title}</h3>
                                <p>{eachTask.description}</p>
                                <button 
                                    type="button" 
                                    className="delete-task-btn"
                                    onClick={() => deleteTask(eachTask.id || eachTask._id)}
                                >
                                    Delete
                                </button> 
                                <button 
                                    type="button" 
                                    className="update-task-btn" 
                                    onClick={() => updateTask(eachTask.id || eachTask._id)}
                                >
                                    Update
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;