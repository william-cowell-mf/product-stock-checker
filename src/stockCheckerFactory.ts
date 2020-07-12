import {createNotification} from './notifications/notifcationFactory'
import {NotSupportedStockCheckLogger, SupportedStockCheckLogger} from './stockCheckers/stockCheckLogger'
import {StockChecker} from './stockCheckers/stockChecker'
import {StockCheckErrorHandler} from './stockCheckers/stockCheckErrorHandler'
import {StockCheckNotifier} from './stockCheckers/stockCheckNotifier'
import {Website} from './configuration/configuration'

type StockCheckerFactory = (website: Website) => StockChecker

const createDecoratedStockChecker = (stockChecker: StockChecker): StockChecker => {
    return stockChecker.isSupported ?
        new StockCheckNotifier(
            new SupportedStockCheckLogger(
                new StockCheckErrorHandler(stockChecker)),
            createNotification) :
        new NotSupportedStockCheckLogger(stockChecker)
}

const createFactory = (patternFactories: [string, StockCheckerFactory][]): StockCheckerFactory => {
    const expressionFactories: [RegExp, StockCheckerFactory][] = patternFactories
        .map(([pattern, factory]) => [new RegExp(pattern), factory])

    return (website: Website) => {
        const factory = expressionFactories
            .filter(([expression, _]) => expression.test(website.url))
            .map(([_, factory]) => factory)[0]

        return createDecoratedStockChecker(
            factory === undefined ?
                {...website, isSupported: false} :
                factory(website),
        )
    }
}


export {StockCheckerFactory, createFactory}
