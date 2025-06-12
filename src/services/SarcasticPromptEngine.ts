import { SarcasticPrompt } from '../types';

export class SarcasticPromptEngine {
  private static prompts: Record<string, Record<string, string[]>> = {
    'drill-sergeant': {
      procrastination: [
        "DROP AND GIVE ME TWENTY! And by twenty, I mean twenty minutes of actual work!",
        "WHAT ARE YOU WAITING FOR, SOLDIER? Those tasks won't complete themselves!",
        "I've seen glaciers move faster than your productivity today!",
        "MOVE IT, MOVE IT, MOVE IT! Time is ticking and so is my patience!",
      ],
      distraction: [
        "EYES ON THE PRIZE, RECRUIT! That notification can wait!",
        "FOCUS! You're scattered like leaves in a hurricane!",
        "PUT DOWN THAT PHONE AND PICK UP YOUR PRODUCTIVITY!",
        "ATTENTION! Your brain is AWOL - bring it back to base!",
      ],
      achievement: [
        "OUTSTANDING! You actually did something productive today!",
        "WELL DONE, SOLDIER! You've earned a 5-minute break!",
        "IMPRESSIVE! I almost thought you'd forgotten how to work!",
        "EXCELLENT EXECUTION! Now drop and give me another task!",
      ],
    },
    'disappointed-parent': {
      procrastination: [
        "I'm not angry, I'm just... disappointed. Again.",
        "You know, when I was your age, we actually finished what we started.",
        "I had such high hopes for you today. *sigh*",
        "Your potential is showing, but so is your procrastination.",
      ],
      distraction: [
        "Really? You're checking social media again? I raised you better than this.",
        "I can see you're not focusing. Do I need to take away your internet privileges?",
        "This is exactly why you can't have nice things... like free time.",
        "I'm watching you, and I'm not impressed with what I see.",
      ],
      achievement: [
        "Well, look who finally decided to be productive! I'm proud of you.",
        "See? I knew you had it in you all along. Good job, kiddo.",
        "Finally! A reason to brag about you to the neighbors.",
        "I'm genuinely surprised and pleased. Keep it up!",
      ],
    },
    'sarcastic-friend': {
      procrastination: [
        "Oh wow, another 'productive' day of staring at your screen. Impressive.",
        "Let me guess, you're 'thinking about' starting that task? Revolutionary approach.",
        "I love how you've turned procrastination into an art form. Truly inspiring.",
        "Are you waiting for the task to complete itself? Because that's not how this works.",
      ],
      distraction: [
        "Oh look, another shiny object caught your attention. Shocking.",
        "Your focus is like a goldfish - impressive 3-second attention span.",
        "I see you've mastered the art of being busy without being productive.",
        "Multitasking champion right here! Too bad none of those tasks are getting done.",
      ],
      achievement: [
        "Wow, you actually did something! Mark your calendar, this is historic.",
        "Look who decided to join the land of the productive! Welcome back.",
        "I'm genuinely shocked. In a good way. Don't let it go to your head.",
        "Finally! I was starting to think you'd forgotten how to work.",
      ],
    },
    'motivational-coach': {
      procrastination: [
        "Champions don't wait for motivation - they create it! Let's GO!",
        "Every second you wait is a second your future self will thank you for using!",
        "You've got this! The only thing standing between you and success is action!",
        "Believe in yourself! You're capable of amazing things when you focus!",
      ],
      distraction: [
        "Stay strong! Your goals are bigger than your distractions!",
        "Focus is your superpower! Use it to achieve greatness!",
        "You're in control! Choose progress over procrastination!",
        "Channel that energy into your tasks! You're unstoppable!",
      ],
      achievement: [
        "YES! That's what I'm talking about! You're on fire!",
        "INCREDIBLE! You're proving that hard work pays off!",
        "AMAZING! Keep this momentum going - you're unstoppable!",
        "FANTASTIC! You're showing the world what you're made of!",
      ],
    },
  };

  static generatePrompt(
    trigger: 'procrastination' | 'distraction' | 'low-productivity' | 'missed-deadline' | 'achievement',
    persona: 'drill-sergeant' | 'disappointed-parent' | 'sarcastic-friend' | 'motivational-coach' = 'sarcastic-friend'
  ): SarcasticPrompt {
    const personaPrompts = this.prompts[persona];
    const triggerPrompts = personaPrompts[trigger] || personaPrompts['procrastination'];
    const message = triggerPrompts[Math.floor(Math.random() * triggerPrompts.length)];

    return {
      id: crypto.randomUUID(),
      persona,
      trigger,
      message,
      intensity: this.getIntensityForPersona(persona),
      category: this.getCategoryForTrigger(trigger),
    };
  }

  private static getIntensityForPersona(persona: string): 1 | 2 | 3 | 4 | 5 {
    const intensityMap: Record<string, 1 | 2 | 3 | 4 | 5> = {
      'drill-sergeant': 5,
      'disappointed-parent': 3,
      'sarcastic-friend': 4,
      'motivational-coach': 2,
    };
    return intensityMap[persona] || 3;
  }

  private static getCategoryForTrigger(trigger: string): 'motivation' | 'accountability' | 'celebration' | 'intervention' {
    const categoryMap: Record<string, 'motivation' | 'accountability' | 'celebration' | 'intervention'> = {
      'procrastination': 'motivation',
      'distraction': 'intervention',
      'low-productivity': 'accountability',
      'missed-deadline': 'accountability',
      'achievement': 'celebration',
    };
    return categoryMap[trigger] || 'motivation';
  }

  static getAvailablePersonas(): Array<{ id: string; name: string; description: string }> {
    return [
      {
        id: 'drill-sergeant',
        name: 'Drill Sergeant',
        description: 'Tough love with military precision. No excuses, just results.',
      },
      {
        id: 'disappointed-parent',
        name: 'Disappointed Parent',
        description: 'Gentle guilt trips and loving disappointment to motivate you.',
      },
      {
        id: 'sarcastic-friend',
        name: 'Sarcastic Friend',
        description: 'Witty remarks and playful mockery to keep you on track.',
      },
      {
        id: 'motivational-coach',
        name: 'Motivational Coach',
        description: 'Positive energy and encouraging words to boost your confidence.',
      },
    ];
  }
}