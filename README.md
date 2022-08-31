### npm run dev 


### Please note: 

In the current state of this application it is advised to follow the following instructions for proper preformance: 

1. Use Metamask Login - 
WalletConnect/Coinbase is misbehaving, this is in the pipeline to fix/optimize. 

2. Use Goerli Network - Due to my lack of desire to pay for gas fees, and well, actually exchange my mainnet USDC :), this application is operating on the Goerli testnet. https://usdcfaucet.com/ (For demo purposes only) 

3. USDC DAI Pool query table reflects a mainnet pool. 
The Subgraph API provided by Uniswap V3 does not enable querying of testnet pools? Therefore, I'm querying data and displaying from a mainnet pool. (Again, for demo purposes only)

4. Pool Selection function - not currently active. 
I used the "getPool" functionality built into the Uniswap v3 SDK. This returns a default pool. 
To extend functionality, I would use mainnet and query/display multiple active USDC/DAI pools.  

5. Add AlchemyAPI Goerli URL/API key in .env folder. 

6. Swap functionality may act strange if there is high traffic on the Goerli network....
Currently looking into this, will optimize. 


Thank you for your consideration :) 
Paige - pcjones12@gmail.com
wagmi 
