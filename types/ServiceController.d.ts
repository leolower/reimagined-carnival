import Web3 from 'web3';
import SmartContract from './SmartContract';
declare class ServiceController extends SmartContract {
    static build(web3: Web3): Promise<ServiceController>;
    getServiceAddress(service: string): Promise<any>;
}
export default ServiceController;
