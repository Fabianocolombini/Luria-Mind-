import React, { useState } from 'react';
import { Button, Card, Logo } from '../components/UI';
import { Mail, CheckCircle2 } from 'lucide-react';

interface Props {
  email: string;
  onVerified: () => void;
}

const EmailVerification: React.FC<Props> = ({ email, onVerified }) => {
  const [status, setStatus] = useState<'sent' | 'verifying' | 'success'>('sent');

  const simulateVerificationClick = () => {
    setStatus('verifying');
    setTimeout(() => {
        setStatus('success');
    }, 1500);
  };

  if (status === 'success') {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 text-center space-y-6 border-[#0ABAB5]">
                <div className="w-16 h-16 bg-[#0ABAB5]/20 rounded-full flex items-center justify-center mx-auto text-[#0ABAB5]">
                    <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
                <p className="text-slate-400">Your account has been successfully activated.</p>
                <Button fullWidth onClick={onVerified}>Continue to Setup</Button>
            </Card>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Logo size="lg" />
      <div className="h-8"></div>
      
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-[#0ABAB5]">
            <Mail className="h-8 w-8" />
        </div>
        
        <div>
            <h2 className="text-2xl font-bold text-white">Check your email</h2>
            <p className="text-slate-400 mt-2">
                We sent a verification link to <br/>
                <span className="font-medium text-white">{email}</span>
            </p>
        </div>

        <div className="bg-slate-900 p-4 rounded text-sm text-slate-500 border border-slate-800">
            <p><strong>Demo Mode:</strong> Click the button below to simulate clicking the link in your email.</p>
        </div>

        <Button fullWidth onClick={simulateVerificationClick} isLoading={status === 'verifying'}>
            Simulate "Verify Email" Click
        </Button>

        <Button variant="ghost" fullWidth size="sm" className="text-slate-500">
            Resend Email
        </Button>
      </Card>
    </div>
  );
};

export default EmailVerification;