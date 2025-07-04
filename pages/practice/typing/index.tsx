import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useLanguage } from '@/stores/app-store';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Eye,
  Keyboard,
  Target,
  RotateCcw,
  ExternalLink,
  Settings,
  CheckCircle
} from 'lucide-react';
const TypingPracticePage: React.FC = () => {
  const router = useRouter();
  const language = useLanguage();
  const [kanaType, setKanaType] = useState<'hiragana' | 'katakana' | 'all'>('hiragana');
  const [characterCount, setCharacterCount] = useState(100);
  const [showFurigana, setShowFurigana] = useState(true);
  const handleStartPractice = () => {
    const params = new URLSearchParams({
      kana: kanaType,
      chars: characterCount.toString(),
      furigana: showFurigana.toString(),
      lang: language 
    });
    const gameUrl = `/typing-game/index.html?${params.toString()}`;
    window.open(gameUrl, '_blank');
  };
  return (
    <Layout>
      <Head>
        <title>{language === 'zh' ? '打字训练 - Just Gojuon' : 'Typing Practice - Just Gojuon'}</title>
      </Head>
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          {}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-japanese-romaji rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-4 font-display">
              {language === 'zh' ? '假名打字训练' : 'Kana Typing Practice'}
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              {language === 'zh'
                ? '看假名字符，快速准确地输入对应的罗马音。提高您的假名识别速度和打字技能。'
                : 'See kana characters and type the corresponding romaji quickly and accurately. Improve your kana recognition speed and typing skills.'
              }
            </p>
            {}
            <div className="mt-4">
              <p className="text-sm text-text-secondary">
                {language === 'zh' ? '基于 ' : 'Based on '}
                <a
                  href="https://github.com/fleon/type-kana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  type-kana
                </a>
                {language === 'zh' ? ' 项目构建' : ' project'}
              </p>
            </div>
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
                      ? '仔细观察屏幕上显示的假名字符，然后使用键盘输入对应的罗马音'
                      : 'Carefully observe the kana characters displayed on screen, then type the corresponding romaji'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Keyboard className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p>
                    {language === 'zh'
                      ? '输入正确后会自动跳转到下一个字符，错误时可选择显示振假名提示'
                      : 'Automatically advance to next character when correct, optionally show furigana hints on mistakes'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p>
                    {language === 'zh'
                      ? '专注于准确性而非速度，打字速度会随着练习自然提升'
                      : 'Focus on accuracy over speed, typing speed will improve naturally with practice'
                    }
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                  <p>
                    {language === 'zh'
                      ? '基于开源项目 type-kana 构建，在新窗口中打开专业的打字训练界面'
                      : 'Built on open-source type-kana project, opens professional typing interface in new window'
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>
          {}
          <Card className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Keyboard className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-text-primary">
                {language === 'zh' ? '选择假名分类' : 'Select Kana Categories'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {}
              <div
                onClick={() => setKanaType('hiragana')}
                className={`
                  relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105
                  ${kanaType === 'hiragana'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 text-text-secondary'
                  }
                `}
              >
                {kanaType === 'hiragana' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-700">
                    HIRAGANA
                  </span>
                </div>
                <div className="text-lg font-semibold mb-1">
                  {language === 'zh' ? '平假名' : 'Hiragana'}
                </div>
                <div className="text-sm mb-2">
                  {language === 'zh' ? '日语基础文字' : 'Basic Japanese characters'}
                </div>
                <div className="font-japanese text-xl text-japanese-hiragana">
                  あいうえお
                </div>
              </div>
              {}
              <div
                onClick={() => setKanaType('katakana')}
                className={`
                  relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105
                  ${kanaType === 'katakana'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 text-text-secondary'
                  }
                `}
              >
                {kanaType === 'katakana' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    KATAKANA
                  </span>
                </div>
                <div className="text-lg font-semibold mb-1">
                  {language === 'zh' ? '片假名' : 'Katakana'}
                </div>
                <div className="text-sm mb-2">
                  {language === 'zh' ? '外来语文字' : 'Foreign word characters'}
                </div>
                <div className="font-japanese text-xl text-japanese-katakana">
                  アイウエオ
                </div>
              </div>
              {}
              <div
                onClick={() => setKanaType('all')}
                className={`
                  relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105
                  ${kanaType === 'all'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 text-text-secondary'
                  }
                `}
              >
                {kanaType === 'all' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="mb-2">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                    ALL
                  </span>
                </div>
                <div className="text-lg font-semibold mb-1">
                  {language === 'zh' ? '全部' : 'All'}
                </div>
                <div className="text-sm mb-2">
                  {language === 'zh' ? '随机混合练习' : 'Random mix practice'}
                </div>
                <div className="font-japanese text-xl">
                  <span className="text-japanese-hiragana">あ</span>
                  <span className="text-japanese-katakana">ア</span>
                </div>
              </div>
            </div>
            {}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-primary-500" />
                <h4 className="text-lg font-semibold text-text-primary">
                  {language === 'zh' ? '练习设置' : 'Practice Settings'}
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                {}
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-primary-500" />
                    <label className="text-sm font-medium text-text-primary">
                      {language === 'zh' ? '字符数量' : 'Character Count'}
                    </label>
                  </div>
                  <div className="text-center mb-3">
                    <span className="text-lg font-bold text-primary-600">
                      {characterCount} {language === 'zh' ? '个字符' : 'characters'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={characterCount}
                    onChange={(e) => setCharacterCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer hover:bg-gray-300 transition-colors"
                  />
                  <div className="flex justify-between text-xs text-text-secondary mt-2">
                    <span>10</span>
                    <span>500</span>
                  </div>
                </div>
                {}
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-primary-500" />
                    <label className="text-sm font-medium text-text-primary">
                      {language === 'zh' ? '辅助功能' : 'Assistance'}
                    </label>
                  </div>
                  <div className="flex items-center justify-center h-16">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showFurigana}
                        onChange={(e) => setShowFurigana(e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-text-primary">
                        {language === 'zh' ? '错误时显示振假名' : 'Show furigana on mistakes'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          {}
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleStartPractice}
                size="lg"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Keyboard className="w-6 h-6 mr-3" />
                {language === 'zh' ? '开始打字训练' : 'Start Typing Practice'}
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
export default TypingPracticePage;
