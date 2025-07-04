import React, { useEffect, useRef, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useLanguage } from '@/stores/app-store';
import {
  useDictationStore,
  useDictationState,
  useDictationConfig,
  useCurrentAudioItem
} from '@/stores/dictation-store';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { PenTool } from 'lucide-react';
const DictationSessionPage: React.FC = () => {
  const router = useRouter();
  const language = useLanguage();
  const state = useDictationState();
  const config = useDictationConfig();
  const currentItem = useCurrentAudioItem();
  const { pauseDictation, resumeDictation, stopDictation, nextAudio, previousAudio, updateTimer, recordAudioPlayed, updateCurrentRepeat } = useDictationStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const [isPlaying, setIsPlaying] = useState(false);
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const getProgress = (): number => {
    const totalTime = config.duration * 60;
    const elapsed = totalTime - state.remainingTime;
    return Math.round((elapsed / totalTime) * 100);
  };
  useEffect(() => {
    if (state.isActive && !state.isPaused) {
      timerRef.current = setInterval(() => {
        updateTimer();
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.isActive, state.isPaused, updateTimer]);
  const handleNextAudio = useCallback(() => {
    nextAudio();
  }, [nextAudio]);
  useEffect(() => {
    if (!currentItem || !audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = config.audioSettings.volume;
    audio.playbackRate = config.audioSettings.playbackRate;
    let isCurrentAudio = true; 
    const playAudio = async () => {
      if (state.isActive && !state.isPaused && isCurrentAudio) {
        try {
          setIsPlaying(true);
          await audio.play();
        } catch (error) {
          console.error('音频播放失败:', error);
          setIsPlaying(false);
          if (isCurrentAudio) {
            setTimeout(() => {
              handleAudioEnd();
            }, 1000); 
          }
        }
      }
    };
    const handleAudioEnd = () => {
      if (!isCurrentAudio) return; 
      setIsPlaying(false);
      const nextRepeat = state.currentRepeat + 1;
      console.log('Audio ended, current repeat:', state.currentRepeat, 'next repeat:', nextRepeat, 'max repeats:', config.audioSettings.repeatCount);
      if (nextRepeat < config.audioSettings.repeatCount) {
        updateCurrentRepeat(nextRepeat);
        setTimeout(() => {
          if (state.isActive && !state.isPaused && isCurrentAudio) {
            console.log('Replaying current audio, repeat:', nextRepeat);
            playAudio();
          }
        }, config.audioSettings.intervalTime * 1000);
      } else {
        if (currentItem) {
          recordAudioPlayed(currentItem, config.audioSettings.repeatCount);
        }
        console.log('Moving to next audio');
        setTimeout(() => {
          if (state.isActive && !state.isPaused && isCurrentAudio) {
            handleNextAudio();
          }
        }, config.audioSettings.intervalTime * 1000);
      }
    };
    const handleAudioError = () => {
      if (!isCurrentAudio) return;
      console.warn('音频加载失败:', currentItem?.audioUrl);
      setIsPlaying(false);
      setTimeout(() => {
        if (isCurrentAudio) {
          handleAudioEnd();
        }
      }, 500);
    };
    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('error', handleAudioError);
    if (state.isActive && !state.isPaused) {
      playAudio();
    }
    return () => {
      isCurrentAudio = false; 
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('error', handleAudioError);
    };
  }, [currentItem, state.isActive, state.isPaused, state.currentRepeat, config.audioSettings, handleNextAudio, recordAudioPlayed, updateCurrentRepeat]);
  useEffect(() => {
    console.log('Current item changed, resetting repeat count');
    updateCurrentRepeat(0);
  }, [currentItem?.id, updateCurrentRepeat]); 
  useEffect(() => {
    if (!state.isActive && state.remainingTime === 0) {
      router.push('/practice/dictation/result');
    }
  }, [state.isActive, state.remainingTime, router]);
  const handlePause = () => {
    if (state.isPaused) {
      resumeDictation();
    } else {
      pauseDictation();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };
  const handleStop = () => {
    stopDictation();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    router.push('/practice/dictation/result');
  };
  const handlePrevious = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    previousAudio();
  };
  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    nextAudio();
  };
  if (!state.isActive) {
    return (
      <Layout>
        <Container className="py-8 text-center">
          <Card>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              {language === 'zh' ? '练习未开始' : 'Practice Not Started'}
            </h2>
            <p className="text-text-secondary mb-6">
              {language === 'zh' ? '请先配置练习设置' : 'Please configure practice settings first'}
            </p>
            <Button onClick={() => router.push('/practice/dictation')}>
              {language === 'zh' ? '返回配置' : 'Back to Config'}
            </Button>
          </Card>
        </Container>
      </Layout>
    );
  }
  return (
    <Layout fullHeight>
      <Head>
        <title>{language === 'zh' ? '听写练习中 - Just Gojuon' : 'Dictation in Progress - Just Gojuon'}</title>
      </Head>
      <Container className="py-8 h-full">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          {}
          <Card className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatTime(state.remainingTime)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {language === 'zh' ? '剩余时间' : 'Time Left'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-text-primary">
                    {state.currentAudioIndex + 1} / {state.totalAudios}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {language === 'zh' ? '音频进度' : 'Audio Progress'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-text-primary">
                    {state.currentRepeat + 1} / {config.audioSettings.repeatCount}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {language === 'zh' ? '重复次数' : 'Repetition'}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-japanese-accent transition-all duration-1000"
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {getProgress()}%
                </span>
              </div>
            </div>
          </Card>
          {}
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-2xl text-center">
              <div className="py-12">
                {}
                <div className="mb-8">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
                    isPlaying ? 'bg-japanese-hiragana animate-pulse' : 'bg-gray-300'
                  }`}>
                    <span className="text-white text-3xl">
                      {isPlaying ? '🔊' : '🔇'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    {language === 'zh' ? '正在播放音频' : 'Playing Audio'}
                  </h2>
                </div>
                {}
                <div className="mb-8 p-4 bg-primary-50 rounded-card">
                  <div className="flex items-center gap-2 text-primary-700 text-sm">
                    <PenTool className="w-4 h-4 flex-shrink-0" />
                    <p>
                      {language === 'zh'
                        ? '请在纸上写下您听到的假名字符或罗马音'
                        : 'Please write down the kana characters or romaji you hear on paper'
                      }
                    </p>
                  </div>
                </div>
                {}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handlePrevious}
                    disabled={state.totalAudios <= 1}
                  >
                    ⏮️ {language === 'zh' ? '上一个' : 'Previous'}
                  </Button>
                  <Button
                    variant={state.isPaused ? 'primary' : 'secondary'}
                    size="lg"
                    onClick={handlePause}
                  >
                    {state.isPaused ? '▶️' : '⏸️'} 
                    {state.isPaused 
                      ? (language === 'zh' ? '继续' : 'Resume')
                      : (language === 'zh' ? '暂停' : 'Pause')
                    }
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleNext}
                    disabled={state.totalAudios <= 1}
                  >
                    ⏭️ {language === 'zh' ? '下一个' : 'Next'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleStop}
                  >
                    ⏹️ {language === 'zh' ? '停止' : 'Stop'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          {}
          {currentItem && (
            <audio
              ref={audioRef}
              src={currentItem.audioUrl}
              preload="auto"
            />
          )}
        </div>
      </Container>
    </Layout>
  );
};
export default DictationSessionPage;
