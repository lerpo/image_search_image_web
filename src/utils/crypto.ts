import JSEncrypt from 'jsencrypt';

export function encrypt(publicKey: string, value) {
  const encryptor = new JSEncrypt();

  encryptor.setPublicKey(publicKey);

  return encryptor.encrypt(value);
}
