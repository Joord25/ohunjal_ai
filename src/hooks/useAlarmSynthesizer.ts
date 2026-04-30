import { useRef, useCallback } from "react";

type AlarmPattern = "start" | "tick" | "half" | "end" | "rest_end" | "exercise_done";

type AlarmOptions = {
  /**
   * 알람 발사 직전 호출. 음악 BGM ducking 등 외부 효과를 트리거하는 데 사용.
   * 회의 2026-04-26 음악 도입.
   */
  onBeforePlay?: () => void;
};

export function useAlarmSynthesizer(opts?: AlarmOptions) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const onBeforePlayRef = useRef(opts?.onBeforePlay);
  onBeforePlayRef.current = opts?.onBeforePlay;

  const getAudioCtx = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playAlarmSound = useCallback((pattern: AlarmPattern = "end") => {
    try {
      // 소리 설정 OFF면 무시
      if (typeof window !== "undefined" && localStorage.getItem("ohunjal_settings_sound") === "false") return;
      onBeforePlayRef.current?.();

      // 회의 ζ-5 (2026-04-30): 운동 종료음 = 복싱 벨 mp3 (synth smallBell 대체).
      // start 는 음질 이슈로 mp3 폐기 → synth moktak 패턴 복귀 (2026-04-30 정정).
      // 캐시 버스팅 ?v= : 음원 교체 시 숫자 ++ 하면 브라우저/CDN 캐시 무시.
      if (pattern === "end") {
        const audio = new Audio("/sounds/workout-end.mp3?v=2");
        audio.volume = 1.0;
        audio.play().catch(() => {
          // 자동재생 차단 등 실패 시 silent fail
        });
        return;
      }

      const ctx = getAudioCtx();
      const t = ctx.currentTime;

      const master = ctx.createDynamicsCompressor();
      master.threshold.value = -3;
      master.knee.value = 3;
      master.ratio.value = 3;
      const masterGain = ctx.createGain();
      masterGain.gain.value = 1.8;
      master.connect(masterGain);
      masterGain.connect(ctx.destination);

      const moktak = (start: number, vol: number) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(480, start);
        o.frequency.exponentialRampToValueAtTime(180, start + 0.08);
        o.connect(g);
        g.connect(master);
        g.gain.setValueAtTime(vol, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
        o.start(start); o.stop(start + 0.12);
        const bLen = Math.floor(ctx.sampleRate * 0.008);
        const buf = ctx.createBuffer(1, bLen, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bLen, 3);
        const n = ctx.createBufferSource();
        n.buffer = buf;
        const nG = ctx.createGain();
        const f = ctx.createBiquadFilter();
        f.type = "bandpass";
        f.frequency.value = 800;
        f.Q.value = 3;
        n.connect(f);
        f.connect(nG);
        nG.connect(master);
        nG.gain.setValueAtTime(vol * 0.7, start);
        nG.gain.exponentialRampToValueAtTime(0.001, start + 0.02);
        n.start(start);
      };

      const smallBell = (start: number, vol: number, decay: number) => {
        const freqs = [1200, 2400, 3180, 4200];
        const gains = [1, 0.5, 0.3, 0.15];
        freqs.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "sine";
          o.frequency.value = freq;
          o.connect(g);
          g.connect(master);
          const v = vol * gains[i];
          g.gain.setValueAtTime(v, start);
          g.gain.exponentialRampToValueAtTime(0.001, start + decay * (1 - i * 0.1));
          o.start(start); o.stop(start + decay);
          const o2 = ctx.createOscillator();
          const g2 = ctx.createGain();
          o2.type = "sine";
          o2.frequency.value = freq * 1.004;
          o2.connect(g2);
          g2.connect(master);
          g2.gain.setValueAtTime(v * 0.4, start);
          g2.gain.exponentialRampToValueAtTime(0.001, start + decay * (1 - i * 0.1));
          o2.start(start); o2.stop(start + decay);
        });
        const bLen = Math.floor(ctx.sampleRate * 0.006);
        const buf = ctx.createBuffer(1, bLen, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bLen, 2);
        const n = ctx.createBufferSource();
        n.buffer = buf;
        const nG = ctx.createGain();
        const nF = ctx.createBiquadFilter();
        nF.type = "highpass";
        nF.frequency.value = 4000;
        n.connect(nF);
        nF.connect(nG);
        nG.connect(master);
        nG.gain.setValueAtTime(vol * 0.5, start);
        nG.gain.exponentialRampToValueAtTime(0.001, start + 0.015);
        n.start(start);
      };

      const ripple = (start: number, vol: number) => {
        const notes = [1047, 1319, 1568, 1760, 2093];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const m = ctx.createOscillator();
          const mG = ctx.createGain();
          osc.type = "sine";
          osc.frequency.value = freq;
          m.type = "sine";
          m.frequency.value = freq * 3.5;
          m.connect(mG);
          mG.connect(osc.frequency);
          const s = start + i * 0.065;
          mG.gain.setValueAtTime(freq * 1.5, s);
          mG.gain.exponentialRampToValueAtTime(freq * 0.02, s + 0.4);
          osc.connect(g);
          g.connect(master);
          const v = vol * (0.6 + i * 0.08);
          g.gain.setValueAtTime(v, s);
          g.gain.exponentialRampToValueAtTime(0.001, s + 0.5 - i * 0.04);
          osc.start(s); osc.stop(s + 0.5);
          m.start(s); m.stop(s + 0.5);
        });
      };

      switch (pattern) {
        case "tick":
          // 회의 ζ-5 (2026-04-30): 마지막 5초 카운트는 크게 — 0.8 → 1.6
          moktak(t, 1.6);
          break;
        case "start":
          // 회의 ζ-5 (2026-04-30) 정정: mp3 음질 이슈로 synth 복귀. 0.9 → 1.6 (대표 지시 키우기).
          moktak(t, 1.6);
          break;
        case "half":
          ripple(t, 0.55);
          break;
        case "rest_end":
          smallBell(t, 0.85, 0.8);
          smallBell(t + 0.3, 0.85, 0.8);
          smallBell(t + 0.6, 0.85, 0.8);
          break;
        case "exercise_done":
          smallBell(t, 0.9, 1.0);
          smallBell(t + 0.35, 0.9, 1.0);
          smallBell(t + 0.7, 0.9, 1.2);
          break;
      }
    } catch (e) {}
  }, []);

  /**
   * 회의 ζ-5 (2026-04-30): "반대쪽 시행" 음성 안내 (Web Speech API).
   * 양쪽 교대 운동 (런지, 스플릿 스쿼트 등) 중간 시점(예: 1분 운동의 30초)에 호출.
   * 사운드 OFF 시 무시. 브라우저 미지원 시 silent fail.
   */
  const speakSwitchSide = useCallback((locale: "ko" | "en" = "ko") => {
    try {
      if (typeof window === "undefined") return;
      if (localStorage.getItem("ohunjal_settings_sound") === "false") return;
      if (!("speechSynthesis" in window)) return;
      const text = locale === "en" ? "Switch sides!" : "반대쪽 시행해주세요!";
      const u = new SpeechSynthesisUtterance(text);
      u.lang = locale === "en" ? "en-US" : "ko-KR";
      u.rate = 1.05;
      u.volume = 1.0;
      // 기존 발화가 큐에 있으면 cancel 후 새로 (중복 방지)
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }, []);

  return { playAlarmSound, speakSwitchSide };
}
