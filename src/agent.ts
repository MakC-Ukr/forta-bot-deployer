import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";
import dataJson from "./data.json";

export function provideHandleTransaction(AGENT_DEPLOYER_FUNC: string, FORTA_ADDR:string, NETHERMIND_ADDR:string): HandleTransaction {
  return async (txEvent: TransactionEvent) => {  
    const findings: Finding[] = [];
    if (txEvent.from?.toLowerCase() != NETHERMIND_ADDR?.toLowerCase()) {
      return findings;
    }
    const txns = txEvent.filterFunction(AGENT_DEPLOYER_FUNC, FORTA_ADDR);
    txns.forEach((_) => {
      findings.push(
        Finding.fromObject({
          name: "Forta Agent Deployed",
          description: "A Forta agent was just deployed from the Nethermind deployer",
          alertId: "FAD-1",
          protocol: "Nethermind",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            "network": txEvent.network.toString()
          },
        })
      );
    });
    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(dataJson.AGENT_DEPLOYER_FUNC, dataJson.FORTA_ADDR, dataJson.NETHERMIND_ADDR),
};