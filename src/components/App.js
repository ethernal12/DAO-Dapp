import React, { useState, useEffect } from "react";
import CrowdFunding from "../build_ABIS/CrowdFunding.json";
import { getWeb3 } from "./Utils.js";
import Main from './Main'
import ParticleSettings from "./ParticleSettings";

const BigNumber = require('bignumber.js');
function App() {

  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [admin, setAdmin] = useState(undefined);
  const [contractBalance, setBalance] = useState(undefined);
  const [contractAddress, setAddress] = useState(undefined);
  const [userBalance, setUserBalance] = useState(undefined);
  const [minCon, setMinCon] = useState("");
  const [id, setId] = useState(undefined);
  const [voted, setVoted] = useState(undefined);
  const [table, setTable] = useState([]);
  const [requestCompleted, setRequestComplete] = useState([])
  const [deadline, setDeadline] = useState("")
  const [requestDate, setRequestDate] = useState(undefined)

  const [raisedAmount, setRaisedAmount] = useState()
  const [goal, setGoal] = useState("")
  const [noOfContributers, setNoOfContributers] = useState(undefined)
  const [currentDateTime, setCurrentDateTime] = useState(undefined)
  const [noOfVotes, setNoOfVotes] = useState([]);


  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CrowdFunding.networks[networkId];
      const contract = new web3.eth.Contract(
        CrowdFunding.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const admin = await contract.methods
        .admin()
        .call();

      const balance = await contract.methods
        .getContractBalance()
        .call();

      const userBalance = await contract.methods
        .contributors(accounts[0])
        .call();
      console.log(userBalance)

      const contractBalance = await contract.methods
        .getContractBalance()
        .call()


      const minCon = await contract.methods
        .minContribution()
        .call()

      const id = await contract.methods
        .id()
        .call()

      const voted = await contract.methods
        .hasVoted(accounts[0])
        .call()
      setVoted(voted);

      const spendingRequest = []


      for (let i = 0; i < id; i++) {

        await contract.methods
          .getSpendingRequest(i)
          .call()
          .then((test) => {
            spendingRequest.push(test)

          })

        setTable(spendingRequest);

      }

      const deadline = await contract.methods
        .deadline_()
        .call()

      let requestDate = await contract.methods
        .deadline()
        .call()
      console.log(requestDate)
      let toNum = Number(requestDate)
      let toUTC = (toNum + 28800) // UTC + 1 (+ 9 hours)

      const curDateTime = Math.round(new Date().getTime() / 1000).toString()
      console.log(curDateTime)

      const goal = await contract.methods
        .goal_()
        .call()

      const noOfContributors = await contract.methods
        .noOfContributors()
        .call()


      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setAdmin(admin);
      setBalance(balance);
      setAddress(deployedNetwork.address);
      setUserBalance(userBalance);
      setMinCon(minCon);
      setId(id);
      setDeadline(deadline)
      setGoal(goal)
      setNoOfContributers(noOfContributors)
      setRequestDate(toUTC)
      setCurrentDateTime(curDateTime)
    }
    init();
    window.ethereum.on('accountsChanged', accounts => {

      setAccounts(accounts);
      window.location.reload(true);

    });
  }, []);


  const isReady = () => {

    return (

      typeof contract !== 'undefined'
      && typeof web3 !== 'undefined'
      && typeof accounts !== 'undefined'
      && typeof admin !== 'undefined'
      && typeof userBalance !== 'undefined'

    );
  }


  useEffect(() => {
    if (isReady()) {

    }
  }, [accounts, contract, web3]);


  if (!isReady()) {
    return <div>Loading...</div>;

  }


  return (

    <div className="container">
      <ParticleSettings/>

      {<Main
        accounts={accounts}
        contract={contract}
        admin={admin}
        minCon={minCon}
        contractAddress={contractAddress}
        contractBalance={contractBalance}
        userBalance={userBalance}
        id={id}
        voted={voted}
        table={table}
        deadline={deadline}
        rasideAmount={raisedAmount}
        goal={goal}
        noOfContributors={noOfContributers}
        requestDate={requestDate}
        currentDateTime={currentDateTime}

      />}


    </div>

  )
};

export default App;
