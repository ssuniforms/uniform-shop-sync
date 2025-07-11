import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, Eye, EyeOff, Package, Shield, Users, Award } from 'lucide-react';
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

    // Basic email validation
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
      console.log('Attempting login with:', { email, passwordLength: password.length });
      const success = await login(email, password);
      console.log('Login result:', success);
      
      if (success) {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in to SS Uniforms.",
        });
        navigate('/');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
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
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    setIsLoading(true);
    try {
      const success = await login(demoEmail, demoPassword);
      if (success) {
        toast({
          title: `Welcome ${role}!`,
          description: `Successfully logged in as ${role}.`,
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      toast({
        title: "Demo Login Failed",
        description: "Demo account not available. Please contact administrator.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-20 floating">
        <Package className="w-8 h-8 text-primary/20" />
      </div>
      <div className="absolute top-40 right-32 floating-delayed">
        <Shield className="w-6 h-6 text-secondary/20" />
      </div>
      <div className="absolute bottom-32 left-32 floating">
        <Users className="w-7 h-7 text-blue-500/20" />
      </div>
      <div className="absolute bottom-20 right-20 floating-delayed">
        <Award className="w-5 h-5 text-green-500/20" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo and branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-business mb-4 hover:scale-110 transition-transform duration-300">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text-primary mb-2">SS Uniforms</h1>
            <p className="text-muted-foreground">Delhi NCR's Premier Uniform Provider</p>
          </div>

          <Card className="shadow-business-xl border-0 bg-white/80 backdrop-blur-lg">
            <CardHeader className="space-y-1 text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-primary rounded-xl shadow-lg">
                  <LogIn className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Welcome Back</CardTitle>
              <CardDescription className="text-base">
                Sign in to access your SS Uniforms dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-11 bg-white/50 border-2 focus:border-primary transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className="h-11 bg-white/50 border-2 focus:border-primary transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-primary hover:shadow-business-hover transition-all duration-300 hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>

              {/* Demo accounts section */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground font-medium">Demo Accounts</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin('admin')}
                    disabled={isLoading}
                    className="h-10 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200 text-purple-700 hover:text-purple-800 transition-all duration-300"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Demo
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin('staff')}
                    disabled={isLoading}
                    className="h-10 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200 text-blue-700 hover:text-blue-800 transition-all duration-300"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Staff Demo
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link 
                  to="/signup" 
                  className="text-primary hover:text-primary-dark font-medium hover:underline transition-colors"
                >
                  Create Account
                </Link>
              </div>

              {/* Credentials info */}
              <div className="p-4 bg-gradient-to-r from-muted/30 to-muted/20 rounded-lg border border-muted/50">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-primary" />
                  Demo Credentials
                </h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span className="font-medium">Admin:</span>
                    <span className="font-mono">admin@ssuniforms.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Staff:</span>
                    <span className="font-mono">staff@ssuniforms.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Password:</span>
                    <span className="font-mono">Admin123! / Staff123!</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>© 2025 SS Uniforms. Trusted by 50+ schools across Delhi NCR.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;