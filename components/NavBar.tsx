import { ReactNode } from 'react';
import {
    Box,
    Flex,
    Button,
    useDisclosure,
    useColorModeValue,
    useColorMode,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Swap from './Swap';
import { useAccount } from 'wagmi';
import UserTxBttn from './UserTxBttn';



    export default function Simple() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode()
    const { address, isConnected } = useAccount()

    return (
        <>
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <Flex gap={"1em"} alignItems={'center'}>
                <Button onClick={toggleColorMode}>
                    {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
                </Button>
                {isConnected ? 
                <div> 
                <Swap/>
                <UserTxBttn/>
                </div>
                : null}
            </Flex>
            <Flex alignItems={'center'}>
                <ConnectButton label="Connect Wallet" />
            </Flex>
            </Flex>
        </Box>
        </>
    );
}