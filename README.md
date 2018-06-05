# epoch-Mira
### Tests
truffle develop
test
### Deployment
Have node running on 127.0.0.1:8545.
Change from address in truffle.js if you want to specify that.
truffle compile
truffle migrate --network miranet
Confirm transactions.
### Warning!
In EpochContract epoch end time set to current time for test purposes. Change that to +12 hours before deploying.
nodeFreezeValue set to 1 for same test purposes. Change that to needed value. Owner can do it with setNodeFreezeValue() function later.
