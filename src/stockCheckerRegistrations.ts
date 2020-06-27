import {CurrysStockChecker} from './stockCheckers/currysStockChecker'
import {InStockChecker} from './stockCheckers/inStockChecker'
import {OutOfStockChecker} from './stockCheckers/outOfStockChecker'
import {StockCheckerFactory} from './stockCheckerFactory'

const stockCheckerRegistrations: [string, StockCheckerFactory][] = [
    [
        'http(s?):\/\/store.nintendo.co.uk',
        (website) => new OutOfStockChecker(website, '.productAddToBasket-soldOut'),
    ], [
        'http(s?):\/\/www.currys.co.uk',
        (website) => new CurrysStockChecker(website),
    ], [
        'http(s?):\/\/ao.com',
        (website) => new OutOfStockChecker(website, '.back-in-stock'),
    ], [
        'http(s?):\/\/uk.ooni.com',
        (website) => new InStockChecker(website, '#stock-indicator'),
    ], [
        'http(s?):\/\/www.johnlewis.com',
        (website) => new OutOfStockChecker(website, '#button--add-to-basket-out-of-stock'),
    ], [
        'http(s?):\/\/www.cosmetify.com',
        (website) => new OutOfStockChecker(website, '.noStk'),
    ], [
        'http(s?):\/\/www.cultbeauty.co.uk',
        (website) => new OutOfStockChecker(website, '.js-waitlist-header'),
    ],
]

export {stockCheckerRegistrations}
