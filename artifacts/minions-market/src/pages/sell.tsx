import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/i18n";
import { ArrowLeft, X, ChevronRight, Upload, Trash2, Search } from "lucide-react";
import { PLAYEROK_GAMES, PLAYEROK_MOBILE_GAMES, PLAYEROK_APPS } from "@/data/playerok-categories";

const allCategories = [
  ...PLAYEROK_GAMES,
  ...PLAYEROK_MOBILE_GAMES,
  ...PLAYEROK_APPS,
];

const forbiddenWords = ["Продам", "Срочно", "Дешево", "Куплю"];

export default function SellPage() {
  const { t } = useLang();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceSeller: "",
    priceBuyer: "",
    quantity: "1",
    contact: "",
    email: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [titleError, setTitleError] = useState("");
  const [direction, setDirection] = useState(0);

  const handleSelectCategory = (category: any) => {
    setSelectedCategory(category);
    setDirection(1);
    setCurrentStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "title") {
      const hasForbidden = forbiddenWords.some(word => value.toLowerCase().includes(word.toLowerCase()));
      setTitleError(hasForbidden ? "Заголовок не должен содержать запрещенные слова" : "");
    }
  };

  const handlePriceChange = (field: "priceSeller" | "priceBuyer", value: string) => {
    const numValue = parseFloat(value) || 0;
    if (field === "priceBuyer") {
      const sellerPrice = numValue * 0.9;
      setFormData({
        ...formData,
        priceBuyer: value,
        priceSeller: sellerPrice.toFixed(2),
      });
    } else {
      const buyerPrice = numValue / 0.9;
      setFormData({
        ...formData,
        priceSeller: value,
        priceBuyer: buyerPrice.toFixed(2),
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5)); // max 5 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.priceBuyer || titleError) {
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setCurrentStep(1);
      setSelectedCategory(null);
      setSubmitted(false);
      setFormData({
        title: "",
        description: "",
        priceSeller: "",
        priceBuyer: "",
        quantity: "1",
        contact: "",
        email: "",
      });
      setImages([]);
    }, 2000);
  };

  const filteredCategories = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const nextStep = () => {
    setDirection(1);
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
  };

  const handleClose = () => {
    window.location.href = "/";
  };

  const getStepLabel = () => {
    switch (currentStep) {
      case 1:
        return "Выберите категорию";
      case 2:
        return "Информация о товаре";
      case 3:
        return "Загрузка изображений";
      default:
        return "";
    }
  };

  return (
    <div className="w-full text-white font-sans outline-none bg-bg-main">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-bg-card z-40">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / 3) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-16 right-4 bg-green-500 text-white px-6 py-3 rounded-container shadow-lg z-50 flex items-center gap-2"
          >
            <span>✓</span>
            <span>Товар успешно опубликован!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with step label */}
      <div className="bg-bg-main border-b border-bg-card/50 pt-2 pb-2 px-4 sticky top-1 z-30">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <motion.button
              onClick={prevStep}
              className="p-2 hover:bg-bg-card rounded-button transition-colors outline-none"
              whileTap={{ scale: 0.98 }}
              disabled={currentStep === 1}
              style={{ opacity: currentStep === 1 ? 0.5 : 1, pointerEvents: currentStep === 1 ? "none" : "auto" }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <h1 className="text-base font-semibold">{getStepLabel()}</h1>
          </div>
          <motion.button
            onClick={handleClose}
            className="p-2 hover:bg-bg-card rounded-button transition-colors outline-none"
            whileTap={{ scale: 0.98 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <main className="px-4 py-6 max-w-[550px] mx-auto">
        <AnimatePresence custom={direction} mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Category Selection */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-400 mb-4">Выберите интересующую вас категорию:</p>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Поиск...​"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-bg-input border-none rounded-container focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-500 text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Categories Grid - 2 columns on mobile, 3 on desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredCategories.map((category) => (
                    <motion.button
                      key={`${category.name}-${category.slug}`}
                      onClick={() => handleSelectCategory(category)}
                      className="group relative bg-bg-card rounded-container border-none overflow-hidden transition-all duration-300"
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Category Image - aspect-square with object-cover */}
                      <div className="aspect-square w-full bg-bg-input overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove("hidden");
                          }}
                        />
                        <div className="hidden w-full h-full bg-gradient-to-br from-bg-input to-bg-card flex items-center justify-center">
                          <div className="w-8 h-8 bg-accent rounded-full opacity-30"></div>
                        </div>
                      </div>

                      {/* Category Name */}
                      <div className="p-2">
                        <p className="font-medium text-xs line-clamp-2 text-center text-gray-300">{category.name}</p>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <ChevronRight className="w-5 h-5 text-white" />
                      </div>
                    </motion.button>
                  ))}
                </div>

                {filteredCategories.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-gray-400 text-sm">Категория не найдена</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Step 2: Form Details */}
              <div className="space-y-6">
                {selectedCategory && (
                  <div className="flex items-center gap-3 p-3 bg-bg-card rounded-container">
                    <div className="w-12 h-12 bg-bg-input rounded-button overflow-hidden flex-shrink-0">
                      <img
                        src={selectedCategory.image}
                        alt={selectedCategory.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold truncate">{selectedCategory.name}</h3>
                      <p className="text-xs text-gray-400">Товар untuk platform ini</p>
                    </div>
                  </div>
                )}

                <form className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Название товара <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Например: Премиум аккаунт"
                      maxLength={100}
                      required
                      className="w-full px-4 py-3 bg-bg-input border-none rounded-container focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-500 text-sm transition-colors"
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500">{formData.title.length}/100 символов</p>
                      {titleError && <p className="text-xs text-red-500">{titleError}</p>}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Описание товара <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Опишите товар подробно..."
                      maxLength={500}
                      required
                      className="w-full h-24 px-4 py-3 bg-bg-input border-none rounded-container focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-500 text-sm resize-none transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 символов</p>
                  </div>

                  {/* Smart Price */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold">
                      Цена (₽) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Вы получите</p>
                        <input
                          type="number"
                          name="priceSeller"
                          value={formData.priceSeller}
                          onChange={(e) => handlePriceChange("priceSeller", e.target.value)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          required
                          className="w-full px-4 py-3 bg-bg-input border-none rounded-container focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-500 text-sm transition-colors"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Цена для покупателя</p>
                        <input
                          type="number"
                          name="priceBuyer"
                          value={formData.priceBuyer}
                          onChange={(e) => handlePriceChange("priceBuyer", e.target.value)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          required
                          className="w-full px-4 py-3 bg-bg-input border-none rounded-container focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-500 text-sm transition-colors"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center">Комиссия системы: 10%</p>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Количество</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="1"
                      min="1"
                      className="w-full px-4 py-3 bg-bg-input border-none rounded-container focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-500 text-sm transition-colors"
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Имя</label>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="Иван"
                        maxLength={50}
                        className="w-full px-4 py-3 bg-bg-input border-none rounded-container focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-500 text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="mail@example.com"
                        className="w-full px-4 py-3 bg-bg-input border-none rounded-container focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-500 text-sm transition-colors"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 px-4 py-3 border border-bg-card rounded-button text-white font-semibold hover:bg-bg-card transition-colors outline-none"
                      whileTap={{ scale: 0.98 }}
                    >
                      Назад
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-button font-semibold transition-colors outline-none"
                      whileTap={{ scale: 0.98 }}
                    >
                      Далее
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Step 3: Image Upload */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Загрузите фотографии</h2>
                  <p className="text-sm text-gray-400">Добавьте до 5 фотографий товара для лучшего привлечения покупателей</p>
                </div>

                {/* Image Slots - aspect-square with dashed border */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="aspect-square border-2 border-dashed border-bg-card rounded-container flex items-center justify-center relative overflow-hidden bg-bg-input/30 hover:border-accent/50 transition-colors"
                    >
                      {images[i] ? (
                        <div className="relative w-full h-full">
                          <img
                            src={URL.createObjectURL(images[i])}
                            alt={`Preview ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <motion.button
                            onClick={() => removeImage(i)}
                            type="button"
                            className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors outline-none"
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      ) : (
                        <label className="cursor-pointer w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <Upload className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-400">Нажмите для загрузки</p>
                          </div>
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

                <p className="text-xs text-gray-400 text-center">Загружено: {images.length} из 5 фотографий</p>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 px-4 py-3 border border-bg-card rounded-button text-white font-semibold hover:bg-bg-card transition-colors outline-none"
                    whileTap={{ scale: 0.98 }}
                  >
                    Назад
                  </motion.button>
                  <motion.button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-3 bg-accent hover:bg-accent/90 text-white rounded-button font-semibold transition-colors outline-none"
                    whileTap={{ scale: 0.98 }}
                  >
                    Опубликовать
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
