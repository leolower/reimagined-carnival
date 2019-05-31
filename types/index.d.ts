export * from './PolicyService';

declare module '@makerdao-cdp-insurance/smart-contracts-abi' {
  interface ContractArtifact {
    contractName: string;
    abi: any[];
    networks: {
      [networkId: string]: {
        address: string;
        transactionHash: string;
        // ...
      };
    };
    // ...
  }
}
