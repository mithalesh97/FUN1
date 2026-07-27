import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Sparkles, Brain, Trophy } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="animate-pulse text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt={APP_TITLE} className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              {APP_TITLE}
            </h1>
          </div>
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hi, {user.name || "User"}!</span>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <Button
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
              size="sm"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Master Gen-Z Slang</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Learn Gen-Z Slang the Fun Way
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Test your knowledge of modern slang through interactive pronunciation and meaning quizzes. 
            Learn what Gen-Z is actually saying and keep up with the trends.
          </p>

          {isAuthenticated ? (
            <Link href="/quiz-setup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                Start Quiz
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Sign In to Start
            </Button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Pronunciation Quiz</CardTitle>
              <CardDescription>Learn how to say Gen-Z slang correctly</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Hear the pronunciation and test your knowledge with interactive audio-based questions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Meaning Quiz</CardTitle>
              <CardDescription>Understand what each slang term means</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Test your understanding of slang meanings with multiple-choice questions and examples.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>Monitor your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Keep track of your scores, streaks, and improvement over time with detailed statistics.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/50 backdrop-blur-sm py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <p className="text-gray-600">Slang Terms to Learn</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
              <p className="text-gray-600">Quiz Types</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">∞</div>
              <p className="text-gray-600">Learning Potential</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 {APP_TITLE}. Learn Gen-Z slang one term at a time.</p>
        </div>
      </footer>
    </div>
  );
}
