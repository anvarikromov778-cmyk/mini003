import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/i18n";
import { ArrowLeft, X, ChevronRight } from "lucide-react";
import { PLAYEROK_GAMES, PLAYEROK_MOBILE_GAMES, PLAYEROK_APPS } from "@/data/playerok-categories";

const allCategories = [
  ...PLAYEROK_GAMES,
  ...PLAYEROK_MOBILE_GAMES,
  ...PLAYEROK_APPS,
];

export default function SellPage() {
  const { t } = useLang();

  const [formData, setFormData] = useState({
    category: "",
    categoryIcon: "🎮",
    title: "",
    description: "",
    price: "",
    quantity: "1",
    contact: "",
    email: "",
  });

  const [step, setStep] = useState<"category" | "details" | "review">("category");
  const [submitted, setSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectCategory = (categoryName: string, categoryIcon: string) => {
    setFormData({ ...formData, category: categoryName, categoryIcon });
    setStep("details");
    setSearchQuery("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.description || !formData.price) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }
    setStep("review");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setStep("category");
      setFormData({
        category: "",
        categoryIcon: "🎮",
        title: "",
        description: "",
        price: "",
        quantity: "1",
        contact: "",
        email: "",
      });
    }, 2500);
  };

  // Filter categories based on search
  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (step === "category") window.location.href = "/";
                else setStep("category");
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <img src={PLAYEROK_LOGO} alt="PlayerOK" className="w-6 h-6" />
              <h1 className="text-lg font-bold text-gray-900">Выставить товар</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${step === "category" ? "bg-blue-100 text-blue-700" : "text-gray-500"}`}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-current text-white text-xs font-bold">1</div>
              <span>Категория</span>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${step !== "category" ? "bg-blue-100 text-blue-700" : "text-gray-500"}`}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-current text-white text-xs font-bold">2</div>
              <span>Описание</span>
            </div>
          </div>
        </div>
      </header>

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-12 text-center max-w-md shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Товар выставлен!</h2>
            <p className="text-gray-600 mb-8">Ваше объявление опубликовано и видно в каталоге площадки</p>
            <Button onClick={() => (window.location.href = "/")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Вернуться на главную
            </Button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {step === "category" ? (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Выберите категорию</h2>
              <p className="text-gray-600 mb-6">Укажите, к какой категории относится ваш товар</p>

              {/* Search */}
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по названию игры или приложения..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            {filteredCategories.map((category) =>
              category.items.length > 0 ? (
                <div key={category.name} className="mb-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {category.items.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleSelectCategory(item.name, category.icon)}
                        className="group relative"
                      >
                        <div className="bg-white border border-gray-200 rounded-lg p-2 hover:border-blue-400 hover:shadow-md transition-all overflow-hidden h-full flex flex-col">
                          <div className="aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-size='12' fill='%239ca3af'%3EНет фото%3C/text%3E%3C/svg%3E";
                              }}
                            />
                          </div>
                          <p className="font-medium text-gray-900 text-xs line-clamp-2 text-center flex-1">{item.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null
            )}

            {searchQuery && filteredCategories.every((cat) => cat.items.length === 0) && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Категория не найдена</p>
              </div>
            )}
          </div>
        ) : step === "details" ? (
          <div className="max-w-2xl">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-white border border-blue-200 rounded-lg flex items-center justify-center text-2xl">{formData.categoryIcon}</div>
              <div>
                <h3 className="font-semibold text-gray-900">{formData.category}</h3>
                <p className="text-sm text-gray-600">Вы выбрали эту категорию</p>
              </div>
              <button onClick={() => setStep("category")} className="ml-auto text-blue-600 hover:text-blue-700 text-sm font-semibold">
                Изменить
              </button>
            </div>

            <form onSubmit={handleNext} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Название товара *</label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Например: Account с 100 часов DotA 2"
                  className="w-full border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Описание товара *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Опишите товар подробно: что входит в комплект, его характеристики, условия доставки и т.д."
                  className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Цена (₽) *</label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Количество</label>
                  <Input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="1"
                    className="w-full border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Ваше имя</label>
                  <Input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Иван"
                    className="w-full border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@mail.com"
                    className="w-full border-gray-300"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-900">
                  Убедитесь, что товар соответствует правилам площадки. Нарушающие объявления будут удалены без возмещения средств.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("category")}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
                >
                  ← Назад
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Дальше →
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Проверьте информацию</h2>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 mb-8">
              <div className="border-b pb-6">
                <p className="text-sm text-gray-600 mb-2">Категория</p>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{formData.categoryIcon}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{formData.category}</p>
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <p className="text-sm text-gray-600 mb-2">Название</p>
                <p className="text-lg font-semibold text-gray-900">{formData.title}</p>
              </div>

              <div className="border-b pb-6">
                <p className="text-sm text-gray-600 mb-2">Описание</p>
                <p className="text-gray-800 whitespace-pre-wrap">{formData.description}</p>
              </div>

              <div className="border-b pb-6 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Цена</p>
                  <p className="text-2xl font-bold text-gray-900">₽{formData.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Количество</p>
                  <p className="text-lg font-semibold text-gray-900">{formData.quantity}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {formData.contact && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Контакт</p>
                    <p className="text-gray-900">{formData.contact}</p>
                  </div>
                )}
                {formData.email && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="text-gray-900">{formData.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("details")}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
              >
                ← Редактировать
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Опубликовать товар
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
