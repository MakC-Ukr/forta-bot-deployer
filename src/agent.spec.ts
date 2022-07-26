import { FindingType, FindingSeverity, Finding, HandleTransaction, ethers } from "forta-agent";
import agent from "./agent";
import { FORTA_ADDR, NETHERMIND_ADDR } from "./data.json";
import { TestTransactionEvent } from "forta-agent-tools/lib/tests";

let iface = new ethers.utils.Interface(["function createAgent(uint256,address,string,uint256[])"]);
let txnData = iface.encodeFunctionData("createAgent", ["2345675643", "0x56D9e2Ce76F9E97337938112230B1Ca3506A858f", "Hello world", ["9696", "2343"]]);


describe("Testing basic functionanlity of agent deployment detection agent", () => {
  let handleTransaction: HandleTransaction;

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  describe("Nethermind Forta Bot Deployment Test Suite", () => {
    it("should not report any findings if agent is not deployed", async () => {
      const mockTxFunc = new TestTransactionEvent().setFrom(NETHERMIND_ADDR).addTraces({
        to: FORTA_ADDR,
        from: NETHERMIND_ADDR
      });
      const findings = await handleTransaction(mockTxFunc);
      expect(findings).toStrictEqual([]);
    });

    it("should report findings if an agent is deployed", async () => {
      const mockTxFunc = new TestTransactionEvent().setFrom(NETHERMIND_ADDR).addTraces({
        to: FORTA_ADDR,
        from: NETHERMIND_ADDR,
        input: txnData,
      });
      
      const findings = await handleTransaction(mockTxFunc);
      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Forta Agent Deployed",
          description: "A Forta agent was just deployed from the Nethermind deployer",
          alertId: "FAD-1",
          protocol: "Nethermind",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            "network": "1"
          }
        }),
      ]);
    });

    it("should not report any findings if an agent is deployed from a non-nethermind deployer", async () => {
      const mockTxFunc = new TestTransactionEvent().setFrom(FORTA_ADDR).addTraces({
        to: FORTA_ADDR,
        from: NETHERMIND_ADDR,
        input: txnData,
      });
      const findings = await handleTransaction(mockTxFunc);
      expect(findings).toStrictEqual([]);
    });
  });
});
