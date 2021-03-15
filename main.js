const SHA256 = require('crypto-js/sha256')
class Block {
	constructor(index, timestamp, data, previousHash = '')
	{
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
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
		this.difficulty = 1;
	}

	createGenesisBlock() {
		return new Block(0, "01/01/2017", "Genesis block", "0");
	}

	getLastestBlock() {
		return this.chain[this.chain.length - 1];		
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLastestBlock().hash;
		//newBlock.hash = newBlock.calculateHash();
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
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