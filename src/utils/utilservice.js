// import CryptoJS from 'crypto-js';

// const SECRET_KEY = '5891239269021817'; 

// export const encryptData = (data) => {
//   const stringData = JSON.stringify(data);
//   return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
// };

// export const decryptData = (cipherText) => {
//   const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
//   const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
//   return decryptedData;
// };

import CryptoJS from 'crypto-js';

// You should store your key securely (consider environment variables)
const ENCRYPTION_KEY = '5891239269021817'; // Replace with your actual key

export const encryptData = (data) => {
  try {
    const _key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
    const _iv = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
    
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data), 
      _key, 
      {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decryptData = (data) => {
  try {
    const _key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
    const _iv = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);

    const decryptedBytes = CryptoJS.AES.decrypt(
      data, 
      _key, 
      {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      throw new Error('Failed to decrypt data or empty result');
    }

    return JSON.parse(decryptedText);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};