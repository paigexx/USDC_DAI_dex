import { endpoint } from "../config"
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { DAIQuery, USDCQuery, USDC_DAI_Query } from "./queries";

const client = new ApolloClient({
    uri: endpoint,
    cache: new InMemoryCache(),
})

export const USD_DAI_data = client.query({
    query: gql(USDC_DAI_Query),
    })
    .then((data) => {console.log(data.data); return data.data})
    .catch((err) => {
        console.log('Error fetching data: ', err)
})

export const USDC_data = client.query({
    query: gql(USDCQuery),
    })
    .then((data) => {console.log(data.data); return data.data})
    .catch((err) => {
        console.log('Error fetching data: ', err)
})

export const DAI_data = client.query({
    query: gql(DAIQuery),
    })
    .then((data) => {console.log(data.data); return data.data})
    .catch((err) => {
        console.log('Error fetching data: ', err)
})