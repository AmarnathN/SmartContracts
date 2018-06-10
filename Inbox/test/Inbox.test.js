const assert =  require('assert');
const ganache =  require('ganache-cli');
const Web3 = require('web3');//constructor of Web3

require('events').EventEmitter.prototype._maxListeners = 100;
const provider = ganache.provider();
const web3 = new Web3(provider); //instance of web3
const {interface,bytecode} =  require("../compile");

let accounts;
let inbox;
let message;
beforeEach(async () => {

  //to fet the accounts from ganache-cli
    accounts = await web3.eth.getAccounts();

  //deploy contact using one of the accounts
inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode , arguments:['Hi There']})
        .send({from:accounts[0],gas: '1000000'});

inbox.setProvider(provider);


});

describe('Inbox' , () => {
  it('Deploys Contracts',()=>{
    console.log(inbox.options.address);
    assert.ok(inbox.options.address);
  });

  it('Has a default message ',async ()=>{

     message = await inbox.methods.getMessage().call();
      console.log(message);
      assert.equal(message,'Hi There');
    });


  it('Has a set new message',async ()=>{
    const sendReturn = await inbox.methods.setMessage("I am chnaged").send({from: accounts[0]});
    console.log(sendReturn);
    console.log(sendReturn.transactionHash);
    message = await inbox.methods.getMessage().call();
      console.log(message);
      assert.equal(message,'I am chnaged');
    });
});
