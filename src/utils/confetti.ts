import confetti from 'canvas-confetti';

export function fireHolidayConfetti() {
  // Christmas themed confetti colors: Emerald, Ruby Red, Gold, White
  const colors = ['#22c55e', '#ef4444', '#fbbf24', '#ffffff', '#e11d48', '#f59e0b'];

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65 },
    colors: colors,
    ticks: 200,
  });
}

export function fireCelebrationCannons() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const colors = ['#22c55e', '#ef4444', '#fbbf24', '#ffffff'];

  const interval: ReturnType<typeof setInterval> = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

    // Left cannon
    confetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors
    });
    // Right cannon
    confetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors
    });
  }, 250);
}
