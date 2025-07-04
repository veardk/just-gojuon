import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useLanguage } from '@/stores/app-store';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CheckCircle, XCircle, RotateCcw, Home, Clock } from 'lucide-react';
import { KANA_BY_CATEGORY } from '@/constants/kana';
import { KanaCategory } from '@/types/kana';
const KANA_DATA = {
  basic: KANA_BY_CATEGORY[KanaCategory.SEION].map(k => ({
    romaji: k.romaji,
    hiragana: k.hiragana,
    katakana: k.katakana
  })),
  dakuten: KANA_BY_CATEGORY[KanaCategory.DAKUON].map(k => ({
    romaji: k.romaji,
    hiragana: k.hiragana,
    katakana: k.katakana
  })),
  handakuten: KANA_BY_CATEGORY[KanaCategory.HANDAKUON].map(k => ({
    romaji: k.romaji,
    hiragana: k.hiragana,
    katakana: k.katakana
  })),
  yoon: KANA_BY_CATEGORY[KanaCategory.YOON].map(k => ({
    romaji: k.romaji,
    hiragana: k.hiragana,
    katakana: k.katakana
  }))
};
interface Question {
  romaji: string;
  correctHiragana: string;
  correctKatakana: string;
  hiraganaOptions: string[];
  katakanaOptions: string[];
}
interface GameState {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  questions: Question[];
  selectedHiragana: string | null;
  selectedKatakana: string | null;
  isComplete: boolean;
  startTime: number;
  endTime: number | null;
  isTransitioning: boolean;
}
const RecognitionGamePage: React.FC = () => {
  const router = useRouter();
  const language = useLanguage();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!router.isReady) return;
    const { units, count, lang } = router.query;
    if (!units || !count) {
      router.push('/practice/recognition');
      return;
    }
    const selectedUnits = (units as string).split(',');
    const questionCount = parseInt(count as string);
    const allKana = selectedUnits.reduce((acc, unitId) => {
      const unitData = KANA_DATA[unitId as keyof typeof KANA_DATA];
      if (unitData) {
        acc.push(...unitData);
      }
      return acc;
    }, [] as typeof KANA_DATA.basic);
    if (allKana.length < 3) {
      router.push('/practice/recognition');
      return;
    }
    const questions = generateQuestions(allKana, questionCount);
    setGameState({
      currentQuestion: 0,
      totalQuestions: questionCount,
      score: 0,
      questions,
      selectedHiragana: null,
      selectedKatakana: null,
      isComplete: false,
      startTime: Date.now(),
      endTime: null,
      isTransitioning: false
    });
  }, [router.isReady, router.query]);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const generateQuestions = (kanaPool: typeof KANA_DATA.basic, count: number): Question[] => {
    const questions: Question[] = [];
    for (let i = 0; i < count; i++) {
      const correct = kanaPool[Math.floor(Math.random() * kanaPool.length)];
      const hiraganaOptions = [correct.hiragana];
      while (hiraganaOptions.length < 3) {
        const random = kanaPool[Math.floor(Math.random() * kanaPool.length)];
        if (!hiraganaOptions.includes(random.hiragana)) {
          hiraganaOptions.push(random.hiragana);
        }
      }
      const katakanaOptions = [correct.katakana];
      while (katakanaOptions.length < 3) {
        const random = kanaPool[Math.floor(Math.random() * kanaPool.length)];
        if (!katakanaOptions.includes(random.katakana)) {
          katakanaOptions.push(random.katakana);
        }
      }
      shuffleArray(hiraganaOptions);
      shuffleArray(katakanaOptions);
      questions.push({
        romaji: correct.romaji,
        correctHiragana: correct.hiragana,
        correctKatakana: correct.katakana,
        hiraganaOptions,
        katakanaOptions
      });
    }
    return questions;
  };
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  const handleSelection = (type: 'hiragana' | 'katakana', value: string) => {
    if (!gameState || gameState.isTransitioning) return;
    const currentQ = gameState.questions[gameState.currentQuestion];
    setGameState(prev => {
      if (!prev || prev.isTransitioning) return prev;
      const newState = {
        ...prev,
        [type === 'hiragana' ? 'selectedHiragana' : 'selectedKatakana']: value
      };
      if (newState.selectedHiragana && newState.selectedKatakana) {
        newState.isTransitioning = true;
        const hiraganaCorrect = (newState.selectedHiragana === currentQ.correctHiragana);
        const katakanaCorrect = (newState.selectedKatakana === currentQ.correctKatakana);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setGameState(prev => {
            if (!prev) return prev;
            const nextQuestion = prev.currentQuestion + 1;
            let newScore = prev.score;
            if (hiraganaCorrect && katakanaCorrect) {
              newScore += 1;
            }
            if (nextQuestion >= prev.totalQuestions) {
              return {
                ...prev,
                score: newScore,
                isComplete: true,
                endTime: Date.now(),
                isTransitioning: false
              };
            } else {
              return {
                ...prev,
                score: newScore,
                currentQuestion: nextQuestion,
                selectedHiragana: null,
                selectedKatakana: null,
                isTransitioning: false
              };
            }
          });
          timeoutRef.current = null;
        }, 1000);
      }
      return newState;
    });
  };
  const handleRestart = () => {
    if (!gameState) return;
    const questions = generateQuestions(
      gameState.questions.map(q => ({
        romaji: q.romaji,
        hiragana: q.correctHiragana,
        katakana: q.correctKatakana
      })),
      gameState.totalQuestions
    );
    setGameState({
      ...gameState,
      currentQuestion: 0,
      score: 0,
      questions,
      selectedHiragana: null,
      selectedKatakana: null,
      isComplete: false,
      startTime: Date.now(),
      endTime: null,
      isTransitioning: false
    });
  };
  if (!gameState) {
    return (
      <Layout>
        <Container className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-japanese-hiragana mx-auto"></div>
            <p className="mt-4 text-text-secondary">
              {language === 'zh' ? '正在加载游戏...' : 'Loading game...'}
            </p>
          </div>
        </Container>
      </Layout>
    );
  }
  const currentQ = gameState.questions[gameState.currentQuestion];
  const progress = ((gameState.currentQuestion + 1) / gameState.totalQuestions) * 100;
  return (
    <Layout>
      <Head>
        <title>{language === 'zh' ? '识别训练游戏 - Just Gojuon' : 'Recognition Game - Just Gojuon'}</title>
      </Head>
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          {!gameState.isComplete ? (
            <>
              {}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/practice/recognition')}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      {language === 'zh' ? '返回' : 'Back'}
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-text-secondary">
                      {language === 'zh' ? '题目' : 'Question'} {gameState.currentQuestion + 1} / {gameState.totalQuestions}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {language === 'zh' ? '得分' : 'Score'}: {gameState.score}
                    </div>
                  </div>
                </div>
                {}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-japanese-hiragana h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              {}
              <Card className="mb-8 text-center bg-gradient-to-r from-japanese-hiragana/5 to-japanese-katakana/5">
                <div className="py-12">
                  <h2 className="text-sm text-text-secondary mb-4">
                    {language === 'zh' ? '请选择对应的假名' : 'Select the corresponding kana'}
                  </h2>
                  <div className="text-6xl font-mono font-bold text-text-primary mb-8">
                    {currentQ.romaji}
                  </div>
                </div>
              </Card>
              {}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-japanese-hiragana mb-4 text-center">
                    {language === 'zh' ? '平假名' : 'Hiragana'}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {currentQ.hiraganaOptions.map((option, index) => {
                      const isSelected = gameState.selectedHiragana === option;
                      const isCorrect = option === currentQ.correctHiragana;
                      const showResult = gameState.selectedHiragana && gameState.selectedKatakana;
                      return (
                        <button
                          key={index}
                          onClick={() => handleSelection('hiragana', option)}
                          disabled={gameState.selectedHiragana !== null || gameState.isTransitioning}
                          className={`
                            h-16 text-2xl font-japanese rounded-lg border-2 transition-all
                            ${isSelected && showResult && isCorrect ? 'bg-semantic-success text-white border-semantic-success' : ''}
                            ${isSelected && showResult && !isCorrect ? 'bg-semantic-error text-white border-semantic-error' : ''}
                            ${!isSelected && showResult && isCorrect ? 'bg-semantic-success/20 border-semantic-success' : ''}
                            ${isSelected && !showResult ? 'bg-japanese-hiragana/20 border-japanese-hiragana' : ''}
                            ${!isSelected && !showResult ? 'bg-white border-gray-300 hover:border-japanese-hiragana hover:bg-japanese-hiragana/10' : ''}
                            disabled:cursor-not-allowed
                          `}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </Card>
                {}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-japanese-katakana mb-4 text-center">
                    {language === 'zh' ? '片假名' : 'Katakana'}
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {currentQ.katakanaOptions.map((option, index) => {
                      const isSelected = gameState.selectedKatakana === option;
                      const isCorrect = option === currentQ.correctKatakana;
                      const showResult = gameState.selectedHiragana && gameState.selectedKatakana;
                      return (
                        <button
                          key={index}
                          onClick={() => handleSelection('katakana', option)}
                          disabled={gameState.selectedKatakana !== null || gameState.isTransitioning}
                          className={`
                            h-16 text-2xl font-japanese rounded-lg border-2 transition-all
                            ${isSelected && showResult && isCorrect ? 'bg-semantic-success text-white border-semantic-success' : ''}
                            ${isSelected && showResult && !isCorrect ? 'bg-semantic-error text-white border-semantic-error' : ''}
                            ${!isSelected && showResult && isCorrect ? 'bg-semantic-success/20 border-semantic-success' : ''}
                            ${isSelected && !showResult ? 'bg-japanese-katakana/20 border-japanese-katakana' : ''}
                            ${!isSelected && !showResult ? 'bg-white border-gray-300 hover:border-japanese-katakana hover:bg-japanese-katakana/10' : ''}
                            disabled:cursor-not-allowed
                          `}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <Card className="text-center">
              <div className="py-12">
                <CheckCircle className="w-16 h-16 text-semantic-success mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-text-primary mb-4">
                  {language === 'zh' ? '练习完成！' : 'Practice Complete!'}
                </h2>
                <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-japanese-hiragana">
                        {gameState.score}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {language === 'zh' ? '正确题数' : 'Correct'}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-japanese-katakana">
                        {Math.round((gameState.score / gameState.totalQuestions) * 100)}%
                      </div>
                      <div className="text-sm text-text-secondary">
                        {language === 'zh' ? '准确率' : 'Accuracy'}
                      </div>
                    </div>
                  </div>
                  {gameState.endTime && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                        <Clock className="w-4 h-4" />
                        {language === 'zh' ? '用时' : 'Time'}: {Math.round((gameState.endTime - gameState.startTime) / 1000)}s
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleRestart}
                    className="bg-japanese-hiragana hover:bg-japanese-hiragana/90"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    {language === 'zh' ? '再次练习' : 'Practice Again'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/practice/recognition')}
                  >
                    {language === 'zh' ? '返回设置' : 'Back to Settings'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/')}
                  >
                    {language === 'zh' ? '返回首页' : 'Back to Home'}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Container>
    </Layout>
  );
};
export default RecognitionGamePage;
