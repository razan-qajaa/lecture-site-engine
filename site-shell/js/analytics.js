/**
 * Microsoft Clarity — lecture study analytics
 *
 * Tracks per subject site (SPA):
 * - Virtual pages: /home, /lectures/{id} → time-on-page per lecture in Clarity
 * - Focused minutes: visible tab + user activity (scroll/click/key), idle after 2 min
 * - Scroll milestones: 25 / 50 / 75 / 100 % of lecture scroll depth
 *
 * Clarity dashboard:
 * - Pages → filter paths containing /lectures/
 * - Filters → custom tags: subject, lecture, active_seconds
 * - Events → scroll_25 … scroll_100, lecture_session_end
 * - Heatmaps → session replays filtered by lecture tag (virtual pages)
 */

const IDLE_TIMEOUT_MS = 2 * 60 * 1000;
const SCROLL_MILESTONES = [25, 50, 75, 100];

/** @type {{ subjectName: string, storagePrefix: string } | null} */
let context = null;

/** @type {LectureSession | null} */
let activeSession = null;

function clarityAvailable() {
  return typeof window.clarity === 'function';
}

function clarityCall(...args) {
  if (!clarityAvailable()) return;
  try {
    window.clarity(...args);
  } catch {
    /* ignore analytics errors */
  }
}

function claritySet(key, value) {
  if (value == null || value === '') return;
  clarityCall('set', key, String(value));
}

function clarityEvent(name) {
  clarityCall('event', name);
}

function virtualPath(segment) {
  const prefix = context?.storagePrefix || 'study-guide';
  const base = `/${prefix}`;
  if (!segment || segment === 'home') return `${base}/home`;
  return `${base}/${segment.replace(/^\//, '')}`;
}

function trackVirtualPage(segment) {
  claritySet('subject', context?.subjectName || '');
  clarityCall('set', 'page', virtualPath(segment));
}

class LectureSession {
  /** @param {string} lectureId */
  constructor(lectureId) {
    this.lectureId = lectureId;
    this.activeMs = 0;
    this.lastTickAt = null;
    this.isVisible = document.visibilityState === 'visible';
    this.isIdle = false;
    this.idleTimer = null;
    /** @type {Set<number>} */
    this.milestonesHit = new Set();
    this.scrollRoot = null;

    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.onActivity = this.onActivity.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onPageHide = this.onPageHide.bind(this);

    claritySet('lecture', lectureId);
    trackVirtualPage(`lectures/${lectureId}`);
  }

  begin() {
    this.resumeTicking();
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    document.addEventListener('click', this.onActivity, { passive: true });
    document.addEventListener('keydown', this.onActivity, { passive: true });
    document.addEventListener('touchstart', this.onActivity, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('pagehide', this.onPageHide);
    this.resetIdleTimer();
    requestAnimationFrame(() => this.checkScrollMilestones());
  }

  /** Call after lecture HTML is in #content */
  attachContentRoot() {
    this.scrollRoot = document.getElementById('content');
    requestAnimationFrame(() => this.checkScrollMilestones());
  }

  onVisibilityChange() {
    const visible = document.visibilityState === 'visible';
    if (visible && !this.isVisible) {
      this.isVisible = true;
      if (!this.isIdle) this.resumeTicking();
      this.resetIdleTimer();
    } else if (!visible && this.isVisible) {
      this.isVisible = false;
      this.pauseTicking();
      clearTimeout(this.idleTimer);
    }
  }

  onActivity() {
    if (this.isIdle) {
      this.isIdle = false;
      if (this.isVisible) this.resumeTicking();
    }
    this.resetIdleTimer();
  }

  onScroll() {
    this.onActivity();
    this.checkScrollMilestones();
  }

  resetIdleTimer() {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.isIdle = true;
      this.pauseTicking();
      clarityEvent('lecture_idle');
    }, IDLE_TIMEOUT_MS);
  }

  resumeTicking() {
    if (!this.isVisible || this.isIdle) return;
    if (this.lastTickAt == null) this.lastTickAt = Date.now();
  }

  pauseTicking() {
    if (this.lastTickAt == null) return;
    this.activeMs += Date.now() - this.lastTickAt;
    this.lastTickAt = null;
  }

  getActiveSeconds() {
    let total = this.activeMs;
    if (this.lastTickAt != null && this.isVisible && !this.isIdle) {
      total += Date.now() - this.lastTickAt;
    }
    return Math.max(0, Math.round(total / 1000));
  }

  checkScrollMilestones() {
    const depth = this.readScrollDepth();
    if (depth <= 0) return;

    for (const milestone of SCROLL_MILESTONES) {
      if (depth < milestone || this.milestonesHit.has(milestone)) continue;
      this.milestonesHit.add(milestone);
      claritySet('lecture', this.lectureId);
      clarityEvent(`scroll_${milestone}`);
    }
  }

  readScrollDepth() {
    const doc = document.documentElement;
    const scrollHeight = Math.max(
      doc.scrollHeight,
      document.body?.scrollHeight || 0,
      this.scrollRoot?.scrollHeight || 0,
    );
    const viewport = window.innerHeight || doc.clientHeight;
    const maxScroll = scrollHeight - viewport;
    if (maxScroll <= 0) return 100;
    const y = window.scrollY || doc.scrollTop || 0;
    return Math.min(100, Math.round((y / maxScroll) * 100));
  }

  onPageHide() {
    this.end();
  }

  end() {
    this.pauseTicking();
    clearTimeout(this.idleTimer);

    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    document.removeEventListener('click', this.onActivity);
    document.removeEventListener('keydown', this.onActivity);
    document.removeEventListener('touchstart', this.onActivity);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('pagehide', this.onPageHide);

    const seconds = this.getActiveSeconds();
    const maxScroll = this.milestonesHit.size
      ? Math.max(...this.milestonesHit)
      : 0;

    claritySet('lecture', this.lectureId);
    claritySet('active_seconds', String(seconds));
    claritySet('max_scroll_pct', String(maxScroll));
    clarityEvent('lecture_session_end');

    if (seconds >= 60) clarityEvent('lecture_focus_1min');
    if (seconds >= 300) clarityEvent('lecture_focus_5min');
    if (seconds >= 900) clarityEvent('lecture_focus_15min');
  }
}

function endActiveSession() {
  if (!activeSession) return;
  activeSession.end();
  activeSession = null;
}

/**
 * @param {{ subjectName?: string, storagePrefix?: string }} options
 */
export function initAnalytics(options = {}) {
  context = {
    subjectName: options.subjectName || '',
    storagePrefix: options.storagePrefix || 'study-guide',
  };
  window.addEventListener('pagehide', endActiveSession);
}

export function trackHomeView() {
  endActiveSession();
  claritySet('lecture', '');
  trackVirtualPage('home');
}

/**
 * @param {{ lec: { id: string } }} item
 */
export function trackLectureView(item) {
  if (!item?.lec?.id) return;
  endActiveSession();
  activeSession = new LectureSession(item.lec.id);
  activeSession.begin();
}

export function trackLectureContentReady() {
  activeSession?.attachContentRoot();
}

export function updateAnalyticsContext(patch) {
  context = { ...(context || { subjectName: '', storagePrefix: 'study-guide' }), ...patch };
}
