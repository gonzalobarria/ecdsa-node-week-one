import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

const hashMessage = (message) => keccak256(utf8ToBytes(message));

const getAddressHex = (publicKey) => {
  const pre = keccak256(publicKey.slice(1));

  return pre.slice(pre.length - 20);
};

export const signMessage = async (msg, privateKey) =>
  await secp.sign(hashMessage(JSON.stringify(msg)), privateKey, {
    recovered: true,
  });

export const getAddress = (privateKey) =>
  toHex(getAddressHex(secp.getPublicKey(privateKey)));
