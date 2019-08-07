import Web3 from 'web3';
import SmartContract from './SmartContract';
export declare class UserProxyRegistry extends SmartContract {
    static build(web3: Web3): Promise<UserProxyRegistry>;
    getUserProxies(owner: string): Promise<any>;
}
export default UserProxyRegistry;
