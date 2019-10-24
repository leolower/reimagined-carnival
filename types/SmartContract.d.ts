import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { ContractArtifact } from '@makerdao-cdp-insurance/smart-contracts-abi';
interface ContractOptions {
    address: string;
    initialBlock: number;
    jsonInterface: any[];
    networkType: string;
    web3: Web3;
}
export declare abstract class SmartContract {
    protected static configure({ contractName, abi, networks: artifacts }: ContractArtifact): (web3: Web3) => Promise<ContractOptions>;
    readonly address: string;
    readonly networkType: 'main' | 'morden' | 'ropsten' | 'rinkeby' | 'kovan' | 'private';
    readonly initialBlock: number;
    readonly contract: Contract;
    readonly web3: Web3;
    protected constructor({ web3, jsonInterface, ...options }: ContractOptions);
}
export default SmartContract;
