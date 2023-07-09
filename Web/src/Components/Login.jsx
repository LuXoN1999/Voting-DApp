import React from "react";

const Login = (props) => {
    return (
        <div className="login-container">
            <h1 className="welcome-message">Welcome to decentralized voting application</h1>
            <button className="metamask-button" onClick = {props.connectWallet}>Login with Metamask</button>
        </div>
    )
}

export default Login;