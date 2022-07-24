import {
  BlockEvent,
  Finding,
  HandleBlock,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";

let AGENT_DEPLOYER_FUNC: string =
  "function createAgent(uint256 agentId, address owner, string metadata, uint256[] chainIds)";
const FORTA_ADDR: string = "0x61447385B019187daa48e91c55c02AF1F1f3F863";
const NETHERMIND_ADDR: string = "0x88dc3a2284fa62e0027d6d6b1fcfdd2141a143b8";

let findingsCount = 0;

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  if (txEvent.from?.toLowerCase() != NETHERMIND_ADDR?.toLowerCase()) {
    return findings;
  }

  if (txEvent.to?.toLowerCase() != FORTA_ADDR?.toLowerCase()) {
    return findings;
  }

  const txns = txEvent.filterFunction(AGENT_DEPLOYER_FUNC, FORTA_ADDR);
  txns.forEach((_) => {
    findings.push(
      Finding.fromObject({
        name: "Forta Agent Deployed",
        description:
          "A Forta agent was just deployed from the Nethermind deployer",
        alertId: "FAD" + findingsCount.toString(),
        protocol: "Forta",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {},
      })
    );
    findingsCount += 1;
  });

  return findings;
};

export default {
  handleTransaction,
};

export { AGENT_DEPLOYER_FUNC, FORTA_ADDR, NETHERMIND_ADDR };
