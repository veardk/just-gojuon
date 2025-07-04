import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useLanguage } from '@/stores/app-store';
import { useDictationStats, useDictationConfig } from '@/stores/dictation-store';
import { CATEGORY_LABELS } from '@/constants/kana';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
const DictationResultPage: React.FC = () => {
  const router = useRouter();
  const language = useLanguage();
  const stats = useDictationStats();
  const config = useDictationConfig();
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}${language === 'zh' ? '分' : 'min'} ${secs}${language === 'zh' ? '秒' : 's'}`;
    }
    return `${secs}${language === 'zh' ? '秒' : 's'}`;
  };
  const getCompletionRate = (): number => {
    const plannedDuration = config.duration * 60;
    return Math.round((stats.sessionDuration / plannedDuration) * 100);
  };
  return (
    <Layout>
      <Head>
        <title>{language === 'zh' ? '练习完成 - Just Gojuon' : 'Practice Complete - Just Gojuon'}</title>
      </Head>
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          {}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-semantic-success to-japanese-accent rounded-2xl mb-4">
              <span className="text-white text-3xl">🎉</span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-4 font-display">
              {language === 'zh' ? '听写练习完成！' : 'Dictation Practice Complete!'}
            </h1>
            <p className="text-text-secondary">
              {language === 'zh' 
                ? '恭喜您完成了这次听写练习，继续保持学习的热情！'
                : 'Congratulations on completing this dictation practice session!'
              }
            </p>
          </div>
          {}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {formatDuration(stats.sessionDuration)}
              </div>
              <div className="text-sm text-text-secondary">
                {language === 'zh' ? '实际练习时长' : 'Actual Duration'}
              </div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-japanese-hiragana mb-2">
                {stats.totalPlayed}
              </div>
              <div className="text-sm text-text-secondary">
                {language === 'zh' ? '播放音频数' : 'Audio Played'}
              </div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-japanese-katakana mb-2">
                {getCompletionRate()}%
              </div>
              <div className="text-sm text-text-secondary">
                {language === 'zh' ? '完成度' : 'Completion Rate'}
              </div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-japanese-accent mb-2">
                {stats.categoriesUsed.length}
              </div>
              <div className="text-sm text-text-secondary">
                {language === 'zh' ? '练习分类' : 'Categories Used'}
              </div>
            </Card>
          </div>
          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {}
            <Card>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {language === 'zh' ? '练习配置' : 'Practice Configuration'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    {language === 'zh' ? '计划时长：' : 'Planned Duration:'}
                  </span>
                  <span className="font-medium">
                    {config.duration} {language === 'zh' ? '分钟' : 'minutes'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    {language === 'zh' ? '重复次数：' : 'Repetitions:'}
                  </span>
                  <span className="font-medium">
                    {config.audioSettings.repeatCount} {language === 'zh' ? '次' : 'times'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    {language === 'zh' ? '音频间隔：' : 'Audio Interval:'}
                  </span>
                  <span className="font-medium">
                    {config.audioSettings.intervalTime} {language === 'zh' ? '秒' : 'seconds'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    {language === 'zh' ? '播放速度：' : 'Playback Speed:'}
                  </span>
                  <span className="font-medium">
                    {config.audioSettings.playbackRate}x
                  </span>
                </div>
              </div>
            </Card>
            {}
            <Card>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {language === 'zh' ? '练习分类' : 'Practice Categories'}
              </h3>
              <div className="space-y-2">
                {stats.categoriesUsed.map((category) => (
                  <div key={category} className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                    <span className="text-text-primary">
                      {CATEGORY_LABELS[category][language]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          {}
          {stats.playedAudios && stats.playedAudios.length > 0 && (
            <Card className="mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                {language === 'zh' ? '播放记录' : 'Audio Playback Record'}
              </h3>
              <div className="max-h-60 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {stats.playedAudios.map((record, index) => (
                    <div
                      key={`${record.kanaId}-${index}`}
                      className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-japanese text-lg font-bold text-primary-600 mb-1">
                        {record.hiragana} / {record.katakana}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {record.romaji}
                      </div>
                      <div className="text-xs text-text-tertiary mt-1">
                        {language === 'zh' ? '重复' : 'x'}{record.repeatCount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-sm text-text-secondary text-center">
                {language === 'zh'
                  ? `共播放了 ${stats.playedAudios.length} 个音频`
                  : `Total ${stats.playedAudios.length} audio files played`
                }
              </div>
            </Card>
          )}
          {}
          <Card className="mb-8 bg-gradient-to-r from-primary-50 to-japanese-accent/10 border-primary-200">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {language === 'zh' ? '学习建议' : 'Learning Tips'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
              <div className="space-y-2">
                <p>
                  ✅ {language === 'zh'
                    ? '检查您写下的答案，对照上方播放记录确认正确性'
                    : 'Check your written answers against the playback record above for accuracy'
                  }
                </p>
                <p>
                  📚 {language === 'zh' 
                    ? '重点练习听错或不熟悉的假名字符'
                    : 'Focus on practicing kana characters you missed or found difficult'
                  }
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  🔄 {language === 'zh' 
                    ? '建议每天进行听写练习，提高听音辨识能力'
                    : 'Practice dictation daily to improve audio recognition skills'
                  }
                </p>
                <p>
                  📈 {language === 'zh' 
                    ? '逐步增加练习时长和难度，挑战更多分类'
                    : 'Gradually increase practice duration and difficulty with more categories'
                  }
                </p>
              </div>
            </div>
          </Card>
          {}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/practice/dictation')}
            >
              {language === 'zh' ? '再次练习' : 'Practice Again'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/chart')}
            >
              {language === 'zh' ? '查看假名表' : 'View Kana Chart'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/')}
            >
              {language === 'zh' ? '返回首页' : 'Back to Home'}
            </Button>
          </div>
          {}
          <Card className="mt-8">
            <div className="text-center text-sm text-text-secondary">
              <p>
                {language === 'zh' ? '练习开始时间：' : 'Started at: '}
                {stats.startTime.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}
              </p>
              {stats.endTime && (
                <p>
                  {language === 'zh' ? '练习结束时间：' : 'Ended at: '}
                  {stats.endTime.toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}
                </p>
              )}
            </div>
          </Card>
        </div>
      </Container>
    </Layout>
  );
};
export default DictationResultPage;
