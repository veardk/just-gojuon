import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { KanaCategory } from '@/types/kana';
import { DictationDuration } from '@/types/dictation';
import { useLanguage } from '@/stores/app-store';
import { useDictationStore, useDictationConfig } from '@/stores/dictation-store';
import { KANA_BY_CATEGORY } from '@/constants/kana';
import { audioService } from '@/services/audio-service';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import CategorySelector from '@/components/learning/CategorySelector';
import {
  PenTool,
  RotateCcw,
  Clock,
  Volume2,
  BookOpen,
  Play
} from 'lucide-react';
const DictationConfigPage: React.FC = () => {
  const router = useRouter();
  const language = useLanguage();
  const config = useDictationConfig();
  const { updateConfig, updateAudioSettings, startDictation } = useDictationStore();

  // 智能音频预加载：只预加载选中类别的音频
  const selectedCharacters = useMemo(() => {
    return config.selectedCategories.flatMap(category =>
      KANA_BY_CATEGORY[category] || []
    );
  }, [config.selectedCategories]);

  // 使用音频服务进行智能预加载
  React.useEffect(() => {
    if (selectedCharacters.length > 0) {
      // 延迟预加载，避免阻塞页面
      setTimeout(() => {
        audioService.preloadAudios(selectedCharacters);
      }, 500);
    }
  }, [selectedCharacters]);
  const durationOptions: DictationDuration[] = [1, 3, 5, 10, 15, 30, 60];
  const handleStartDictation = () => {
    startDictation();
    router.push('/practice/dictation/session');
  };
  const handleCategoryChange = (categories: KanaCategory[]) => {
    updateConfig({ selectedCategories: categories });
  };
  const handleDurationChange = (duration: DictationDuration) => {
    updateConfig({ duration });
  };
  const handleAudioSettingChange = (key: keyof typeof config.audioSettings, value: number) => {
    updateAudioSettings({ [key]: value });
  };
  return (
    <Layout>
      <Head>
        <title>{language === 'zh' ? '五十音听写练习 - Just Gojuon' : 'Dictation Practice - Just Gojuon'}</title>
        <meta name="description" content="Configure your Japanese kana dictation practice session" />
      </Head>
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          {}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-japanese-hiragana rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-4 font-display">
              {language === 'zh' ? '五十音听写练习' : 'Kana Dictation Practice'}
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              {language === 'zh'
                ? '根据音频播放，在纸上写下听到的假名字符。音频会自动连续播放，每个音频重复3遍。'
                : 'Listen to audio and write down the kana characters on paper. Audio will play continuously with 3 repetitions each.'
              }
            </p>
          </div>
          {}
          <Card className="mb-8 bg-gradient-to-r from-primary-50 to-japanese-accent/10 border-primary-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {language === 'zh' ? '使用说明' : 'Instructions'}
              </h3>
              <div className="text-text-secondary space-y-3 max-w-3xl mx-auto text-left">
                <div className="flex items-start gap-3">
                  <PenTool className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p>
                    {language === 'zh'
                      ? '准备纸笔，听到音频后写下对应的假名字符或罗马音'
                      : 'Prepare paper and pen, write down the corresponding kana or romaji when you hear the audio'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p>
                    {language === 'zh'
                      ? '每个音频会连续播放指定次数，然后自动播放下一个'
                      : 'Each audio will play the specified number of times, then automatically play the next one'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p>
                    {language === 'zh'
                      ? '练习时间到达后会自动停止，您可以随时暂停或停止练习'
                      : 'Practice will stop automatically when time is up, you can pause or stop anytime'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Volume2 className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p>
                    {language === 'zh'
                      ? '可以调节音量、播放速度和间隔时间以适应您的学习节奏'
                      : 'Adjust volume, playback speed and interval time to match your learning pace'
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {}
            <Card className="h-fit">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-primary-500" />
                <h3 className="text-lg font-semibold text-text-primary">
                  {language === 'zh' ? '选择假名分类' : 'Select Kana Categories'}
                </h3>
              </div>
              <CategorySelector
                selectedCategories={config.selectedCategories}
                onCategoryChange={handleCategoryChange}
                multiple
              />
            </Card>
            {}
            <Card className="h-fit">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary-500" />
                <h3 className="text-lg font-semibold text-text-primary">
                  {language === 'zh' ? '练习时间' : 'Practice Duration'}
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {durationOptions.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => handleDurationChange(duration)}
                    className={`p-4 rounded-xl border-2 text-center transition-all duration-200 hover:scale-105 ${
                      config.duration === duration
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 text-text-secondary'
                    }`}
                  >
                    <div className="font-bold text-xl">{duration}</div>
                    <div className="text-xs font-medium mt-1">
                      {language === 'zh' ? '分钟' : 'min'}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>
          {}
          <Card className="bg-gradient-to-r from-gray-50 to-primary-50/30">
            <div className="flex items-center gap-2 mb-6">
              <Volume2 className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-text-primary">
                {language === 'zh' ? '音频设置' : 'Audio Settings'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {}
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 className="w-4 h-4 text-primary-500" />
                  <label className="text-sm font-medium text-text-primary">
                    {language === 'zh' ? '音量' : 'Volume'}
                  </label>
                </div>
                <div className="text-center mb-3">
                  <span className="text-lg font-bold text-primary-600">
                    {Math.round(config.audioSettings.volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.audioSettings.volume}
                  onChange={(e) => handleAudioSettingChange('volume', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer hover:bg-gray-300 transition-colors"
                />
              </div>
              {}
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Play className="w-4 h-4 text-primary-500" />
                  <label className="text-sm font-medium text-text-primary">
                    {language === 'zh' ? '播放速度' : 'Speed'}
                  </label>
                </div>
                <div className="text-center mb-3">
                  <span className="text-lg font-bold text-primary-600">
                    {config.audioSettings.playbackRate}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={config.audioSettings.playbackRate}
                  onChange={(e) => handleAudioSettingChange('playbackRate', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer hover:bg-gray-300 transition-colors"
                />
              </div>
              {}
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <label className="text-sm font-medium text-text-primary">
                    {language === 'zh' ? '音频间隔' : 'Interval'}
                  </label>
                </div>
                <div className="text-center mb-3">
                  <span className="text-lg font-bold text-primary-600">
                    {config.audioSettings.intervalTime}s
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={config.audioSettings.intervalTime}
                  onChange={(e) => handleAudioSettingChange('intervalTime', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer hover:bg-gray-300 transition-colors"
                />
              </div>
              {}
              <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <RotateCcw className="w-4 h-4 text-primary-500" />
                  <label className="text-sm font-medium text-text-primary">
                    {language === 'zh' ? '重复次数' : 'Repeats'}
                  </label>
                </div>
                <div className="text-center mb-3">
                  <span className="text-lg font-bold text-primary-600">
                    {config.audioSettings.repeatCount}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={config.audioSettings.repeatCount}
                  onChange={(e) => handleAudioSettingChange('repeatCount', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer hover:bg-gray-300 transition-colors"
                />
              </div>
            </div>
          </Card>
          {}
          <div className="text-center mt-8">
            {config.selectedCategories.length === 0 && (
              <div className="text-sm text-semantic-warning mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto">
                {language === 'zh'
                  ? '请至少选择一个假名分类。'
                  : 'Please select at least one kana category.'
                }
              </div>
            )}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartDictation}
                disabled={config.selectedCategories.length === 0}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Play className="w-6 h-6 mr-3" />
                {language === 'zh' ? '开始听写练习' : 'Start Dictation'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/')}
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-200"
              >
                {language === 'zh' ? '返回首页' : 'Back to Home'}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
};
export default DictationConfigPage;
