import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Upload, ChevronLeft } from "lucide-react";
import { PLAYEROK_GAMES, PLAYEROK_MOBILE_GAMES, PLAYEROK_APPS } from "@/data/playerok-categories";

const TABS = [
  { id: "games", label: "Игры", icon: "🎮", count: PLAYEROK_GAMES.length },
  { id: "mobile", label: "Мобильные игры", icon: "📱", count: PLAYEROK_MOBILE_GAMES.length },
  { id: "apps", label: "Приложения", icon: "🛠", count: PLAYEROK_APPS.length },
];

const getAllItems = () => [
  ...PLAYEROK_GAMES.map(g => ({ ...g, category: "games" })),
  ...PLAYEROK_MOBILE_GAMES.map(g => ({ ...g, category: "mobile" })),
  ...PLAYEROK_APPS.map(g => ({ ...g, category: "apps" })),
];

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("games");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [commissionEnabled, setCommissionEnabled] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priceForMe: "",
    priceForBuyer: "",
    quantity: "1",
    contact: "",
    email: "",
  });

  const [images, setImages] = useState<File[]>([]);

  const getTabItems = (tabId: string) => {
    const allItems = getAllItems();
    return allItems.filter(item => item.category === tabId);
  };

  const tabItems = getTabItems(activeTab);
  const filtered = tabItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setStep(2);
  };

  const handlePriceChange = (field: string, value: string) => {
    const num = parseFloat(value) || 0;
    if (field === "priceForBuyer") {
      const forMe = commissionEnabled ? num * 0.9 : num;
      setForm(prev => ({
        ...prev,
        priceForBuyer: value,
        priceForMe: forMe.toFixed(2),
      }));
    } else {
      const forBuyer = commissionEnabled ? num / 0.9 : num;
      setForm(prev => ({
        ...prev,
        priceForMe: value,
        priceForBuyer: forBuyer.toFixed(2),
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setStep(1);
      setForm({ title: "", description: "", priceForMe: "", priceForBuyer: "", quantity: "1", contact: "", email: "" });
      setImages([]);
      setSelectedItem(null);
      setSubmitted(false);
    }, 2000);
  };

  const progress = (step / 3) * 100;

  return (
    <div className="bg-bg-main text-white min-h-screen pb-20">
      {/* Header с прогресс-баром */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          className="h-1 bg-accent"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="max-w-md mx-auto pt-2">
        {/* Топ панель */}
        <div className="px-4 py-2 flex items-center justify-between gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="p-2 rounded-button hover:bg-bg-card transition flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-center text-gray-300">
              {step === 1
                ? "Выберите раздел товаров"
                : step === 2
                ? "Детали товара"
                : "Загрузите фотографии"}
            </p>
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="p-2 rounded-button hover:bg-bg-card transition flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success notification */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-4 mb-4 p-3 bg-green-600 rounded-button text-sm text-center"
            >
              ✓ Товар успешно опубликован!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="px-4 space-y-4">
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Поиск игр и приложений"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-bg-input rounded-button text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent border-none"
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-2">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setSearch(""); }}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      activeTab === tab.id
                        ? "bg-[#1f2a37] text-white"
                        : "bg-bg-card text-gray-400 hover:bg-[#1a2530]"
                    }`}
                  >
                    {tab.label} {tab.count}
                  </button>
                ))}
              </div>

              {/* Commission Toggle */}
              <div className="flex items-center justify-between bg-bg-card rounded-button p-2.5">
                <div>
                  <p className="text-xs font-semibold">Платеж 10%</p>
                  <p className="text-[10px] text-gray-400">Комиссия</p>
                </div>
                <button
                  onClick={() => setCommissionEnabled(!commissionEnabled)}
                  className={`w-10 h-5 rounded-full p-0.5 transition ${
                    commissionEnabled ? "bg-accent" : "bg-gray-600"
                  }`}
                >
                  <motion.div
                    className="w-4 h-4 bg-white rounded-full"
                    animate={{ x: commissionEnabled ? 20 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-4 gap-2">
                {filtered.slice(0, 24).map((item, idx) => (
                  <button
                    key={`${item.category}-${item.slug}`}
                    onClick={() => handleSelectItem(item)}
                    className="relative group flex flex-col items-center gap-1 p-1.5 rounded-2xl bg-bg-card hover:bg-[#18212f] transition"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-bg-input overflow-hidden flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[8px] font-medium line-clamp-2 text-center leading-tight w-full">
                      {item.name}
                    </span>
                    {idx < 3 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-black text-[7px] px-1 py-0 rounded-full font-bold">Новое</span>
                    )}
                  </button>
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="text-center text-gray-400 py-8">Ничего не найдено</p>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Selected Category */}
              {selectedItem && (
                <div className="flex items-center gap-3 bg-bg-card rounded-button p-3">
                  <div className="w-12 h-12 rounded-2xl bg-bg-input overflow-hidden">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Категория</p>
                    <p className="font-semibold text-sm">{selectedItem.name}</p>
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Название товара</label>
                <input
                  type="text"
                  placeholder="Введите название"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  maxLength={100}
                  className="w-full px-3 py-2 bg-bg-input rounded-button text-white text-xs placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent border-none"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">{form.title.length}/100</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Описание</label>
                <textarea
                  placeholder="Описание товара"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  maxLength={500}
                  rows={3}
                  className="w-full px-3 py-2 bg-bg-input rounded-button text-white text-xs placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent border-none resize-none"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">{form.description.length}/500</p>
              </div>

              {/* Prices */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">Цена (₽)</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Вы получите</p>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.priceForMe}
                      onChange={(e) => handlePriceChange("priceForMe", e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 bg-bg-input rounded-button text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent border-none"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Цена для покупателя</p>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.priceForBuyer}
                      onChange={(e) => handlePriceChange("priceForBuyer", e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 bg-bg-input rounded-button text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent border-none"
                    />
                  </div>
                </div>
                {commissionEnabled && (
                  <p className="text-xs text-gray-400 mt-1 text-center">Комиссия 10% учтена</p>
                )}
              </div>

              {/* Quantity & Contact */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Количество</label>
                  <input
                    type="number"
                    placeholder="1"
                    value={form.quantity}
                    onChange={(e) => setForm(prev => ({ ...prev, quantity: e.target.value }))}
                    min="1"
                    className="w-full px-3 py-2 bg-bg-input rounded-button text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent border-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Контакт</label>
                  <input
                    type="text"
                    placeholder="Имя"
                    value={form.contact}
                    onChange={(e) => setForm(prev => ({ ...prev, contact: e.target.value }))}
                    className="w-full px-3 py-2 bg-bg-input rounded-button text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent border-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="mail@example.com"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-bg-input rounded-button text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent border-none"
                />
              </div>

              {/* Next Button */}
              <button
                onClick={() => setStep(3)}
                className="w-full px-4 py-3 bg-accent hover:bg-[#1aa7ff] text-black font-semibold rounded-button transition"
              >
                Далее
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <p className="text-sm text-gray-400">Добавьте фотографии для объявления</p>

              {/* Images Grid */}
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="aspect-square border-2 border-dashed border-bg-card/60 rounded-2xl bg-bg-input flex items-center justify-center relative overflow-hidden hover:border-accent/50 transition"
                  >
                    {images[idx] ? (
                      <>
                        <img
                          src={URL.createObjectURL(images[idx])}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-black/90 transition"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-2">
                        <Upload className="w-6 h-6 text-gray-500" />
                        <span className="text-xs text-gray-400">Загрузить</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          multiple
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 text-center">{images.length}/5 загружено</p>

              {/* Submit Button */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-accent hover:bg-[#1aa7ff] text-black font-semibold rounded-button transition"
                >
                  Опубликовать
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
