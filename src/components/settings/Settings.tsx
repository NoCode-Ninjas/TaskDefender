import React, { useState } from 'react';
import { Save, Download, Upload, Trash2, Shield, Bell, Palette, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { StorageService } from '../../services/StorageService';

const Settings: React.FC = () => {
  const { settings, updateSettings, user, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState('general');
  const [exportData, setExportData] = useState('');

  const tabs = [
    { id: 'general', label: 'General', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'focus', label: 'Focus', icon: Clock },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Download },
  ];

  const handleExportData = async () => {
    try {
      const data = await StorageService.exportData();
      setExportData(data);
      
      // Download file
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `taskdefender-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export data');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result as string;
        await StorageService.importData(data);
        alert('Data imported successfully! Please refresh the page.');
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        await StorageService.clearAllData();
        alert('All data cleared successfully! Please refresh the page.');
      } catch (error) {
        alert('Failed to clear data');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your TaskDefender experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  General Settings
                </h2>

                {/* Profile */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Profile
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        onChange={(e) => updateUser({ name: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Work Style
                      </label>
                      <select
                        value={user?.workStyle || 'focused'}
                        onChange={(e) => updateUser({ workStyle: e.target.value as any })}
                        className="input-field"
                      >
                        <option value="focused">Deep Focus</option>
                        <option value="flexible">Flexible</option>
                        <option value="social">Collaborative</option>
                        <option value="independent">Independent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Theme */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Appearance
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.theme}
                      onChange={(e) => updateSettings({ theme: e.target.value as any })}
                      className="input-field"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Notification Settings
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.notifications.enabled}
                      onChange={(e) => updateSettings({
                        notifications: { ...settings.notifications, enabled: e.target.checked }
                      })}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-900 dark:text-gray-100">
                      Enable notifications
                    </span>
                  </label>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notification Types
                    </p>
                    {['reminder', 'deadline', 'achievement'].map((type) => (
                      <label key={type} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.notifications.types.includes(type)}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...settings.notifications.types, type]
                              : settings.notifications.types.filter(t => t !== type);
                            updateSettings({
                              notifications: { ...settings.notifications, types }
                            });
                          }}
                          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="text-gray-700 dark:text-gray-300 capitalize">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'focus' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Focus Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pomodoro Length (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.focus.pomodoroLength}
                      onChange={(e) => updateSettings({
                        focus: { ...settings.focus, pomodoroLength: parseInt(e.target.value) }
                      })}
                      className="input-field"
                      min="1"
                      max="60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Short Break (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.focus.shortBreakLength}
                      onChange={(e) => updateSettings({
                        focus: { ...settings.focus, shortBreakLength: parseInt(e.target.value) }
                      })}
                      className="input-field"
                      min="1"
                      max="30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Long Break (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.focus.longBreakLength}
                      onChange={(e) => updateSettings({
                        focus: { ...settings.focus, longBreakLength: parseInt(e.target.value) }
                      })}
                      className="input-field"
                      min="1"
                      max="60"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.focus.autoStartBreaks}
                      onChange={(e) => updateSettings({
                        focus: { ...settings.focus, autoStartBreaks: e.target.checked }
                      })}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-900 dark:text-gray-100">
                      Auto-start breaks
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.focus.autoStartPomodoros}
                      onChange={(e) => updateSettings({
                        focus: { ...settings.focus, autoStartPomodoros: e.target.checked }
                      })}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-900 dark:text-gray-100">
                      Auto-start pomodoros
                    </span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Privacy Settings
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.privacy.analytics}
                      onChange={(e) => updateSettings({
                        privacy: { ...settings.privacy, analytics: e.target.checked }
                      })}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-gray-900 dark:text-gray-100">
                        Anonymous Analytics
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Help improve TaskDefender by sharing anonymous usage data
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.privacy.externalMonitoring}
                      onChange={(e) => updateSettings({
                        privacy: { ...settings.privacy, externalMonitoring: e.target.checked }
                      })}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-gray-900 dark:text-gray-100">
                        External Monitoring
                      </span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow system-wide activity tracking for better insights
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Data Management
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Export Data
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Download all your TaskDefender data as a JSON file
                    </p>
                    <button
                      onClick={handleExportData}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export Data</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Import Data
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Restore your data from a previously exported file
                    </p>
                    <label className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <span>Import Data</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Clear All Data
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Permanently delete all your TaskDefender data
                    </p>
                    <button
                      onClick={handleClearData}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Clear All Data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;