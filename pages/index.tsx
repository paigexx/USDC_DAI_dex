import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { Text} from '@chakra-ui/react';
import PoolTx from '../components/PoolTx';
import Simple from '../components/NavBar';





const Home: NextPage = () => {
  
  
    return (
        <div>
          <Simple />
        <main className={styles.main}>
          <Text fontSize='4xl'>USDC DAI Swap</Text>
          <PoolTx/>
        </main>
        <footer className={styles.footer}>
        <p >Made with ❤️ by Paige Jones</p>
        </footer>
        </div>
    )
    
};

export default Home;
