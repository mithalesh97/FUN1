import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { BarChart3, TrendingUp, Flame, Target } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const statsQuery = trpc.quiz.getUserStats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">Please sign in to view your dashboard.</p>
            <Link href="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = statsQuery.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 cursor-pointer">
              Gen-Z Slang Quiz
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name || "User"}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || "User"}!</h2>
            <p className="text-lg text-gray-600">Here's your learning progress</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Quizzes</CardTitle>
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats?.totalQuizzes || 0}</div>
                <p className="text-xs text-gray-500 mt-1">quizzes completed</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Accuracy</CardTitle>
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats?.accuracy || 0}%</div>
                <p className="text-xs text-gray-500 mt-1">correct answers</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Current Streak</CardTitle>
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats?.streakCount || 0}</div>
                <p className="text-xs text-gray-500 mt-1">correct in a row</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Correct Answers</CardTitle>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats?.correctAnswers || 0}</div>
                <p className="text-xs text-gray-500 mt-1">out of {stats?.totalQuizzes || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Type Breakdown */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Pronunciation Quiz Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {stats?.pronunciationScore || 0}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: stats?.totalQuizzes
                        ? `${(((stats?.pronunciationScore || 0) / (stats?.totalQuizzes || 1)) * 100)}%`
                        : "0%",
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {stats?.totalQuizzes ? `${Math.round(((stats?.pronunciationScore || 0) / (stats?.totalQuizzes || 1)) * 100)}% success rate` : "No attempts yet"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Meaning Quiz Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stats?.meaningScore || 0}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: stats?.totalQuizzes
                        ? `${(((stats?.meaningScore || 0) / (stats?.totalQuizzes || 1)) * 100)}%`
                        : "0%",
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {stats?.totalQuizzes ? `${Math.round(((stats?.meaningScore || 0) / (stats?.totalQuizzes || 1)) * 100)}% success rate` : "No attempts yet"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Link href="/quiz">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                Take Another Quiz
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
