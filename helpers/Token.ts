import {ethers} from 'ethers'
import {Token} from '@uniswap/sdk-core'



export const getTokenAndBalance = async function (contract: ethers.Contract, address: string, chainId: number) {
    var [dec, symbol, name, balance] = await Promise.all(
        [
            contract.decimals(),
            contract.symbol(),
            contract.name(),
            contract.balanceOf(address)
        ]);
console.log(balance)
return [new Token(chainId, contract.address, dec, symbol, name), balance];
}
