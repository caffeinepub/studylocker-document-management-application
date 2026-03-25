import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Shield, Lock, FileText } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/studylocker-logo-transparent.dim_200x200.png" 
              alt="StudyLocker Logo" 
              className="h-10 w-10"
            />
            <h1 className="text-2xl font-bold text-primary">StudyLocker</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Hero */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white lg:text-5xl">
                  अपने दस्तावेज़ों को सुरक्षित रखें
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  StudyLocker के साथ अपने सभी शैक्षणिक और व्यक्तिगत दस्तावेज़ों को एक सुरक्षित स्थान पर संग्रहीत करें
                </p>
              </div>

              <div className="hidden lg:block">
                <img 
                  src="/assets/generated/document-upload-hero.dim_600x400.png" 
                  alt="Document Upload" 
                  className="rounded-2xl shadow-2xl"
                />
              </div>

              {/* Features */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-800/60">
                  <Shield className="h-6 w-6 flex-shrink-0 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">सुरक्षित संग्रहण</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">ब्लॉकचेन तकनीक से सुरक्षित</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-800/60">
                  <Lock className="h-6 w-6 flex-shrink-0 text-indigo-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">निजी एक्सेस</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">केवल आपके लिए उपलब्ध</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-800/60">
                  <FileText className="h-6 w-6 flex-shrink-0 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">सभी प्रकार के दस्तावेज़</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">PDF, छवियाँ, प्रमाणपत्र</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-800/60">
                  <LogIn className="h-6 w-6 flex-shrink-0 text-pink-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">आसान लॉगिन</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Internet Identity से</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="flex items-center justify-center">
              <Card className="w-full max-w-md border-2 shadow-2xl">
                <CardHeader className="space-y-3 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">StudyLocker में आपका स्वागत है</CardTitle>
                  <CardDescription className="text-base">
                    अपने दस्तावेज़ों तक पहुँचने के लिए लॉगिन करें
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Button
                      onClick={login}
                      disabled={isLoggingIn}
                      size="lg"
                      className="w-full text-lg font-semibold"
                    >
                      {isLoggingIn ? (
                        <>
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                          लॉगिन हो रहा है...
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 h-5 w-5" />
                          Internet Identity से लॉगिन करें
                        </>
                      )}
                    </Button>

                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>नोट:</strong> Internet Identity एक सुरक्षित और गोपनीय प्रमाणीकरण प्रणाली है जो आपकी पहचान की रक्षा करती है।
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
        <div className="container mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025. Built with ❤️ using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
