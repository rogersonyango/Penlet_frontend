import React, { useState, useEffect, useCallback } from 'react';
import { Microscope, Trophy, Clock, RotateCcw, Home, Zap, Heart, Leaf, Droplets } from 'lucide-react';
import { submitGameScore } from '../../../services/gamesApi';
import { useAppStore } from '../../../store/appStore';

const BiologyExplorer = ({ onExit }) => {
  const { theme } = useAppStore();
  const [gameState, setGameState] = useState('menu');
  const [difficulty, setDifficulty] = useState('easy');
  const [topic, setTopic] = useState('cells');
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(false);

  const difficultySettings = {
    easy: { questions: 10, timePerQuestion: 15, points: 10 },
    medium: { questions: 15, timePerQuestion: 12, points: 20 },
    hard: { questions: 20, timePerQuestion: 10, points: 30 },
    expert: { questions: 25, timePerQuestion: 8, points: 50 },
  };

  const questionBanks = {
    cells: [
      { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], correct: 1 },
      { question: 'What contains genetic material in a cell?', options: ['Cytoplasm', 'Nucleus', 'Cell membrane', 'Vacuole'], correct: 1 },
      { question: 'What produces proteins in the cell?', options: ['Ribosome', 'Nucleus', 'Mitochondria', 'Golgi apparatus'], correct: 0 },
      { question: 'What is the outer boundary of a cell?', options: ['Cell wall', 'Cell membrane', 'Cytoplasm', 'Nucleus'], correct: 1 },
      { question: 'What do plant cells have that animal cells do not?', options: ['Nucleus', 'Cell membrane', 'Cell wall', 'Mitochondria'], correct: 2 },
      { question: 'Where does photosynthesis occur?', options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Ribosome'], correct: 2 },
      { question: 'What is the jelly-like substance in cells?', options: ['Nucleus', 'Cytoplasm', 'Cell membrane', 'Vacuole'], correct: 1 },
      { question: 'What stores water in plant cells?', options: ['Nucleus', 'Mitochondria', 'Vacuole', 'Chloroplast'], correct: 2 },
      { question: 'What modifies and packages proteins?', options: ['Ribosome', 'Golgi apparatus', 'Nucleus', 'Lysosome'], correct: 1 },
      { question: 'What breaks down waste in cells?', options: ['Ribosome', 'Mitochondria', 'Lysosome', 'Chloroplast'], correct: 2 },
      { question: 'What controls what enters and exits the cell?', options: ['Nucleus', 'Cell membrane', 'Cytoplasm', 'Ribosome'], correct: 1 },
      { question: 'What is the basic unit of life?', options: ['Atom', 'Molecule', 'Cell', 'Tissue'], correct: 2 },
      { question: 'What type of cells have no nucleus?', options: ['Eukaryotic', 'Prokaryotic', 'Plant', 'Animal'], correct: 1 },
      { question: 'What are cells with a nucleus called?', options: ['Prokaryotic', 'Eukaryotic', 'Bacteria', 'Virus'], correct: 1 },
      { question: 'What provides support in plant cells?', options: ['Cell membrane', 'Cell wall', 'Cytoplasm', 'Nucleus'], correct: 1 },
      { question: 'What is the site of cellular respiration?', options: ['Chloroplast', 'Nucleus', 'Mitochondria', 'Ribosome'], correct: 2 },
      { question: 'What organelle contains digestive enzymes?', options: ['Lysosome', 'Ribosome', 'Nucleus', 'Vacuole'], correct: 0 },
      { question: 'What is the control center of the cell?', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi'], correct: 1 },
    ],
    body: [
      { question: 'How many chambers does the human heart have?', options: ['2', '3', '4', '5'], correct: 2 },
      { question: 'What carries oxygen in the blood?', options: ['Plasma', 'Platelets', 'Red blood cells', 'White blood cells'], correct: 2 },
      { question: 'What is the largest organ in the human body?', options: ['Liver', 'Brain', 'Skin', 'Heart'], correct: 2 },
      { question: 'What organ pumps blood throughout the body?', options: ['Lungs', 'Liver', 'Heart', 'Kidney'], correct: 2 },
      { question: 'What filters waste from the blood?', options: ['Liver', 'Kidneys', 'Lungs', 'Stomach'], correct: 1 },
      { question: 'What is the main function of red blood cells?', options: ['Fight infection', 'Carry oxygen', 'Clot blood', 'Digest food'], correct: 1 },
      { question: 'What protects the brain?', options: ['Ribcage', 'Spine', 'Skull', 'Pelvis'], correct: 2 },
      { question: 'What is the longest bone in the body?', options: ['Humerus', 'Tibia', 'Femur', 'Radius'], correct: 2 },
      { question: 'What connects muscles to bones?', options: ['Ligaments', 'Tendons', 'Cartilage', 'Joints'], correct: 1 },
      { question: 'What system includes the brain and spinal cord?', options: ['Circulatory', 'Respiratory', 'Nervous', 'Digestive'], correct: 2 },
      { question: 'What organ is responsible for digestion?', options: ['Liver', 'Stomach', 'Heart', 'Lungs'], correct: 1 },
      { question: 'How many bones are in the adult human body?', options: ['186', '206', '226', '246'], correct: 1 },
      { question: 'What is the body\'s largest muscle?', options: ['Bicep', 'Heart', 'Gluteus maximus', 'Quadriceps'], correct: 2 },
      { question: 'What produces insulin in the body?', options: ['Liver', 'Pancreas', 'Kidney', 'Stomach'], correct: 1 },
      { question: 'What is the main function of white blood cells?', options: ['Carry oxygen', 'Fight infection', 'Clot blood', 'Digest food'], correct: 1 },
      { question: 'What system removes carbon dioxide from blood?', options: ['Digestive', 'Circulatory', 'Respiratory', 'Excretory'], correct: 2 },
      { question: 'What part of the brain controls balance?', options: ['Cerebrum', 'Cerebellum', 'Medulla', 'Hypothalamus'], correct: 1 },
      { question: 'What is the average human body temperature?', options: ['35°C', '36°C', '37°C', '38°C'], correct: 2 },
      { question: 'What carries messages throughout the body?', options: ['Blood', 'Nerves', 'Muscles', 'Bones'], correct: 1 },
      { question: 'What helps blood to clot?', options: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma'], correct: 2 },
      { question: 'What is the smallest bone in the body?', options: ['Stapes (in ear)', 'Finger bone', 'Toe bone', 'Nose bone'], correct: 0 },
      { question: 'What organ produces bile?', options: ['Stomach', 'Pancreas', 'Liver', 'Gallbladder'], correct: 2 },
      { question: 'How many lungs do humans have?', options: ['1', '2', '3', '4'], correct: 1 },
    ],
    plants: [
      { question: 'What is photosynthesis?', options: ['Making food using light', 'Breathing', 'Growing roots', 'Reproducing'], correct: 0 },
      { question: 'What do plants absorb through their roots?', options: ['Oxygen', 'Carbon dioxide', 'Water and minerals', 'Sunlight'], correct: 2 },
      { question: 'What is the green pigment in plants?', options: ['Melanin', 'Hemoglobin', 'Chlorophyll', 'Carotene'], correct: 2 },
      { question: 'What gas do plants take in for photosynthesis?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], correct: 2 },
      { question: 'What gas do plants release during photosynthesis?', options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], correct: 2 },
      { question: 'What part of the plant makes seeds?', options: ['Root', 'Stem', 'Leaf', 'Flower'], correct: 3 },
      { question: 'What carries water up the plant?', options: ['Phloem', 'Xylem', 'Roots', 'Leaves'], correct: 1 },
      { question: 'What carries food down the plant?', options: ['Xylem', 'Phloem', 'Roots', 'Stem'], correct: 1 },
      { question: 'Where does most photosynthesis occur?', options: ['Roots', 'Stem', 'Leaves', 'Flowers'], correct: 2 },
      { question: 'What are the tiny pores on leaves called?', options: ['Stomata', 'Chloroplasts', 'Cells', 'Veins'], correct: 0 },
      { question: 'What anchors the plant in soil?', options: ['Stem', 'Leaves', 'Roots', 'Flowers'], correct: 2 },
      { question: 'What is the male part of a flower?', options: ['Pistil', 'Stamen', 'Petal', 'Sepal'], correct: 1 },
      { question: 'What is the female part of a flower?', options: ['Stamen', 'Pistil', 'Petal', 'Sepal'], correct: 1 },
      { question: 'What process do plants use at night?', options: ['Photosynthesis', 'Respiration', 'Germination', 'Pollination'], correct: 1 },
      { question: 'What helps in plant pollination?', options: ['Wind and insects', 'Rain', 'Snow', 'Earthquakes'], correct: 0 },
      { question: 'What is the first part to emerge from a seed?', options: ['Leaf', 'Root', 'Stem', 'Flower'], correct: 1 },
      { question: 'What type of plant has no flowers?', options: ['Fern', 'Rose', 'Sunflower', 'Tulip'], correct: 0 },
      { question: 'What gives flowers their color?', options: ['Chlorophyll', 'Pigments', 'Water', 'Minerals'], correct: 1 },
    ],
    ecosystems: [
      { question: 'What is a food chain?', options: ['Energy transfer sequence', 'Group of animals', 'Type of plant', 'Water cycle'], correct: 0 },
      { question: 'What are producers in an ecosystem?', options: ['Plants', 'Carnivores', 'Decomposers', 'Herbivores'], correct: 0 },
      { question: 'What is a herbivore?', options: ['Plant eater', 'Meat eater', 'Both plants and meat', 'Neither'], correct: 0 },
      { question: 'What is a carnivore?', options: ['Plant eater', 'Meat eater', 'Both plants and meat', 'Decomposer'], correct: 1 },
      { question: 'What is an omnivore?', options: ['Plant eater', 'Meat eater', 'Both plants and meat', 'Decomposer'], correct: 2 },
      { question: 'What breaks down dead organisms?', options: ['Producers', 'Consumers', 'Decomposers', 'Predators'], correct: 2 },
      { question: 'What is the primary source of energy in ecosystems?', options: ['Water', 'Soil', 'Sun', 'Wind'], correct: 2 },
      { question: 'What is a habitat?', options: ['Where an organism lives', 'What an organism eats', 'How an organism moves', 'When an organism sleeps'], correct: 0 },
      { question: 'What is a biome?', options: ['Small habitat', 'Large ecosystem', 'Single organism', 'Food chain'], correct: 1 },
      { question: 'What is the largest biome on Earth?', options: ['Desert', 'Forest', 'Ocean', 'Grassland'], correct: 2 },
      { question: 'What is symbiosis?', options: ['Competition', 'Close relationship between species', 'Predation', 'Migration'], correct: 1 },
      { question: 'What is mutualism?', options: ['Both organisms benefit', 'One benefits, one harmed', 'One benefits, other unaffected', 'Both harmed'], correct: 0 },
      { question: 'What is parasitism?', options: ['Both benefit', 'One benefits, one harmed', 'Both harmed', 'Neither affected'], correct: 1 },
      { question: 'What is the role of predators?', options: ['Control prey population', 'Produce food', 'Decompose matter', 'Fix nitrogen'], correct: 0 },
      { question: 'What is biodiversity?', options: ['Variety of life', 'Number of plants', 'Amount of water', 'Soil quality'], correct: 0 },
      { question: 'What causes seasons?', options: ['Distance from sun', 'Earth\'s tilt', 'Moon phases', 'Ocean currents'], correct: 1 },
      { question: 'What is the water cycle?', options: ['Movement of water', 'Food production', 'Energy transfer', 'Carbon storage'], correct: 0 },
      { question: 'What is evaporation?', options: ['Water to gas', 'Gas to water', 'Ice to water', 'Water to ice'], correct: 0 },
      { question: 'What is condensation?', options: ['Water to gas', 'Gas to water', 'Ice to water', 'Water to ice'], correct: 1 },
      { question: 'What is precipitation?', options: ['Water vapor rising', 'Water falling as rain/snow', 'Water freezing', 'Water evaporating'], correct: 1 },
      { question: 'What is a food web?', options: ['Multiple interconnected food chains', 'Single food chain', 'Group of producers', 'Water system'], correct: 0 },
    ],
  };

  const getRandomQuestions = useCallback(() => {
    const bank = questionBanks[topic];
    const numQuestions = difficultySettings[difficulty].questions;
    const shuffled = [...bank].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  }, [difficulty, topic]);

  const startGame = () => {
    const newQuestions = getRandomQuestions();
    setQuestions(newQuestions);
    setCurrentQuestion(newQuestions[0]);
    setGameState('playing');
    setCurrentIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setStreak(0);
    setTimeLeft(difficultySettings[difficulty].timePerQuestion);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (optionIndex) => {
    if (answered) return;

    setAnswered(true);
    setSelectedAnswer(optionIndex);

    const isCorrect = optionIndex === currentQuestion.correct;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      let points = difficultySettings[difficulty].points;
      if (newStreak >= 5) points += 10;
      if (newStreak >= 10) points += 20;
      if (timeLeft > 5) points += timeLeft;

      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setCurrentQuestion(questions[currentIndex + 1]);
        setTimeLeft(difficultySettings[difficulty].timePerQuestion);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        endGame();
      }
    }, 1500);
  };

  useEffect(() => {
    if (gameState === 'playing' && !answered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && !answered && timeLeft === 0) {
      handleAnswer(-1);
    }
  }, [gameState, timeLeft, answered]);

  const endGame = async () => {
    setGameState('finished');
    
    try {
      const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
      
      await submitGameScore('biology-explorer', {
        score,
        time_taken: questions.length * difficultySettings[difficulty].timePerQuestion,
        accuracy,
        answers_correct: correctAnswers,
        answers_total: questions.length,
      });
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Microscope size={40} className="text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Biology Explorer
            </h1>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Explore cells, human body, plants, and ecosystems!
            </p>
          </div>

          <div className="mb-6">
            <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Topic
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'cells', label: 'Cells', icon: Microscope },
                { id: 'body', label: 'Human Body', icon: Heart },
                { id: 'plants', label: 'Plants', icon: Leaf },
                { id: 'ecosystems', label: 'Ecosystems', icon: Droplets },
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTopic(t.id)}
                    className={`p-3 rounded-lg font-medium capitalize ${
                      topic === t.id
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={20} className="inline mr-2" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Difficulty
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.keys(difficultySettings).map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`p-3 rounded-lg font-medium capitalize ${
                    difficulty === diff
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {diff}
                  <div className="text-xs mt-1">{difficultySettings[diff].questions} questions</div>
                </button>
              ))}
            </div>
          </div>

          <div className={`mb-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-emerald-50'}`}>
            <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              How to Play:
            </h3>
            <ul className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>✓ Choose your favorite biology topic</li>
              <li>✓ Answer multiple choice questions</li>
              <li>✓ Beat the timer for each question</li>
              <li>✓ Build streaks for bonus points</li>
              <li>✓ Learn about life science while playing!</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button onClick={startGame} className="btn btn-primary flex-1 py-4 text-lg">
              Start Exploring
            </button>
            <button 
              onClick={onExit} 
              className={`px-6 py-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              <Home size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center">
            <Trophy className="inline mb-1 text-yellow-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{score}</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Score</div>
          </div>
          <div className="card text-center">
            <Clock className="inline mb-1 text-blue-500" size={20} />
            <div className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-500' : theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {timeLeft}s
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Time</div>
          </div>
          <div className="card text-center">
            <Zap className="inline mb-1 text-emerald-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{streak} 🔥</div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Streak</div>
          </div>
          <div className="card text-center">
            <Microscope className="inline mb-1 text-purple-500" size={20} />
            <div className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {currentIndex + 1}/{questions.length}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Question</div>
          </div>
        </div>

        <div className="card mb-6">
          <div className="text-center py-8">
            <div className={`text-2xl md:text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {currentQuestion?.question}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answered}
                  className={`p-4 rounded-xl text-lg font-medium transition-all transform hover:scale-105 ${
                    answered
                      ? index === currentQuestion.correct
                        ? 'bg-green-500 text-white'
                        : index === selectedAnswer
                          ? 'bg-red-500 text-white'
                          : 'opacity-50 ' + (theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const accuracy = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="card text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
            <Trophy size={48} className="text-white" />
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Exploration Complete!
          </h2>
          <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Great biology knowledge!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-emerald-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{score}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Score</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{accuracy}%</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{streak}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Best Streak</div>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{correctAnswers}/{questions.length}</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Correct</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={startGame} className="btn btn-primary flex-1 py-4">
              <RotateCcw size={20} className="mr-2 inline" />
              Explore Again
            </button>
            <button 
              onClick={onExit}
              className={`px-6 py-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              <Home size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default BiologyExplorer;