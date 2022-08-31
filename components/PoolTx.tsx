import { Select, Divider, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Tfoot, Text, Center} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { USD_DAI_data } from "../queries/ApolloClient"

const PoolTx = () => {
    const [dataUSDC_DAI, setDataUSDC_DAI] = useState<any[]>([])

    useEffect(()=> {
        const getData = async() => {
            let resUSDC_DAI = await USD_DAI_data;
            if (resUSDC_DAI !== undefined){
                resUSDC_DAI = resUSDC_DAI.swaps
                resUSDC_DAI = resUSDC_DAI.slice(0,10)
                setDataUSDC_DAI(resUSDC_DAI)
                console.log("USDC DAI Pool Stats", resUSDC_DAI.swaps)

            }
        }
        getData()
    }, [])

    return (
        <>
        <Center height='50px'>
            <Divider orientation='horizontal' />
        </Center>
        <Text align={"left"} textColor={"pink.500"}>Past Transactions on USDC DAI pool: 0x5777d92f208679db4b9778590fa3cab3ac9e2168</Text>
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                <Tr>
                    <Th>Amount In</Th>
                    <Th>Amount Out</Th>
                    <Th>Recipent</Th>
                </Tr>
                </Thead>
                <Tbody>
                {dataUSDC_DAI.slice(0).reverse().map((swap: any, index: number) => ( 
                <>
                    <Tr>
                    <Td key={index}>{swap.amount0}</Td> 
                    <Td key={index}>{swap.amount1}</Td> 
                    <Td key={index}>{swap.recipient}</Td> 
                    </Tr>
                </>
                ))}
                </Tbody>
                <Tfoot>
                <Tr>
                    <Th>Amount In</Th>
                    <Th>Amount Out</Th>
                    <Th>Recipent</Th>
                </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
        </>
    )
}

export default PoolTx;