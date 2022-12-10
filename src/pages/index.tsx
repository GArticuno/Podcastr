import {GetStaticProps} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import {format, parseISO} from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import { usePlayer } from '../contexts/PlayerContext';
import styles from '../styles/home.module.scss';
import { useRouter } from 'next/router';

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
  duration: number;
  duratioAsString: string;
  url: string;
};
interface HomeProps {
  latestEpisodes: EpisodeFormated[];
  allEpisodes: EpisodeFormated[];
}

export default function Home({latestEpisodes, allEpisodes} : HomeProps) {
  const { playList } = usePlayer();
  const { push } = useRouter();

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {
            return(
              <li key={episode.id}>
                <Image
                  width={170}
                  height={100} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                />

                <div className={styles.episodesDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    {episode.title}
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.duratioAsString}</span>
                </div>

                <button type='button' onClick={()=> playList(episodeList, index)}>
                  <Image src="/play-green.svg" alt="Tocar episódio" width={20} height={20} />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return(
                <tr key={episode.id}>
                  <td style={{width: 72}}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      {episode.title}
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{width: 100}}>{episode.publishedAt}</td>
                  <td>{episode.duratioAsString}</td>
                  <td>
                    <button type='button' onClick={()=> playList(episodeList, index + latestEpisodes.length)}>
                      <Image src="/play-green.svg" alt="Tocar episódio" width={20} height={20} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export  const getStaticProps : GetStaticProps = async () => {
  const { data } = await api.get<Response>('', {
    params:{
      limit: 12,
      order: '-published_at',
    }
  });

  const episodes: EpisodeFormated[] = data.results.map(episode => {
    return{
      id: episode.name,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      thumbnail: episode.thumbnail,
      duration: Number(episode.duration),
      duratioAsString: convertDurationToTimeString(Number(episode.duration)),
      url: episode.url
    }
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  return { 
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}