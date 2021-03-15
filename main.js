const SHA256 = require('crypto-js/sha256')

class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block {
	constructor(timestamp, transactions, previousHash = '')
	{
		this.timestamp = timestamp;
		this.transactions = transactions || [];
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
		this.nonce = 0;
	}

	calculateHash() {
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
	}	

	mineBlock(difficulty) {
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0"))
		{
			this.nonc++;
			this.hash = this.calculateHash();
		}
		console.log("Block mined:" + this.hash);
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 0;
		this.pendingTransctions = [];
		this.miningReward = 100;
	}

	createGenesisBlock() {
		return new Block(0, "01/01/2017", "Genesis block", "0");
	}

	getLastestBlock() {
		return this.chain[this.chain.length - 1];		
	}

	/*addBlock(newBlock) {
		newBlock.previousHash = this.getLastestBlock().hash;
		//newBlock.hash = newBlock.calculateHash();
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}
	*/
	minePendingTransactions(miningRewardAddress) {
		let block = new Block(Date.now(), this.pendingTransctions);
		block.mineBlock(this.difficulty);

		console.log('Block successfully mined !');
		this.chain.push(block);

		this.pendingTransctions = [
			new Transaction(null, miningRewardAddress, this.miningReward)
		];
	}

	createTransaction(transaction) {
		this.pendingTransctions.push(transaction);
	}

	getBalanceOfAddress(address) {
		let balance = 0;
		for (const block of this.chain) {
			for (const trans of block.transactions) {
				if (trans.fromAddress === address) {
					balance -= trans.amount;
				}

				if (trans.toAddress === address) {
					balance += trans.amount;
				}
			}	
		}

		return balance;
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++)
		{
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (currentBlock.hash !== currentBlock.calculateHash())
			{
				return false;
			}

			if (currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}
		return true;
	}
}


/*
let jyoCoin = new Blockchain();

console.log('Mining block 1....');
jyoCoin.addBlock(new Block(1, '10/07/2017', { amount: 4 }));

console.log('Mining block 2....');
jyoCoin.addBlock(new Block(2, '11/07/2017', { amount: 14 }));

/*console.log('Is blockchain valid ?', jyoCoin.isChainValid());
console.log(JSON.stringify(jyoCoin, null, 4));
*/


let jyoCoin = new Blockchain();
jyoCoin.createTransaction(new Transaction('address1', 'address2', 100));
jyoCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Start the mining....');
jyoCoin.minePendingTransactions('jyoti-address');
console.log('\n Balance of jyoti is ', jyoCoin.getBalanceOfAddress('jyoti-address'));

console.log('\n Start the mining again....');
jyoCoin.minePendingTransactions('jyoti-address');
console.log('\n Balance of jyoti is ', jyoCoin.getBalanceOfAddress('jyoti-address'));
