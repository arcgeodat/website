import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../ui/button';
import { Sun, Moon, Save, XCircle, Lock } from 'lucide-react';

const Settings: React.FC = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [editing, setEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    // Placeholder for save logic
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('Settings saved! (Not yet connected to backend)');
        setEditing(false);
    };

    const handleCancel = () => {
        setName(user?.name || '');
        setEmail(user?.email || '');
        setTheme('light');
        setEditing(false);
        setMessage('');
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Settings</h2>
            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={!editing}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={!editing}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant={theme === 'light' ? 'default' : 'outline'}
                            onClick={() => setTheme('light')}
                            className="flex items-center gap-2"
                            disabled={!editing}
                        >
                            <Sun className="h-4 w-4" /> Light
                        </Button>
                        <Button
                            type="button"
                            variant={theme === 'dark' ? 'default' : 'outline'}
                            onClick={() => setTheme('dark')}
                            className="flex items-center gap-2"
                            disabled={!editing}
                        >
                            <Moon className="h-4 w-4" /> Dark
                        </Button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
                    <div className="flex gap-2">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="New password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={!editing}
                        />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            disabled={!editing}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowPassword(v => !v)}
                            className="px-2"
                            disabled={!editing}
                        >
                            <Lock className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Password change is a placeholder for future implementation.</p>
                </div>
                <div className="flex gap-4 mt-8">
                    {editing ? (
                        <>
                            <Button type="submit" variant="default" className="flex items-center gap-2">
                                <Save className="h-4 w-4" /> Save
                            </Button>
                            <Button type="button" variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                                <XCircle className="h-4 w-4" /> Cancel
                            </Button>
                        </>
                    ) : (
                        <Button type="button" variant="default" onClick={() => setEditing(true)} className="flex items-center gap-2">
                            Edit
                        </Button>
                    )}
                </div>
                {message && <div className="text-green-600 font-medium mt-2">{message}</div>}
                <div className="pt-6 border-t mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">More settings coming soon...</h3>
                    <p className="text-gray-500 text-sm">You will be able to customize more preferences in the future.</p>
                </div>
            </form>
        </div>
    );
};

export default Settings; 