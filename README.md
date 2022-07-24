# Forta agent deployement agent

## Description

This agent detects transactions with deployments of Forta agents

## Supported Chains
- Polygon
- For other EVM compatible chains, change the `jsonRpcUrl` in `./forta.config.json` and the `chainId` in `package.json`

## Alerts

- FAD-0
  - Fired when a transaction contains the Nethermind deployer deploys a Forta agent
  - Severity is always set to "low" 
  - Type is always set to "info"
  - Metadata is empty
## Test Data

The agent behaviour can be verified by running `npm test`.