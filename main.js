const { Blockchain } = require('./blockchain');
const { Transaction } = require('./transaction');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); 

const myKey = ec.keyFromPrivate('47295e73fa716e5cf12071804d5ac4361f335e0b384ffe941dda6480c20e6e77');
const walletAddress = myKey.getPublic('hex');

let jyoCoin = new Blockchain();
const tx1 = new Transaction(walletAddress, 'address2', 10);
tx1.signTransaction(myKey);
jyoCoin.addTransaction(tx1);


console.log('\n Start the mining....');
jyoCoin.minePendingTransactions(walletAddress);
console.log('\n Balance of jyoti is ', jyoCoin.getBalanceOfAddress(walletAddress));


/*
let jyoCoin = new Blockchain();

console.log('Mining block 1....');
jyoCoin.addBlock(new Block(1, '10/07/2017', { amount: 4 }));

console.log('Mining block 2....');
jyoCoin.addBlock(new Block(2, '11/07/2017', { amount: 14 }));

/*console.log('Is blockchain valid ?', jyoCoin.isChainValid());
console.log(JSON.stringify(jyoCoin, null, 4));
*/

