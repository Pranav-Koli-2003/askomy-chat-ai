
import React, { useState } from 'react';
import { create_account } from '../api/api_link';
import Login_token from '../components/Login_token';
import { useNavigate } from 'react-router-dom';
import './Login.css'
import { toast } from 'react-toastify';

function Login() {
    const [user_name, setUser_name] = useState("");
    const [user_email, setUser_email] = useState("");
    const [user_password, setUser_password] = useState("");
    const [message, setUser_message] = useState("");
    const [page, setPage] = useState(false);
     const navigate = useNavigate(); 

    async function create_user(e) {
        e.preventDefault();

        const data ={
            user_name : user_name,
            user_email : user_email,
            user_password : user_password,
        }
        try{
            const response = await create_account(data);
            console.log(response.message)
            if (response.value == 'True'){
                toast.success(response.message)
                setPage(false);
            }
            setUser_message(response.message)
        }
        catch (error) {
           toast.error(error.message)
        }
    }
    async function login_user(e) {
        e.preventDefault()
        const data = {
            user_email : user_email,
            user_password : user_password,
        }
        const response = await Login_token(data,navigate)

        setUser_message(response)
    }
    function swap() {
        setPage(!page);
        
    }

    return (
        <>
            {page ? (
                <form onSubmit={create_user} id="create_account">
                    <h2>Create Account</h2>

                    <input
                        type="text"
                        placeholder="Username"
                        value={user_name}
                        required
                        onChange={(e) => setUser_name(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={user_email}
                        required
                        onChange={(e) => setUser_email(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={user_password}
                        required
                        onChange={(e) => setUser_password(e.target.value)}
                    />

                    <p> {message} </p>

                    <p>
                        I have an account!
                        <span onClick={swap}> Login</span>
                    </p>

                    <button type="submit">Create Account</button>
                </form>
            ) : (
                <form onSubmit={login_user} id="login">
                    <h2>Login</h2>

                    <input
                        type="email" 
                        placeholder="Email"
                        value={user_email}
                        required
                        onChange={(e) => setUser_email(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={user_password}
                        required
                        onChange={(e) => setUser_password(e.target.value)}
                    />

                    <p>{message} </p>

                    <p>
                        I don't have an account!
                        <span onClick={swap}> Create Account</span>
                    </p>

                    <button type="submit">Login</button>
                </form>
            )}
        </>
    );
}

export default Login;
