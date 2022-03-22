import Web3 from 'web3';

// Web 3 connection
const web3 = window.ethereum ? new Web3(window.ethereum) : null; 
console.log("@@myweb3",web3)
export default web3;