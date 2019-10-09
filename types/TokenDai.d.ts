import Web3 from 'web3';
import SmartContract from './SmartContract';
export declare class TokenDai extends SmartContract {
    static build(web3: Web3): Promise<TokenDai>;
    getBalance(account: string): Promise<any>;
}
export default TokenDai;
