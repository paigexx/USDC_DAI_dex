import { ethers } from 'ethers'
import { useAccount, erc20ABI, useSigner, useProvider  } from 'wagmi'
import { TradeType, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { Pool } from '@uniswap/v3-sdk/'
import { AlphaRouter} from '@uniswap/smart-order-router'
import { getPoolAddress, getPoolImmutables, getPoolState } from '../helpers/Pool'
import {getTokenAndBalance} from "../helpers/Token"
import { useEffect, useState } from 'react'
import { useDisclosure, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, InputGroup, InputRightElement, ModalHeader, Select, Spinner, Text } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'


const Swap = () => {
    const { address } = useAccount()
    const { data } = useSigner()
    const regex = /^([1-9]\d*)?(\.\d+)?(?<=\d)$/
    //contract addresses
    const tokenUSDCAddress = "0x07865c6e87b9f70255377e024ace6630c1eaa37f"; //goerli usdc
    const tokenDAIAddress = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844"; // goerli dai
    const v3SwapRouterAddress = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
    const chainId = 5;  // chainId for Goerli
    const provider:any = useProvider()
    //provider
    // only for metamask: -> 
    // const provider = new ethers.providers.Web3Provider(window.ethereum as any, "goerli");
    // const signer = provider.getSigner();
    //contract instances
    const [contractUSDC, setContractUSDC] = useState<ethers.Contract|undefined>(undefined)
    const [contractDAI, setContractDAI] = useState<ethers.Contract|undefined>(undefined)
    //chakra modal 
    const { isOpen, onOpen, onClose } = useDisclosure();
    //state variables
    const [amountInStr, setAmountInStr] = useState<string>("0.01");
    const [tokenBalanceUSDC, setTokenBalanceUSDC] = useState<string>("0.00");
    const [tokenBalanceDAI, setTokenBalanceDAI] = useState<string>("0.00");
    const [tokenUSDC, setTokenUSDC] = useState<Token | undefined>(undefined)
    const [tokenDAI, setTokenDAI] = useState<Token | undefined>(undefined)
    const [amountInDisplay, setAmountInDisplay] = useState<string>("0.00");
    const [amountOutDisplay, setAmountOutDisplay] = useState<string>("0.00");
    const [inReview, setInReview] = useState<boolean>(false);
    const [amountIn, setAmountIn] = useState<ethers.BigNumber>();
    const [quoteLoading, setQuoteLoading] = useState<boolean>(false);
    const [txLoading, setTxLoading] = useState<boolean>(false);
    const [isValidInput, setIsValidInput] = useState<boolean>(false);
    const [isSwappedChecked, setIsSwappedCheck] = useState<boolean>(false);
    const [route, setRoute] = useState< any | undefined>(undefined);
    const [signer, setSigner] = useState<any|undefined>(undefined);
    const [isSwapSuccess, setIsSwapSuccess] = useState<boolean>(false);




    useEffect(()=> {
        if(data && signer == undefined){
            setSigner(data)
            setContractUSDC(new ethers.Contract(tokenUSDCAddress, erc20ABI, data))
            setContractDAI(new ethers.Contract(tokenDAIAddress, erc20ABI, data));
            console.log(data)
        }    
        if(contractUSDC !== undefined && contractDAI !== undefined){
            userTokenAndBalance()
        }    
    },[address, data, signer])

    const userTokenAndBalance = async() => {
        const [tokenUSDC, balanceTokenUSDC] = await getTokenAndBalance(contractUSDC as ethers.Contract, address as string, chainId);
        const [tokenDAI, balanceTokenDAI] = await getTokenAndBalance(contractDAI  as ethers.Contract, address as string, chainId);
        setTokenBalanceUSDC(ethers.utils.formatUnits(balanceTokenUSDC, tokenUSDC.decimals))
        setTokenBalanceDAI(ethers.utils.formatUnits(balanceTokenDAI, tokenDAI.decimals))
        setTokenUSDC(tokenUSDC)
        setTokenDAI(tokenDAI)
    }

    
    const sendTx = async () => {
        setInReview(false)
        setAmountOutDisplay("0.00")
        setIsValidInput(false)
        //Add Loading Modal here
        setTxLoading(true)
        console.log("Amount to send: ", amountIn)
        if(contractUSDC !== undefined){
            try {
                await contractUSDC.approve(v3SwapRouterAddress, amountIn);
            } catch (error) {
                console.log("User rejected approval.")
                closeModal()
            }
        }
        const value = ethers.BigNumber.from(route.methodParameters.value);
        const transaction = {
            data: route.methodParameters.calldata,
            to: v3SwapRouterAddress,
            value: value,
            from: address,
            gasPrice: route.gasPriceWei,
    
            gasLimit: ethers.BigNumber.from("800000")
        };
        if(signer){
            const tx = await signer.sendTransaction(transaction);
            const receipt = await tx.wait();
            if (receipt.status === 0) {
                console.log("Swap transaction failed");
                closeModal()
            }
            else{
                setIsSwapSuccess(true)
                setTxLoading(false)
            }
            console.log(receipt)
        }

        userTokenAndBalance()
    }


    const reviewSwap = () => {
        if(regex.test(amountInStr)){
            setInReview(!inReview)
        }
    } 

    const checkValidInput =(e:any) => {
        setIsSwappedCheck(false)
        if(regex.test(e.target.value)){
            console.log("matched")
            setIsValidInput(true)
            setAmountInStr(e.target.value)
        }
        else{
            setIsValidInput(false)
            console.log("no match")
        }
        console.log(e.target.value)
    }


    const getQuoteValue = async () => {
        const poolAddress = await getPoolAddress(tokenUSDCAddress, tokenDAIAddress, provider)
        const poolContract = new ethers.Contract(poolAddress, IUniswapV3Pool.abi, provider);
        const [immutables, state] = await Promise.all([getPoolImmutables(poolContract), getPoolState(poolContract)]);
        const pool = new Pool(
            tokenUSDC as Token,
            tokenDAI as Token,
            immutables.fee,
            state.sqrtPriceX96.toString(),
            state.liquidity.toString(),
            state.tick
        );
        if(tokenUSDC !== undefined && tokenDAI !== undefined){
            const amountIn = ethers.utils.parseUnits(amountInStr, tokenUSDC.decimals);
            setAmountIn(amountIn)
            setAmountInDisplay(ethers.utils.formatUnits(amountIn, tokenUSDC.decimals))
 
            let amountInBN = amountIn as ethers.BigNumber
            const inAmount = CurrencyAmount.fromRawAmount(tokenUSDC as Token, amountInBN.toString());
            const router = new AlphaRouter({ chainId: chainId, provider: provider });
            const route = await router.route(
                inAmount,
                tokenDAI as Token,
                TradeType.EXACT_INPUT,
                {
                    recipient: address as string,
                    slippageTolerance: new Percent(5, 100),      
                    deadline: Math.floor(Date.now() / 1000 + 1800)    
                },
            );
        
            if (route == null || route.methodParameters === undefined){
                console.log("No route loaded")
            }
            else{
                const amountOut =  route.quote.toFixed(tokenDAI.decimals)
                setAmountOutDisplay(amountOut)
                setRoute(route)

                console.log(`   You'll get ${route.quote.toFixed()} of ${tokenDAI.symbol}`);
                console.log(`   Gas Adjusted Quote: ${route.quoteGasAdjusted.toFixed()}`);
                console.log(`   Gas Used Quote Token: ${route.estimatedGasUsedQuoteToken.toFixed()}`);
                console.log(`   Gas Used USD: ${route.estimatedGasUsedUSD.toFixed()}`);
                console.log(`   Gas Used: ${route.estimatedGasUsed.toString()}`);
                console.log(`   Gas Price Wei: ${route.gasPriceWei}`);
                }
        }
        setQuoteLoading(false)
        setIsSwappedCheck(true)
    }

    const resetModal = () => {
        setInReview(false)
        setIsSwappedCheck(false)
        setAmountOutDisplay("0.00")
        setIsValidInput(false)
    }

    const closeModal = () => {
        onClose()
        setAmountInStr("0.01")
        setAmountInDisplay("0.00")
        setAmountOutDisplay("0.00")
        setInReview(false)
        setTxLoading(false)
        setIsValidInput(false)
        setIsSwapSuccess(false)
        setIsSwappedCheck(false)
    }

    return (
        <>
        <Button  size='md'
                height='40px'
                width='150px'
                colorScheme={"pink"}
                onClick={onOpen}>Create Swap</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <>
                <ModalOverlay/>
                <ModalContent>
                <ModalCloseButton onClick={closeModal} />
                <ModalBody pb={6}>
                    {!inReview && !txLoading && !isSwapSuccess &&
                        <>
                        <ModalHeader>
                        <Select placeholder='Select Pool' variant='filled' borderColor='pink'>
                            <option value='defaultPool'>Default Pool</option>
                        </Select>
                        </ModalHeader>
                        <FormControl>
                        <FormLabel textColor={"pink.500"} fontSize={"2xl"}>Swap</FormLabel> 
                        <InputGroup>
                            <InputRightElement children="USDC" fontSize={"2xl"} />
                            <Input
                                    onChange={(event) => {checkValidInput(event)}}
                                    variant='flushed' 
                                    size='lg' width='auto'                              
                                    />
                        </InputGroup>
                        <p>Balance:  {tokenBalanceUSDC} USDC</p>
                        </FormControl>
                        <FormControl mt={4}>
                        <FormLabel textColor={"pink.500"} fontSize={"2xl"} >For</FormLabel>
                        <InputGroup>
                            <InputRightElement children="DAI" fontSize={"2xl"}  />
                            <Input isReadOnly={true} variant='flushed' size='lg' value={amountOutDisplay}/>
                        </InputGroup>                   
                        </FormControl>
                        <p>Balance: {tokenBalanceDAI} DAI</p>
                        </>
                    }

                    {inReview && !txLoading &&
                    <>  
                        <ModalHeader fontSize={"2xl"}  textColor={"pink.500"}>Swap Review
                        </ModalHeader>
                        <InputGroup>
                        <InputRightElement fontSize={"2xl"}  children="USDC" />
                        <Input defaultValue={amountInDisplay} 
                                isReadOnly={true}
                                variant='flushed' 
                                size='lg' width='auto'                                 
                                />
                        </InputGroup>
                        <InputGroup>
                        <InputRightElement fontSize={"2xl"} children="DAI" />
                        <Input defaultValue={amountOutDisplay} 
                                isReadOnly={true}
                                variant='flushed' 
                                size='lg' width='auto'                                 
                                />
                        </InputGroup>
                    </>
                    }
                {txLoading && 
                    <>
                        <ModalHeader fontSize={"2xl"} textColor={"pink.500"}>Swapping</ModalHeader>
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='pink.500'
                            size='xl'
                        />
                    </>
                }
                {isSwapSuccess && !txLoading &&
                    <>
                        <ModalHeader fontSize={"2xl"}>
                        <CheckCircleIcon color={"pink.500"} boxSize={9} paddingRight={"3"}/>
                            Swap Success
                        </ModalHeader>
                        <ModalBody>
                            <Text fontSize={"lg"}>Balance: {tokenBalanceDAI} DAI</Text>      
                        </ModalBody>
                    </>
                }                
                </ModalBody>
                <ModalFooter>
                {!inReview && !txLoading && !isSwapSuccess &&
                <>
                    <Button isDisabled={isValidInput ? false : true } isLoading={quoteLoading ? true:false} mr={3} onClick={()=>getQuoteValue()} colorScheme='green'>Check Price
                    </Button> 
                    <Button isDisabled={isSwappedChecked ? false : true} isLoading={quoteLoading ? true:false} onClick={()=>reviewSwap()} colorScheme='pink'>Review Swap
                    </Button>
                </>
                } 
                {inReview && !txLoading &&
                <>
                    <Button mr={3} onClick={()=>resetModal()}>Go Back</Button>
                    <Button onClick={()=>sendTx()} colorScheme='pink'>Swap
                    </Button>
                </>
                }
                {isSwapSuccess && !txLoading &&
                    <Button onClick={closeModal} colorScheme={"pink"}>Close</Button>
                }
                </ModalFooter>
                </ModalContent>
                </>
            </Modal>
        </>
    )
}
export default Swap;

