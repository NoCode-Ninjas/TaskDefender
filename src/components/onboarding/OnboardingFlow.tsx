import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { User } from '../../types';

const OnboardingFlow: React.FC = () => {
  const { setUser, completeOnboarding } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    workStyle: 'focused' as 'focused' | 'flexible' | 'social' | 'independent',
    goals: [] as string[],
    sarcasticPersona: 'sarcastic-friend',
    privacyConsent: false,
  });

  const steps = [
    {
      title: 'Welcome to TaskDefender',
      subtitle: 'Your AI-powered productivity companion',
      component: WelcomeStep,
    },
    {
      title: 'Tell us about yourself',
      subtitle: 'Help us personalize your experience',
      component: PersonalInfoStep,
    },
    {
      title: 'Choose your work style',
      subtitle: 'How do you prefer to work?',
      component: WorkStyleStep,
    },
    {
      title: 'Set your goals',
      subtitle: 'What do you want to achieve?',
      component: GoalsStep,
    },
    {
      title: 'Choose your AI personality',
      subtitle: 'Pick your motivational style',
      component: PersonalityStep,
    },
    {
      title: 'Privacy & Permissions',
      subtitle: 'Your data, your choice',
      component: PrivacyStep,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      const user: User = {
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        role: 'user',
        integrityScore: 100,
        streak: 0,
        workStyle: formData.workStyle,
        goals: formData.goals,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(user);
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {steps[currentStep].subtitle}
            </p>
          </div>

          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
          />

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            <button
              onClick={handleNext}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Complete Setup
                  <Check className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Components
const WelcomeStep: React.FC<any> = () => (
  <div className="text-center space-y-6">
    <div className="text-6xl mb-4">🛡️</div>
    <div className="space-y-4">
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Welcome to TaskDefender, where productivity meets personality!
      </p>
      <p className="text-gray-600 dark:text-gray-400">
        We'll help you stay focused, motivated, and accountable with our unique blend of 
        task management and AI-powered motivation.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div className="text-2xl mb-2">🎯</div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Smart Tasks</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Intelligent task management with AI insights</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl mb-2">🤖</div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">AI Motivation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sarcastic AI that keeps you accountable</p>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl mb-2">🔒</div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Privacy First</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Your data stays private and secure</p>
        </div>
      </div>
    </div>
  </div>
);

const PersonalInfoStep: React.FC<any> = ({ formData, updateFormData }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        What's your name?
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => updateFormData({ name: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
        placeholder="Enter your name"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Email address
      </label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => updateFormData({ email: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
        placeholder="Enter your email"
      />
    </div>
  </div>
);

const WorkStyleStep: React.FC<any> = ({ formData, updateFormData }) => {
  const workStyles = [
    {
      id: 'focused',
      title: 'Deep Focus',
      description: 'Long, uninterrupted work sessions',
      icon: '🎯',
    },
    {
      id: 'flexible',
      title: 'Flexible',
      description: 'Adaptable schedule with varied tasks',
      icon: '🌊',
    },
    {
      id: 'social',
      title: 'Collaborative',
      description: 'Team-based work and communication',
      icon: '👥',
    },
    {
      id: 'independent',
      title: 'Independent',
      description: 'Self-directed with minimal oversight',
      icon: '🚀',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {workStyles.map((style) => (
        <button
          key={style.id}
          onClick={() => updateFormData({ workStyle: style.id as any })}
          className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
            formData.workStyle === style.id
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
          }`}
        >
          <div className="text-3xl mb-3">{style.icon}</div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {style.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {style.description}
          </p>
        </button>
      ))}
    </div>
  );
};

const GoalsStep: React.FC<any> = ({ formData, updateFormData }) => {
  const goalOptions = [
    'Increase productivity',
    'Better time management',
    'Reduce procrastination',
    'Improve focus',
    'Work-life balance',
    'Team collaboration',
    'Personal development',
    'Stress reduction',
  ];

  const toggleGoal = (goal: string) => {
    const currentGoals = formData.goals;
    const updatedGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    updateFormData({ goals: updatedGoals });
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Select all that apply (you can change these later):
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {goalOptions.map((goal) => (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              formData.goals.includes(goal)
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                formData.goals.includes(goal)
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {formData.goals.includes(goal) && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
              <span className="text-gray-900 dark:text-gray-100">{goal}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const PersonalityStep: React.FC<any> = ({ formData, updateFormData }) => {
  const personalities = [
    {
      id: 'sarcastic-friend',
      title: 'Sarcastic Friend',
      description: 'Witty remarks and playful mockery',
      example: '"Oh wow, another productive day of staring at your screen. Impressive."',
      icon: '😏',
    },
    {
      id: 'drill-sergeant',
      title: 'Drill Sergeant',
      description: 'Tough love with military precision',
      example: '"DROP AND GIVE ME TWENTY! And by twenty, I mean twenty minutes of actual work!"',
      icon: '🪖',
    },
    {
      id: 'disappointed-parent',
      title: 'Disappointed Parent',
      description: 'Gentle guilt trips and loving disappointment',
      example: '"I\'m not angry, I\'m just... disappointed. Again."',
      icon: '😔',
    },
    {
      id: 'motivational-coach',
      title: 'Motivational Coach',
      description: 'Positive energy and encouraging words',
      example: '"You\'ve got this! The only thing standing between you and success is action!"',
      icon: '💪',
    },
  ];

  return (
    <div className="space-y-4">
      {personalities.map((personality) => (
        <button
          key={personality.id}
          onClick={() => updateFormData({ sarcasticPersona: personality.id })}
          className={`w-full p-6 rounded-lg border-2 transition-all duration-200 text-left ${
            formData.sarcasticPersona === personality.id
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
          }`}
        >
          <div className="flex items-start">
            <div className="text-3xl mr-4">{personality.icon}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {personality.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {personality.description}
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded italic text-sm text-gray-700 dark:text-gray-300">
                {personality.example}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

const PrivacyStep: React.FC<any> = ({ formData, updateFormData }) => (
  <div className="space-y-6">
    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
        🔒 Your Privacy Matters
      </h3>
      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <li>• All data is stored locally on your device by default</li>
        <li>• No personal information is shared without your explicit consent</li>
        <li>• You can export or delete your data at any time</li>
        <li>• Optional external monitoring requires separate permission</li>
      </ul>
    </div>

    <div className="space-y-4">
      <label className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={formData.privacyConsent}
          onChange={(e) => updateFormData({ privacyConsent: e.target.checked })}
          className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
        />
        <div className="text-sm">
          <span className="text-gray-900 dark:text-gray-100">
            I agree to the privacy policy and terms of service
          </span>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            By checking this box, you consent to TaskDefender storing your data locally 
            and using it to provide personalized productivity insights.
          </p>
        </div>
      </label>
    </div>
  </div>
);

export default OnboardingFlow;