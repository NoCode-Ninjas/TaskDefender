import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Lightbulb, Clock, Flag } from 'lucide-react';

interface QuickCaptureProps {
  onAddTask: (task: any) => void;
  isVoiceMode: boolean;
  onToggleVoice: () => void;
}

const QuickCapture: React.FC<QuickCaptureProps> = ({ onAddTask, isVoiceMode, onToggleVoice }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock suggestions based on common tasks
  const commonTasks = [
    'Review project proposal',
    'Call client about meeting',
    'Update website content',
    'Prepare presentation slides',
    'Send follow-up emails',
    'Complete code review',
    'Schedule team meeting',
    'Write blog post',
  ];

  useEffect(() => {
    if (input.length > 2) {
      const filtered = commonTasks.filter(task => 
        task.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 3));
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const handleSubmit = (taskTitle: string = input) => {
    if (!taskTitle.trim()) return;

    // Smart parsing of task input
    const priority = taskTitle.toLowerCase().includes('urgent') || taskTitle.includes('!') ? 'high' : 'medium';
    const dueToday = taskTitle.toLowerCase().includes('today') || taskTitle.toLowerCase().includes('asap');
    
    const task = {
      title: taskTitle.replace(/\s*(urgent|today|asap|!)\s*/gi, '').trim(),
      description: '',
      priority,
      status: 'todo' as const,
      dueDate: dueToday ? new Date() : undefined,
      tags: [],
      timeBlocks: [],
    };

    onAddTask(task);
    setInput('');
    setSuggestions([]);
  };

  const handleVoiceCapture = () => {
    if (!isVoiceMode) {
      onToggleVoice();
      return;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        alert('Voice recognition failed. Please try again.');
      };

      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser.');
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Quick Task Capture
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Add tasks in 2 taps
        </span>
      </div>

      <div className="space-y-4">
        {/* Input Area */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="What needs to be done? (e.g., 'Call client urgent', 'Review docs today')"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
            
            {/* Smart indicators */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {input.toLowerCase().includes('urgent') && (
                <Flag className="h-4 w-4 text-red-500" title="High Priority Detected" />
              )}
              {(input.toLowerCase().includes('today') || input.toLowerCase().includes('asap')) && (
                <Clock className="h-4 w-4 text-orange-500" title="Due Today Detected" />
              )}
            </div>
          </div>

          <button
            onClick={handleVoiceCapture}
            className={`p-3 rounded-lg transition-all duration-200 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : isVoiceMode
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            title={isVoiceMode ? 'Voice input enabled' : 'Enable voice input'}
          >
            {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim()}
            className="p-3 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* Smart Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Smart suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSubmit(suggestion)}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Voice Status */}
        {isVoiceMode && (
          <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400">
            <Mic className="h-4 w-4" />
            <span>
              {isListening ? 'Listening... Speak now!' : 'Voice mode enabled. Click mic to start.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickCapture;