import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';

type StageId =
  | 'welcome'
  | 'question'
  | 'letter'
  | 'photos'
  | 'reasons'
  | 'timeline'
  | 'quiz'
  | 'compliments'
  | 'fortunes'
  | 'scratch'
  | 'promises'
  | 'catcher'
  | 'adventures'
  | 'wheel'
  | 'declaration';

interface StageMeta {
  id: StageId;
  label: string;
  icon: string;
}

interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  readonly brand = 'MY_Dear_one';
  readonly girlName = 'Syed Rukaiya';
  readonly recipient = 'Syed Rukaiya';
  readonly welcomePhoto = 'assets/photos/05.jpg';

  musicOn = false;
  musicReady = false;

  readonly stages: StageMeta[] = [
    { id: 'welcome', label: 'Welcome', icon: '👋' },
    { id: 'question', label: 'Love Question', icon: '💕' },
    { id: 'letter', label: 'Your Letter', icon: '✉️' },
    { id: 'photos', label: 'Photo Memories', icon: '📷' },
    { id: 'reasons', label: 'Reasons I Love You', icon: '💝' },
    { id: 'timeline', label: 'Our Timeline', icon: '📅' },
    { id: 'quiz', label: 'Love Quiz', icon: '🎯' },
    { id: 'compliments', label: 'Compliments', icon: '🎰' },
    { id: 'fortunes', label: 'Fortune Cookies', icon: '🥠' },
    { id: 'scratch', label: 'Scratch Cards', icon: '🎫' },
    { id: 'promises', label: 'Promise Wall', icon: '🤝' },
    { id: 'catcher', label: 'Love Catcher', icon: '🎮' },
    { id: 'adventures', label: 'Future Adventures', icon: '🗺️' },
    { id: 'wheel', label: 'Spin Wheel', icon: '🎡' },
    { id: 'declaration', label: 'Declaration', icon: '🎉' },
  ];

  stageIndex = 0;
  questionRound = 0;
  letterVisibleChars = 0;
  noOffset = { x: 0, y: 0 };
  noFleeCount = 0;
  photoIndex = 0;
  reasonIndex = 0;
  quizIndex = 0;
  quizScore = 0;
  quizFeedback: string | null = null;
  quizLocked = false;
  quizAnswers: { prompt: string; answer: string; correct: boolean }[] = [];
  complimentIndex = 0;
  complimentSpinning = false;
  complimentSpun = false;
  openedFortunes = new Set<number>();
  scratchedCards = new Set<number>();
  acceptedPromises = new Set<number>();
  selectedAdventures = new Set<number>();
  catcherScore = 0;
  catcherActive = false;
  catcherHearts: {
    id: number;
    left: number;
    duration: number;
    caught: boolean;
  }[] = [];
  wheelSpinning = false;
  wheelRotation = 0;
  wheelPrize: string | null = null;
  hearts: { id: number; left: number; delay: number; size: number }[] = [];
  confetti: {
    id: number;
    left: number;
    delay: number;
    color: string;
  }[] = [];

  readonly loveLetter = `Syed Rukaiya,

I made this for you — partly to tease you, mostly to tell you what I keep noticing every time I look at you.

Your smile softens everything. Those big eyes of yours? They pull me in before I even realize I’ve stopped talking. And then there are those curls… bouncing around like they know they have a fan club of one.

But what gets me most is who you are when nobody’s performing.
You’re quietly, unassumingly nice.
You care for everyone around you like it’s the most natural thing in the world.
Your nature feels a little out of this world — soft, rare, and somehow always kind.

So yes, I’ll keep teasing you about your hair.
And yes, I’ll keep falling for your smile, your eyes, and that gentle heart.

I love you, Rukaiya.
You’re my dear one.

Yours,
Always`;

  readonly photos = [
    {
      src: 'assets/photos/01.jpg',
      title: 'Mirror curls',
      caption: 'Excuse me — those ringlets are doing the absolute most. I’m not okay.',
    },
    {
      src: 'assets/photos/02.jpg',
      title: 'Burgundy & bounce',
      caption: 'Pretty outfit. Gorgeous stance. But let’s be honest… I came for the curls.',
    },
    {
      src: 'assets/photos/03.jpg',
      title: 'Cake & curls',
      caption: 'Birthday soft. Cutipe and pretty. Hair is still the main character.',
    },
    {
      src: 'assets/photos/04.jpg',
      title: 'Side profile spiral',
      caption: 'That one curl near your collarbone? Yeah. That one owns me.',
    },
    {
      src: 'assets/photos/05.jpg',
      title: 'Smile + chaos',
      caption: 'Your smile is dangerous. Your curls make it unfair.',
    },
    {
      src: 'assets/photos/06.jpg',
      title: 'Little red bow',
      caption: 'Trying to tame the curls with a bow? Cute. They’re still winning.',
    },
    {
      src: 'assets/photos/07.jpg',
      title: 'Red & ringlets',
      caption: 'Looking at your phone… while I’m looking at your hair. Classic us.',
    },
    {
      src: 'assets/photos/08.jpg',
      title: 'Hidden treasure',
      caption: 'Hijab era. Still thinking about the curls underneath. Obsessed is obsessed.',
    },
    {
      src: 'assets/photos/09.jpg',
      title: 'Gold & glory',
      caption: 'Festive. Glowing. And those curls cascading like they paid rent.',
    },
    {
      src: 'assets/photos/10.jpg',
      title: 'Glasses & glory',
      caption: 'Chill pose. Soft vibe. Loud curly hair energy. Perfect.',
    },
  ];

  readonly reasons = [
    'Your smile — soft, bright, and dangerously disarming.',
    'Those big eyes that say more than words ever could.',
    'Your curly hair bouncing like it has its own personality (I’m obsessed, sorry).',
    'You’re quietly, unassumingly nice — and it shows in everything you do.',
    'You care for everyone around you like it’s second nature.',
  ];

  readonly timeline = [
    { date: 'First look', text: 'Saw your smile… and then those eyes finished the job.' },
    { date: 'Soon after', text: 'Noticed how gently you treat people. That stayed with me.' },
    { date: 'Along the way', text: 'Fell for your nature — rare, kind, a little out of this world.' },
    { date: 'Right now', text: 'Still teasing your curls. Still choosing you.' },
  ];

  readonly quiz: QuizQuestion[] = [
    {
      prompt: 'What do I notice first when you smile?',
      options: ['Your shoes', 'How the whole room softens', 'The weather'],
      correctIndex: 1,
    },
    {
      prompt: 'What am I low-key obsessed with?',
      options: ['Your curly hair', 'My alarms', 'Traffic'],
      correctIndex: 0,
    },
    {
      prompt: 'What makes you out of this world to me?',
      options: ['Being loud', 'Your quietly kind nature', 'Skipping texts'],
      correctIndex: 1,
    },
  ];

  readonly compliments = [
    'Your smile could rewrite my whole day.',
    'Those big eyes? Unfair advantage.',
    'Your curls are chaos in the cutest way.',
    'You’re quietly nice — and that’s rare.',
    'You care for everyone… including my whole heart.',
  ];

  readonly fortunes = [
    'Someone is thinking about your smile right now. Hi.',
    'A soft compliment about your eyes is on its way.',
    'Your kindness is going to come back around today.',
    'Curl tease incoming. Emotional damage: minimal. Affection: maximum.',
  ];

  readonly scratchRewards = [
    'One long compliment about your smile.',
    'A forehead kiss and a soft stare into those eyes.',
    'Permission to gently tuck one curl. Carefully.',
    'A “thank you for being you” message.',
  ];

  readonly promises = [
    'I promise to notice your kindness, not just your beauty.',
    'I promise soft teasing about your curls — forever.',
    'I promise to protect that big, caring heart of yours.',
    'I promise to keep choosing Syed Rukaiya, every day.',
  ];

  readonly adventures = [
    { title: 'Sunset walk', detail: 'Just so I can catch that smile in golden light.' },
    { title: 'Quiet café date', detail: 'Big eyes, soft talks, no rush.' },
    { title: 'Photo dump day', detail: 'More of you. More of us.' },
    { title: 'Slow evening in', detail: 'Curl talk, care talk, and cozy silence.' },
  ];

  readonly wheelPrizes = [
    'Smile compliments',
    'Eye contact challenge',
    'Curl tease',
    'Soft hug',
    'Kindness note',
    'Forever us',
  ];

  /** WhatsApp number without + or spaces */
  readonly whatsappNumber = '917463904786';

  private letterTimer: ReturnType<typeof setInterval> | null = null;
  private complimentTimer: ReturnType<typeof setInterval> | null = null;
  private catcherTimer: ReturnType<typeof setInterval> | null = null;
  private heartId = 0;
  private confettiId = 0;
  private catcherHeartId = 0;

  @ViewChild('bgMusic') bgMusic?: ElementRef<HTMLAudioElement>;
  @ViewChild('playground') playground?: ElementRef<HTMLElement>;
  @ViewChild('noBtn') noBtn?: ElementRef<HTMLButtonElement>;

  get stage(): StageMeta {
    return this.stages[this.stageIndex];
  }

  get progress(): number {
    return ((this.stageIndex + 1) / this.stages.length) * 100;
  }

  get isLast(): boolean {
    return this.stageIndex === this.stages.length - 1;
  }

  get questionCopy() {
    if (this.questionRound === 1) {
      return {
        title: 'Even after that smile?',
        subtitle: 'Those big eyes already gave you away, Rukaiya.',
        yes: 'Yes, I love you',
        no: 'Still thinking',
      };
    }
    if (this.questionRound === 2) {
      return {
        title: 'Okay, last chance',
        subtitle: 'Your curls are bouncing. Your heart knows. Just say it.',
        yes: 'Fine… I love you',
        no: 'Nope',
      };
    }
    return {
      title: 'Do you love me, Rukaiya?',
      subtitle: 'Be honest. I’ll keep teasing either way.',
      yes: 'Yes',
      no: 'No',
    };
  }

  get typedLetter(): string {
    return this.loveLetter.slice(0, this.letterVisibleChars);
  }

  get letterDone(): boolean {
    return this.letterVisibleChars >= this.loveLetter.length;
  }

  get canContinue(): boolean {
    switch (this.stage.id) {
      case 'welcome':
        return true;
      case 'question':
        return false;
      case 'letter':
        return this.letterDone;
      case 'photos':
        return this.photoIndex >= this.photos.length - 1;
      case 'reasons':
        return this.reasonIndex >= this.reasons.length - 1;
      case 'timeline':
        return true;
      case 'quiz':
        return this.quizIndex >= this.quiz.length && !this.quizFeedback;
      case 'compliments':
        return this.complimentSpun && !this.complimentSpinning;
      case 'fortunes':
        return this.openedFortunes.size >= 2;
      case 'scratch':
        return this.scratchedCards.size >= 2;
      case 'promises':
        return this.acceptedPromises.size >= 2;
      case 'catcher':
        return this.catcherScore >= 5;
      case 'adventures':
        return this.selectedAdventures.size >= 1;
      case 'wheel':
        return !!this.wheelPrize && !this.wheelSpinning;
      case 'declaration':
        return false;
      default:
        return true;
    }
  }

  get continueLabel(): string {
    if (this.stage.id === 'welcome') {
      return 'Begin';
    }
    if (this.isLast) {
      return 'Done';
    }
    return 'Continue';
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.pauseMusic();
  }

  next(): void {
    if (this.stage.id === 'declaration' || !this.canContinue) {
      return;
    }
    if (this.stage.id === 'welcome') {
      this.startMusic();
    }
    if (this.stageIndex < this.stages.length - 1) {
      this.enterStage(this.stageIndex + 1);
    }
  }

  toggleMusic(): void {
    if (this.musicOn) {
      this.pauseMusic();
    } else {
      this.startMusic();
    }
  }

  startMusic(): void {
    const audio = this.bgMusic?.nativeElement;
    if (!audio) {
      return;
    }
    audio.volume = 0.35;
    audio.loop = true;
    const play = audio.play();
    if (play) {
      play
        .then(() => {
          this.musicOn = true;
          this.musicReady = true;
        })
        .catch(() => {
          this.musicOn = false;
        });
    }
  }

  pauseMusic(): void {
    const audio = this.bgMusic?.nativeElement;
    if (audio) {
      audio.pause();
    }
    this.musicOn = false;
  }

  enterStage(index: number): void {
    this.clearTimers();
    this.stageIndex = index;
    const id = this.stages[index].id;

    if (id === 'question') {
      this.questionRound = 0;
      this.resetNoButton();
      this.spawnHearts(8);
    }
    if (id === 'letter') {
      this.letterVisibleChars = 0;
      this.typeLetter();
    }
    if (id === 'quiz') {
      this.quizIndex = 0;
      this.quizScore = 0;
      this.quizAnswers = [];
      this.quizFeedback = null;
      this.quizLocked = false;
    }
    if (id === 'catcher') {
      this.catcherScore = 0;
      this.catcherHearts = [];
      this.startCatcher();
    }
    if (id === 'declaration') {
      this.spawnConfetti();
      this.spawnHearts(22);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onYes(): void {
    if (this.questionRound < 2) {
      this.questionRound += 1;
      this.resetNoButton();
      this.spawnHearts(6);
      return;
    }
    this.spawnHearts(12);
    this.enterStage(this.stageIndex + 1);
  }

  fleeNo(event?: Event): void {
    event?.preventDefault();
    const area = this.playground?.nativeElement;
    const btn = this.noBtn?.nativeElement;
    if (!area || !btn) {
      return;
    }

    const areaRect = area.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const maxX = Math.max(24, areaRect.width - btnRect.width - 8);
    const maxY = Math.max(24, areaRect.height - btnRect.height - 8);

    let nextX = Math.random() * maxX;
    let nextY = Math.random() * maxY;
    let tries = 0;
    while (
      tries < 12 &&
      Math.hypot(nextX - this.noOffset.x, nextY - this.noOffset.y) < 70
    ) {
      nextX = Math.random() * maxX;
      nextY = Math.random() * maxY;
      tries += 1;
    }

    this.noOffset = { x: nextX, y: nextY };
    this.noFleeCount += 1;
  }

  skipTyping(): void {
    if (!this.letterDone) {
      if (this.letterTimer) {
        clearInterval(this.letterTimer);
        this.letterTimer = null;
      }
      this.letterVisibleChars = this.loveLetter.length;
    }
  }

  nextPhoto(): void {
    if (this.photoIndex < this.photos.length - 1) {
      this.photoIndex += 1;
    }
  }

  prevPhoto(): void {
    if (this.photoIndex > 0) {
      this.photoIndex -= 1;
    }
  }

  revealReason(): void {
    if (this.reasonIndex < this.reasons.length - 1) {
      this.reasonIndex += 1;
    }
  }

  answerQuiz(optionIndex: number): void {
    if (this.quizLocked || this.quizIndex >= this.quiz.length) {
      return;
    }
    const current = this.quiz[this.quizIndex];
    this.quizLocked = true;
    const correct = optionIndex === current.correctIndex;
    this.quizAnswers = [
      ...this.quizAnswers,
      {
        prompt: current.prompt,
        answer: current.options[optionIndex],
        correct,
      },
    ];
    if (correct) {
      this.quizScore += 1;
      this.quizFeedback = 'Exactly. You know me.';
    } else {
      this.quizFeedback = 'Cute try — but not quite.';
    }
    setTimeout(() => {
      this.quizFeedback = null;
      this.quizLocked = false;
      this.quizIndex += 1;
    }, 900);
  }

  sendWhatsAppAnswers(): void {
    const message = this.buildAnswersMessage();
    const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, '_blank');
  }

  private buildAnswersMessage(): string {
    const lines: string[] = [
      'MY_Dear_one — answers from Syed Rukaiya 💕',
      '',
      'Love question: She said YES 💖',
      `Quiz score: ${this.quizScore}/${this.quiz.length}`,
    ];

    if (this.quizAnswers.length) {
      lines.push('', 'Quiz answers:');
      this.quizAnswers.forEach((q, i) => {
        lines.push(
          `${i + 1}. ${q.prompt}`
        );
        lines.push(
          `   → ${q.answer}${q.correct ? ' ✓' : ''}`
        );
      });
    }

    const promises = [...this.acceptedPromises]
      .map((i) => this.promises[i])
      .filter(Boolean);
    if (promises.length) {
      lines.push('', 'Promises she accepted:');
      promises.forEach((p) => lines.push(`• ${p}`));
    }

    const adventures = [...this.selectedAdventures]
      .map((i) => this.adventures[i]?.title)
      .filter(Boolean);
    if (adventures.length) {
      lines.push('', 'Future adventures she picked:');
      adventures.forEach((a) => lines.push(`• ${a}`));
    }

    lines.push(
      '',
      `Fortunes opened: ${this.openedFortunes.size}`,
      `Scratch cards revealed: ${this.scratchedCards.size}`,
      `Hearts caught: ${this.catcherScore}`,
      `Wheel prize: ${this.wheelPrize || '—'}`,
      `Compliment spun: ${
        this.complimentSpun ? this.compliments[this.complimentIndex] : '—'
      }`,
      '',
      'Sent from MY_Dear_one ✨'
    );

    return lines.join('\n');
  }

  spinCompliment(): void {
    if (this.complimentSpinning) {
      return;
    }
    this.complimentSpinning = true;
    let ticks = 0;
    this.complimentTimer = setInterval(() => {
      this.complimentIndex =
        (this.complimentIndex + 1) % this.compliments.length;
      ticks += 1;
      if (ticks > 12) {
        if (this.complimentTimer) {
          clearInterval(this.complimentTimer);
          this.complimentTimer = null;
        }
        this.complimentSpinning = false;
        this.complimentSpun = true;
        this.complimentIndex = Math.floor(
          Math.random() * this.compliments.length
        );
      }
    }, 80);
  }

  openFortune(index: number): void {
    this.openedFortunes = new Set(this.openedFortunes).add(index);
  }

  scratchCard(index: number): void {
    this.scratchedCards = new Set(this.scratchedCards).add(index);
  }

  acceptPromise(index: number): void {
    this.acceptedPromises = new Set(this.acceptedPromises).add(index);
  }

  toggleAdventure(index: number): void {
    const next = new Set(this.selectedAdventures);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    this.selectedAdventures = next;
  }

  startCatcher(): void {
    this.catcherActive = true;
    this.catcherTimer = setInterval(() => {
      if (!this.catcherActive) {
        return;
      }
      if (this.catcherHearts.filter((h) => !h.caught).length > 6) {
        return;
      }
      this.catcherHearts = [
        ...this.catcherHearts.filter((h) => !h.caught).slice(-8),
        {
          id: ++this.catcherHeartId,
          left: 8 + Math.random() * 84,
          duration: 2.4 + Math.random() * 1.6,
          caught: false,
        },
      ];
    }, 700);
  }

  catchHeart(id: number, event: Event): void {
    event.stopPropagation();
    const heart = this.catcherHearts.find((h) => h.id === id);
    if (!heart || heart.caught) {
      return;
    }
    heart.caught = true;
    this.catcherScore += 1;
    if (this.catcherScore >= 5) {
      this.catcherActive = false;
    }
  }

  spinWheel(): void {
    if (this.wheelSpinning) {
      return;
    }
    this.wheelSpinning = true;
    this.wheelPrize = null;
    const prizeIndex = Math.floor(Math.random() * this.wheelPrizes.length);
    const slice = 360 / this.wheelPrizes.length;
    const extraSpins = 4 + Math.floor(Math.random() * 3);
    this.wheelRotation =
      extraSpins * 360 + (360 - prizeIndex * slice - slice / 2);
    setTimeout(() => {
      this.wheelSpinning = false;
      this.wheelPrize = this.wheelPrizes[prizeIndex];
      this.spawnHearts(10);
    }, 3200);
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.stage.id === 'question') {
      this.resetNoButton();
    }
  }

  private resetNoButton(): void {
    this.noOffset = { x: 0, y: 0 };
    this.noFleeCount = 0;
  }

  private typeLetter(): void {
    this.letterTimer = setInterval(() => {
      if (this.letterVisibleChars >= this.loveLetter.length) {
        if (this.letterTimer) {
          clearInterval(this.letterTimer);
          this.letterTimer = null;
        }
        return;
      }
      this.letterVisibleChars += 1;
    }, 22);
  }

  private spawnHearts(count: number): void {
    const batch = Array.from({ length: count }, () => ({
      id: ++this.heartId,
      left: Math.random() * 100,
      delay: Math.random() * 1.2,
      size: 10 + Math.random() * 16,
    }));
    this.hearts = [...this.hearts.slice(-20), ...batch];
  }

  private spawnConfetti(): void {
    const colors = ['#c45c7a', '#f2a0b3', '#8b3a4f', '#ffd6e0', '#f7c59f'];
    this.confetti = Array.from({ length: 40 }, () => ({
      id: ++this.confettiId,
      left: Math.random() * 100,
      delay: Math.random() * 1.6,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }

  private clearTimers(): void {
    if (this.letterTimer) {
      clearInterval(this.letterTimer);
      this.letterTimer = null;
    }
    if (this.complimentTimer) {
      clearInterval(this.complimentTimer);
      this.complimentTimer = null;
    }
    if (this.catcherTimer) {
      clearInterval(this.catcherTimer);
      this.catcherTimer = null;
    }
    this.catcherActive = false;
  }
}
