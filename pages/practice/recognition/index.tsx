import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useLanguage } from '@/stores/app-store';
import { useAudioPreloader } from '@/hooks/useAudioPreloader';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Eye, Settings, RotateCcw, CheckCircle } from 'lucide-react';
import { KANA_BY_CATEGORY } from '@/constants/kana';
import { KanaCategory } from '@/types/kana';
const KANA_DATA = {
  basic: KANA_BY_CATEGORY[KanaCategory.SEION],
  dakuten: KANA_BY_CATEGORY[KanaCategory.DAKUON],
  handakuten: KANA_BY_CATEGORY[KanaCategory.HANDAKUON],
  yoon: KANA_BY_CATEGORY[KanaCategory.YOON]
};
const SOUND_UNITS = [
  { id: 'basic', name: { zh: '清音 (基础音节)', en: 'Basic Sounds' } },
  { id: 'dakuten', name: { zh: '浊音 (带点音节)', en: 'Voiced Sounds' } },
  { id: 'handakuten', name: { zh: '半浊音 (带圈音节)', en: 'Semi-voiced Sounds' } },
  { id: 'yoon', name: { zh: '拗音 (复合音节)', en: 'Contracted Sounds' } }
];
interface RecognitionConfig {
  selectedUnits: string[];
  questionCount: number;
}
const RecognitionPracticePage: React.FC = () => {
  const router = useRouter();
  const language = useLanguage();
  const [config, setConfig] = useState<RecognitionConfig>({
    selectedUnits: ['basic'],
    questionCount: 50
  });

  // 智能音频预加载：只预加载选中单元的音频
  const selectedCharacters = useMemo(() => {
    return config.selectedUnits.flatMap(unitId => {
      const kanaData = KANA_DATA[unitId as keyof typeof KANA_DATA];
      return kanaData || [];
    });
  }, [config.selectedUnits]);

  // 智能音频预加载：只预加载选中的单元，延迟加载
  useAudioPreloader({
    enabled: selectedCharacters.length > 0,
    characters: selectedCharacters,
    maxConcurrent: 2,
    priority: 'lazy'
  });
  const handleUnitToggle = (unitId: string) => {
    setConfig(prev => ({
      ...prev,
      selectedUnits: prev.selectedUnits.includes(unitId)
        ? prev.selectedUnits.filter(id => id !== unitId)
        : [...prev.selectedUnits, unitId]
    }));
  };
  const handleStartPractice = () => {
    const params = new URLSearchParams({
      units: config.selectedUnits.join(','),
      count: config.questionCount.toString(),
      lang: language
    });
    router.push(`/practice/recognition/game?${params.toString()}`);
  };
  const getTotalKanaCount = () => {
    return config.selectedUnits.reduce((total, unitId) => {
      return total + (KANA_DATA[unitId as keyof typeof KANA_DATA]?.length || 0);
    }, 0);
  };
  return (
    <Layout>
      <Head>
        <title>{language === 'zh' ? '识别训练 - Just Gojuon' : 'Recognition Practice - Just Gojuon'}</title>
      </Head>
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          {}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-japanese-katakana rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-4 font-display">
              {language === 'zh' ? '假名识别训练' : 'Kana Recognition Practice'}
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              {language === 'zh'
                ? '根据罗马音选择正确的平假名和片假名。提高您的假名识别准确度和反应速度。'
                : 'Select the correct hiragana and katakana based on romaji. Improve your kana recognition accuracy and reaction speed.'
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
                  <Eye className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p>
                    {language === 'zh'
                      ? '仔细观察屏幕上显示的罗马音拼写，然后选择对应的假名'
                      : 'Carefully observe the romaji spelling displayed on screen, then select the corresponding kana'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p>
                    {language === 'zh'
                      ? '从3个选项中选择正确的平假名和片假名，两个都选对才能得分'
                      : 'Choose the correct hiragana and katakana from 3 options each, both must be correct to score'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p>
                    {language === 'zh'
                      ? '两个选择都完成后会自动跳转到下一题，所有题目和选项都是随机生成的'
                      : 'Automatically advance to next question when both selections are complete, all questions and options are randomly generated'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Settings className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p>
                    {language === 'zh'
                      ? '可以选择不同的音节单元和调整题目数量以适应您的学习需求'
                      : 'Select different sound units and adjust question count to match your learning needs'
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>
          {}
          <Card className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-text-primary">
                {language === 'zh' ? '选择假名分类' : 'Select Kana Categories'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {SOUND_UNITS.map((unit) => {
                const isSelected = config.selectedUnits.includes(unit.id);
                const unitData = KANA_DATA[unit.id as keyof typeof KANA_DATA];
                const count = unitData?.length || 0;
                return (
                  <div
                    key={unit.id}
                    onClick={() => handleUnitToggle(unit.id)}
                    className={`
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105
                      ${isSelected
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 text-text-secondary'
                      }
                    `}
                  >
                    {}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {}
                    <div className="mb-2">
                      <span className={`
                        inline-block px-3 py-1 rounded-full text-sm font-medium
                        ${unit.id === 'basic' ? 'bg-pink-100 text-pink-700' :
                          unit.id === 'dakuten' ? 'bg-blue-100 text-blue-700' :
                          unit.id === 'handakuten' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }
                      `}>
                        {unit.id === 'basic' ? 'SEION' :
                         unit.id === 'dakuten' ? 'DAKUON' :
                         unit.id === 'handakuten' ? 'HANDAKUON' :
                         'YOON'
                        }
                      </span>
                    </div>
                    {}
                    <div className="text-lg font-semibold mb-1">
                      {unit.name[language].split(' (')[0]}
                    </div>
                    <div className="text-sm">
                      {count} {language === 'zh' ? '个字符' : 'characters'}
                    </div>
                  </div>
                );
              })}
            </div>
            {}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => {
                  const allUnits = SOUND_UNITS.map(unit => unit.id);
                  const isAllSelected = allUnits.every(id => config.selectedUnits.includes(id));
                  setConfig(prev => ({
                    ...prev,
                    selectedUnits: isAllSelected ? [] : allUnits
                  }));
                }}
                className="px-4 py-2 border-2 border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
              >
                {language === 'zh' ? '全选' : 'Select All'}
              </button>
              <button
                onClick={() => {
                  setConfig(prev => ({
                    ...prev,
                    selectedUnits: []
                  }));
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {language === 'zh' ? '重置' : 'Reset'}
              </button>
            </div>
            {}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-primary-500" />
                <h4 className="text-lg font-semibold text-text-primary">
                  {language === 'zh' ? '练习设置' : 'Practice Settings'}
                </h4>
              </div>
              <div className="max-w-md">
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-primary-500" />
                    <label className="text-sm font-medium text-text-primary">
                      {language === 'zh' ? '题目数量' : 'Question Count'}
                    </label>
                  </div>
                  <div className="text-center mb-3">
                    <span className="text-lg font-bold text-primary-600">
                      {config.questionCount} {language === 'zh' ? '题' : 'questions'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="10"
                    value={config.questionCount}
                    onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer hover:bg-gray-300 transition-colors"
                  />
                  <div className="flex justify-between text-xs text-text-secondary mt-2">
                    <span>10</span>
                    <span>200</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          {}
          <div className="text-center">
            {(config.selectedUnits.length === 0 || getTotalKanaCount() < 3) && (
              <div className="text-sm text-semantic-warning mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto">
                {language === 'zh'
                  ? '请至少选择一个音节单元，且假名总数不少于3个。'
                  : 'Please select at least one sound unit with minimum 3 kana characters.'
                }
              </div>
            )}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleStartPractice}
                size="lg"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                disabled={config.selectedUnits.length === 0 || getTotalKanaCount() < 3}
              >
                <Eye className="w-6 h-6 mr-3" />
                {language === 'zh' ? '开始识别训练' : 'Start Recognition Practice'}
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
export default RecognitionPracticePage;
