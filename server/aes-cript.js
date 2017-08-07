const aesjs = require("aes-js");


class Aesjs{
	constructor(len){
		this.key = this.geyGen(len);
	}


	encodeTextToByte(text){
		const textBytes = aesjs.utils.utf8.toBytes(text); //зашили в байты
		const aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(5));
		return aesCtr.encrypt(textBytes); //зашифровали байты
	}

	encodeByteToByte(textBytes){
		const aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(5));
		return aesCtr.encrypt(textBytes)
	}

	decodeByteToText(encryptedBytes){
		const aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(5));
		const decryptedBytes = aesCtr.decrypt(encryptedBytes);
		return aesjs.utils.utf8.fromBytes(decryptedBytes);
	}

	decodeByteToByte(encryptedBytes){
		const aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(5));
		return aesCtr.decrypt(encryptedBytes);
	}


	geyGen(len){
		const key = [];
		for(let i=0; i<len; i++){
			key.push(this.getRandom(0,9,true))
		}
		return key;
	}

	getRandom(min, max, int){
		let rand = min + Math.random() * (max - min);
		if (int) {
			rand = Math.round(rand)
		}
		return rand;
	}
}

module.exports = Aesjs



