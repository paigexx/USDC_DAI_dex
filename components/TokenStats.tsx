import { Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";
import { DAI_data, USDC_data } from "../queries/ApolloClient";
import { useState, useEffect } from "react";
import styles from '../styles/Home.module.css';



const Stats = () => {
    const [dataUSDC, setDataUSDC] = useState<any>()
    const [dataDAI, setDataDAI] = useState<any>()

    useEffect(()=> {
        const getData = async() => {
            let resUSDC = await USDC_data;
            let resDAI = await DAI_data;
            setDataUSDC(resUSDC);
            setDataDAI(resDAI);
            console.log("USDC Token Stats", resUSDC)
            console.log("DAI Token Stats", resDAI)
        }
        getData()
    }, [])

    return (
        <div className={styles.tokenContainer}>
            {dataUSDC !== undefined && dataDAI !== undefined ? 
            <>
            <Stat>
                <StatNumber>{dataUSDC.token.symbol}</StatNumber>
                <StatLabel>{dataUSDC.token.name}</StatLabel>
                <StatHelpText>Decimals: {dataUSDC.token.decimals}</StatHelpText> 
                <StatHelpText>Pool Count: {dataUSDC.token.poolCount}</StatHelpText>
            </Stat>
            <Stat>
                <StatNumber>{dataDAI.token.symbol}</StatNumber>
                <StatLabel>{dataDAI.token.name}</StatLabel>
                <StatHelpText>Decimals: {dataDAI.token.decimals}</StatHelpText> 
                <StatHelpText>Pool Count: {dataDAI.token.poolCount}</StatHelpText>
            </Stat>
            </>
            : null }
        </div>
    )
}

export default Stats;