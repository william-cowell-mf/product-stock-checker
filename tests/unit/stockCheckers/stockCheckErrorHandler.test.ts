import {Autofixture} from 'ts-autofixture/dist/src'
import {StockCheckErrorHandler} from '../../../src/stockCheckers/stockCheckErrorHandler'
import {SupportedStockChecker} from '../../../src/stockCheckers/stockChecker'

const fixture = new Autofixture()

test('has same URL as decorated instance', () => {
    const decoratedInstance: SupportedStockChecker = {
        url: fixture.create({url: 'string'}).url,
        alias: 'ignored',
        isSupported: true,
        isInStock: () => Promise.resolve(true),
    }

    const decorator = new StockCheckErrorHandler(decoratedInstance)

    expect(decorator.url)
        .toBe(decoratedInstance.url)
})

test('has same alias as decorated instance', () => {
    const decoratedInstance: SupportedStockChecker = {
        url: 'unimportant',
        alias: fixture.create({alias: 'string'}).alias,
        isSupported: true,
        isInStock: () => Promise.resolve(true),
    }

    const decorator = new StockCheckErrorHandler(decoratedInstance)

    expect(decorator.alias)
        .toBe(decoratedInstance.alias)
})

test('returns isInStock from decorated instance', async () => {
    const expectedIsInStock = fixture.create({isInStock: false}).isInStock
    const decoratedInstance: SupportedStockChecker = {
        url: 'some url',
        alias: 'my alias',
        isSupported: true,
        isInStock: () => Promise.resolve(expectedIsInStock),
    }
    const decorator = new StockCheckErrorHandler(decoratedInstance)

    const isInStock = await decorator.isInStock()

    expect(isInStock)
        .toBe(expectedIsInStock)
})

test('does nothing when no error is found', async () => {
    const spy = jest.spyOn(console, 'log')

    const decoratedInstance: SupportedStockChecker = {
        url: 'some url',
        alias: 'my alias',
        isSupported: true,
        isInStock: () => Promise.resolve(true),
    }
    const decorator = new StockCheckErrorHandler(decoratedInstance)

    await decorator.isInStock()

    expect(spy)
        .not.toHaveBeenCalled()
})

test('reports when a product is no longer found', async () => {
    const spy = jest.spyOn(console, 'log')

    const decoratedInstance: SupportedStockChecker = {
        url: 'some url',
        alias: fixture.create({alias: 'my alias'}).alias,
        isSupported: true,
        isInStock: () => Promise.reject(Error('Request failed with status code 404')),
    }
    const decorator = new StockCheckErrorHandler(decoratedInstance)

    await decorator.isInStock()

    expect(spy)
        .toHaveBeenCalledWith(
            decoratedInstance.alias + ' not found. Check configuration.')
})

test('reports when it encounters an error', async () => {
    const spy = jest.spyOn(console, 'log')
    const decoratedInstance: SupportedStockChecker = {
        url: 'some url',
        alias: fixture.create({alias: 'my alias'}).alias,
        isSupported: true,
        isInStock: () => Promise.reject(Error('There has been a problem')),
    }
    const decorator = new StockCheckErrorHandler(decoratedInstance)

    await decorator.isInStock()

    expect(spy)
        .toHaveBeenCalledWith(
            `Error when processing ${decoratedInstance.alias}.`)
})
