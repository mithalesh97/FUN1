import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function QuizSetup() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLength, setSelectedLength] = useState<string>("10");
  const [isLoading, setIsLoading] = useState(false);

  const categoriesQuery = trpc.slang.getCategories.useQuery();
  const lengthsQuery = trpc.quiz.getQuizLengths.useQuery();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">Please sign in to customize your quiz.</p>
            <Link href="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (categoriesQuery.isLoading || lengthsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-600">Loading quiz options...</p>
        </div>
      </div>
    );
  }

  if (categoriesQuery.isError || lengthsQuery.isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Quiz Options</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">Failed to load quiz configuration. Please try again.</p>
            <Link href="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleStartQuiz = async () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category");
      return;
    }

    setIsLoading(true);
    try {
      // Store preferences in sessionStorage for the quiz page
      sessionStorage.setItem(
        "quizConfig",
        JSON.stringify({
          categories: selectedCategories,
          quizLength: parseInt(selectedLength),
        })
      );
      setLocation("/quiz");
    } catch (error) {
      console.error("Error starting quiz:", error);
      alert("Failed to start quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            ← Back
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Customize Your Quiz</h1>
            <p className="text-lg text-gray-600">
              Choose your categories and quiz length to get started
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Categories Section */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Select Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {!categoriesQuery.data || categoriesQuery.data.length === 0 ? (
                      <p className="text-gray-600 text-center py-4">No categories available</p>
                    ) : (
                      categoriesQuery.data.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between ${
                          selectedCategories.includes(category.id)
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <span className="font-medium text-gray-900">{category.label}</span>
                        {selectedCategories.includes(category.id) && (
                          <CheckCircle2 className="w-5 h-5 text-purple-600" />
                        )}
                      </button>
                    ))
                    )}

                    <button
                      onClick={() => {
                        if (selectedCategories.length === categoriesQuery.data?.length) {
                          setSelectedCategories([]);
                        } else {
                          setSelectedCategories(
                            categoriesQuery.data?.map((cat) => cat.id) || []
                          );
                        }
                      }}
                      className="w-full p-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      {selectedCategories.length === categoriesQuery.data?.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quiz Length Section */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Quiz Length</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {!lengthsQuery.data || lengthsQuery.data.length === 0 ? (
                      <p className="text-gray-600 text-center py-4">No quiz lengths available</p>
                    ) : (
                      lengthsQuery.data.map((length) => (
                      <button
                        key={length.value}
                        onClick={() => setSelectedLength(length.value.toString())}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left font-medium ${
                          selectedLength === length.value.toString()
                            ? "border-blue-500 bg-blue-50 text-blue-900"
                            : "border-gray-200 hover:border-blue-300 text-gray-900"
                        }`}
                      >
                        {length.label                        }
                      </button>
                    ))
                    )}
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Selected:</span> {selectedLength} questions
                      from {selectedCategories.length} categor{selectedCategories.length !== 1 ? "ies" : "y"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Start Button */}
          <div className="mt-12 flex gap-4 justify-center">
            <Button
              onClick={handleStartQuiz}
              disabled={isLoading || selectedCategories.length === 0}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Start Quiz <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
