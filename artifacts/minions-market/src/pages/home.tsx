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
  { name: "Brawl Stars",     slug: "brawl-stars",     img: "https://media.rawg.io/media/games/baf/bafbac650de0c6fd36d7c6301e4b7372.jpg" },
  { name: "Clash Royale",    slug: "clash-royale",    img: "https://media.rawg.io/media/games/562/562e33776e1a4b39d0be85a5fdc3ffe5.jpg" },
  { name: "PUBG Mobile",     slug: "pubg-mobile",     img: "https://media.rawg.io/media/games/e60/e60e4cb13dc0793eaea104fbc98b3910.jpg" },
  { name: "Standoff 2",      slug: "standoff2",       img: "https://media.rawg.io/media/games/2d3/2d348881d1b764dff81df505eacc0f63.jpg" },
  { name: "Clash of Clans",  slug: "clash-of-clans",  img: "https://media.rawg.io/media/games/d20/d20ee61aa0248b32e47a3122b425da10.jpg" },
  { name: "Mobile Legends",  slug: "mobile-legends",  img: "https://media.rawg.io/media/games/8cc/8cc77154ecc6ce5bfa45ca293a01a230.jpg" },
  { name: "Call of Duty M",  slug: "codm",            img: "https://media.rawg.io/media/games/949/9498cf85b58d5c11424e58b0c9ed5313.jpg" },
  { name: "Free Fire",       slug: "free-fire",       img: "https://media.rawg.io/media/games/12f/12f6cac1b89ebe1819b7a200e327e4ef.jpg" },
  { name: "Roblox",          slug: "roblox",          img: "https://media.rawg.io/media/games/198/1988a98f7e14cbf8db158b0b9beb0e44.jpg" },
  { name: "Minecraft",       slug: "minecraft-pe",    img: "https://media.rawg.io/media/games/f87/f87457e8347484ecaaf22448725e226f.jpg" },
  { name: "Genshin Impact",  slug: "genshin-mobile",  img: "https://media.rawg.io/media/games/26d/26d96ce4d66f32d38e5f0e19a0adc9f4.jpg" },
  { name: "Fortnite",        slug: "fortnite-mobile", img: "https://media.rawg.io/media/games/713/713269608ba0bff142af87d3e43a5ed2.jpg" },
];

// ─── Игры ПК ─────────────────────────────────────────────────────────────────
const PC_GAMES = [
  { name: "GTA 5 Online",      slug: "gta5",       img: "https://cdn2.steamgriddb.com/icon_thumb/cdbe18d12b5e5e1b08961a0ad0e3b233.png" },
  { name: "Dota 2",            slug: "dota2",      img: "https://cdn2.steamgriddb.com/icon_thumb/73c89a6388b13c69a0e91fe6e15a7ec9.png" },
  { name: "Valorant",          slug: "valorant",   img: "https://cdn2.steamgriddb.com/icon_thumb/31e60c2e56e7e37e48df30c9ace96f9b.png" },
  { name: "Counter-Strike 2",  slug: "cs2",        img: "https://cdn2.steamgriddb.com/icon_thumb/3ffc48e8f57fa097c06e06f686e3efcf.png" },
  { name: "Fortnite",          slug: "fortnite",   img: "https://cdn2.steamgriddb.com/icon_thumb/7c339f5b7e4dd17d5e7c5ef71ae36a1c.png" },
  { name: "Minecraft",         slug: "minecraft",  img: "https://cdn2.steamgriddb.com/icon_thumb/1a2ae4db3a38f098e9373dd34cf26c8a.png" },
  { name: "Genshin Impact",    slug: "genshin",    img: "https://cdn2.steamgriddb.com/icon_thumb/d5df098d3fea32c8f6a5408e34fd9f41.png" },
  { name: "World of Warcraft", slug: "wow",        img: "https://cdn2.steamgriddb.com/icon_thumb/e8e85f34cb3e1fb8b85c02e1eb9e7e0a.png" },
  { name: "League of Legends", slug: "lol",        img: "https://cdn2.steamgriddb.com/icon_thumb/86cca8d1ddee8c7fb24c3eacde2e8fae.png" },
  { name: "Rust",              slug: "rust",       img: "https://cdn2.steamgriddb.com/icon_thumb/32d27eb5d31ae72e6373f40e8f83b75d.png" },
  { name: "Apex Legends",      slug: "apex",       img: "https://cdn2.steamgriddb.com/icon_thumb/17c1f0c3e5cbfc7d4d5d3d19c0e7e3c9.png" },
  { name: "Warframe",          slug: "warframe",   img: "https://cdn2.steamgriddb.com/icon_thumb/a4ce2d02d5e64ce5c2d6e8f5c7b8e5f3.png" },
];

// ─── Приложения ──────────────────────────────────────────────────────────────
const APPS = [
  { name: "Telegram",    slug: "telegram",    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/1200px-Telegram_2019_Logo.svg.png", bg: "#2CA5E0" },
  { name: "TikTok",      slug: "tiktok",      img: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/1200px-TikTok_logo.svg.png", bg: "#010101" },
  { name: "Instagram",   slug: "instagram",   img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1024px-Instagram_icon.png", bg: "#E1306C" },
  { name: "YouTube",     slug: "youtube",     img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1200px-YouTube_full-color_icon_%282017%29.svg.png", bg: "#FF0000" },
  { name: "Steam",       slug: "steam-acc",   img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/1024px-Steam_icon_logo.svg.png", bg: "#1B2838" },
  { name: "Spotify",     slug: "spotify",     img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png", bg: "#1DB954" },
  { name: "Netflix",     slug: "netflix",     img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1024px-Netflix_2015_logo.svg.png", bg: "#E50914" },
  { name: "Discord",     slug: "discord",     img: "https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Discord_logo.svg/1024px-Discord_logo.svg.png", bg: "#5865F2" },
  { name: "VK",          slug: "vk",          img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/VK_Compact_Logo_%282021-present%29.svg/1024px-VK_Compact_Logo_%282021-present%29.svg.png", bg: "#4C75A3" },
  { name: "ChatGPT",     slug: "chatgpt",     img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png", bg: "#10A37F" },
  { name: "App Store",   slug: "appstore",    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/App_Store_%28iOS%29.svg/1024px-App_Store_%28iOS%29.svg.png", bg: "#0D96F6" },
  { name: "PlayStation", slug: "playstation", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/1024px-PlayStation_logo.svg.png", bg: "#003087" },
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
