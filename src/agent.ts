import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";
import {BOT_DEPLOYER_FUNC, FORTA_ADDR, NETHERMIND_ADDR} from './constants'

export function provideHandleTransaction(botDeployerFunc: string, fortaAddr:string, nethermindAddr:string): HandleTransaction {
  return async (txEvent: TransactionEvent) => {  
    const findings: Finding[] = [];
    if (txEvent.from?.toLowerCase() != nethermindAddr?.toLowerCase()) {
      return findings;
    }
    const txns = txEvent.filterFunction(botDeployerFunc, fortaAddr);

    txns.forEach((singleTxEvent) => {
      const {agentId, owner, metadata} = singleTxEvent.args;

      findings.push(
        Finding.fromObject({
          name: "Forta Bot Deployed",
          description: "A Forta bot was just deployed from the Nethermind deployer",
          alertId: "FAD-1",
          protocol: "Nethermind",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            "agentId": agentId.toString(),
            "owner": owner,
            "metadata": metadata,
            "chainId": "137"
          },
        })
      );
    });
    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(BOT_DEPLOYER_FUNC, FORTA_ADDR, NETHERMIND_ADDR),
};