
import type { AppProps } from 'next/app'
import '../styles/globals.scss';

import styles from '../styles/app.module.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import { GetStaticProps } from 'next';

function MyApp({ Component, pageProps }: AppProps<GetStaticProps>) {
  
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header/>
          <Component {...pageProps} />
        </main>
        <Player/>
      </div>    
    </PlayerContextProvider>
  )
}

export default MyApp
