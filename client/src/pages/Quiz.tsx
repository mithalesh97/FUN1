import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { Volume2, ArrowRight, Check, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type QuizType = "pronunciation" | "meaning";
type SlangTerm = {
  id: number;
  term: string;
  meaning: string;
  pronunciation: string;
  example: string | null;
  category: string;
  createdAt: Date;
};

export default function Quiz() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizTerms, setQuizTerms] = useState<SlangTerm[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [quizConfig, setQuizConfig] = useState<{ categories: string[]; quizLength: number } | null>(null);

  const recordAnswerMutation = trpc.quiz.recordAnswer.useMutation();
  const statsQuery = trpc.quiz.getUserStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const [quizInput, setQuizInput] = useState<{ categories: "all" | string[]; quizLength: "10" | "20" | "30" | "100" } | null>(null);
  const getQuizTermsQuery = trpc.slang.getQuizTerms.useQuery(quizInput as any, {
    enabled: quizInput !== null,
  });

  useEffect(() => {
    // Load quiz configuration from sessionStorage
    const config = sessionStorage.getItem("quizConfig");
    if (config) {
      try {
        const parsed = JSON.parse(config);
        setQuizConfig(parsed);
        // Fetch quiz terms based on configuration
        setQuizInput({
          categories: parsed.categories.length > 0 ? parsed.categories : "all",
          quizLength: parsed.quizLength.toString() as "10" | "20" | "30" | "100",
        });
      } catch (error) {
        console.error("Error parsing quiz config:", error);
        setLocation("/quiz-setup");
      }
    } else {
      setLocation("/quiz-setup");
    }
  }, []);

  useEffect(() => {
    if (getQuizTermsQuery.data) {
      setQuizTerms(getQuizTermsQuery.data);
    }
  }, [getQuizTermsQuery.data]);

  useEffect(() => {
    if (quizTerms.length > 0 && currentIndex < quizTerms.length) {
      generateShuffledOptions();
    }
  }, [currentIndex, quizTerms, quizType]);

  const generateShuffledOptions = () => {
    if (!quizType || currentIndex >= quizTerms.length) return;

    const currentTerm = quizTerms[currentIndex];
    let options: string[];

    if (quizType === "pronunciation") {
      // For pronunciation quiz, shuffle pronunciations
      options = [currentTerm.pronunciation];
      const otherTerms = quizTerms.filter((_, i) => i !== currentIndex);
      const randomOthers = otherTerms
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((t) => t.pronunciation);
      options = [...options, ...randomOthers].sort(() => Math.random() - 0.5);
    } else {
      // For meaning quiz, shuffle meanings
      options = [currentTerm.meaning];
      const otherTerms = quizTerms.filter((_, i) => i !== currentIndex);
      const randomOthers = otherTerms
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((t) => t.meaning);
      options = [...options, ...randomOthers].sort(() => Math.random() - 0.5);
    }

    setShuffledOptions(options);
    setSelectedAnswer(null);
    setAnswered(false);
  };

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

  if (getQuizTermsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-600">Loading your quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
        <div className="container mx-auto px-4">
          <Link href="/quiz-setup">
            <Button variant="ghost" className="mb-8">
              ← Back
            </Button>
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
                  <p className="text-sm text-gray-500">
                    Test your listening and comprehension skills with audio-based questions.
                  </p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
                onClick={() => setQuizType("meaning")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="w-6 h-6 text-blue-600" />
                    Meaning Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Read the slang term and select the correct meaning from multiple choices.
                  </p>
                  <p className="text-sm text-gray-500">
                    Test your understanding of what each slang term means.
                  </p>
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
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl mb-4">Quiz Complete! 🎉</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    {accuracy}%
                  </p>
                  <p className="text-xl text-gray-600">
                    You got {score} out of {quizTerms.length} correct!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Correct Answers</p>
                    <p className="text-2xl font-bold text-purple-600">{score}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Questions</p>
                    <p className="text-2xl font-bold text-blue-600">{quizTerms.length}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    onClick={() => {
                      setLocation("/quiz-setup");
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Take Another Quiz
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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
            <CardTitle>No Questions Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">Could not load quiz questions. Please try again.</p>
            <Link href="/quiz-setup">
              <Button className="w-full">Back to Setup</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentTerm = quizTerms[currentIndex];
  const isCorrect =
    quizType === "pronunciation"
      ? shuffledOptions[selectedAnswer || 0] === currentTerm.pronunciation
      : shuffledOptions[selectedAnswer || 0] === currentTerm.meaning;

  const handleAnswer = async (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setAnswered(true);

    const correct =
      quizType === "pronunciation"
        ? shuffledOptions[optionIndex] === currentTerm.pronunciation
        : shuffledOptions[optionIndex] === currentTerm.meaning;

    if (correct) {
      setScore(score + 1);
      toast.success("Correct! 🎉");
    } else {
      toast.error("Incorrect. Try the next one!");
    }

    // Record the answer
    await recordAnswerMutation.mutateAsync({
      slangTermId: currentTerm.id,
      quizType,
      isCorrect: correct,
    });

    // Move to next question after a delay
    setTimeout(() => {
      if (currentIndex + 1 >= quizTerms.length) {
        setQuizComplete(true);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Question {currentIndex + 1} of {quizTerms.length}
              </span>
              <span className="text-sm font-semibold text-purple-600">Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / quizTerms.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                {quizType === "meaning" ? currentTerm.term : "What does this mean?"}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                {quizType === "pronunciation" ? "Identify the meaning of the pronunciation" : "Select the correct meaning"}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {quizType === "pronunciation" && (
                <div>
                  <p className="text-sm text-gray-600 mb-4">Listen to the pronunciation and select the correct meaning:</p>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(currentTerm.pronunciation);
                        window.speechSynthesis.speak(utterance);
                      }}
                      variant="outline"
                      size="lg"
                      className="gap-2"
                    >
                      <Volume2 className="w-5 h-5" />
                      Play Pronunciation
                    </Button>
                  </div>
                </div>
              )}

              {quizType === "meaning" && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-lg font-semibold text-gray-900">{currentTerm.term}</p>
                </div>
              )}

              {/* Example */}
              {currentTerm.example && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Example:</p>
                  <p className="text-gray-900 italic">"{currentTerm.example}"</p>
                </div>
              )}

              {/* Answer Options */}
              <div className="space-y-3">
                {shuffledOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !answered && handleAnswer(index)}
                    disabled={answered}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      answered
                        ? selectedAnswer === index
                          ? isCorrect
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                          : index === (quizType === "pronunciation" ? shuffledOptions.indexOf(currentTerm.pronunciation) : shuffledOptions.indexOf(currentTerm.meaning))
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                        : "border-gray-200 hover:border-purple-400 hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{option}</span>
                      {answered && selectedAnswer === index && (
                        <div>
                          {isCorrect ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      )}
                      {answered &&
                        index === (quizType === "pronunciation" ? shuffledOptions.indexOf(currentTerm.pronunciation) : shuffledOptions.indexOf(currentTerm.meaning)) &&
                        selectedAnswer !== index && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                    </div>
                  </button>
                ))}
              </div>

              {answered && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">
                    {isCorrect ? "Great job! 🎉" : "Here's the correct answer:"}
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {quizType === "pronunciation" ? currentTerm.meaning : currentTerm.pronunciation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {answered && currentIndex + 1 < quizTerms.length && (
            <div className="mt-6 text-center">
              <Button
                onClick={() => {
                  setCurrentIndex(currentIndex + 1);
                }}
                className="gap-2"
              >
                Next Question <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
