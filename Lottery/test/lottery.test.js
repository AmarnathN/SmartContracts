const assert =  require('assert');
const ganache =  require('ganache-cli');
const Web3 = require('web3');//constructor of Web3

require('events').EventEmitter.prototype._maxListeners = 100;
const provider = ganache.provider();
const web3 = new Web3(provider); //instance of web3
const {interface,bytecode} =  require("../compile");

let accounts;
let lottery;
let message;

beforeEach( async ()=>{
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data: bytecode})
            .send({from:accounts[0],gas: '1000000'});

});

describe ( 'Lottery Contract : ',  () =>{

    it('Delploys a Contarct ',async () =>{
      await assert.ok(lottery.options.address);

    });

    it('Allows One Player Account to enter ', async () =>{
      await lottery.methods.enterToLoterry().send({
        from : accounts[0],
        value : web3.utils.toWei('0.02','ether')
      });

      const players = await lottery.methods.getPlayers().call({
        from:accounts[0]
      });

      assert.equal(accounts[0],players[0]);
      assert.equal(1,players.length);
      console.log('List of Players : ' + players);
    });

    it('Allows Multiple Players to enter ', async () =>{
      await lottery.methods.enterToLoterry().send({
        from : accounts[0],
        value : web3.utils.toWei('0.02','ether')
      });
      await lottery.methods.enterToLoterry().send({
        from : accounts[1],
        value : web3.utils.toWei('0.02','ether')
      });
      await lottery.methods.enterToLoterry().send({
        from : accounts[2],
        value : web3.utils.toWei('0.02','ether')
      });

      const players = await lottery.methods.getPlayers().call({
        from:accounts[0]
      });

      assert.equal(accounts[0],players[0]);
      assert.equal(accounts[1],players[1]);
      assert.equal(accounts[2],players[2]);
      assert.equal(3,players.length);
      console.log('List of Players : ' + players);
    });

    it('Requires minimum amount to enter the lottery', async () => {
      try{
        await lottery.methods.enterToLoterry().send({
          from : accounts[0],
          value : web3.utils.toWei('0.01','ether')
        });
        assert(false)
      }catch(e){
        console.log('Minimum amount requirement validated');
        assert(e);
      }
    });

    it('Only Manager needs to Pick Winner', async ()=>{
      try{
        await lottery.methods.pickWinner().call({
          from: accounts[1]
        });
          assert(false)
        }catch(e){
          console.log('Only Manager Picked  validated');
          assert(e);
        }
    });

    it('Sends money to Winner and Clear the players', async ()=>{
      await lottery.methods.enterToLoterry().send({
        from : accounts[0],
        value : web3.utils.toWei('1','ether')
      });

      const iniBal = await web3.eth.getBalance(accounts[0]);

      await lottery.methods.pickWinner().send({
        from : accounts[0]
      })

      const finBal = await web3.eth.getBalance(accounts[0]);

      const diffBal = finBal -iniBal;
      console.log('the difference of Bal : ' +  diffBal.toString())
      assert(diffBal > web3.utils.toWei('0.8','ether'));

      const players = await lottery.methods.getPlayers().call({
        from:accounts[0]
      });
      console.log('List of Players : ' + players);
      assert.equal(0,players.length);

    })
});
