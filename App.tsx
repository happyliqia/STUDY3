
import React, { useState, useCallback } from 'react';
import { Question, GameState } from './types';
import { ANIMALS, TOTAL_QUESTIONS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');

  // 初始化题目
  const generateQuestions = useCallback(() => {
    const newQuestions: Question[] = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const isAdd = Math.random() > 0.5;
      let n1, n2, ans;
      if (isAdd) {
        ans = Math.floor(Math.random() * 11); // 0-10
        n1 = Math.floor(Math.random() * (ans + 1));
        n2 = ans - n1;
      } else {
        n1 = Math.floor(Math.random() * 11);
        n2 = Math.floor(Math.random() * (n1 + 1));
        ans = n1 - n2;
      }
      newQuestions.push({
        id: i,
        num1: n1,
        num2: n2,
        operator: isAdd ? '+' : '-',
        answer: ans
      });
    }
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setInputVal('');
  }, []);

  const startGame = () => {
    generateQuestions();
    setGameState(GameState.QUIZ);
  };

  const handleNext = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].userAnswer = parseInt(inputVal);
    setQuestions(updatedQuestions);

    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex(currentIndex + 1);
      setInputVal('');
    } else {
      setGameState(GameState.RESULT);
    }
  };

  const currentAnimal = ANIMALS[currentIndex % ANIMALS.length];
  const correctCount = questions.filter(q => q.userAnswer === q.answer).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-green-200">
        
        {/* Header */}
        <div className="bg-green-500 p-6 text-center text-white relative">
          <div className="absolute top-2 left-2 text-2xl">🌿</div>
          <div className="absolute top-2 right-2 text-2xl">🍂</div>
          <h1 className="text-3xl font-bold tracking-widest comic-font">森林数学大冒险</h1>
          <p className="text-sm opacity-90 mt-1">10以内加减法乐园</p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {gameState === GameState.START && (
            <div className="text-center space-y-6">
              <div className="text-8xl animate-bounce mb-4">🦁</div>
              <h2 className="text-2xl font-bold text-gray-700">准备好接受挑战了吗？</h2>
              <p className="text-gray-500">森林里的动物们都在等着你呢！</p>
              <button 
                onClick={startGame}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg transform transition active:scale-95 text-xl"
              >
                开始冒险 🚀
              </button>
            </div>
          )}

          {gameState === GameState.QUIZ && (
            <div className="space-y-8">
              <div className="flex justify-between items-center text-gray-400 font-bold">
                <span>第 {currentIndex + 1} 题</span>
                <span className="text-green-500">{currentIndex + 1} / {TOTAL_QUESTIONS}</span>
              </div>

              <div className={`p-6 rounded-3xl ${currentAnimal.color} text-center shadow-inner relative border-2 border-dashed border-gray-300`}>
                <div className="text-5xl mb-4">{currentAnimal.emoji}</div>
                <div className="text-lg font-bold text-gray-600 mb-2">{currentAnimal.name} 问：</div>
                <div className="text-5xl font-black text-gray-800 tracking-tighter flex justify-center items-center gap-4">
                  <span>{questions[currentIndex].num1}</span>
                  <span className="text-orange-500">{questions[currentIndex].operator}</span>
                  <span>{questions[currentIndex].num2}</span>
                  <span>=</span>
                  <span className="text-blue-600 underline decoration-dotted">?</span>
                </div>
              </div>

              <div className="space-y-4">
                <input 
                  autoFocus
                  type="number" 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && inputVal !== '' && handleNext()}
                  placeholder="输入答案..."
                  className="w-full text-center text-4xl font-bold p-4 border-4 border-green-200 rounded-2xl focus:outline-none focus:border-green-500 transition-colors"
                />
                <button 
                  disabled={inputVal === ''}
                  onClick={handleNext}
                  className={`w-full font-bold py-4 rounded-2xl shadow-md transition-all text-xl ${
                    inputVal === '' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white active:scale-95'
                  }`}
                >
                  确认答案
                </button>
              </div>
            </div>
          )}

          {gameState === GameState.RESULT && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-2">🏆</div>
                <h2 className="text-3xl font-bold text-gray-800">冒险结束！</h2>
                <p className="text-xl text-green-600 font-bold mt-2">
                  得分：{correctCount} / {TOTAL_QUESTIONS}
                </p>
              </div>

              <div className="max-h-64 overflow-y-auto pr-2 space-y-2 border-t border-b py-4">
                <h3 className="font-bold text-gray-600 flex items-center gap-2">
                  <i className="fas fa-list-check text-blue-500"></i> 成绩报告单
                </h3>
                {questions.map((q, idx) => {
                  const isCorrect = q.userAnswer === q.answer;
                  return (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="font-bold text-gray-700">
                        {q.num1} {q.operator} {q.num2} = {q.answer}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          你的回答: {q.userAnswer ?? '?'}
                        </span>
                        {isCorrect ? (
                          <span className="text-green-500">✅</span>
                        ) : (
                          <span className="text-red-500">❌</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={startGame}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg transform transition active:scale-95 text-xl flex items-center justify-center gap-2"
              >
                <i className="fas fa-rotate-right"></i>
                重玩一次
              </button>
            </div>
          )}
        </div>

        {/* Footer Decoration */}
        <div className="bg-green-50 p-3 flex justify-around items-center opacity-60">
          <span>🌲</span>
          <span>🌳</span>
          <span>🌻</span>
          <span>🌲</span>
          <span>🌳</span>
          <span>🍄</span>
        </div>
      </div>
    </div>
  );
};

export default App;
