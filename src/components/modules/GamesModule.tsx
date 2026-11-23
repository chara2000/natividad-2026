import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  RotateCw,
  CheckCircle2,
  HelpCircle,
  Dice5,
  Volume2,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Music,
  ExternalLink,
  VolumeX,
  Award,
  Bell,
  PartyPopper,
  Users,
} from 'lucide-react';
import { soundFX } from '../../utils/audio';
import { fireHolidayConfetti, fireCelebrationCannons } from '../../utils/confetti';

interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AguinaldoGame {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  rules: string[];
  penalty: string;
  catchphrase: string;
}

const AGUINALDOS_GAMES: AguinaldoGame[] = [
  {
    id: 'si-no',
    title: 'Al Sí y al No',
    subtitle: 'El clásico rey de los aguinaldos colombianos',
    icon: '🗣️',
    rules: [
      'Durante la ronda, está estrictamente PROHIBIDO decir "Sí" o decir "No".',
      'Debes responder siempre con alternativas como "Correcto", "De acuerdo", "Para nada", "Jamás", "Negativo".',
      'El rival intentará hacerte preguntas tramposas y rápidas para que caigas.',
    ],
    penalty: '¡Quien pronuncie Sí o No pierde el punto de inmediato!',
    catchphrase: '¡Mis Aguinaldos!',
  },
  {
    id: 'dar-no-recibir',
    title: 'Dar y No Recibir',
    subtitle: 'Cuidado con lo que te pasan en la mano',
    icon: '✋',
    rules: [
      'Queda prohibido recibir directamente en la mano cualquier objeto que otra persona te ofrezca.',
      'Si te pasan un buñuelo, servilleta o vaso, pide que lo dejen sobre la mesa.',
      'Si lo tomas directamente de su mano, ¡has caído en la trampa!',
    ],
    penalty: 'El rival te gritará ¡Mis aguinaldos! y sumará el punto.',
    catchphrase: '¡Mis Aguinaldos!',
  },
  {
    id: 'estatua',
    title: 'Estatua',
    subtitle: 'Congelados al instante',
    icon: '🗿',
    rules: [
      'En cualquier momento inesperado de la reunión, alguien grita: "¡ESTATUA!".',
      'Todos los jugadores deben congelarse exactamente en la posición en la que estaban.',
      'No se puede mover un solo músculo, ni hablar ni pestañear exageradamente.',
      'El primero en reírse o moverse pierde.',
    ],
    penalty: 'El que se mueva cumple la penitencia familiar.',
    catchphrase: '¡Estatua!',
  },
  {
    id: 'pajita-boca',
    title: 'Pajita en Boca',
    subtitle: 'El pitillo o palillo infaltable',
    icon: '🥢',
    rules: [
      'Cada participante debe mantener un palillo o pajita (pitillo) visible en la boca durante la fiesta.',
      'En cualquier momento, un rival puede decirte: "¡Pajita en boca!".',
      'Si no la tienes puesta al responder o no la muestras de inmediato, ¡pierdes!',
    ],
    penalty: 'Punto para el rival y penitencia de la ruleta.',
    catchphrase: '¡Pajita en boca!',
  },
  {
    id: 'preguntar-no-responder',
    title: 'Preguntar y No Responder',
    subtitle: 'Guerra de preguntas rápidas',
    icon: '❓',
    rules: [
      'A cualquier pregunta que te hagan, debes responder OBLIGATORIAMENTE con otra pregunta.',
      'Ejemplo: "¿Quieres buñuelo?" -> "¿Acaso no se nota que tengo hambre?"',
      'Si respondes con una afirmación o dudas más de 3 segundos, pierdes.',
    ],
    penalty: 'El rival reclama el punto.',
    catchphrase: '¡Mis Aguinaldos!',
  },
];

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: '¿Cuántos días componen tradicionalmente la Novena de Aguinaldos?',
    options: ['7 días', '9 días', '12 días', '24 días'],
    correctAnswer: 1,
    explanation: '¡Exacto! Son 9 días (del 16 al 24 de diciembre), que representan los 9 meses de gestación de María.',
  },
  {
    question: '¿En qué fecha se celebra en Colombia la tradicional Noche de las Velitas?',
    options: ['7 de Diciembre', '16 de Diciembre', '24 de Diciembre', '31 de Diciembre'],
    correctAnswer: 0,
    explanation: '¡Muy bien! La noche del 7 de diciembre y madrugada del 8 se encienden velitas en honor a la Inmaculada Concepción.',
  },
  {
    question: '¿Cuál es el dulce tradicional colombiano infaltable que suele acompañarse con dulce de mora?',
    options: ['Arequipe solo', 'Natilla de maíz o panela', 'Arroz de leche', 'Flan de caramelo'],
    correctAnswer: 1,
    explanation: '¡La natilla! Acompañada con buñuelos recién fritos y dulce de mora o brevas.',
  },
  {
    question: '¿Quién popularizó el famoso villancico "Mi burrito sabanero"?',
    options: ['Pastor López', 'Hugo Blanco', 'Los Hispanos', 'Carlos Vives'],
    correctAnswer: 1,
    explanation: 'Fue compuesto por el músico venezolano Hugo Blanco en 1972 y grabado con el grupo infantil La Rondallita.',
  },
  {
    question: 'En el juego de aguinaldos, ¿qué gritas cuando la otra persona responde con la palabra prohibida en "Al sí y al no"?',
    options: ['¡Ganaste!', '¡Mis aguinaldos!', '¡Buñuelo!', '¡Inocente!'],
    correctAnswer: 1,
    explanation: '¡Gritas "¡Mis aguinaldos!" para reclamar el punto y el premio!',
  },
];

const PENALTIES = [
  '🥟 Cantar un villancico con un pedazo de buñuelo en la boca.',
  '🎅 Imitar la risa de Papá Noel (¡Ho, ho, ho!) durante 15 segundos con mucha emoción.',
  '💃 Bailar 30 segundos de "El hijo ausente" de Pastor López en el centro de la sala.',
  '👵 Darle un abrazo de 20 segundos a la persona de más edad en la reunión.',
  '🎁 Decirle 3 cumplidos sinceros y festivos a la persona que esté a tu izquierda.',
  '🎤 Cantar "Tutaina tuturuma" a capella sin reírte.',
  '☕ Servirle una taza de chocolate o bebida a tres personas del grupo.',
  '📖 Contar la anécdota navideña más divertida o vergonzosa de tu infancia.',
  '🦌 Caminar como Rodolfo el Reno durante una vuelta a la mesa.',
  '🤫 Jugar una ronda de "Dar y no recibir" con quien tengas al frente.',
];

const BINGO_TERMS = [
  'Natilla', 'Buñuelo', 'Pesebre', 'Pandereta', 'Pastor López',
  'Burrito Sabanero', 'Estrella', 'Velita', 'Farolito', 'Uvas',
  'Pavo Relleno', 'Champaña', 'Papas Rellenas', 'Campanas', 'FREE 🎄',
  'Duende', 'Papá Noel', 'Reyes Magos', 'Aguinaldos', 'Manzana Verde',
  'Música Bailable', 'Regalo', 'Corona Adviento', 'Brindis', 'Abrazo 00:00'
];

export const GamesModule: React.FC = () => {
  const [activeGameTab, setActiveGameTab] = useState<'bingo' | 'aguinaldos' | 'music' | 'wheel' | 'trivia'>('bingo');

  // Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState<string | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);

  // Trivia State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [triviaFinished, setTriviaFinished] = useState(false);

  // Bingo State
  const [bingoMode, setBingoMode] = useState<'card' | 'balotera'>('card');
  const [markedBingoCells, setMarkedBingoCells] = useState<number[]>([12]); // index 12 is FREE 🎄
  const [drawnBalls, setDrawnBalls] = useState<string[]>([]);
  const [currentBall, setCurrentBall] = useState<string | null>(null);
  const [isDrawingBall, setIsDrawingBall] = useState(false);

  // Aguinaldos State
  const [selectedAguinaldoIdx, setSelectedAguinaldoIdx] = useState(0);
  const [timerPreset, setTimerPreset] = useState(120);
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team1Name, setTeam1Name] = useState('Equipo Buñuelos');
  const [team2Name, setTeam2Name] = useState('Equipo Natilla');

  // Music State
  const [playingCarol, setPlayingCarol] = useState<string | null>(null);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            soundFX.playTimerBeep(true);
            fireHolidayConfetti();
            return 0;
          }
          if (prev <= 5) {
            soundFX.playTimerBeep(false);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedPenalty(null);
    soundFX.playMagicReveal();

    const randomAngle = Math.floor(Math.random() * 360) + 1440; // 4+ full rotations
    const newRotation = wheelRotation + randomAngle;
    setWheelRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const randomIndex = Math.floor(Math.random() * PENALTIES.length);
      setSelectedPenalty(PENALTIES[randomIndex]);
      soundFX.playJingleBell();
      fireHolidayConfetti();
    }, 2600);
  };

  const handleTriviaAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    setShowExplanation(true);

    const isCorrect = optionIdx === TRIVIA_QUESTIONS[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      soundFX.playPaymentChime();
    } else {
      soundFX.playClick();
    }
  };

  const handleNextTriviaQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuestionIndex + 1 < TRIVIA_QUESTIONS.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setTriviaFinished(true);
      soundFX.playVictoryFanfare();
      fireCelebrationCannons();
    }
  };

  const resetTrivia = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setTriviaFinished(false);
  };

  const toggleBingoCell = (index: number) => {
    soundFX.playClick();
    setMarkedBingoCells(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const getBingoColumn = (term: string) => {
    const idx = BINGO_TERMS.indexOf(term);
    if (idx < 0) return 'B';
    if (idx < 5) return 'B';
    if (idx < 10) return 'I';
    if (idx < 15) return 'N';
    if (idx < 20) return 'G';
    return 'O';
  };

  const handleDrawBall = () => {
    if (isDrawingBall) return;
    const candidates = BINGO_TERMS.filter(t => t !== 'FREE 🎄' && !drawnBalls.includes(t));
    if (candidates.length === 0) {
      soundFX.playVictoryFanfare();
      fireCelebrationCannons();
      return;
    }

    setIsDrawingBall(true);
    soundFX.playBingoBall();

    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * candidates.length);
      const picked = candidates[randomIdx];
      setDrawnBalls(prev => [picked, ...prev]);
      setCurrentBall(picked);
      setIsDrawingBall(false);
      soundFX.playJingleBell();
      fireHolidayConfetti();
    }, 600);
  };

  const handleResetBalotera = () => {
    soundFX.playClick();
    setDrawnBalls([]);
    setCurrentBall(null);
  };

  const handleShoutBingo = () => {
    soundFX.playVictoryFanfare();
    fireCelebrationCannons();
  };

  const handleStartTimer = () => {
    soundFX.playClick();
    setTimerRunning(true);
  };

  const handlePauseTimer = () => {
    soundFX.playClick();
    setTimerRunning(false);
  };

  const handleResetTimer = (presetSeconds?: number) => {
    soundFX.playClick();
    setTimerRunning(false);
    const secs = presetSeconds ?? timerPreset;
    setTimerSeconds(secs);
    if (presetSeconds) setTimerPreset(presetSeconds);
  };

  const handleTeamPoint = (team: 1 | 2) => {
    soundFX.playVictoryFanfare();
    fireHolidayConfetti();
    if (team === 1) setTeam1Score(prev => prev + 1);
    else setTeam2Score(prev => prev + 1);
  };

  const handlePlayCarol = (name: 'tutaina' | 'jingle' | 'noche') => {
    if (playingCarol === name) {
      soundFX.stopMelody();
      setPlayingCarol(null);
    } else {
      soundFX.playCarolSnippet(name);
      setPlayingCarol(name);
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300 flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" /> Entretenimiento y Tradición
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white">
            Juegos Navideños en Familia
          </h2>
          <p className="text-xs text-emerald-200/80 mt-0.5">
            Balotera virtual de bingo, retos de aguinaldos con cronómetro, música y villancicos.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/10 text-xs flex-wrap">
          {[
            { id: 'bingo', label: '🔮 Bingo & Balotera' },
            { id: 'aguinaldos', label: '🎯 Retos Aguinaldos' },
            { id: 'music', label: '🎶 Villancicos' },
            { id: 'wheel', label: '🎰 Ruleta' },
            { id: 'trivia', label: '🧠 Trivia' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playClick();
                setActiveGameTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeGameTab === tab.id
                  ? 'bg-amber-400 text-pine-950 shadow-sm'
                  : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* GAME 1: Ruleta Navideña de Penitencias */}
      {activeGameTab === 'wheel' && (
        <div className="max-w-xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-amber-400/30 text-center space-y-6 shadow-2xl">
          <div>
            <h3 className="text-xl font-bold font-cinzel text-white">
              Ruleta de Penitencias y Aguinaldos
            </h3>
            <p className="text-xs text-emerald-200/80 mt-1">
              Gira la ruleta y cumple el reto navideño frente a toda la familia.
            </p>
          </div>

          {/* Visual Wheel Display */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
            {/* Pointer on top */}
            <div className="absolute -top-3 z-20 text-amber-400 drop-shadow-md">
              <span className="text-3xl">▼</span>
            </div>

            {/* Rotating Circular Disc */}
            <div
              className="w-full h-full rounded-full border-4 border-amber-400 shadow-2xl overflow-hidden relative"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transition: isSpinning ? 'transform 2.5s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
                background: 'conic-gradient(#881337 0% 12.5%, #064e3b 12.5% 25%, #d97706 25% 37.5%, #be123c 37.5% 50%, #15803d 50% 62.5%, #b45309 62.5% 75%, #991b1b 75% 87.5%, #052e16 87.5% 100%)',
              }}
            >
              {/* Center decorative festive hub */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-pine-950 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-black text-xl shadow-inner">
                  🎄
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div>
            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className={`px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-pine-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all active:scale-95 ${
                isSpinning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
            >
              {isSpinning ? '¡Girando la ruleta mágica...!' : '¡Girar Ruleta Navideña! 🎲'}
            </button>
          </div>

          {/* Result announcement */}
          {selectedPenalty && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-berry-950/80 border-2 border-amber-400 shadow-xl animate-in zoom-in-95">
              <span className="text-xs uppercase font-bold text-amber-300 block mb-1">
                🎉 Reto Asignado:
              </span>
              <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {selectedPenalty}
              </p>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: Trivia Navideña Familiar */}
      {activeGameTab === 'trivia' && (
        <div className="max-w-xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl space-y-6">
          {!triviaFinished ? (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-amber-300 font-mono">
                  Pregunta {currentQuestionIndex + 1} de {TRIVIA_QUESTIONS.length}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Puntaje: {score}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-cinzel text-white leading-snug">
                  {TRIVIA_QUESTIONS[currentQuestionIndex].question}
                </h3>
              </div>

              <div className="space-y-2.5">
                {TRIVIA_QUESTIONS[currentQuestionIndex].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === TRIVIA_QUESTIONS[currentQuestionIndex].correctAnswer;

                  let btnStyle = 'bg-black/40 border-white/10 hover:border-amber-400/40 text-white';
                  if (showExplanation) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-600/30 border-emerald-400 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-600/30 border-rose-400 text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleTriviaAnswer(idx)}
                      disabled={showExplanation}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs font-semibold flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showExplanation && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-amber-400/30 text-xs text-amber-200 leading-relaxed">
                    <strong>Sabías que:</strong> {TRIVIA_QUESTIONS[currentQuestionIndex].explanation}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextTriviaQuestion}
                      className="px-5 py-2 rounded-xl bg-amber-500 text-pine-950 font-bold text-xs shadow-md"
                    >
                      {currentQuestionIndex + 1 < TRIVIA_QUESTIONS.length
                        ? 'Siguiente Pregunta →'
                        : 'Ver Resultados Finales 🏆'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 text-3xl">
                🏆
              </div>
              <h3 className="text-2xl font-bold font-cinzel text-white">
                ¡Trivia Completada!
              </h3>
              <p className="text-sm text-emerald-200">
                Obtuviste <strong>{score} de {TRIVIA_QUESTIONS.length}</strong> respuestas correctas.
              </p>
              <span className="inline-block text-xs text-amber-300 font-bold bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/40">
                {score >= 4 ? '🌟 ¡Experto Navideño Familiar!' : '🎄 ¡Buen intento! A comer más natilla'}
              </span>
              <div className="pt-4">
                <button
                  onClick={resetTrivia}
                  className="px-6 py-2.5 rounded-2xl bg-amber-500 text-pine-950 font-bold text-xs shadow-md"
                >
                  Jugar de Nuevo
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GAME 1: Bingo Navideño y Balotera Virtual */}
      {activeGameTab === 'bingo' && (
        <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl space-y-6">
          {/* Sub-mode Toggle */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-3">
            <div>
              <h3 className="text-xl font-bold font-cinzel text-white">
                {bingoMode === 'card' ? '🎟️ Mi Cartón de Bingo' : '🔮 Balotera Virtual Familiar'}
              </h3>
              <p className="text-xs text-emerald-200/70">
                {bingoMode === 'card'
                  ? 'Marca las casillas que vayan cantando en la reunión.'
                  : 'Saca las balotas al azar y canta el bingo para todos los familiares.'}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setBingoMode('card');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  bingoMode === 'card'
                    ? 'bg-amber-400 text-pine-950 shadow-sm'
                    : 'text-emerald-200/70 hover:text-white'
                }`}
              >
                🎟️ Mi Cartón
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setBingoMode('balotera');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  bingoMode === 'balotera'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 shadow-sm'
                    : 'text-emerald-200/70 hover:text-white'
                }`}
              >
                🔮 Balotera Virtual
              </button>
            </div>
          </div>

          {/* MODE A: CARTÓN INDIVIDUAL */}
          {bingoMode === 'card' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-300 font-semibold">
                  Toca una casilla para marcar o desmarcar:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setMarkedBingoCells([12]);
                  }}
                  className="text-xs text-rose-300 hover:underline cursor-pointer"
                >
                  Reiniciar cartón
                </button>
              </div>

              {/* 5x5 Grid */}
              <div className="grid grid-cols-5 gap-2">
                {BINGO_TERMS.map((term, index) => {
                  const isMarked = markedBingoCells.includes(index);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleBingoCell(index)}
                      className={`aspect-square p-1 rounded-xl text-center flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold transition-all border cursor-pointer ${
                        isMarked
                          ? 'bg-amber-400 border-amber-300 text-pine-950 shadow-md scale-95'
                          : 'bg-black/40 border-white/15 text-emerald-100 hover:border-amber-400/50'
                      }`}
                    >
                      {isMarked && <span className="text-[10px]">⭐</span>}
                      <span className="line-clamp-2 leading-tight">{term}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-emerald-300 font-bold">
                  {markedBingoCells.length} de 25 casillas marcadas.
                </span>
                <button
                  type="button"
                  onClick={handleShoutBingo}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-pine-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  🎉 ¡Gritar BINGO!
                </button>
              </div>
            </div>
          )}

          {/* MODE B: BALOTERA VIRTUAL PARA EL CANTOR */}
          {bingoMode === 'balotera' && (
            <div className="space-y-6">
              {/* Balotera Center Stage */}
              <div className="relative bg-gradient-to-b from-black/60 to-pine-950/60 rounded-3xl p-6 border border-amber-400/30 text-center space-y-4 shadow-inner">
                <div className="flex items-center justify-center">
                  <div
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-amber-400/60 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden transition-all ${
                      isDrawingBall
                        ? 'animate-spin scale-110 bg-amber-500/20 border-amber-300'
                        : 'bg-gradient-to-br from-amber-400 to-amber-600 text-pine-950 shadow-amber-500/30'
                    }`}
                  >
                    {isDrawingBall ? (
                      <span className="text-3xl animate-bounce">🎲</span>
                    ) : currentBall ? (
                      <>
                        <span className="text-xs font-black uppercase tracking-widest text-amber-950/70">
                          {getBingoColumn(currentBall)}
                        </span>
                        <span className="text-sm sm:text-base font-black font-cinzel leading-tight px-2 text-pine-950">
                          {currentBall}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-pine-950 px-2 leading-tight">
                        Presiona Sacar Balota
                      </span>
                    )}
                  </div>
                </div>

                {currentBall && !isDrawingBall && (
                  <div className="animate-in fade-in zoom-in-95">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
                      Balota #{drawnBalls.length}: Columna {getBingoColumn(currentBall)} - "{currentBall}"
                    </span>
                  </div>
                )}

                {/* Balotera Actions */}
                <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleDrawBall}
                    disabled={isDrawingBall || drawnBalls.length >= 24}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-pine-950 font-black text-sm shadow-xl shadow-amber-500/30 hover:scale-102 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Dice5 className="w-4 h-4" />
                    {isDrawingBall ? 'Revolviendo Balotera...' : 'Sacar Balota Navideña 🔮'}
                  </button>

                  <button
                    type="button"
                    onClick={handleShoutBingo}
                    className="px-4 py-3 rounded-2xl bg-emerald-800/40 hover:bg-emerald-800/60 border border-emerald-400/30 text-emerald-200 font-bold text-xs transition-all cursor-pointer"
                  >
                    🎉 ¡Confirmar BINGO!
                  </button>

                  <button
                    type="button"
                    onClick={handleResetBalotera}
                    className="px-3.5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status & Balotas Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-bold">
                    Balotas Cantadas ({drawnBalls.length} de 24):
                  </span>
                  <span className="text-white/60">
                    Faltan {24 - drawnBalls.length} balotas en la jaula
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto p-2 bg-black/40 rounded-2xl border border-white/10">
                  {BINGO_TERMS.filter(t => t !== 'FREE 🎄').map((term, i) => {
                    const isDrawn = drawnBalls.includes(term);
                    return (
                      <div
                        key={i}
                        className={`p-2 rounded-xl text-center text-[10px] font-bold border transition-all ${
                          isDrawn
                            ? 'bg-amber-400/90 text-pine-950 border-amber-300 shadow-sm'
                            : 'bg-black/30 border-white/5 text-white/40'
                        }`}
                      >
                        <span className="text-[9px] block text-white/60 font-mono">
                          {getBingoColumn(term)}
                        </span>
                        <span className="line-clamp-1">{term}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: Retos Tradicionales de Aguinaldos con Cronómetro y Marcador */}
      {activeGameTab === 'aguinaldos' && (
        <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl space-y-6">
          {/* Header */}
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold font-cinzel text-white">
              🎯 Retos Tradicionales de Aguinaldos
            </h3>
            <p className="text-xs text-emerald-200/80 mt-1">
              Juegos autóctonos de la Navidad colombiana con cronómetro para duelos y contador de puntos familiar.
            </p>
          </div>

          {/* Game Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AGUINALDOS_GAMES.map((game, idx) => (
              <button
                key={game.id}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setSelectedAguinaldoIdx(idx);
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  selectedAguinaldoIdx === idx
                    ? 'bg-amber-400 border-amber-300 text-pine-950 shadow-md font-bold scale-102'
                    : 'bg-black/40 border-white/10 text-white hover:border-amber-400/40'
                }`}
              >
                <span className="text-xl block mb-1">{game.icon}</span>
                <span className="text-xs font-bold block">{game.title}</span>
              </button>
            ))}
          </div>

          {/* Active Aguinaldo Card */}
          {(() => {
            const activeGame = AGUINALDOS_GAMES[selectedAguinaldoIdx];
            return (
              <div className="bg-black/40 rounded-3xl p-5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{activeGame.icon}</span>
                    <div>
                      <h4 className="text-lg font-bold font-cinzel text-amber-300">
                        {activeGame.title}
                      </h4>
                      <p className="text-xs text-emerald-200/70">{activeGame.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
                    ¡Grito: "{activeGame.catchphrase}"!
                  </span>
                </div>

                {/* Rules List */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                    📜 Reglas Oficiales:
                  </span>
                  <ul className="space-y-1 text-xs text-emerald-100/90 list-disc list-inside">
                    {activeGame.rules.map((rule, rIdx) => (
                      <li key={rIdx}>{rule}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-rose-300 font-semibold pt-1">
                    ⚠️ {activeGame.penalty}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Interactive Countdown Timer */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-pine-950/60 rounded-3xl p-5 border border-emerald-500/20 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Temporizador para Duelos de Aguinaldos
                </span>
              </div>

              {/* Preset buttons */}
              <div className="flex items-center gap-1.5 text-xs">
                {[
                  { label: '1 min', secs: 60 },
                  { label: '2 min', secs: 120 },
                  { label: '5 min', secs: 300 },
                ].map(p => (
                  <button
                    key={p.secs}
                    type="button"
                    onClick={() => handleResetTimer(p.secs)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer ${
                      timerPreset === p.secs
                        ? 'bg-amber-400 text-pine-950 border-amber-300'
                        : 'bg-black/30 text-white/70 border-white/10 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer Clock Display */}
            <div className="text-center py-2">
              <span className={`text-5xl sm:text-6xl font-black font-mono tracking-wider drop-shadow-lg ${
                timerSeconds <= 10 && timerRunning ? 'text-rose-400 animate-pulse' : 'text-amber-400'
              }`}>
                {formatTimer(timerSeconds)}
              </span>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-3">
              {!timerRunning ? (
                <button
                  type="button"
                  onClick={handleStartTimer}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold text-xs shadow-lg hover:scale-102 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> Iniciar Duelo
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePauseTimer}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-pine-950 font-bold text-xs shadow-lg hover:scale-102 active:scale-95 transition-all cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" /> Pausar
                </button>
              )}

              <button
                type="button"
                onClick={() => handleResetTimer()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
              </button>
            </div>
          </div>

          {/* Marcador de Duelos Familiar */}
          <div className="bg-black/40 rounded-3xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Marcador de Puntos Familiar
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setTeam1Score(0);
                  setTeam2Score(0);
                }}
                className="text-xs text-rose-300 hover:underline cursor-pointer"
              >
                Reiniciar puntos
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Team 1 */}
              <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-4 text-center space-y-2">
                <input
                  type="text"
                  value={team1Name}
                  onChange={e => setTeam1Name(e.target.value)}
                  className="w-full text-center font-bold text-xs text-emerald-300 bg-transparent border-b border-emerald-500/30 focus:outline-none"
                />
                <span className="text-4xl font-black text-white block font-mono">
                  {team1Score}
                </span>
                <button
                  type="button"
                  onClick={() => handleTeamPoint(1)}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  +1 ¡Mis Aguinaldos! 🎉
                </button>
              </div>

              {/* Team 2 */}
              <div className="bg-berry-950/40 border border-rose-500/20 rounded-2xl p-4 text-center space-y-2">
                <input
                  type="text"
                  value={team2Name}
                  onChange={e => setTeam2Name(e.target.value)}
                  className="w-full text-center font-bold text-xs text-rose-300 bg-transparent border-b border-rose-500/30 focus:outline-none"
                />
                <span className="text-4xl font-black text-white block font-mono">
                  {team2Score}
                </span>
                <button
                  type="button"
                  onClick={() => handleTeamPoint(2)}
                  className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  +1 ¡Mis Aguinaldos! 🎉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GAME 3: Villancicos, Música & Soundboard Navideño */}
      {activeGameTab === 'music' && (
        <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-amber-400/30 shadow-2xl space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold font-cinzel text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-300" /> Villancicos & Ambiente Festivo
            </h3>
            <p className="text-xs text-emerald-200/80 mt-1">
              Melodías navideñas sintetizadas en vivo, efectos de sonido festivos y listas de reproducción clásicas colombianas.
            </p>
          </div>

          {/* Section 1: Synthesizer Melodies */}
          <div className="bg-black/40 rounded-3xl p-5 border border-white/10 space-y-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              🎶 Melodías Navideñas Sintetizadas (100% Offline):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'tutaina', name: 'Tutaina Tuturuma', icon: '🥟' },
                { id: 'jingle', name: 'Jingle Bells', icon: '🔔' },
                { id: 'noche', name: 'Noche de Paz', icon: '🕊️' },
              ].map(carol => (
                <button
                  key={carol.id}
                  type="button"
                  onClick={() => handlePlayCarol(carol.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    playingCarol === carol.id
                      ? 'bg-amber-400 text-pine-950 border-amber-300 shadow-lg scale-102 font-bold'
                      : 'bg-black/30 border-white/10 text-white hover:border-amber-400/40'
                  }`}
                >
                  <span className="text-xl">{carol.icon}</span>
                  <span className="text-xs font-bold">{carol.name}</span>
                  <span className="text-[10px] text-emerald-300/80">
                    {playingCarol === carol.id ? '▶ Reproduciendo...' : 'Tocar melodía'}
                  </span>
                </button>
              ))}
            </div>

            {playingCarol && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.stopMelody();
                    setPlayingCarol(null);
                  }}
                  className="text-xs text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer font-bold"
                >
                  <VolumeX className="w-3.5 h-3.5" /> Detener melodía
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Soundboard */}
          <div className="bg-black/40 rounded-3xl p-5 border border-white/10 space-y-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              🪇 Soundboard de Efectos para la Novena:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => soundFX.playJingleBell()}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold text-center cursor-pointer transition-all active:scale-95"
              >
                <span className="text-2xl block mb-1">🔔</span>
                <span>Campanitas</span>
              </button>
              <button
                type="button"
                onClick={() => soundFX.playTambourine()}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold text-center cursor-pointer transition-all active:scale-95"
              >
                <span className="text-2xl block mb-1">🪇</span>
                <span>Pandereta</span>
              </button>
              <button
                type="button"
                onClick={() => soundFX.playVictoryFanfare()}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold text-center cursor-pointer transition-all active:scale-95"
              >
                <span className="text-2xl block mb-1">🎺</span>
                <span>Fanfarria</span>
              </button>
              <button
                type="button"
                onClick={() => soundFX.playMagicReveal()}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold text-center cursor-pointer transition-all active:scale-95"
              >
                <span className="text-2xl block mb-1">✨</span>
                <span>Mágico</span>
              </button>
            </div>
          </div>

          {/* Section 3: Colombian Christmas Playlists */}
          <div className="bg-emerald-950/40 rounded-3xl p-5 border border-emerald-500/20 space-y-3">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
              📻 Listas Recomendadas de Diciembre Colombiano:
            </span>
            <div className="space-y-2">
              {[
                {
                  title: 'Los 50 de Joselito & Clásicos Navideños',
                  desc: 'Música bailable de diciembre, chucu-chucu tradicional.',
                  search: 'Los 50 de Joselito Navidad Colombia',
                },
                {
                  title: 'Pastor López & Los Hispanos',
                  desc: 'El hijo ausente, Golpe con golpe, Traicionera.',
                  search: 'Pastor Lopez Navidad exitos',
                },
                {
                  title: 'Villancicos Tradicionales de Colombia',
                  desc: 'Tutaina, Mi burrito sabanero, Noche de paz, Hacia Belén.',
                  search: 'Villancicos Tradicionales de Colombia',
                },
              ].map((pl, pIdx) => (
                <div
                  key={pIdx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5 text-xs gap-3"
                >
                  <div>
                    <h5 className="font-bold text-white">{pl.title}</h5>
                    <p className="text-[11px] text-emerald-300/70">{pl.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://open.spotify.com/search/${encodeURIComponent(pl.search)}`, '_blank');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" /> Spotify
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(pl.search)}`, '_blank');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" /> YouTube
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
