import React from 'react';
import { Button, Logo, Card } from '../components/UI';
import { User } from '../types';
import { Mic, FileText, Plus, LogOut, Clock, Activity, Users } from 'lucide-react';

interface Props {
  user: User | null;
  onLogout: () => void;
}

const Dashboard: React.FC<Props> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Top Nav */}
      <nav className="bg-[#161B22] border-b border-[#30363D] px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <Logo size="md" />
        <div className="flex items-center space-x-6">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-white">{user?.name}</span>
                <span className="text-xs text-slate-400">{user?.role} • {user?.crpCrm}</span>
            </div>
            <div className="h-10 w-10 bg-[#0ABAB5]/20 border border-[#0ABAB5]/30 rounded-full flex items-center justify-center text-[#0ABAB5] font-bold">
                {user?.name?.charAt(0) || 'U'}
            </div>
            <Button variant="ghost" onClick={onLogout} title="Logout" className="text-slate-400 hover:text-white">
                <LogOut className="h-5 w-5" />
            </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 mt-4">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Clinical Dashboard</h1>
                <p className="text-slate-400 mt-1">Manage your sessions and patient data securely.</p>
            </div>
            <Button size="lg" className="shadow-[0_0_20px_rgba(10,186,181,0.2)]">
                <Plus className="mr-2 h-5 w-5" /> New Session
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Credits Card */}
            <Card className="p-6 bg-gradient-to-br from-[#0ABAB5]/10 to-[#161B22] border-[#0ABAB5]/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0ABAB5]/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#0ABAB5]/20 transition-all duration-500"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="font-semibold text-[#0ABAB5] text-sm uppercase tracking-wider">Analysis Credits</p>
                        <h2 className="text-5xl font-bold mt-3 text-white">{user?.credits || 0}</h2>
                        <p className="text-xs text-slate-400 mt-2">Free Trial Plan</p>
                    </div>
                    <div className="p-3 bg-[#0ABAB5]/20 rounded-xl text-[#0ABAB5] border border-[#0ABAB5]/20">
                        <Mic className="h-6 w-6" />
                    </div>
                </div>
            </Card>

             {/* Sessions Card */}
             <Card className="p-6 hover:border-slate-500 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#21262D] rounded-xl text-slate-300 border border-[#30363D]">
                        <FileText className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold bg-[#21262D] text-slate-400 px-2 py-1 rounded border border-[#30363D]">This Week</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">0</h3>
                <p className="text-sm text-slate-500">Sessions recorded</p>
            </Card>

            {/* Patients Card */}
            <Card className="p-6 hover:border-slate-500 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#21262D] rounded-xl text-slate-300 border border-[#30363D]">
                        <Users className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold bg-[#21262D] text-slate-400 px-2 py-1 rounded border border-[#30363D]">Active</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">0</h3>
                <p className="text-sm text-slate-500">Patients enrolled</p>
            </Card>
        </div>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Clock className="h-5 w-5 mr-3 text-[#0ABAB5]" /> Recent Activity
        </h2>
        
        <Card className="p-16 text-center border-dashed border-[#30363D] bg-[#161B22]/50">
            <div className="w-20 h-20 bg-[#21262D] rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600 shadow-inner">
                <Activity className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No sessions yet</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
                Upload an audio file or start a recording to generate your first neuropsychological report using Luria Mind's AI.
            </p>
            <Button variant="outline" className="border-slate-600 hover:border-white">Upload Audio File</Button>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;