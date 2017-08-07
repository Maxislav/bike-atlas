
import * as aesjs  from "aes-js";


/*
var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
var text = 'Text may be any length you wish, no padding is required.';
var textBytes = aesjs.utils.utf8.toBytes(text);

// The counter is optional, and if omitted will begin at 1
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var encryptedBytes = aesCtr.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
console.log(encryptedHex);
// "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
//  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

// When ready to decrypt the hex string, convert it back to bytes
var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

// The counter mode of operation maintains internal state, so to
// decrypt a new instance must be instantiated.
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var decryptedBytes = aesCtr.decrypt(encryptedBytes);

// Convert our bytes back into text
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
console.log(decryptedText);
// "Text may be any length you wish, no padding is required."

*/
export class Aes{

    key: Array<number>;
    constructor(len: number){
        this.key = this.geyGen(len);
    }


    encodeTextToByte(text:string): Uint8Array{
        const textBytes = aesjs.utils.utf8.toBytes(text); //зашили в байты
        const aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(5));
        return aesCtr.encrypt(textBytes); //зашифровали байты
    }

    encodeByteToByte(textBytes: Uint8Array): Uint8Array{
        const aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(5));
        return aesCtr.encrypt(textBytes)
    }

    decodeByteToText(encryptedBytes: Uint8Array): string{
        const aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(5));
        const decryptedBytes = aesCtr.decrypt(encryptedBytes);
        return aesjs.utils.utf8.fromBytes(decryptedBytes);
    }

    decodeByteToByte(encryptedBytes: Uint8Array): Uint8Array{
        const aesCtr = new aesjs.ModeOfOperation.ctr(this.key, new aesjs.Counter(5));
        return aesCtr.decrypt(encryptedBytes);
    }


    private geyGen(len: number):Array<number>{
        const key = [];
        for(let i=0; i<len; i++){
            key.push(this.getRandom(0,9,true))
        }
        return key;
    }

    private getRandom(min:number, max:number, int: boolean){
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = Math.round(rand)
        }
        return rand;
    }


}