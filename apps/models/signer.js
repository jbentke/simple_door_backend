var keythereum = require('keythereum')
var Tx = require('ethereumjs-tx');
var Web3 = require('web3')
var web3 = new Web3('http://localhost:8545')

//keyfile for the faucet account
var keyFile = {
  "address": "00012bb183bbb3d7c3b78bc80cacb3f6983500d4",
  "crypto": {
    "cipher": "aes-128-ctr",
    "cipherparams": {
      "iv": "76c209a8dec577b24473b032d7fc5e4b"
    },
    "ciphertext": "2471a7b08a29f012bc4695ed33a44ea9d5d64c24e52defb2e16c84a97a7b1195",
    "kdf": "pbkdf2",
    "kdfparams": {
      "c": 10240,
      "dklen": 32,
      "prf": "hmac-sha256",
      "salt": "9b7267957d9200c6e1daf0f37b5032a0462cdd8ccfd2e1e25fd4dfa2a9c71d53"
    },
    "mac": "cae6921ccad6d38bd284aaf8fd93d784eccc678106d274154393687798c3ee5f"
  },
  "id": "150881b2-f505-e762-1d95-6c89dd6869a3",
  "meta": "{\"description\":\"\",\"passwordHint\":\"\",\"timestamp\":1517223608799}",
  "name": "",
  "version": 3
}

var contract = new web3.eth.Contract([{
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "address"
  }],
  "name": "permission",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "place",
    "type": "uint256"
  }],
  "name": "open",
  "outputs": [],
  "payable": false,
  "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "owner",
  "outputs": [{
    "name": "",
    "type": "address"
  }],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "employee",
    "type": "address"
  }],
  "name": "removeEmployee",
  "outputs": [],
  "payable": false,
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "employee",
    "type": "address"
  }],
  "name": "addEmployee",
  "outputs": [],
  "payable": false,
  "type": "function"
}, {
  "inputs": [],
  "payable": false,
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "name": "from",
    "type": "address"
  }, {
    "indexed": false,
    "name": "timestamp",
    "type": "uint256"
  }, {
    "indexed": false,
    "name": "place",
    "type": "uint256"
  }],
  "name": "Opened",
  "type": "event"
}], '0x23a1f700594f3d9be3fE4ad159F9Bd4006Fc9BdD');

var openDoorDataPart = contract.open.getData(999);

//private key from faucet account needed to sign transactions
var privateKey = keythereum.recover("thisisthepasswordforthedoor", keyFile)

module.exports.signAndSend = async function () {

  var nonce;
  nonce = await web3.eth.getTransactionCount('0x00012bB183BBb3d7C3B78bc80CacB3f6983500d4')
  var rawTx = {
    nonce: web3.utils.toHex(nonce),
    value: 0x0,
    gasPrice: web3.utils.toHex(20000000000),
    gasLimit: web3.utils.toHex(100000),
    data: openDoorDataPart,
    to: '0x23a1f700594f3d9be3fE4ad159F9Bd4006Fc9BdD',
    from: '0x00012bB183BBb3d7C3B78bc80CacB3f6983500d4'
  }

  var tx = new Tx(rawTx);
  tx.sign(privateKey);

  var serializedTx = tx.serialize();

  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))

}