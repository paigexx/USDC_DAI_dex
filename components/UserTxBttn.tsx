import { Button } from "@chakra-ui/button";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";



const UserTxBttn = () => {
    const { address } = useAccount()
    const baseUrl = process.env.NEXT_PUBLIC_ALCHEMY_URL as string
    const [txData, setTxData] = useState<any|undefined>(undefined)
    const { isOpen, onOpen, onClose } = useDisclosure();


    let data = JSON.stringify({
        "jsonrpc": "2.0",
        "id": 0,
        "method": "alchemy_getAssetTransfers",
        "params": [
            {
            "fromBlock": "0x0",
            "fromAddress": address,
            "category": ["external", "internal", "erc20", "erc721", "erc1155"],
            }
        ]
    });

    var requestOptions = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: data,
    };

    const getData = async () => {
        if(address){
            axios(baseUrl, requestOptions)
            .then(response => setTxData(response.data.result.transfers))
            .catch(error => console.log(error))

        }
    }


    useEffect(() => {
        getData()
    }, [address, onOpen])

    return (
        <>
        <Button colorScheme='pink' variant="ghost" onClick={onOpen}>My Transactions</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Past Transactions (Goerli)</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <TableContainer>
            <Table size='sm' variant='striped'>
                <Thead>
                <Tr>
                    <Th>Block #</Th>
                    <Th>Category</Th>
                    <Th>Asset</Th>
                    <Th>Value</Th>
                </Tr>
                </Thead>
                <Tbody>
                {txData !== undefined &&
                txData.slice(0).reverse().map((tx: any, index:number) => ( 
                <>
                    <Tr>
                    <Td className="" key={index}>{tx.blockNum}</Td> 
                    <Td className="" key={index}>{tx.category}</Td> 
                    <Td className="" key={index}>{tx.asset}</Td>
                    <Td className="" key={index}>{tx.value}</Td>  
                    </Tr>
                </>
                ))
                }
                </Tbody>
                <Tfoot>
                <Tr>
                    <Th>Block #</Th>
                    <Th>Category</Th>
                    <Th>Asset</Th>
                    <Th>Value</Th>
                </Tr>
                </Tfoot>
            </Table>
        </TableContainer>



            </ModalBody>

            <ModalFooter>
                <Button colorScheme='pink' mr={3} onClick={onClose}>
                Close
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default UserTxBttn;