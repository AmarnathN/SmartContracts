const HDWalletProvider =  require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode} = require('./compile');


const provider =  new HDWalletProvider(
  'miracle stick decide artefact unfair tribe tornado scan bacon erupt sorry goddess',
  'https://rinkeby.infura.io/Q7L6RygY2cWMnkluJIbi'
);

const web3 =  new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attenting to deploy from account ', accounts[0]);

  const contractReturn = await new web3.eth.Contract(JSON.parse(interface))
                          .deploy({data: '0x'+bytecode})
                          .send({from:accounts[0],gas:'1000000'})

  console.log('contract deployed to :',contractReturn.options.address);


};

deploy();
