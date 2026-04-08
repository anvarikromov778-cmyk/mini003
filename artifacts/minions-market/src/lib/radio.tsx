import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

export const stations = [
  {
    id: "europa-plus",
    name: "Europa Plus",
    description: "Популярная русская музыка 24/7",
    url: "https://ep256.hostingradio.ru/ep256",
    emoji: "🌍",
  },
  {
    id: "dfm",
    name: "DFM",
    description: "Танцевальные хиты и радио-лидеры",
    url: "https://dfm.hostingradio.ru/dfm128.mp3",
    emoji: "🎚️",
  },
  {
    id: "retro-fm",
    name: "Retro FM",
    description: "Хиты из 80–90-х и ностальгия",
    url: "https://retro.hostingradio.ru/retro96.aacp",
    emoji: "💿",
  },
  {
    id: "radio-record",
    name: "Radio Record",
    description: "Лучший EDM и dance из России",
    url: "https://radiorecord.hostingradio.ru/rr96.aacp",
    emoji: "🎧",
  },
  {
    id: "mayak",
    name: "Радио Маяк",
    description: "Классика радио и новости",
    url: "https://icecast.radiomayak.ru/mayak128.mp3",
    emoji: "🕯️",
  },
  {
    id: "autoradio",
    name: "Авторадио",
    description: "Популярные хиты на дороге",
    url: "https://avtoradio.hostingradio.ru/avtoradio128.mp3",
    emoji: "🚗",
  },
  {
    id: "dorozhnoe",
    name: "Дорожное Радио",
    description: "Радио на все случаи пути",
    url: "https://dorozhnoe.hostingradio.ru/dorozhnoe128.mp3",
    emoji: "🛣️",
  },
  {
    id: "hit-fm",
    name: "Hit FM",
    description: "Топовые российские треки",
    url: "https://hitfm.hostingradio.ru/hitfm128.mp3",
    emoji: "🔥",
  },
];

export type Station = typeof stations[number];

interface RadioContextValue {
  station: Station;
  isPlaying: boolean;
  isLoading: boolean;
  isMuted: boolean;
  error: string | null;
  selectStation: (id: string) => void;
  togglePlay: () => void;
  toggleMute: () => void;
}

const RadioContext = createContext<RadioContextValue | null>(null);

// Единственный audio-элемент живёт вне React — не пересоздаётся при смене страниц
const globalAudio = new Audio();
globalAudio.preload = "none";

export function RadioProvider({ children }: { children: ReactNode }) {
  const [stationId, setStationId] = useState(stations[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const station = stations.find((s) => s.id === stationId) || stations[0];

  useEffect(() => {
    const audio = globalAudio;

    const onPlaying = () => { setIsLoading(false); setIsPlaying(true); setError(null); };
    const onWaiting  = () => setIsLoading(true);
    const onPause    = () => { setIsPlaying(false); setIsLoading(false); };
    const onError    = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setError("Нет соединения со стримом");
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("pause",   onPause);
    audio.addEventListener("error",   onError);

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("pause",   onPause);
      audio.removeEventListener("error",   onError);
    };
  }, []);

  const selectStation = (id: string) => {
    const next = stations.find((s) => s.id === id);
    if (!next) return;
    setStationId(id);
    setError(null);
    globalAudio.pause();
    globalAudio.src = next.url;
    globalAudio.load();
    setIsLoading(true);
    globalAudio.play().catch(() => { setIsLoading(false); setIsPlaying(false); });
  };

  const togglePlay = () => {
    const audio = globalAudio;
    if (isPlaying || isLoading) {
      audio.pause();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      if (!audio.src || audio.src === window.location.href) {
        audio.src = station.url;
        audio.load();
      }
      setIsLoading(true);
      setError(null);
      audio.play().catch(() => { setIsLoading(false); setIsPlaying(false); setError("Ошибка воспроизведения"); });
    }
  };

  const toggleMute = () => {
    globalAudio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <RadioContext.Provider value={{ station, isPlaying, isLoading, isMuted, error, selectStation, togglePlay, toggleMute }}>
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio must be used within RadioProvider");
  return ctx;
}
