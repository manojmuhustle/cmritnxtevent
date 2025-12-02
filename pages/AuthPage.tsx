import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { login, signup } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email.endsWith('@cmrit.ac.in') && email !== 'manojmuhustle@gmail.com') {
            setError('Only @cmrit.ac.in emails are allowed.');
            return;
        }

        const action = isLogin ? login : signup;
        const result = action(email, password);

        if (!result.success) {
            setError(result.message);
        } else {
            if(!isLogin) {
                setSuccess('Signup successful! Please log in.');
                setIsLogin(true);
                setEmail('');
                setPassword('');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/30 border border-white/20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                       <span className="text-brand-accent">CMR</span> NXT
                    </h1>
                    <p className="mt-2 text-gray-300">
                        {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center">{error}</div>}
                    {success && <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-center">{success}</div>}
                    <div className="relative">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-4 py-3 text-white bg-black/20 rounded-lg border border-white/20 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 peer"
                            placeholder=" "
                            required
                        />
                         <label
                            htmlFor="email"
                            className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-slate-800 px-2 peer-focus:px-2 peer-focus:text-brand-accent peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                        >
                            Email Address
                        </label>
                    </div>
                     <div className="relative">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-4 py-3 text-white bg-black/20 rounded-lg border border-white/20 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="password"
                            className="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-slate-800 px-2 peer-focus:px-2 peer-focus:text-brand-accent peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                        >
                            Password
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 text-white font-semibold bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg hover:from-brand-secondary hover:to-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                    <p className="text-center text-sm text-gray-400">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <button
                            type="button"
                            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                            className="font-medium text-brand-accent hover:underline ml-2"
                        >
                            {isLogin ? 'Sign up' : 'Login'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;