import React, { useState } from 'react';
import { Button, Input, Card, Logo } from '../components/UI';
import { Smartphone, LockKeyhole } from 'lucide-react';

interface Props {
  onSuccess: () => void;
}

const MFA: React.FC<Props> = ({ onSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
        setIsLoading(false);
        if (code === '123456') { // Mock correct code
            onSuccess();
        } else {
            setError('Invalid code. Try 123456');
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Logo size="lg" />
      <div className="h-8"></div>

      <Card className="max-w-md w-full p-8 shadow-lg">
        <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-[#0ABAB5]">
                <Smartphone className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Two-Step Verification</h2>
            <p className="text-sm text-slate-400 mt-2">
                For your security, please enter the code sent to your registered email/phone.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input 
                    className="pl-10 text-center tracking-widest text-lg font-mono"
                    placeholder="000000"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    error={error}
                />
            </div>
            
            <div className="bg-slate-900 text-slate-400 text-xs p-3 rounded border border-slate-800">
                <strong>Hint:</strong> Use code 123456 for this demo.
            </div>

            <Button fullWidth type="submit" isLoading={isLoading}>
                Verify & Login
            </Button>
        </form>

        <div className="mt-6 text-center">
            <button className="text-sm text-[#0ABAB5] hover:underline">
                Didn't receive code? Resend
            </button>
        </div>
      </Card>
    </div>
  );
};

export default MFA;