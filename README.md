> There are far, far better things ahead than any we leave behind. - C.S. Lewis

Thanks for participating in the RareRedirect experiment. 2021-2025. 

# RareRedirect

RareRedirect is an experiment that allows users to decide where a website should redirect based on whether they are willing to pay more than the previous redirect purchaser. The contract is very simple. None of the code is audited, so proceed at your own risk. If you notice any bugs or have suggestions for improvements, please open an issue. I'm always open to feedback.

Validation for URL correctness occurs on the frontend site. The current site to implement this experiment is [janetyellen.com](https://janetyellen.com).

## Development

### Install dependencies

`npm i`

### Build Contracts and Generate Typechain Typeings

`npm run compile`

### Run Contract Tests & Get Callstacks

In one terminal run `npx hardhat node`

Then in another run `npm run test`

Notes:

- The gas usage table may be incomplete (the gas report currently needs to run with the `--network localhost` flag; see below).

### Run Contract Tests and Generate Gas Usage Report

In one terminal run `npx hardhat node`

Then in another run `npm run test -- --network localhost`

Notes:

- When running with this `localhost` option, you get a gas report but may not get good callstacks
- See [here](https://github.com/cgewecke/eth-gas-reporter#installation-and-config) for how to configure the gas usage report.

### Run Coverage Report for Tests

`npm run coverage`

Notes:

- running a coverage report currently deletes artifacts, so after each coverage run you will then need to run `npx hardhat clean` followed by `npm run build` before re-running tests

### Deploy to Ethereum

Create/modify network config in `hardhat.config.ts` and add API key and private key, then run:

`npx hardhat run --network <NETWORK> scripts/deploy.ts`

### Verify on Etherscan

Using the [hardhat-etherscan plugin](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html), add Etherscan API key to `hardhat.config.ts`, then run:

`npx hardhat verify --network <NETWORK> <DEPLOYED ADDRESS>`
