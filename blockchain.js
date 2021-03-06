const { Block } = require('./block');
const { Transaction } = require('./transaction');

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

	/*createTransaction(transaction) {
		this.pendingTransctions.push(transaction);
	}
	*/

	addTransaction(transaction) {
		if (!transaction.fromAddress || !transaction.toAddress) {
			throw new Error('Transaction must include from and to address');
		}

		if (!transaction.isValid()) {
			throw new Error('Canot add invalid transcation to chain');
		}			

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

			if (!currentBlock.hasValidTransactions()) {
				return false;
			}			

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

module.exports.Blockchain = Blockchain;