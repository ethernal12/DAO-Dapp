//const web3 = require('web3');
const { assert } = require("chai");
const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { web3 } = require("@openzeppelin/test-helpers/src/setup");



require("chai")
    .use(require("chai-as-promised"))
    .should()

const CF = artifacts.require('CrowdFunding')


contract("voting DApp", (accounts) => {
    const [admin, voter1, voter2, voter3, recipient] = [accounts[0], accounts[1], accounts[2], accounts[3], accounts[4]];
    const deadline = 1000;
    const goal = web3.utils.toBN(30000000000000000).toString();
    const minCon = web3.utils.toBN(10000000000000000).toString();


    //spending request
    const title = "new office";
    const description = "new office";
    const recepient_address = recipient;
    const value = web3.utils.toBN(30000000000000000).toString();;

    before(async () => {
        cf = await CF.new(deadline,
            web3.utils.toBN(goal).toString(),
            web3.utils.toBN(minCon).toString(), { from: admin })


    })
    it("can contribute", async () => {
        const contribution = web3.utils.toBN(10000000000000000).toString();

         const gasPrice = web3.utils.toBN(20000000000)//wei => 20 gwei
        // console.log( web3.utils.toBN(gasPrice))

        let balanceBefore1 = await web3.eth.getBalance(voter1);
        let balanceBefore2 = await web3.eth.getBalance(voter2);
        let balanceBefore3 = await web3.eth.getBalance(voter3);

        const tx1 = await cf.contribute({ from: voter1, value: contribution, gasPrice:gasPrice}) ;
        const tx2 = await cf.contribute({ from: voter2, value: contribution, gasPrice:gasPrice}) ;

        const tx3 = await cf.contribute({ from: voter3, value: contribution, gasPrice:gasPrice}) ;

        const gasUsed1 = web3.utils.toBN(tx1.receipt.gasUsed * gasPrice);
        const gasUsed2 = web3.utils.toBN(tx2.receipt.gasUsed * gasPrice);
        const gasUsed3 = web3.utils.toBN(tx3.receipt.gasUsed * gasPrice);

       


        let balanceAfter1 = await web3.eth.getBalance(voter1);
        let balanceAfter2 = await web3.eth.getBalance(voter2);
        let balanceAfter3 = await web3.eth.getBalance(voter3);

        const conValue = await cf.contributors(voter1);
        const conValue2 = await cf.contributors(voter2);
        const conValue3 = await cf.contributors(voter3);

        assert.equal(web3.utils.toBN(balanceBefore1 - balanceAfter1 - gasUsed1 - 2048).toString(), contribution)
        assert.equal(web3.utils.toBN(balanceBefore2 - balanceAfter2 - gasUsed2 - 2048).toString(), contribution)
        assert.equal(web3.utils.toBN(balanceBefore3 - balanceAfter3 - gasUsed3 - 2048).toString(), contribution)

        assert.equal(conValue.toString(), 10000000000000000)
        assert.equal(conValue2.toString(), 10000000000000000)
        assert.equal(conValue3.toString(), 10000000000000000)

    })

    it("only admin can create new spending request", async () => {
        await expectRevert(
            cf.spendingRequest(title, description, recepient_address, value, { from: voter1 }),
            "Only admin!"
        )

    })
    it("create spending request", async () => {
        await cf.spendingRequest(title, description, recepient_address, value, { from: admin })

        const spendingRequest = await cf.spendingRequests(0)


        assert.equal(spendingRequest[1].toString(), title);
        assert.equal(spendingRequest[2].toString(), description);
        assert.equal(spendingRequest[3].toString(), value);
        assert.equal(spendingRequest[4].toString(), recepient_address);
        assert.equal(spendingRequest[5].toString(), 0);
        assert.equal(spendingRequest[6], false);
    })

    it("only contributors can vote for spending request", async () => {
        await expectRevert(
            cf.vote(0, { from: recipient }),
            "No right to vote!"

        )

    })

    it("can vote", async () => {
        await cf.vote(0, { from: voter1 });
        await cf.vote(0, { from: voter2 });
        await cf.vote(0, { from: voter3 });

        const vote1 = await cf.getVotersBool(0, voter1)
        const vote2 = await cf.getVotersBool(0, voter2)
        const vote3 = await cf.getVotersBool(0, voter3)

        assert.equal(vote1, true);
        assert.equal(vote2, true);
        assert.equal(vote3, true);

    })
    it("can only vote once", async () => {
     await expectRevert(cf.vote(0, { from: voter1 }),
     "You have allready voted for this spending request!"
     
     
     )

    })

    it("only admin can transfer request funds", async () => {

        await expectRevert(
            cf.transferRequestFunds(0, { from: voter1 }),
            "Only admin!"

        )

    })

    it(" can transfer request funds", async () => {
        let balanceBefore = await web3.eth.getBalance(recipient);

        await cf.transferRequestFunds(0, { from: admin });

        let balanceAfter = await web3.eth.getBalance(recipient);


        assert.equal((balanceAfter - balanceBefore), value);
    })

})