const { abi: UniswapV3Factory } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json')
import { ethers } from 'ethers'

export const getPoolImmutables = async function (poolContract: ethers.Contract) {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
        poolContract.factory(),
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.maxLiquidityPerTick(),
    ]);

    return {
        factory: factory,
        token0: token0,
        token1: token1,
        fee: fee,
        tickSpacing: tickSpacing,
        maxLiquidityPerTick: maxLiquidityPerTick,
    }
}

export const getPoolState = async function (poolContract: ethers.Contract) {
    const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()]);

    return {
        liquidity: liquidity,
        sqrtPriceX96: slot[0],
        tick: slot[1],
        observationIndex: slot[2],
        observationCardinality: slot[3],
        observationCardinalityNext: slot[4],
        feeProtocol: slot[5],
        unlocked: slot[6],
    }
}


export const getPoolAddress = async (tokenInContractAddress: string, tokenOutContractAddress: string, provider: ethers.providers.Web3Provider) => {
    const factoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
    const factoryContract = new ethers.Contract(
        factoryAddress,
        UniswapV3Factory,
        provider
    )
    const poolAddress = await factoryContract.getPool(tokenInContractAddress, tokenOutContractAddress, 500)
    console.log('poolAddress', poolAddress) 
    return poolAddress
}
