import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, Eye, EyeOff, Package, Shield, Users, Award, Sparkles, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔐 Starting login process for:', email);
      console.log('📧 Email validation passed');
      console.log('🔑 Password length:', password.length);
      
      const success = await login(email, password);
      console.log('✅ Login attempt result:', success);
      
      if (success) {
        toast({
          title: "🎉 Welcome back!",
          description: "Successfully logged in to SS Uniforms.",
        });
        navigate('/');
      } else {
        console.error('❌ Login failed - invalid credentials');
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('💥 Login error caught:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'staff') => {
    const demoCredentials = {
      admin: { email: 'admin@ssuniforms.com', password: 'Admin123!' },
      staff: { email: 'staff@ssuniforms.com', password: 'Staff123!' }
    };

    const { email: demoEmail, password: demoPassword } = demoCredentials[role];
    
    console.log(`🎭 Demo login attempt for ${role}:`, demoEmail);
    
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    setIsLoading(true);
    try {
      const success = await login(demoEmail, demoPassword);
      if (success) {
        toast({
          title: `🎉 Welcome ${role.charAt(0).toUpperCase() + role.slice(1)}!`,
          description: `Successfully logged in as ${role}.`,
        });
        navigate('/');
      } else {
        console.error(`❌ Demo ${role} login failed`);
        toast({
          title: "Demo Login Failed",
          description: `Demo ${role} account not available. Please contact administrator.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`💥 Demo ${role} login error:`, error);
      toast({
        title: "Demo Login Error",
        description: "Demo account temporarily unavailable. Please try manual login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-cyan-500/20 animate-gradient-x"></div>
      
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 floating">
        <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-2xl">
          <Package className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute top-40 right-32 floating-delayed">
        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-xl">
          <Shield className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="absolute bottom-32 left-32 floating">
        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl">
          <Users className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute bottom-20 right-20 floating-delayed">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-xl">
          <Award className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="absolute top-1/3 left-10 floating">
        <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full shadow-lg">
          <Star className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="absolute top-2/3 right-10 floating-delayed">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo and branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl mb-6 hover:scale-110 transition-all duration-500 hover:rotate-6">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              SS Uniforms
            </h1>
            <p className="text-white/80 text-lg font-medium">Delhi NCR's Premier Uniform Provider</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          <Card className="shadow-2xl border-0 bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader className="space-y-1 text-center pb-4">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-500 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300">
                  <LogIn className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-white/70 text-lg">
                Sign in to access your SS Uniforms dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/90 text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-12 bg-white/10 border-2 border-white/20 focus:border-cyan-400 transition-all duration-300 text-white placeholder:text-white/50 backdrop-blur-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/90 text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className="h-12 bg-white/10 border-2 border-white/20 focus:border-cyan-400 transition-all duration-300 text-white placeholder:text-white/50 backdrop-blur-sm pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-600 hover:via-purple-700 hover:to-cyan-600 text-white font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] border-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              {/* Demo accounts section */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gradient-to-r from-purple-600 to-cyan-600 px-3 py-1 rounded-full text-white font-medium">Demo Accounts</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin('admin')}
                    disabled={isLoading}
                    className="h-11 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30 text-white hover:text-white transition-all duration-300 backdrop-blur-sm"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Demo
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin('staff')}
                    disabled={isLoading}
                    className="h-11 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/30 hover:from-cyan-500/30 hover:to-blue-500/30 text-white hover:text-white transition-all duration-300 backdrop-blur-sm"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Staff Demo
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-sm">
                <span className="text-white/70">Don't have an account? </span>
                <Link 
                  to="/signup" 
                  className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline transition-colors"
                >
                  Create Account
                </Link>
              </div>

              {/* Credentials info */}
              <div className="p-4 bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/20 backdrop-blur-sm">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-cyan-400" />
                  Demo Credentials
                </h4>
                <div className="space-y-2 text-xs text-white/80">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Admin:</span>
                    <span className="font-mono bg-white/10 px-2 py-1 rounded">admin@ssuniforms.com</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Staff:</span>
                    <span className="font-mono bg-white/10 px-2 py-1 rounded">staff@ssuniforms.com</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Password:</span>
                    <span className="font-mono bg-white/10 px-2 py-1 rounded">Admin123! / Staff123!</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-white/60">
            <p>© 2025 SS Uniforms. Trusted by 50+ schools across Delhi NCR.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;