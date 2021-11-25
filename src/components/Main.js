import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table'
import React, { Component } from 'react'
import "../App.css"
import Identicon from "identicon.js"
import Moment from 'react-moment';



const BigNumber = require('bignumber.js');
const web3 = require('web3');
Moment.globalFormat = "MMMM Do YYYY, h:mm:ss a";


export class Main extends Component {
    constructor(props) {

        super(props)
        this.state = {

            voted: [],
            canFinalizeRequest: false,
            conNumber: 3

        }

    }


    async noOfVoters(index_) {

        const noOfVoters = await this.props.contract.methods
            .noOfVoters_(index_)
            .call()


        this.setState({
            voted: [...this.state.voted, noOfVoters]
        })
        console.log(this.state.voted)


    }



    async contribute(e) {

        e.preventDefault()
        if (this.props.requestDate < this.props.currentDateTime) {

            window.alert("Deadline has ended, contribution not possible anymore!")
        }
        else {
            await this.props.contract.methods
                .contribute()
                .send({ from: this.props.accounts[0], value: web3.utils.toBN(this.props.minCon, "ether") })
                .on('confirmation', (confirmationNumber) => {
                    if (confirmationNumber === this.state.conNumber) {

                        window.alert("Contribution successful!")
                        window.location.reload(true);
                    }
                })
                .on("error", console.error);
        }

        if (this.props.voted) {
            window.alert("You have allready voted, hence can`t contribute more!")

        }
       

    }

    async contributeMore(e) {
        e.preventDefault()
        const contribute = e.target.elements[1].value;
        const toWei = web3.utils.toWei(contribute, "ether")

        if (this.props.requestDate < this.props.currentDateTime) {

            window.alert("Deadline has ended, contribution not possible anymore!")
        } else {
            await this.props.contract.methods
                .contribute()
                .send({ from: this.props.accounts[0], value: toWei })
                .on('confirmation', (confirmationNumber) => {
                    if (confirmationNumber === this.state.conNumber) {

                        window.alert("Contribution successful!")
                        window.location.reload(true);
                    }
                })
                .on("error", console.error);

        }



    }

    async vote(e, id) {
        e.preventDefault()

        console.log("voting")
        this.props.contract.methods
            .vote(id)
            .send({ from: this.props.accounts[0] })
            .on('receipt', receipt => {
                window.alert("Sucessfully voted!")
                window.location.reload(true);
            })
            .on("error", console.error);


    }

    async createSpendingRequest(e) {

        e.preventDefault()
        const title = e.target.elements[0].value;
        const description = e.target.elements[1].value;
        const recipient = e.target.elements[2].value;
        const value = e.target.elements[3].value;
        const BN = new BigNumber(value);


        await this.props.contract.methods
            .spendingRequest(title.toString(), description.toString(), recipient, BN)
            .send({ from: this.props.admin })
            .on('receipt', receipt => {

                window.location.reload(true);
            })

            .on("error", console.error);

    }

    async finalizeRequest(e, index) {
        const proxy = []
        e.preventDefault()
        if (this.props.goal >= this.props.contractBalance)
            await this.props.contract.methods
                .transferRequestFunds(index)
                .send({ from: this.props.accounts[0] })
                .on('confirmation', (confirmationNumber) => {
                    if (confirmationNumber === this.state.conNumber) {
                        this.props.
                            window.alert("Request finalized!")
                        window.location.reload(true);

                    }
                })

                .on("error", console.error);

    }

    async retrieveFunds(e) {
        e.preventDefault()
        if (this.props.goal > this.props.contractBalance && this.props.requestDate < this.props.currentDateTime && this.props.userBalance > 0) {
            await this.props.contract.methods
                .getRefund()
                .send({ from: this.props.accounts[0] })
                .on('confirmation', (confirmationNumber) => {
                    if (confirmationNumber === this.state.conNumber) {

                        window.alert("Refund successful!")
                        window.location.reload(true);
                    }
                })
                .on("error", console.error);
        }
        else {

            window.alert("Not possible to retrieve funds!")
        }

    }

    render() {


        return (


            <div className="card"  >

                <div className="flex-container">
                    {this.props.requestDate < this.props.currentDateTime ? <h4>The deadline has expired</h4> : (
                        <>
                            <h2>The crowdfunding deadline end`s at : </h2> <h4><Moment unix>{this.props.requestDate}</Moment> /  UTC + 1</h4>
                        </>
                    )}
                </div>

                <div className="flex-container">

                    {this.props.accounts[0].toLowerCase() === this.props.admin.toLowerCase() ? (
                        <div className="card-body">

                            <>

                                <label className="float-left" ><h1>Create spending request</h1> </label>
                                <form onSubmit={e => this.createSpendingRequest(e)}>


                                    <div className="form-group">
                                        <label className="float-left" ><h2>Request title</h2> </label>
                                        <input type="text" className="form-control" id="name" style={{ width: "300px" }} />
                                    </div>

                                    <div className="form-group">
                                        <label className="float-left" ><h2>Request description</h2> </label>
                                        <input type="text" className="form-control" id="name" style={{ width: "300px" }} />
                                    </div>
                                    <div className="form-group">
                                        <label className="float-left" ><h2>Request recipient</h2> </label>
                                        <input type="text" className="form-control" id="name" style={{ width: "300px" }} />
                                    </div>
                                    <div className="form-group">
                                        <label className="float-left" ><h2>Request value</h2> </label>
                                        <input type="text" className="form-control" id="name" style={{ width: "300px" }} />
                                    </div>

                                    <button style={{ color: "white", background: "#1a5e5b" }} type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </>
                        </div>

                    ) : null}


                    <div className="flex-container">


                        {this.props.accounts[0].toLowerCase() !== this.props.admin.toLowerCase() ? (
                            <div className="card-body">

                                <>

                                    <label className="float-left" ><h3>Min contribution is :{web3.utils.fromWei(this.props.minCon, "ether")} ETH</h3> </label>
                                    <form onSubmit={e => this.contribute(e)}>

                                        <button style={{ color: "white", background: "#1a5e5b" }} type="submit" className="btn btn-primary">Contribute {web3.utils.fromWei(this.props.minCon, "ether")} ETH</button>

                                    </form>

                                    <form onSubmit={e => this.contributeMore(e)}>

                                        <button style={{ color: "white", background: "#1a5e5b" }} type="submit" className="btn btn-primary">Contribute more: </button>
                                        <input style={{ width: "70px" }} type="text" className="form-control" id="contributors" />

                                    </form>

                                </>
                            </div>
                        ) : null}

                        {this.props.accounts[0].toLowerCase() !== this.props.admin.toLowerCase() ? (
                            <div className="card-body">

                                <>
                                    <h1>Retreive funds:</h1>

                                    <form onSubmit={e => this.retrieveFunds(e)}>

                                        <button style={{ color: "white", background: "#1a5e5b" }} type="submit" className="btn btn-primary">Retrive your funds</button>

                                    </form>


                                </>
                            </div>
                        ) : null}

                    </div>


                    <div className="flex-container">
                        <div className="card-body">


                            <label className="float-left" ><h1>Accounts and contracts info:</h1> </label>
                            <ul>
                                <li>
                                    <label className="float-left" ><h2>Current admin: </h2> <h3><img
                                        className="ml-2"
                                        width="30"
                                        height="30"
                                        src={`data:image/png;base64,${new Identicon(this.props.admin, 30).toString()}`}

                                    ></img>{this.props.admin} </h3></label>
                                </li>

                                <li>
                                    <label className="float-left" ><h2>Current active account: </h2> <h3><img
                                        className="ml-2"
                                        width="30"
                                        height="30"
                                        src={`data:image/png;base64,${new Identicon(this.props.accounts[0], 30).toString()}`}

                                    ></img>{this.props.accounts} </h3></label>
                                </li>

                                <li>
                                    <label className="float-left" ><h2>Contract address:</h2> <h3><img
                                        className="ml-2"
                                        width="30"
                                        height="30"
                                        src={`data:image/png;base64,${new Identicon(this.props.contractAddress, 30).toString()}`}

                                    ></img>{this.props.contractAddress}</h3> </label>
                                </li>

                            </ul>
                        </div>
                    </div>
                    <div className="flex-container">
                        <div className="card-body">

                            <h1>Contract funding: </h1>
                            <h2>Contract balance:</h2>
                            <li>

                                <label className="float-left" > <h3>{web3.utils.fromWei(this.props.contractBalance, "ether")} ETH</h3>  </label>
                            </li>
                            <h2>Goal:</h2>
                            {
                                this.props.goal === this.props.contractBalance ? <p>Goal reached !</p> :
                                    <li>
                                        <label className="float-left" > <h3>{web3.utils.fromWei(this.props.goal, "ether")} ETH</h3>  </label>
                                    </li>
                            }
                            <h1>Contributions: </h1>
                            <li>
                                <label className="float-left" ><h3>{web3.utils.fromWei(this.props.contractBalance, "ether")} ETH</h3>  </label>
                            </li>

                            <h2>Your contribution:</h2>
                            {this.props.accounts[0] === this.props.admin ? "Admin can`t contribute"
                                :
                                (
                                    <li>
                                        <label className="float-left" > <h3>{web3.utils.fromWei(this.props.userBalance, "ether")} ETH</h3>  </label>
                                    </li>
                                )}

                        </div>

                    </div>

                </div>


                <div className="flex-container">


                    <div className="card-body">


                        <label className="float-left" ><h1>Spending requests</h1> </label>

                        <Table striped bordered hover size="sm">
                            <thead >
                                <tr style={{ color: "black" }}>

                                    <th >Id#</th>
                                    <th >Request title</th>
                                    <th >Description</th>
                                    <th >Value</th>
                                    <th >Recipient</th>
                                    <th >#of votes / #of contributors </th>

                                    <th >Vote</th>
                                    <th >Finalize request</th>
                                </tr>

                            </thead>

                            <tbody>

                                {this.props.table.slice(0, this.props.table.length).map((item, index) => {
                                    return (

                                        <tr key={index} >

                                            <td>{item[0]}</td>
                                            <td>{item[1]}</td>
                                            <td>{item[2]}</td>
                                            <td>{web3.utils.fromWei(String(item[3]))} ETH</td>
                                            <td>{item[4]}</td>
                                            <td>{item[5]} / {this.props.noOfContributors}</td>


                                            <td>
                                                {
                                                    this.props.voted ? <h5>You have allready voted!</h5> :
                                                        this.props.accounts[0] === this.props.admin ? <h5> Admin cannot vote!</h5> :
                                                            this.props.userBalance == 0 ? <h5> Must contribute to vote!</h5> :
                                                                (


                                                                    <form onSubmit={e => this.vote(e, index)}>
                                                                        <div className="form-group">
                                                                            <label htmlFor="choice">Choice</label>
                                                                            <select className="form-control" id="choice">

                                                                                <option
                                                                                    key={index}
                                                                                    value={index}>
                                                                                    ID#{item[0]}
                                                                                </option>

                                                                            </select>
                                                                        </div>
                                                                        <button
                                                                            style={{ color: "white", background: "#1a5e5b" }}
                                                                            type="submit"
                                                                            className="btn btn-primary">
                                                                            Vote
                                                                        </button>
                                                                    </form>

                                                                )}
                                            </td>

                                            {item[6].toString() === "true" ? <h5 >Allready finalized!</h5> :
                                                this.props.accounts[0] !== this.props.admin ? <h5>Only admin!!</h5> :

                                                    !(this.props.goal <= this.props.contractBalance) ? <h5 >The goal not reached yet!</h5> :
                                                        item[5] < (this.props.noOfContributors / 2 || item[5] == 0) ? <h5 >Not enough votes for this request yet!</h5> :
                                                            (
                                                                <td >


                                                                    <form onSubmit={e => this.finalizeRequest(e, index)}>
                                                                        <button
                                                                            style={{ color: "white", background: "#1a5e5b" }}
                                                                            type="submit"
                                                                            className="btn btn-primary">
                                                                            Finalize request
                                                                        </button>

                                                                    </form>


                                                                </td>
                                                            )}
                                        </tr>
                                    )
                                })}
                            </tbody>

                        </Table>

                    </div>

                </div>
            </div>

        )
    }
}

export default Main