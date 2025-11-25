import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Volume2, ArrowRight, Check, X } from "lucide-react";
import { toast } from "sonner";

type QuizType = "pronunciation" | "meaning";
type SlangTerm = { id: number; term: string; meaning: string; pronunciation: string; example: string | null; createdAt: Date };

export default function Quiz() {
  const { user, isAuthenticated } = useAuth();
  const [quizType, setQuizType] = useState<QuizType | null>(null) as [QuizType | null, any];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizTerms, setQuizTerms] = useState<SlangTerm[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const slangQuery = trpc.slang.getRandomTerms.useQuery({ count: 10 });
  const recordAnswerMutation = trpc.quiz.recordAnswer.useMutation();
  const statsQuery = trpc.quiz.getUserStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (slangQuery.data) {
      setQuizTerms(slangQuery.data);
    }
  }, [slangQuery.data]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">Please sign in to take the quiz and track your progress.</p>
            <Link href="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="mb-8">← Back</Button>
          </Link>

          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Quiz Type</h1>
            <p className="text-lg text-gray-600 mb-12">
              Select how you want to test your Gen-Z slang knowledge
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <Card
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-purple-500"
                onClick={() => setQuizType("pronunciation")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="w-6 h-6 text-purple-600" />
                    Pronunciation Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Listen to the pronunciation of Gen-Z slang and identify the correct meaning.
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Start Quiz <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
                onClick={() => setQuizType("meaning")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    Meaning Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Read a slang term and choose the correct meaning from multiple options.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Start Quiz <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const accuracy = quizTerms.length > 0 ? Math.round((score / quizTerms.length) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                {accuracy}%
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Complete!</h1>
              <p className="text-xl text-gray-600 mb-8">
                You got {score} out of {quizTerms.length} correct
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Correct Answers</span>
                    <span className="text-2xl font-bold text-green-600">{score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Incorrect Answers</span>
                    <span className="text-2xl font-bold text-red-600">{quizTerms.length - score}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Accuracy</span>
                    <span className="text-2xl font-bold text-blue-600">{accuracy}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setQuizType(null);
                  setCurrentIndex(0);
                  setScore(0);
                  setAnswered(false);
                  setSelectedAnswer(null);
                  setQuizComplete(false);
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Try Again
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">View Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizTerms.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading Quiz...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse text-center">
              <p className="text-gray-600">Preparing your quiz...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizType) return null;
  const currentTerm = quizTerms[currentIndex];
  const options = generateOptions(currentTerm, quizTerms, quizType as "pronunciation" | "meaning");

  async function handleAnswer(optionIndex: number) {
    setSelectedAnswer(optionIndex);
    setAnswered(true);

    const isCorrect = quizType === "pronunciation" 
      ? options[optionIndex] === currentTerm.meaning
      : options[optionIndex] === currentTerm.term;

    if (isCorrect) {
      setScore(score + 1);
      toast.success("Correct! 🎉");
    } else {
      toast.error("Incorrect. Try again next time!");
    }

    await recordAnswerMutation.mutateAsync({
      slangTermId: currentTerm.id,
      quizType: quizType as "pronunciation" | "meaning",
      isCorrect,
    });

    setTimeout(() => {
      if (currentIndex < quizTerms.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-8">← Back</Button>
        </Link>

        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600">
                Question {currentIndex + 1} of {quizTerms.length}
              </span>
              <span className="text-sm font-semibold text-gray-600">
                Score: {score}/{quizTerms.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / quizTerms.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">
                {quizType === "pronunciation" ? "What does this mean?" : "What is this slang term?"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                {quizType === "pronunciation" ? (
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-20 text-lg"
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(currentTerm.pronunciation || "");
                        utterance.rate = 0.8;
                        speechSynthesis.speak(utterance);
                      }}
                    >
                      <Volume2 className="w-6 h-6 mr-2" />
                      Play Pronunciation
                    </Button>
                    <p className="text-sm text-gray-500">Phonetic: {currentTerm.pronunciation || "N/A"}</p>
                  </div>
                ) : (
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                    {currentTerm.term}
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectOption = quizType === "pronunciation" 
                    ? option === currentTerm.meaning
                    : option === currentTerm.term;

                  let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all";
                  if (!answered) {
                    buttonClass += " hover:border-purple-500 hover:bg-purple-50 cursor-pointer";
                  }
                  if (answered) {
                    if (isSelected && isCorrectOption) {
                      buttonClass += " border-green-500 bg-green-50";
                    } else if (isSelected && !isCorrectOption) {
                      buttonClass += " border-red-500 bg-red-50";
                    } else if (isCorrectOption) {
                      buttonClass += " border-green-500 bg-green-50";
                    } else {
                      buttonClass += " border-gray-200 opacity-50";
                    }
                  } else {
                    buttonClass += " border-gray-200";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => !answered && handleAnswer(index)}
                      disabled={answered}
                      className={buttonClass}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{option}</span>
                        {answered && isSelected && isCorrectOption && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                        {answered && isSelected && !isCorrectOption && (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                        {answered && !isSelected && isCorrectOption && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Example:</span> {currentTerm.example ? currentTerm.example : currentTerm.meaning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function generateOptions(
  currentTerm: SlangTerm,
  allTerms: SlangTerm[],
  quizType: "pronunciation" | "meaning"
): string[] {
  const correctAnswer = quizType === "pronunciation" ? currentTerm.meaning : currentTerm.term;
  const options = [correctAnswer];

  const otherTerms = allTerms.filter((t) => t.id !== currentTerm.id);
  while (options.length < 4 && otherTerms.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherTerms.length);
    const randomTerm = otherTerms[randomIndex];
    const randomOption = quizType === "pronunciation" ? randomTerm.meaning : randomTerm.term;

    if (!options.includes(randomOption)) {
      options.push(randomOption);
    }
    otherTerms.splice(randomIndex, 1);
  }

  return options.sort(() => Math.random() - 0.5);
}
