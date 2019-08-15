import Web3 from 'web3';
import { EventOptions } from 'web3-eth-contract';
import SmartContract from './SmartContract';
export declare class UserProxyRegistry extends SmartContract {
    static build(web3: Web3): Promise<UserProxyRegistry>;
    getUserProxies(owner: string): Promise<any>;
    getAddressByProxy(options?: EventOptions): Promise<Map<string, string>>;
}
export default UserProxyRegistry;
