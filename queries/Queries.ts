
export const USDC_DAI_Query = `
query {
    swaps(orderBy: timestamp, orderDirection: desc, where:
        { pool: "0x5777d92f208679db4b9778590fa3cab3ac9e2168" }
        ) {
        pool {
            token0 {
            id
            symbol
            }
            token1 {
            id
            symbol
            }
        }
        sender
        recipient
        amount0
        amount1
        }
    }
`

export const USDCQuery = `
query {
    token(id:"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48") {
        symbol
        name
        decimals
        volumeUSD
        poolCount
    }
}    
`
export const DAIQuery = `
query {
    token(id:"0x6b175474e89094c44da98b954eedeac495271d0f") {
        symbol
        name
        decimals
        volumeUSD
        poolCount
    }
}    
`


