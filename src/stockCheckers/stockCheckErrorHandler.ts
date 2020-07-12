import {SupportedStockChecker} from './stockChecker'

class StockCheckErrorHandler implements SupportedStockChecker {
    public readonly alias: string
    public readonly isSupported = true
    public readonly url: string

    constructor(private errorHandledInstance: SupportedStockChecker) {
        this.url = errorHandledInstance.url
        this.alias = errorHandledInstance.alias
    }

    async isInStock(): Promise<boolean> {
        try {
            return await this.errorHandledInstance.isInStock()
        } catch (error) {
            if (error.message === 'Request failed with status code 404') {
                console.log(`${this.errorHandledInstance.alias} not found. Check configuration.`)
            } else {
                console.log(`Error when processing ${this.errorHandledInstance.alias}.`)
            }
        }
        return false
    }
}

export {StockCheckErrorHandler}
