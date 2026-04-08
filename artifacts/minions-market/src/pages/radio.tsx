import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Radio, Play, Pause, ArrowLeft, Music } from "lucide-react";

const stations = [
  {
    id: "radio-record",
    name: "Radio Record",
    description: "Лучший EDM и dance из России",
    url: "https://air.radiorecord.ru:8101/rr_320",
    emoji: "🎧",
  },
  {
    id: "europa-plus",
    name: "Europa Plus",
    description: "Популярная русская музыка 24/7",
    url: "https://ep128.hostingradio.ru/ep128",
    emoji: "🌍",
  },
  {
    id: "retro-fm",
    name: "Retro FM",
    description: "Хиты из 80–90-х и ностальгия",
    url: "https://retrohost-32bit.cdnvideo.ru/retro128.mp3",
    emoji: "💿",
  },
  {
    id: "dfm",
    name: "DFM",
    description: "Танцевальные хиты и радио-лидеры",
    url: "https://dfm.hostingradio.ru/dfm128",
    emoji: "🎚️",
  },
  {
    id: "mayak",
    name: "Радио Маяк",
    description: "Классика радио и новости",
    url: "https://icecast.radiomayak.ru/mayak128",
    emoji: "🕯️",
  },
  {
    id: "vesti-fm",
    name: "Вести FM",
    description: "Новости и эфиры из России",
    url: "https://vedfm.cdnvideo.ru/vesti128.mp3",
    emoji: "📰",
  },
  {
    id: "autoradio",
    name: "Авторадио",
    description: "Популярные хиты на дороге",
    url: "https://avtoradio.hostingradio.ru/avtoradio128",
    emoji: "🚗",
  },
  {
    id: "dorozhnoe",
    name: "Дорожное Радио",
    description: "Радио на все случаи пути",
    url: "https://dorozhnoe.hostingradio.ru/dorozhnoe128",
    emoji: "🛣️",
  },
  {
    id: "radio-monte-carlo",
    name: "Radio Monte Carlo",
    description: "Стильная музыка и новости",
    url: "https://mcradio.hostingradio.ru/mc128",
    emoji: "🎩",
  },
  {
    id: "hit-fm",
    name: "Hit FM",
    description: "Топовые российские треки",
    url: "https://hitfm.hostingradio.ru/hitfm128",
    emoji: "🔥",
  },
];

export default function RadioPage() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [selectedId, setSelectedId] = useState(stations[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selectedStation = useMemo(
    () => stations.find((station) => station.id === selectedId) || stations[0],
    [selectedId]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = selectedStation.url;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStation]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!audio.src || audio.src !== selectedStation.url) {
        audio.src = selectedStation.url;
        audio.load();
      }
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur px-4 pt-3 pb-3 border-b border-border/30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">{t("radio")}</h1>
            <p className="text-xs text-muted-foreground">{t("liveRadio")}</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="bg-card rounded-3xl border border-border/40 p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-primary/10 text-primary w-14 h-14 flex items-center justify-center text-2xl">
              {selectedStation.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4 text-primary" />
                <span className="text-xs uppercase tracking-[0.2em] text-primary">{t("radioTop10")}</span>
              </div>
              <h2 className="text-xl font-semibold">{selectedStation.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{selectedStation.description}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-3xl bg-background p-4 border border-border/50">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{t("nowPlaying")}</p>
                <p className="font-medium text-sm mt-1">{selectedStation.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedStation.description}</p>
              </div>
              <Button variant="secondary" size="icon" onClick={togglePlay}>
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
            </div>

            <audio
              ref={audioRef}
              className="w-full rounded-3xl border border-border/50 bg-background"
              controls
              preload="none"
              src={selectedStation.url}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        </div>
      </div>

      <div className="px-4">
        <h2 className="font-bold text-base mb-3">{t("topRadio")}</h2>
        <div className="grid gap-3">
          {stations.map((station) => (
            <button
              key={station.id}
              type="button"
              onClick={() => {
                setSelectedId(station.id);
                setIsPlaying(true);
              }}
              className={`w-full rounded-3xl border p-4 text-left transition ${
                station.id === selectedId ? "border-primary bg-primary/10" : "border-border/50 bg-card hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 text-primary w-12 h-12 flex items-center justify-center text-xl">
                  {station.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm truncate">{station.name}</span>
                    {station.id === selectedId && <span className="text-[10px] uppercase tracking-[0.2em] text-primary">{t("playing")}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{station.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
