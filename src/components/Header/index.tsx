import format from 'date-fns/format';
import Link from 'next/link';

import { ptBR } from 'date-fns/locale';
import styles from './styles.module.scss';

export function Header(){
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR
  })

  return(
    <header className={styles.headerContainer}>
      <Link href={"/"} >
        <img src="/logo.svg" alt="logo" title='Home'/>
      </Link>
        <p>O melhor para ouvir, sempre</p>        
      <span>{currentDate}</span>
    </header>
  )
}