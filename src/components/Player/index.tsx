
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    isLooping,
    isShuffling,
    hasNext,
    hasPrevious,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    clearPlayerState
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if(!audioRef.current){
      return
    }
    if(isPlaying){
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

  }, [isPlaying])

  function setupProgressListener() {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setProgress(Math.floor(audioRef.current.currentTime));
        }
      });
    };
  };

  function handleSeek(amount: number | number[]) {
    if (audioRef.current && typeof amount === 'number') {
      audioRef.current.currentTime = amount;
      setProgress(amount);
    }
  }

  function handleEnded(){
    if(hasNext){
      playNext();
    } else {
      clearPlayerState();
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <Image src="/playing.svg" alt="Tocando agora" width={32} height={32} />
        <strong>Tocando agora</strong>
      </header>
      {episode ? (
        <div className={styles.currentEpisode}>
          <Image 
            width={290} 
            height={210} 
            src={episode.thumbnail}
            alt="thumbnail"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}


      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{backgroundColor: '#04d361'}}
                railStyle={{backgroundColor: '#9f75ff'}}
                handleStyle={{borderColor: '#04d361', borderWidth: 4}}
              />
              ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio 
            src={episode.url} 
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onEnded={handleEnded}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}
        <div className={styles.buttons}>
          <button 
            type='button' 
            disabled={!episode}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
            >
            <Image src="/shuffle.svg" alt="Embaralhar" width={24} height={24} />
          </button>
          <button type='button' onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <Image src="/play-previous.svg" alt="Tocar anterior" width={24} height={24} />
          </button>
          
          <button
            type='button'
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Image src="/pause.svg" alt="Tocar" width={11} height={19} />
            ):(
              <Image src="/play.svg" alt="Pausar" width={32} height={32} />
            )}
          </button>
          <button type='button' onClick={playNext} disabled={!episode || !hasNext}>
            <Image src="/play-next.svg" alt="Tocar próximo" width={24} height={24} />
          </button>
          <button 
            type='button' 
            onClick={toggleLoop} 
            disabled={!episode}
            className={isLooping ? styles.isActive : ''}
            >
            <Image src="/repeat.svg" alt="Repitir" width={24} height={24} />
          </button>
        </div>
      </footer>
    </div>
  )
}