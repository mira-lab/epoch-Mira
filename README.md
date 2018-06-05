# epoch-Mira

### Contracts Deployment

```
npm install -g truffle
```
Have mira node running on 127.0.0.1:8545 or specify different host and port in truffle.js

Change "from" address in truffle.js.
```
truffle compile

truffle migrate --network miranet
```
Confirm transactions.
#### Warning!

In EpochContract epochEndTime set to current time for test purposes. Change that to +12 hours before deploying.

In NodesHolder nodeFreezeValue set to 1 for same test purposes. Change that to needed value. Owner can do it with setNodeFreezeValue() function later.

## Running the tests

Tests show basic functionality of these contracts.

```
truffle develop

test
```
