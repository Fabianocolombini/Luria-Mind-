import React, { useState } from 'react';
import { Button, Input, Card, Logo } from '../components/UI';
import { AppView, User, UserRole, AccountType } from '../types';
import { AlertCircle } from 'lucide-react';

interface LoginProps {
  onNavigate: (view: AppView) => void;
  onLoginSuccess: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulation: Check simple validation
      if (email === 'error@test.com' || password === 'wrong') {
        setError('Invalid email or password.');
        return;
      }

      if (email === 'unverified@test.com') {
          setError('You need to verify your email. Check your inbox.');
          return;
      }

      // Mock User
      const mockUser: User = {
        name: "Dr. Alice Smith",
        email: email,
        role: UserRole.Psychologist,
        accountType: AccountType.Independent,
        crpCrm: "CRP 06/12345",
        country: "Brazil",
        patientVolume: "11-25",
        isVerified: true,
        hasCompletedOnboarding: false, 
        credits: 0,
        plan: 'standard'
      };
      onLoginSuccess(mockUser);
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
         const mockUser: User = {
            name: `Dr. ${provider} User`,
            email: `user@${provider.toLowerCase()}.com`,
            role: UserRole.Psychologist,
            accountType: AccountType.Independent,
            crpCrm: "PENDING",
            country: "USA",
            patientVolume: "0",
            isVerified: true,
            hasCompletedOnboarding: false,
            credits: 0,
            plan: 'standard'
          };
          onLoginSuccess(mockUser);
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      
      <Card className="w-full max-w-md p-8 border-[#30363D] shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 mt-2 text-sm">Access your secure clinical dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
                <Input 
                    label="Professional Email"
                    placeholder="name@clinic.com" 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="space-y-1">
                    <Input 
                        label="Password"
                        placeholder="Enter your password" 
                        type="password"
                        required
                        canToggleVisibility
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <button type="button" className="text-xs font-medium text-[#0ABAB5] hover:text-[#089a95] transition-colors">
                            Forgot your password?
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 text-xs flex items-center font-medium">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                </div>
            )}

            <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                Sign In
            </Button>
        </form>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#30363D]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-[#161B22] px-3 text-slate-500 font-semibold">Or continue with</span>
            </div>
        </div>

        <div className="space-y-3">
            <Button variant="secondary" fullWidth onClick={() => handleSocialLogin('Google')}>
                <div className="flex items-center justify-center">
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </div>
            </Button>
            <Button variant="secondary" fullWidth onClick={() => handleSocialLogin('Microsoft')}>
                <div className="flex items-center justify-center">
                   <svg className="mr-3 h-5 w-5" viewBox="0 0 23 23">
                       <path fill="#f35325" d="M1 1h10v10H1z"/>
                       <path fill="#81bc06" d="M12 1h10v10H12z"/>
                       <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                       <path fill="#ffba08" d="M12 12h10v10H12z"/>
                   </svg>
                   Continue with Microsoft
               </div>
            </Button>
        </div>
      </Card>
      
      <p className="mt-8 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <button onClick={() => onNavigate(AppView.Register)} className="font-semibold text-[#0ABAB5] hover:text-[#089a95] transition-colors">
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;