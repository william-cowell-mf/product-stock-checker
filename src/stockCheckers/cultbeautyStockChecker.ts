import axios from 'axios'
import chowdown from 'chowdown'
import {SupportedStockChecker} from './stockChecker'
import {Website} from '../configuration/configuration'

class CultBeautyStockChecker implements SupportedStockChecker {
    public readonly alias: string
    public readonly isSupported = true
    public readonly url: string
    private productId!: string

    constructor(website: Website) {
        this.alias = website.alias
        this.url = website.url
    }

    public async isInStock(): Promise<boolean> {
        await this.ensureProductId()

        const response = await axios.get(`https://www.cultbeauty.co.uk/xhr/macaw/stock?product_ids=${this.productId}`)
        const stockPosition = response.data[this.productId] as number

        return stockPosition > 0
    }

    private async ensureProductId(): Promise<void> {
        if (!this.productId) {
            const webpage = await axios(this.url)
            const scope = chowdown.body(webpage.data)
            const query = chowdown.query.raw(($, _) => $('.product_id'))
            const productIdField = await scope.execute(query)

            this.productId = productIdField[0].attribs['value']
        }
    }
}

export {CultBeautyStockChecker}
