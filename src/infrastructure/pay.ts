import Web3 from "web3";
import { ethers } from "ethers";
import Token from "./erc20.json";

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const MULTIPLIER = 10 ** 6;
async function setup(ethereum: any) {
  const provider = new ethers.providers.Web3Provider(ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const USDCContract = new ethers.Contract(USDC, Token, signer);

  return { lts: USDCContract };
}

export async function approve(provider: any, amount: string, address: string) {
  const { lts } = await setup(provider);
  return lts.approve(address, BigInt(amount));
}

export async function transfer(provider: any, amount: number, address: string) {
  const { lts } = await setup(provider);
  return lts.transfer(address, BigInt(amount * MULTIPLIER));
}
