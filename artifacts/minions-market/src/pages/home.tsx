import { Link } from "wouter";
import { useGetMarketplaceStats, getGetMarketplaceStatsQueryKey, useListProducts, getListProductsQueryKey, useGetFeaturedProducts, getGetFeaturedProductsQueryKey } from "@workspace/api-client-react";
import { useLang } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Search, Star, Eye, Gamepad2, ShoppingBag, Sparkles, Users, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

// ─── Мобильные игры ──────────────────────────────────────────────────────────
const MOBILE_GAMES = [
  { name: "Brawl Stars",     slug: "brawl-stars",     img: "https://raw.githubusercontent.com/supercell/brawlstars-assets/master/icon.png" },
  { name: "Clash Royale",    slug: "clash-royale",    img: "https://raw.githubusercontent.com/supercell/clashroyale-assets/master/icon.png" },
  { name: "PUBG Mobile",     slug: "pubg-mobile",     img: "https://raw.githubusercontent.com/tencent-connect/wiki-assets/main/pubg-mobile-icon.png" },
  { name: "Standoff 2",      slug: "standoff2",       img: "https://raw.githubusercontent.com/axiom-studio/assets/main/standoff2-icon.png" },
  { name: "Clash of Clans",  slug: "clash-of-clans",  img: "https://raw.githubusercontent.com/supercell/coc-assets/master/icon.png" },
  { name: "Mobile Legends",  slug: "mobile-legends",  img: "https://raw.githubusercontent.com/moontoon-assets/wiki/main/ml-icon.png" },
  { name: "Call of Duty M",  slug: "codm",            img: "https://raw.githubusercontent.com/activision-assets/codm/main/icon.png" },
  { name: "Free Fire",       slug: "free-fire",       img: "https://raw.githubusercontent.com/garena-assets/freefire/main/icon.png" },
  { name: "Roblox",          slug: "roblox",          img: "https://www.roblox.com/favicon.ico" },
  { name: "Minecraft",       slug: "minecraft-pe",    img: "https://www.minecraft.net/content/dam/minecraftnet/files/minecraft-icons/minecraft-java-edition_120x120.png" },
  { name: "Genshin Impact",  slug: "genshin-mobile",  img: "https://raw.githubusercontent.com/hoyo-assets/wiki/main/genshin-icon.png" },
  { name: "Fortnite",        slug: "fortnite-mobile", img: "https://www.epicgames.com/favicon.ico" },
];

// ─── Игры ПК ─────────────────────────────────────────────────────────────────
const PC_GAMES = [
  { name: "GTA 5 Online",      slug: "gta5",       img: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg" },
  { name: "Dota 2",            slug: "dota2",      img: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg" },
  { name: "Valorant",          slug: "valorant",   img: "https://raw.githubusercontent.com/valorant-assets/wiki/main/valorant-icon.png" },
  { name: "Counter-Strike 2",  slug: "cs2",        img: "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg" },
  { name: "Fortnite",          slug: "fortnite",   img: "https://www.epicgames.com/favicon.ico" },
  { name: "Minecraft",         slug: "minecraft",  img: "https://www.minecraft.net/content/dam/minecraftnet/files/minecraft-icons/minecraft-java-edition_120x120.png" },
  { name: "Genshin Impact",    slug: "genshin",    img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1971870/header.jpg" },
  { name: "World of Warcraft", slug: "wow",        img: "https://bnetcmsus-a.akamaihd.net/cms/template_resource/WOW_RETAIL_GAME_TILE_EN_US_1650568557369.jpg" },
  { name: "League of Legends", slug: "lol",        img: "https://raw.githubusercontent.com/riotgames-assets/wiki/main/lol-icon.png" },
  { name: "Rust",              slug: "rust",       img: "https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg" },
  { name: "Apex Legends",      slug: "apex",       img: "https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg" },
  { name: "Warframe",          slug: "warframe",   img: "https://cdn.cloudflare.steamstatic.com/steam/apps/230410/header.jpg" },
];

// ─── Приложения ──────────────────────────────────────────────────────────────
const APPS = [
  { name: "Telegram",    slug: "telegram",    img: "https://www.telegram.org/img/t_logo.png", bg: "#2CA5E0" },
  { name: "TikTok",      slug: "tiktok",      img: "https://www.tiktok.com/favicon.ico", bg: "#010101" },
  { name: "Instagram",   slug: "instagram",   img: "https://www.instagram.com/static/images/ico/favicon.ico.png/36b3ee2d91ed.png", bg: "#E1306C" },
  { name: "YouTube",     slug: "youtube",     img: "https://www.youtube.com/favicon.ico", bg: "#FF0000" },
  { name: "Steam",       slug: "steam-acc",   img: "https://cdn.cloudflare.steamstatic.com/steam/apps/steam/logo.png", bg: "#1B2838" },
  { name: "Spotify",     slug: "spotify",     img: "https://www.spotify.com/favicon.ico", bg: "#1DB954" },
  { name: "Netflix",     slug: "netflix",     img: "https://www.netflix.com/favicon.ico", bg: "#E50914" },
  { name: "Discord",     slug: "discord",     img: "https://discord.com/favicon.ico", bg: "#5865F2" },
  { name: "VK",          slug: "vk",          img: "https://vk.com/favicon.ico", bg: "#4C75A3" },
  { name: "ChatGPT",     slug: "chatgpt",     img: "https://cdn.openai.com/API/assets/research-covers/overviewpage/fast-bezier-curves.jpg", bg: "#10A37F" },
  { name: "App Store",   slug: "appstore",    img: "https://www.apple.com/favicon.ico", bg: "#0D96F6" },
  { name: "PlayStation", slug: "playstation", img: "https://www.playstation.com/favicon.ico", bg: "#003087" },
];

interface CategoryItem {
  name: string;
  slug: string;
  img: string;
  bg?: string;
}

function CategoryGrid({ items, newSlugs }: { items: CategoryItem[]; newSlugs?: Set<string> }) {
  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-3 px-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/catalog?category=${item.slug}`}
          className="flex flex-col items-center gap-1"
          data-testid={`cat-${item.slug}`}
        >
          <div className="relative w-full">
            <div
              className="w-full aspect-square rounded-[18px] overflow-hidden shadow-md"
              style={{ background: item.bg || "#1a1a2e" }}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.opacity = "0"; }}
              />
            </div>
            {newSlugs?.has(item.slug) && (
              <span
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg"
                style={{ background: "#22c55e" }}
              >
                Новое
              </span>
            )}
          </div>
          <span className="text-[10px] text-center leading-tight text-foreground/75 w-full line-clamp-1">
            {item.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

function CategorySection({
  emoji, title, items, newSlugs = [],
}: {
  emoji: string;
  title: string;
  items: CategoryItem[];
  newSlugs?: string[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-4">
        <span className="text-xl leading-none">{emoji}</span>
        <h2 className="font-bold text-base text-foreground">{title}</h2>
      </div>
      <CategoryGrid items={items} newSlugs={new Set(newSlugs)} />
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/product/${product.id}`} className="block" data-testid={`card-product-${product.id}`}>
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-200 group">
        <div className="aspect-[4/3] bg-secondary/50 relative overflow-hidden">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <IconWrapper size="xl"><Gamepad2 /></IconWrapper>
            </div>
          )}
          {product.isPromoted && (
            <Badge className="absolute top-2 left-2 bg-primary/90 text-xs gap-1">
              <IconWrapper size="xs"><Sparkles /></IconWrapper> TOP
            </Badge>
          )}
        </div>
        <div className="p-3 flex flex-col gap-1.5">
          <h3 className="font-semibold text-sm truncate text-foreground">{product.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-primary font-bold text-lg">{Number(product.price).toLocaleString()} ₽</span>
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <IconWrapper size="xs"><Eye /></IconWrapper>{product.views || 0}
            </span>
          </div>
          {product.seller && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                {product.seller.avatar
                  ? <img src={product.seller.avatar} className="w-full h-full object-cover" />
                  : <span className="text-[8px]">{product.seller.username?.[0]?.toUpperCase()}</span>}
              </div>
              <span className="truncate">{product.seller.username}</span>
              {product.seller.rating && (
                <span className="flex items-center gap-0.5 text-yellow-500">
                  <Star className="w-3 h-3 fill-current" />{Number(product.seller.rating).toFixed(1)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stats } = useGetMarketplaceStats({ query: { queryKey: getGetMarketplaceStatsQueryKey() } });
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedProducts({ query: { queryKey: getGetFeaturedProductsQueryKey() } });
  const { data: recent, isLoading: recentLoading } = useListProducts(
    { sort: "newest", limit: 8 },
    { query: { queryKey: getListProductsQueryKey({ sort: "newest", limit: 8 }) } }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) setLocation(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="flex flex-col gap-6 pb-4">
      {/* Hero */}
      <div className="gradient-primary px-4 pt-6 pb-8 rounded-b-3xl">
        <h1 className="text-xl font-bold text-white mb-1">Minions Market</h1>
        <p className="text-white/70 text-sm mb-4">{t("secureDeal")}</p>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search")}
              className="pl-9 bg-background/90 border-0 h-10 rounded-xl"
              data-testid="input-search"
            />
          </div>
        </form>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 px-4">
          {[
            { icon: ShoppingBag, value: stats.totalProducts || 0, label: t("totalProducts") },
            { icon: Users,       value: stats.totalUsers    || 0, label: t("totalUsers") },
            { icon: TrendingUp,  value: stats.totalDeals    || 0, label: t("totalDeals") },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-xl p-3 border border-border/30 text-center">
              <s.icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="text-lg font-bold">{s.value.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Мобильные игры */}
      <CategorySection
        emoji="📱"
        title="Мобильные игры"
        items={MOBILE_GAMES}
        newSlugs={["clash-royale", "pubg-mobile", "mobile-legends"]}
      />

      {/* Игры ПК */}
      <CategorySection
        emoji="🎮"
        title="Игры (ПК)"
        items={PC_GAMES}
        newSlugs={["valorant", "genshin", "fortnite"]}
      />

      {/* Приложения */}
      <CategorySection
        emoji="�️"
        title="Приложения"
        items={APPS}
        newSlugs={["telegram", "chatgpt"]}
      />

      {/* Featured */}
      {featured && featured.length > 0 && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" /> {t("featuredProducts")}
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {featuredLoading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="w-48 h-52 rounded-xl shrink-0" />)
              : featured.map((p) => (
                  <div key={p.id} className="w-48 shrink-0">
                    <ProductCard product={p} />
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* Recent */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">{t("recentProducts")}</h2>
          <Link href="/catalog" className="text-xs text-primary font-medium">{t("all")}</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recentLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)
            : recent?.products?.map((p) => <ProductCard key={p.id} product={p} />)}
          {!recentLoading && (!recent?.products || recent.products.length === 0) && (
            <div className="col-span-2 text-center py-12 text-muted-foreground text-sm">{t("noProducts")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
