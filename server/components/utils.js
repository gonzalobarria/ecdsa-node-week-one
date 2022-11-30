const secp = require('ethereum-cryptography/secp256k1');
const { toHex, utf8ToBytes } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

const hashMessage = (message) => keccak256(utf8ToBytes(message));

const getAddressHex = (publicKey) => {
  const pre = keccak256(publicKey.slice(1));

  return pre.slice(pre.length - 20);
};

exports.signMessage = async (msg, privateKey) =>
  await secp.sign(hashMessage(JSON.stringify(msg)), privateKey, {
    recovered: true,
  });

exports.getAddress = (publicKey) => toHex(getAddressHex(publicKey));

exports.recoverKey = async (message, signature, recoveryBit) => {
  const hex = hashMessage(message);

  return secp.recoverPublicKey(hex, signature, recoveryBit);
};
