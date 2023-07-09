import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from './Constant/constant';
import Login from './Components/Login';
import Connected from './Components/Connected';
import './App.css';
import axios from 'axios';
import { SHA256 } from 'crypto-js';


function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [CanVote, setCanVote] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    getCandidates();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  });


  async function vote() {
    let data = true;
    await axios.get("http://localhost:8080/voter/" + idNumber.toString()).then((response) => {
      data = response.data;
    });
    if (data) {
      setErrorMessage(null);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      try {
        const hashedIdNumber = SHA256(idNumber).toString();
        const tx = await contractInstance.vote(number, hashedIdNumber);
        await tx.wait();
      } catch (error) {
        setErrorMessage(error["reason"].split(":")[1]);
      }
      canVote();
    } else {
      setErrorMessage("Person with this ID number has no right to vote.")
    }
  }


  async function canVote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const voteStatus = await contractInstance.voters(idNumber);
    setCanVote(voteStatus);
  }

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const candidatesList = await contractInstance.getAllVotesOfCandidates();
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber()
      }
    });
    setCandidates(formattedCandidates);
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask Connected : " + address);
        setIsConnected(true);
        canVote();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser.")
    }
  }

  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  async function handleIdNumberChange(e) {
    setIdNumber(e.target.value);
  }

  return (
    <div className="App">
      {isConnected ? (<Connected
        account={account}
        candidates={candidates}
        number={number}
        handleNumberChange={handleNumberChange}
        idNumber={idNumber}
        handleIdNumberChange={handleIdNumberChange}
        voteFunction={vote}
        showButton={CanVote}
        errorMessage={errorMessage}
      />)
        :
        (<Login connectWallet={connectToMetamask} />)
      }
      </div>
  );
}





export default App;
