export type IntroStep = 'INTRO' | 'VIDEO_PLAYING' | 'VIDEO_COMPLETED' | 'AUTH_VISIBLE' | 'CLOSED';

export interface IntroState {
  step: IntroStep;
  hasSeenIntro: boolean;
  videoCompleted: boolean;
}
