/*eslint-disable no-undef */
const {Networks} = require('@stellar/stellar-base')
const {parseTxOperationsMeta, disposeSacCache} = require('../src')

function resolveNetwork(network) {
    if (!network)
        return 'Test SDF Future Network ; October 2022' //futurenet by default
    if (network.includes(' '))
        return network
    return Networks[network.toUpperCase()] //predefined
}

describe('Effects', () => {
    test.each(require('./op-effects-data.json'))('Analyze classic operation effects - %s', (description, params) => {
        const {tx, result, meta, expected, network} = params
        const res = parseTxOperationsMeta({
            network: resolveNetwork(network),
            tx,
            result,
            meta
        })

        for (let i = 0; i < res.operations.length; i++) {
            expect(res.operations[i].effects).toStrictEqual(expected[i])
        }
    })

    test.each(require('./soroban-op-effects-data.json'))('Analyze Soroban effects - %s', (description, params) => {
        const {tx, result, meta, expected, network} = params
        const res = parseTxOperationsMeta({
            network: resolveNetwork(network),
            tx,
            result,
            meta
        })

        for (let i = 0; i < res.operations.length; i++) {
            expect(res.operations[i].effects).toStrictEqual(expected[i])
        }
    })

    test.each(require('./soroban-sac-map-data.json'))('Verify SAC map for Soroban effects - %s', (description, params) => {
        const {tx, result, meta, expected, network} = params
        const res = parseTxOperationsMeta({
            network: resolveNetwork(network),
            tx,
            result,
            meta,
            mapSac: true
        })
        expect(res.operations[0].sacMap).toEqual(expected || undefined)
    })

    test.each(require('./tx-effects-data.json'))('Analyze transaction effects - %s', (description, params) => {
        const {tx, result, meta, expected, network} = params
        //merge account
        const res = parseTxOperationsMeta({
            network: resolveNetwork(network),
            tx,
            result,
            meta
        })

        expect(res.effects).toStrictEqual(expected)
    })

    afterAll(() => {
        disposeSacCache()
    })
})