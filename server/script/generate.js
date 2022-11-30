const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex } = require('ethereum-cryptography/utils');

const getAddress = (publicKey) => {
  const pre = keccak256(publicKey.slice(1));

  return pre.slice(pre.length - 20);
};

const privateKey = secp.utils.randomPrivateKey();

console.log('privateKey', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

console.log('publicKey', toHex(getAddress(publicKey)));
