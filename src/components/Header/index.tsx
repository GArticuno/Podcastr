import format from 'date-fns/format';
import Image from 'next/image';
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
        <Image src="/logo.svg" alt="logo" title='Home' width={163} height={40} />
      </Link>
        <p>O melhor para ouvir, sempre</p>        
      <span>{currentDate}</span>
    </header>
  )
}