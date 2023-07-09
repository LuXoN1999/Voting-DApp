import React from "react";

const Connected = (props) => {
    return (
        <div className="connected-container">
            <h1 className="connected-header">You are Connected to Metamask</h1>
            <p className="connected-account">Metamask Account: {props.account}</p>
            <div>
                <input type="number" min="0" placeholder="Enter Candidate Index" value={props.number} onChange={props.handleNumberChange}></input>
                <br></br>
                <input id="idInput" type="text" placeholder="Enter ID number" value={props.idNumber} onChange={props.handleIdNumberChange}></input>
                <br></br>
                <button className="login-button" onClick={props.voteFunction}>Vote</button>
                {props.errorMessage && <p>{props.errorMessage}</p>}
            </div>
            <table id="myTable" className="candidates-table">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Candidate name</th>
                        <th>Candidate votes</th>
                    </tr>
                </thead>
                <tbody>
                    {props.candidates.map((candidate, index) => (
                        <tr key={index}>
                            <td>{candidate.index}</td>
                            <td>{candidate.name}</td>
                            <td>{candidate.voteCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Connected;