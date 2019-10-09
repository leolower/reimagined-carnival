import BN from 'bn.js';
import Web3 from 'web3';
import { EventOptions } from 'web3-eth-contract';
import SmartContract from './SmartContract';
export interface CdpProtection {
    cdpId: number;
    activation: number;
    duration: number;
    expiration: number;
    debt: BN;
    liquidationPenalty: BN;
    owner: string;
    policy: string;
    price: BN;
}
export interface EventData {
    activation: number;
    blockNumber: number;
    cdp: number;
    owner: string;
    timestamp: number;
    debt?: BN;
    duration?: number;
    liquidationPenalty?: BN;
    policy?: string;
    price?: BN;
}
export declare class PolicyService extends SmartContract {
    static build(web3: Web3): Promise<PolicyService>;
    getActiveProtections(options?: EventOptions): Promise<CdpProtection[]>;
    getActivatedEvents(options?: EventOptions): Promise<EventData[]>;
    getChangeEvents(options?: any): Promise<EventData[]>;
    getCancellationEvents(options?: any): Promise<EventData[]>;
    getEraseEvents(options?: any): Promise<EventData[]>;
    getExecutionEvents(options?: any): Promise<EventData[]>;
    protectionPrice(cdpId: number, debt: number, duration?: number): Promise<any>;
    getAvailableFunds(): Promise<any>;
}
export default PolicyService;
