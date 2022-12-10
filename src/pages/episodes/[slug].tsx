import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import { usePlayer } from '../../contexts/PlayerContext';
import styles from './episode.module.scss';

interface Episode {
  name: string;
  title: string;
  members: string;
  thumbnail: string;
  description: string;
  published_at: string;
  url: string,
  duration: number;
};

interface Response {
  results: Episode[];
};

interface EpisodeFormated {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  duration: number;
  duratioAsString: string;
  url: string;
};

interface EpisodeProps {
  episode: EpisodeFormated;
};

export default function Episode({episode}: EpisodeProps){
  const {play} = usePlayer();

  return(
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href={"/"}>
          <button type='button'>
            <Image src="/arrow-left.svg" alt="Voltar" width={10} height={16} />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          alt="thumbnail"
        />
        <button type='button' onClick={() => play(episode)}>
          <Image src="/play.svg" alt="Tocar episódio" width={32} height={32} />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.duratioAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}}/>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  const {data} = await api.get<Response>('', {
    params:{
      limit: 2,
      sort: '-published_at',
    }
  });

  const paths = data.results.map(episode => {
    return{
      params: {
        slug: episode.name,
      }
    }
  })
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (ctx) =>{
  console.log(ctx);
  const { data } = await api.get<Response>(``);
  console.log(data);
  const episode = data.results.filter((item) => item.name);

  const episodeFormated = {
    id: episode[0].name,
    title: episode[0].title,
    members: episode[0].members,
    publishedAt: format(parseISO(episode[0].published_at), 'd MMM yy', { locale: ptBR }),
    thumbnail: episode[0].thumbnail,
    duration: Number(episode[0].duration),
    duratioAsString: convertDurationToTimeString(Number(episode[0].duration)),
    description: episode[0].description,
    url: episode[0].url
  };

  return{
    props: {
      episode: episodeFormated,
    },
    revalidate: 60 * 60 * 24
  }
}