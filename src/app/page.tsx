"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Search, X, Plus, Minus,
  Coffee, MessageSquare, Phone,
  Copy, Check, ChevronRight,
  Package, MapPin, Ticket, Leaf, Clock, Gift,
  Instagram, Star, Heart, Send
} from "lucide-react";
import { MenuItem, CartItem, VoucherConfig, PackageItem } from "@/lib/types";

// ─── Brand & Config ─────────────────────────────────────────────────────
const BRAND_NAME = "Kopi Tenang Jiwa";
const BRAND_TAGLINE = "Seduh perlahan, nikmati detik ini.";
const BRAND_ADDRESS = "Jl. Ketenangan No. 8, Bandung";
const WA_NUMBER = "6289655223792";
const SHEETDB_API_URL = "https://sheetdb.io/api/v1/YOUR_API_ID";

const BANK_ACCOUNTS = [
  { bank: "Bank Jago", number: "104110415462" },
  { bank: "Bank BNI", number: "1883379073" },
  { bank: "Bank BCA", number: "6768102466" },
];

const generateInvoiceCode = () => {
  const date = new Date();
  const ymd = date.toISOString().split("T")[0].replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KTJ-${ymd}-${rand}`;
};

// ─── Real Menu Data ──────────────────────────────────────────────────────
// ─── Real Menu Data (25 Items) ─────────────────────────────────────────
const REAL_MENU: MenuItem[] = [
  // ── Kopi ──
  {
    id: 1,
    name: "Kopi Susu Tenang Jiwa",
    description: "Espresso premium dengan susu segar creamy dan sirup aren organik rahasia.",
    price: 18000,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600",
    category: "kopi",
    isAvailable: true,
    customVariants: ["Dingin", "Hangat"],
    moods: ["Ngantuk Berat", "Butuh Nyantai"],
    badge: "🔥 Best Seller",
    caffeineLevel: "Medium Caffeine",
    sweetnessLevel: "Aren Organik",
  },
  {
    id: 5,
    name: "Americano Klasik",
    description: "Double shot espresso dengan air panas, memberikan rasa kopi murni yang kuat dan clean.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?auto=format&fit=crop&q=80&w=600",
    category: "kopi",
    isAvailable: true,
    customVariants: ["Dingin", "Hangat"],
    moods: ["Ngantuk Berat"],
    badge: "⭐ Barista's Pick",
    caffeineLevel: "Strong Caffeine",
    sweetnessLevel: "Tanpa Gula",
  },
  {
    id: 7,
    name: "Caramel Macchiato",
    description: "Espresso lembut bertemu susu creamy dan drizzle caramel manis yang menggoda.",
    price: 24000,
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=600",
    category: "kopi",
    isAvailable: true,
    customVariants: ["Dingin", "Hangat"],
    moods: ["Butuh Nyantai", "Lagi Badmood"],
    badge: "🔥 Best Seller",
    caffeineLevel: "Medium Caffeine",
    sweetnessLevel: "Caramel Sweet",
  },
  {
    id: 15,
    name: "Kopi Susu Pandan Wangi",
    description: "Espresso khas berpadu ekstrak daun pandan asli yang harum dan legit.",
    price: 20000,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600",
    category: "kopi",
    isAvailable: true,
    customVariants: ["Dingin", "Hangat"],
    moods: ["Butuh Nyantai"],
    sweetnessLevel: "Aroma Pandan",
  },
  {
    id: 16,
    name: "Hazelnut Latte Creamy",
    description: "Espresso dengan rasa kacang hazelnut yang gurih manis dan foam susu lembut.",
    price: 23000,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=600",
    category: "kopi",
    isAvailable: true,
    customVariants: ["Dingin", "Hangat"],
    moods: ["Butuh Nyantai"],
    caffeineLevel: "Medium Caffeine",
  },
  {
    id: 17,
    name: "Spanish Latte Sweet Milk",
    description: "Kopi espresso kuat dipadukan kental manis lezat dan susu segar harum.",
    price: 22000,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600",
    category: "kopi",
    isAvailable: true,
    customVariants: ["Dingin", "Hangat"],
    moods: ["Ngantuk Berat"],
    caffeineLevel: "Strong Caffeine",
  },

  // ── Non-Kopi ──
  {
    id: 2,
    name: "Matcha Cream Latte",
    description: "Pure Uji Matcha jepang berpadu dengan creamy milk foam lembut di atasnya.",
    price: 22000,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=600",
    category: "non-kopi",
    isAvailable: true,
    customVariants: ["Less Sugar", "Normal Sweet"],
    moods: ["Lagi Badmood", "Butuh Nyantai"],
    badge: "⭐ Barista's Pick",
    caffeineLevel: "Low Caffeine",
    sweetnessLevel: "Creamy Matcha",
  },
  {
    id: 6,
    name: "Taro Velvet Latte",
    description: "Perpaduan taro premium dengan susu segar dan hint vanilla yang lembut.",
    price: 20000,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=600",
    category: "non-kopi",
    isAvailable: true,
    customVariants: ["Less Sugar", "Normal Sweet"],
    moods: ["Lagi Badmood", "Butuh Nyantai"],
    caffeineLevel: "Non-Kafein",
    sweetnessLevel: "Velvety Sweet",
  },
  {
    id: 18,
    name: "Earl Grey Artisan Milk Tea",
    description: "Teh Earl Grey dengan aroma bergamot dipadukan susu manis lembut.",
    price: 21000,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=600",
    category: "non-kopi",
    isAvailable: true,
    customVariants: ["Less Sugar", "Normal Sweet"],
    moods: ["Butuh Nyantai"],
    caffeineLevel: "Low Caffeine",
  },
  {
    id: 19,
    name: "Red Velvet Choco Float",
    description: "Minuman Red Velvet kaya rasa cokelat dengan scoop ice cream vanila manis.",
    price: 22000,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600",
    category: "non-kopi",
    isAvailable: true,
    moods: ["Lagi Badmood"],
    caffeineLevel: "Non-Kafein",
  },
  {
    id: 20,
    name: "Mango Tropical Smoothie",
    description: "Smoothie mangga manis menyegarkan dengan bulir buah asli & hint kelapa.",
    price: 23000,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=600",
    category: "non-kopi",
    isAvailable: true,
    moods: ["Butuh Nyantai"],
    caffeineLevel: "Non-Kafein",
  },

  // ── Makanan Berat ──
  {
    id: 9,
    name: "Nasi Goreng Rempah Tenang Jiwa",
    description: "Nasi goreng bumbu rempah spesial dengan topping telor ceplok, sosis, & kerupuk renyah.",
    price: 28000,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=600",
    category: "makanan-berat",
    isAvailable: true,
    moods: ["Laper Dikit"],
    badge: "🔥 Best Seller",
    sweetnessLevel: "Gurih Rempah",
  },
  {
    id: 10,
    name: "Rice Bowl Ayam Sambal Matah",
    description: "Daging ayam crispy empuk dengan siraman sambal matah khas Bali yang pedas segar.",
    price: 27000,
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600",
    category: "makanan-berat",
    isAvailable: true,
    moods: ["Laper Dikit"],
    badge: "⭐ Barista's Pick",
    sweetnessLevel: "Pedas Segar",
  },
  {
    id: 11,
    name: "Beef Teriyaki Donburi",
    description: "Irisan daging sapi saikoro empuk ditumis bumbu teriyaki manis gurih di atas nasi hangat.",
    price: 32000,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=600",
    category: "makanan-berat",
    isAvailable: true,
    badge: "🔥 Best Seller",
    sweetnessLevel: "Manis Gurih",
  },
  {
    id: 12,
    name: "Spaghetti Carbonara Creamy",
    description: "Pasta spaghetti lembut dalam saus keju creamy gurih dengan potongan smoked beef.",
    price: 30000,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=600",
    category: "makanan-berat",
    isAvailable: true,
    sweetnessLevel: "Creamy Cheese",
  },
  {
    id: 13,
    name: "Nasi Ayam Geprek Aren",
    description: "Ayam geprek crispy pedas dengan saus caramel aren gurih manis yang melimpah.",
    price: 25000,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600",
    category: "makanan-berat",
    isAvailable: true,
    sweetnessLevel: "Pedas Manis",
  },
  {
    id: 14,
    name: "Dory Fish & Chips Crispy",
    description: "Ikan dory goreng tepung renyah disajikan bersama kentang goreng & saus tartar segar.",
    price: 29000,
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&q=80&w=600",
    category: "makanan-berat",
    isAvailable: true,
    sweetnessLevel: "Gurih Renyah",
  },
  {
    id: 24,
    name: "Chicken Katsu Curry Rice",
    description: "Ayam katsu tebal berbalur bumbu kari Jepang gurih pekat disajikan di atas nasi pulen.",
    price: 31000,
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=600",
    category: "makanan-berat",
    isAvailable: true,
    badge: "⭐ Barista's Pick",
  },
  {
    id: 25,
    name: "Nasi Kebuli Daging Sapi Special",
    description: "Nasi bumbu kebuli kaya rempah dengan irisan daging sapi empuk & kismis manis.",
    price: 35000,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=600",
    category: "makanan-berat",
    isAvailable: true,
    badge: "🔥 Best Seller",
  },

  // ── Pastry & Snack ──
  {
    id: 3,
    name: "Butter Croissant",
    description: "Pastry renyah berlapis-lapis dengan aroma mentega Prancis yang wangi dan gurih.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600",
    category: "cemilan",
    isAvailable: true,
    moods: ["Laper Dikit"],
    badge: "🔥 Best Seller",
    sweetnessLevel: "Gurih Mentega",
  },
  {
    id: 4,
    name: "Almond Waffle Box",
    description: "Waffle hangat bertekstur empuk disajikan dengan taburan kacang almond dan saus maple.",
    price: 18000,
    image: "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&q=80&w=600",
    category: "cemilan",
    isAvailable: true,
    moods: ["Lagi Badmood", "Laper Dikit"],
    sweetnessLevel: "Manis Maple",
  },
  {
    id: 8,
    name: "Chocolate Banana Toast",
    description: "Roti panggang renyah dengan selai cokelat premium dan irisan pisang segar.",
    price: 16000,
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&q=80&w=600",
    category: "cemilan",
    isAvailable: true,
    moods: ["Laper Dikit", "Lagi Badmood"],
    sweetnessLevel: "Cokelat Pisang",
  },
  {
    id: 21,
    name: "French Fries Truffle Oil",
    description: "Kentang goreng renyah dengan taburan garam gurih & minyak truffle harum aromatik.",
    price: 17000,
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=600",
    category: "cemilan",
    isAvailable: true,
    sweetnessLevel: "Aroma Truffle",
  },
  {
    id: 22,
    name: "Singkong Goreng Keju Aren",
    description: "Singkong merekah empuk dengan cocolan saus gula aren dan parutan keju melimpah.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=600",
    category: "cemilan",
    isAvailable: true,
    sweetnessLevel: "Manis Gurih",
  },
  {
    id: 23,
    name: "Churros Cinnamon Sugar",
    description: "Churros goreng renyah bersalut gula kayu manis disajikan dengan saus cokelat leleh.",
    price: 18000,
    image: "https://images.unsplash.com/photo-1624371414361-e670ef4889d6?auto=format&fit=crop&q=80&w=600",
    category: "cemilan",
    isAvailable: true,
    sweetnessLevel: "Cinnamon Sweet",
  },
];

// ─── Special & Celebration Packages ────────────────────────────────────
const SPECIAL_PACKAGES: PackageItem[] = [
  {
    id: "pkg-bday-1",
    name: "Paket Birthday Perayaan",
    tagline: "Khusus Dekorasi & Reserved Table",
    price: 150000,
    badge: "🎉 Birthday Special",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600",
    description: "Paket pesta perayaan ulang tahun simpel nan hangat di kedai Kopi Tenang Jiwa.",
    itemsIncluded: [
      "Dekorasi Meja Ulang Tahun Special",
      "Custom Birthday Greeting Card",
      "2x Minuman Bebas Pilih (Kopi / Non-Kopi)",
      "Reserved Table Prioritas 2 Jam",
    ],
  },
  {
    id: "pkg-bday-2",
    name: "Paket Birthday Full Set (Cake + Kopi)",
    tagline: "Lengkap Whole Cake + 4 Kopi + Dekor",
    price: 350000,
    badge: "🎂 Ultimate Birthday",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
    description: "Paket ulang tahun mewah lengkap dengan Whole Cake spesial, 4 Minuman, hampers & dekorasi manis.",
    itemsIncluded: [
      "1x Whole Birthday Cake (Tiramisu / Choco)",
      "4x Minuman Kopi / Non-Kopi Bebas Pilih",
      "Dekorasi Meja Full & Balon Perayaan",
      "Hampers Box + Custom Greeting Card",
      "Reserved Table Prioritas 3 Jam",
    ],
    customVariants: ["Cake Tiramisu Premium", "Cake Belgian Chocolate", "Cake Red Velvet Cream"],
  },
  {
    id: "pkg-wfh",
    name: "Paket WFH & Nugas Tenang",
    tagline: "Solusi Kerja & Nugas Seharian",
    price: 45000,
    originalPrice: 53000,
    badge: "💻 Best Value",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
    description: "Paket hemat khusus Anda yang ingin nugas atau kerja tenang dengan koneksi WiFi kencang.",
    itemsIncluded: [
      "1x Kopi Susu Tenang Jiwa / Americano",
      "1x Butter Croissant Renyah / Waffle",
      "Akses WiFi Prioritas High Speed",
      "Stopkontak Khusus di Meja",
    ],
  },
  {
    id: "pkg-mabar",
    name: "Paket Nongkrong Ber-4",
    tagline: "Makin Ramai Makin Hemat",
    price: 120000,
    originalPrice: 144000,
    badge: "👥 Hemat Ber-4",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600",
    description: "Paket mabar & kumpul seru bareng sahabat. Dapat 4 minuman favorit + snack basket komplit.",
    itemsIncluded: [
      "4x Minuman Kopi / Non-Kopi Pilihan",
      "1x Almond Waffle Box Sharing",
      "1x Basket Truffle French Fries",
    ],
  },
];

// ─── Testimonials Data (Social Proof) ────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 1,
    name: "Rizky Ramadhan",
    role: "Pecinta Kopi Aren",
    rating: 5,
    text: "Kopi Susu Tenang Jiwa rahasianya ga pernah gagal. Aren organik-nya pas banget, gak terlalu manis & gak bikin enek!",
    date: "2 hari lalu",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 2,
    name: "Annisa Larasati",
    role: "Mahasiswi Bandung",
    rating: 5,
    text: "Suasananya tenang banget buat nugas. Matcha Cream Latte-nya super creamy dan pas di lidah. Langganan!",
    date: "3 hari lalu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 3,
    name: "Deni Prasetyo",
    role: "Software Engineer",
    rating: 5,
    text: "Croissant renyah berlapis-lapis dipadukan sama Americano panas, perpaduan moodbooster kerja paling ampuh.",
    date: "1 minggu lalu",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 4,
    name: "Siti Nurhaliza",
    role: "Food Content Creator",
    rating: 5,
    text: "Pengiriman cepat dan packaging-nya rapi banget! Tetap dingin waktu sampai di rumah. Paket Santai-nya hemat parah!",
    date: "1 minggu lalu",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 5,
    name: "Bagus Setiawan",
    role: "Arsitek",
    rating: 5,
    text: "Rasa kopinya clean dan wangi. Butter Croissant-nya renyah banget. Tempat ngopi & pesan favorit setiap minggu di Bandung.",
    date: "2 minggu lalu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
];

// ─── Constants ───────────────────────────────────────────────────────────
const categories = [
  { key: "All", label: "Semua", icon: "✨" },
  { key: "kopi", label: "Kopi", icon: "☕" },
  { key: "non-kopi", label: "Non-Kopi", icon: "🍵" },
  { key: "makanan-berat", label: "Makanan Berat", icon: "🍛" },
  { key: "cemilan", label: "Pastry & Snack", icon: "🥐" },
];

const moodsList = ["Ngantuk Berat", "Lagi Badmood", "Butuh Nyantai", "Laper Dikit"];

const deliveryAreas = [
  { label: "Radius < 3 KM", value: "Radius < 3 KM", cost: 5000 },
  { label: "Radius 3 - 7 KM", value: "Radius 3 - 7 KM", cost: 10000 },
];

const COMBO_DISCOUNT = 5000;

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const getDefaultVariant = (item: MenuItem): string => {
  if (item.customVariants && item.customVariants.length > 0) return item.customVariants[0];
  return "";
};

const getVariantOptions = (item: MenuItem): string[] => {
  if (item.customVariants && item.customVariants.length > 0) return item.customVariants;
  return [];
};

// ─── Copy Button ─────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.button whileTap={{ scale: 0.95 }} onClick={handleCopy}
      className={`text-xs px-3 py-1.5 rounded-xl transition-all duration-300 ${copied ? "bg-sage text-bone" : "bg-latte text-charcoal hover:bg-sage/20"}`}
    >
      {copied ? <Check className="w-3 h-3 inline mr-1" /> : <Copy className="w-3 h-3 inline mr-1" />}
      {copied ? "Tersalin" : "Salin"}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function Template3() {
  // ── Core State ──
  const [items, setItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pendingVariants, setPendingVariants] = useState<Record<string | number, string>>({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const menuSectionRef = useRef<HTMLDivElement>(null);

  const scrollToMenu = useCallback(() => {
    menuSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      scrollToMenu();
    }
  };

  // Auto scroll to menu section after 1.5 seconds of inactivity after typing in search bar
  useEffect(() => {
    if (search.trim().length === 0) return;

    const timer = setTimeout(() => {
      scrollToMenu();
    }, 1500);

    return () => clearTimeout(timer);
  }, [search, scrollToMenu]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("Dine In");
  const [dineInOption, setDineInOption] = useState("Scan Barcode Meja");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer");
  const [loading, setLoading] = useState(true);

  // New Features
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [invoiceCode, setInvoiceCode] = useState("");

  // Toast
  const [toast, setToast] = useState({ show: false, message: "" });

  // Modals
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successStep, setSuccessStep] = useState(0);

  // Combo Builder (Paket Santai)
  const [comboDrink, setComboDrink] = useState<MenuItem | null>(null);
  const [comboPastry, setComboPastry] = useState<MenuItem | null>(null);

  // Voucher System
  const [voucherConfig, setVoucherConfig] = useState<VoucherConfig>({ voucherActive: false, voucherCode: "", voucherDiscount: 0 });
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherError, setVoucherError] = useState("");

  // ── Load Data ──
  useEffect(() => {
    const isPlaceholderAPI = SHEETDB_API_URL.includes("YOUR_API_ID");

    const loadMenu = async () => {
      if (isPlaceholderAPI) {
        setItems(REAL_MENU);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${SHEETDB_API_URL}`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error("fail");
        setItems(await res.json());
      } catch {
        setItems(REAL_MENU);
      } finally {
        setLoading(false);
      }
    };

    const loadVoucher = async () => {
      if (isPlaceholderAPI) return;
      try {
        const res = await fetch(`${SHEETDB_API_URL}?sheet=config`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error("fail");
        const data = await res.json();
        const active = data.find((r: { key: string; value: string }) => r.key === "voucherActive");
        const code = data.find((r: { key: string; value: string }) => r.key === "voucherCode");
        const disc = data.find((r: { key: string; value: string }) => r.key === "voucherDiscount");
        if (active && code && disc) {
          setVoucherConfig({
            voucherActive: String(active.value).toUpperCase() === "TRUE",
            voucherCode: String(code.value).toUpperCase(),
            voucherDiscount: Number(disc.value) || 0,
          });
        }
      } catch { /* silent fallback */ }
    };

    loadMenu();
    loadVoucher();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const defaults: Record<string | number, string> = {};
      items.forEach((item) => { defaults[item.id] = getDefaultVariant(item); });
      setPendingVariants(defaults);
    }
  }, [items]);

  // ── Filtering ──
  const filteredItems = useMemo(() => items.filter((item) => {
    const matchCat = category === "All" || item.category.toLowerCase() === category.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchMood = !selectedMood || (item.moods && item.moods.includes(selectedMood));
    return matchCat && matchSearch && matchMood;
  }), [items, category, search, selectedMood]);

  // ── Cart Actions ──
  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const addToCart = useCallback((item: MenuItem) => {
    if (!item.isAvailable || item.isAvailable === "FALSE") return;
    const selectedVariant = pendingVariants[item.id] ?? getDefaultVariant(item);
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...item, quantity: 1, notes: "", variant: selectedVariant }];
    });
    showToast(`${item.name} ditambahkan`);
  }, [pendingVariants]);

  const addPackageToCart = useCallback((pkg: PackageItem) => {
    const selectedVariant = pendingVariants[pkg.id] || (pkg.customVariants ? pkg.customVariants[0] : "");
    setCart((prev) => {
      const existing = prev.find((i) => i.id === pkg.id);
      if (existing) return prev.map((i) => (i.id === pkg.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [
        ...prev,
        {
          id: pkg.id,
          name: pkg.name,
          description: pkg.description,
          price: pkg.price,
          image: pkg.image,
          category: "paket",
          isAvailable: true,
          quantity: 1,
          variant: selectedVariant,
          notes: pkg.itemsIncluded.join(", "),
        },
      ];
    });
    showToast(`${pkg.name} ditambahkan ke pesanan`);
  }, [pendingVariants]);

  const updateQuantity = (id: string | number, delta: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)));
  };
  const updateNotes = (id: string | number, notes: string) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, notes } : i)));
  };
  const updateVariant = (id: string | number, variant: string) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, variant } : i)));
  };

  const addComboToCart = () => {
    if (!comboDrink || !comboPastry) return;
    addToCart(comboDrink);
    addToCart(comboPastry);
    showToast(`Paket Santai ditambahkan (Hemat ${formatRupiah(COMBO_DISCOUNT)})`);
    setComboDrink(null);
    setComboPastry(null);
  };

  // ── Pricing ──
  const shippingCost = 0; // Ongkir tidak relevan untuk Dine In / Take Away
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const voucherDiscountAmount = voucherApplied ? Math.round(subtotal * (voucherConfig.voucherDiscount / 100)) : 0;
  const total = subtotal + shippingCost - voucherDiscountAmount;
  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const applyVoucher = () => {
    if (voucherInput.toUpperCase().trim() === voucherConfig.voucherCode) {
      setVoucherApplied(true);
      setVoucherError("");
      showToast(`Voucher ${voucherConfig.voucherDiscount}% berhasil digunakan`);
    } else {
      setVoucherError("Kode voucher tidak valid");
      setVoucherApplied(false);
    }
  };

  // ── Checkout Flow ──
  const openConfirmModal = () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    if (deliveryMethod === "Dine In" && dineInOption === "Scan Barcode Meja" && !tableNumber.trim()) return alert("Mohon isi Nomor Meja!");
    if (isGift && !giftNote.trim()) return alert("Mohon isi pesan hadiah!");

    // Generate Invoice Code Here
    setInvoiceCode(generateInvoiceCode());
    setIsConfirmOpen(true);
  };

  const handleFinalCheckout = () => {
    setIsConfirmOpen(false);
    setIsSuccessModalOpen(true);
    setSuccessStep(1);
    setTimeout(() => setSuccessStep(2), 1500);
    setTimeout(() => setSuccessStep(3), 3000);
  };

  const sendWhatsAppMessage = () => {
    let msg = `Halo ${BRAND_NAME},\n*INV: ${invoiceCode}*\n\n*Detail Pesanan:*\n`;
    cart.forEach((i) => {
      msg += `- ${i.quantity}x ${i.name} (${formatRupiah(i.price * i.quantity)})\n`;
      if (i.variant) msg += `  [${i.variant}]\n`;
      if (i.notes) msg += `  *Note: ${i.notes}*\n`;
    });

    msg += `\n*Metode:* ${deliveryMethod}`;
    if (deliveryMethod === "Dine In") {
      msg += `\n*Opsi:* ${dineInOption}`;
      if (dineInOption === "Scan Barcode Meja") msg += `\n*No Meja:* ${tableNumber}`;
    }
    if (deliveryMethod === "Take Away / Pick-Up" && pickupTime) msg += ` (Jam: ${pickupTime})`;
    msg += `\n`;

    if (isGift) {
      msg += `\n🎁 *Hadiah & Pesan:* "${giftNote}"\n`;
    }
    if (voucherApplied) {
      msg += `\n*Voucher:* ${voucherConfig.voucherCode} (-${voucherConfig.voucherDiscount}%)\n`;
    }

    msg += `\n*Pembayaran:* ${paymentMethod}\n*TOTAL AKHIR:* ${formatRupiah(total)}\n\nTerima kasih!`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setIsSuccessModalOpen(false);
    setCart([]);
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-bone text-charcoal relative overflow-hidden font-sans selection:bg-sage/30 selection:text-sage">

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sage/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-latte/40 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b-0 border-latte/30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-serif text-charcoal tracking-wide">Kopi Tenang Jiwa.</h1>
          <div className="flex gap-3 items-center">
            <div className="hidden md:flex relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone w-4 h-4" />
              <input type="text" placeholder="Cari menu..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown}
                className="input-elegant pl-11 py-2 w-64 rounded-full text-sm bg-white/50 backdrop-blur-md"
              />
            </div>
            {/* Mobile Search Button */}
            <motion.button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} whileTap={{ scale: 0.95 }}
              className="md:hidden p-3 rounded-full bg-white border border-latte text-charcoal hover:border-sage hover:text-sage transition-all duration-300 shadow-sm"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button onClick={() => setIsCartOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="relative p-3 rounded-full bg-white border border-latte text-charcoal hover:border-sage hover:text-sage transition-all duration-300 shadow-sm"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-sage text-white text-[10px] font-medium w-5 h-5 flex items-center justify-center rounded-full"
                  >{cartItemCount}</motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-t border-latte/30">
              <div className="px-6 py-3 bg-white/50 backdrop-blur-md">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone w-4 h-4" />
                  <input type="text" placeholder="Cari menu favoritmu..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown}
                    className="input-elegant pl-11 py-2.5 w-full rounded-full text-sm" autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24 relative z-10">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-10 md:p-14 mb-16 shadow-elegant border border-latte/50 relative overflow-hidden"
        >
          <div className="max-w-xl relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 bg-bone px-4 py-1.5 rounded-full text-xs text-sage font-medium mb-6 border border-latte">
              <Leaf className="w-3.5 h-3.5" /><span>Biji kopi pilihan Nusantara</span>
            </motion.div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight mb-6">
              Sruput kopinya,<br /><span className="text-sage">-nikmati harinya.</span>
            </h2>
            <p className="text-stone text-lg mb-8 font-light">
              Rasakan ketenangan di setiap tegukan. <br /> Kami menyajikan kopi dan pastry premium dengan <br /> suasana yang menenangkan jiwa.
            </p>
          </div>
          <motion.img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800" alt="Kopi Tenang Jiwa"
            className="absolute right-0 top-0 w-1/2 h-full object-cover rounded-l-[100px] hidden md:block opacity-90 animate-float"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 0.9, x: 0 }} transition={{ duration: 1, delay: 0.2 }}
          />
        </motion.div>

        {/* Mood-Based Menu Matcher */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
          <div className="text-center mb-6">
            <h3 className="font-serif text-2xl text-charcoal mb-2">Bagaimana perasaanmu hari ini?</h3>
            <p className="text-stone text-sm">Biar kami bantu pilihkan menu yang pas.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {moodsList.map(mood => (
              <motion.button key={mood} whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedMood(selectedMood === mood ? null : mood);
                  scrollToMenu();
                }}
                className={`px-5 py-2.5 rounded-full text-sm transition-all duration-300 ${selectedMood === mood ? "bg-sage text-white shadow-soft-glow" : "bg-white border border-latte text-charcoal hover:bg-bone"
                  }`}
              >{mood}</motion.button>
            ))}
          </div>
        </motion.section>

        {/* Combo Builder (Paket Santai) */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-sage/10 px-4 py-1.5 rounded-full text-xs text-sage font-medium mb-4">
              <Package className="w-3.5 h-3.5" /><span>Lebih Hemat!</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">Paket Santai</h3>
            <p className="text-stone text-sm">Pilih 1 minuman + 1 pastry, langsung hemat {formatRupiah(COMBO_DISCOUNT)}!</p>
          </div>
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-elegant border border-latte/50 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <p className="text-xs font-medium text-stone uppercase tracking-widest pl-2">1: Minuman</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.filter(i => i.category === "kopi" || i.category === "non-kopi").map(item => (
                  <button key={item.id} onClick={() => setComboDrink(item)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-300 ${comboDrink?.id === item.id ? "border-sage bg-sage/5 shadow-soft-glow" : "border-latte bg-bone hover:border-sage/30"}`}
                  >
                    <p className="text-sm font-medium text-charcoal truncate">{item.name}</p>
                    <p className="text-xs text-stone mt-1">{formatRupiah(item.price)}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-xs font-medium text-stone uppercase tracking-widest pl-2">2: Pastry</p>
              <div className="grid grid-cols-1 gap-3">
                {items.filter(i => i.category === "cemilan").map(item => (
                  <button key={item.id} onClick={() => setComboPastry(item)}
                    className={`text-left p-4 rounded-2xl border transition-all duration-300 ${comboPastry?.id === item.id ? "border-sage bg-sage/5 shadow-soft-glow" : "border-latte bg-bone hover:border-sage/30"}`}
                  >
                    <p className="text-sm font-medium text-charcoal truncate">{item.name}</p>
                    <p className="text-xs text-stone mt-1">{formatRupiah(item.price)}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <AnimatePresence>
            {comboDrink && comboPastry && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-sage text-bone rounded-2xl p-6 shadow-soft-glow">
                <div>
                  <p className="text-sm font-light text-bone/80">Paket Terpilih</p>
                  <p className="font-serif text-lg">{comboDrink.name} & {comboPastry.name}</p>
                </div>
                <div className="flex items-center gap-6 mt-4 sm:mt-0">
                  <div className="text-right">
                    <p className="text-xs line-through text-bone/60">{formatRupiah(comboDrink.price + comboPastry.price)}</p>
                    <p className="text-xl font-medium">{formatRupiah(comboDrink.price + comboPastry.price - COMBO_DISCOUNT)}</p>
                  </div>
                  <button onClick={addComboToCart} className="bg-white text-sage px-6 py-2.5 rounded-xl font-medium hover:bg-bone transition-colors shadow-sm">Tambah ke Pesanan</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Paket Spesial & Celebration Cards Section */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-sage/10 px-4 py-1.5 rounded-full text-xs text-sage font-medium mb-3 border border-sage/20">
              <Gift className="w-3.5 h-3.5" /><span>Penawaran Spesial & Perayaan</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl text-charcoal mb-3">Paket Spesial Tenang Jiwa</h3>
            <p className="text-stone text-sm max-w-lg mx-auto">
              Pilihan paket hemat, WFH, & perayaan ulang tahun istimewa untuk momen tak terlupakan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SPECIAL_PACKAGES.map((pkg) => (
              <motion.div
                key={pkg.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden border border-latte shadow-elegant flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 overflow-hidden relative">
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                    {pkg.badge && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-sage text-white text-[11px] font-medium px-3.5 py-1 rounded-full shadow-sm border border-white/20">
                          {pkg.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:p-8">
                    <p className="text-xs text-sage font-medium tracking-wide uppercase mb-1">{pkg.tagline}</p>
                    <h4 className="font-serif text-xl md:text-2xl text-charcoal mb-3">{pkg.name}</h4>
                    <p className="text-sm text-stone font-light mb-6 leading-relaxed">{pkg.description}</p>

                    {/* Includes List */}
                    <div className="bg-bone/60 rounded-2xl p-4 mb-6 border border-latte/50 space-y-2">
                      <p className="text-[11px] font-medium text-stone uppercase tracking-wider mb-2">Termasuk Dalam Paket:</p>
                      {pkg.itemsIncluded.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-charcoal/80">
                          <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Cake/Variant Selector if exists */}
                    {pkg.customVariants && (
                      <div className="mb-6">
                        <p className="text-xs font-medium text-stone mb-2">Pilih Varian Cake:</p>
                        <div className="flex gap-2 flex-wrap">
                          {pkg.customVariants.map((v) => {
                            const isSelected = (pendingVariants[pkg.id] || pkg.customVariants![0]) === v;
                            return (
                              <button
                                key={v}
                                onClick={() => setPendingVariants((prev) => ({ ...prev, [pkg.id]: v }))}
                                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                                  isSelected ? "bg-sage text-white border-sage" : "border-latte text-stone hover:border-sage/40"
                                }`}
                              >
                                {v}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0 flex items-center justify-between border-t border-latte/40 pt-4 mt-auto">
                  <div>
                    {pkg.originalPrice && (
                      <p className="text-xs line-through text-stone">{formatRupiah(pkg.originalPrice)}</p>
                    )}
                    <p className="text-2xl font-serif font-medium text-charcoal">{formatRupiah(pkg.price)}</p>
                  </div>
                  <button
                    onClick={() => addPackageToCart(pkg)}
                    className="bg-charcoal hover:bg-sage text-white text-xs md:text-sm font-medium px-6 py-3 rounded-2xl transition-all shadow-sm active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Pesan Paket Ini</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Categories & Menu */}
        <section ref={menuSectionRef} id="menu-section" className="scroll-mt-24">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-10 pb-2">
          {categories.map((c) => (
            <button key={c.key} onClick={() => { setCategory(c.key); setSelectedMood(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap text-sm transition-all duration-300 ${category === c.key && !selectedMood ? "bg-charcoal text-white shadow-elegant" : "bg-white border border-latte text-charcoal hover:bg-bone"
                }`}
            >
              <span className="opacity-70">{c.icon}</span> {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => <div key={i} className="h-[400px] bg-white rounded-3xl border border-latte animate-pulse" />)}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24">
            <Coffee className="w-10 h-10 mx-auto mb-4 text-stone opacity-50" />
            <p className="text-stone">Tidak ada menu yang sesuai.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => {
                const isAvail = item.isAvailable === true || item.isAvailable === "TRUE";
                const selectedVariant = pendingVariants[item.id] ?? getDefaultVariant(item);
                const variantOptions = getVariantOptions(item);

                return (
                  <motion.div layout initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }} key={item.id}
                    className="bg-white rounded-3xl overflow-hidden border border-latte shadow-elegant group flex flex-col"
                  >
                    <div className="h-56 overflow-hidden relative">
                      {item.badge && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-sage/90 backdrop-blur-md text-white text-[11px] font-medium px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-white/20">
                            {item.badge}
                          </span>
                        </div>
                      )}
                      <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={item.name} />
                      {!isAvail && <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center"><span className="bg-charcoal text-white px-4 py-1.5 rounded-full text-xs font-medium">Habis</span></div>}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h4 className="font-serif text-lg text-charcoal mb-2 group-hover:text-sage transition-colors">{item.name}</h4>
                      <p className="text-sm text-stone mb-3 font-light leading-relaxed line-clamp-2">{item.description}</p>

                      {(item.caffeineLevel || item.sweetnessLevel) && (
                        <div className="mb-3 flex items-center gap-2 flex-wrap text-[11px]">
                          {item.caffeineLevel && (
                            <span className="bg-latte/60 text-charcoal border border-latte px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                              ⚡ {item.caffeineLevel}
                            </span>
                          )}
                          {item.sweetnessLevel && (
                            <span className="bg-sage/15 text-charcoal border border-sage/30 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                              🍯 {item.sweetnessLevel}
                            </span>
                          )}
                        </div>
                      )}

                      {variantOptions.length > 0 && isAvail && (
                        <div className="mb-4 flex gap-2 flex-wrap">
                          {variantOptions.map((opt) => (
                            <button key={opt} onClick={() => setPendingVariants((prev) => ({ ...prev, [item.id]: opt }))}
                              className={`text-[10px] px-3 py-1.5 rounded-full border transition-all duration-300 ${selectedVariant === opt ? "border-sage bg-sage text-white" : "border-latte text-stone hover:border-sage/50"}`}
                            >{opt}</button>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-latte/50">
                        <span className="font-medium text-lg text-charcoal">{formatRupiah(item.price)}</span>
                        <button onClick={() => addToCart(item)} disabled={!isAvail} className="bg-bone text-charcoal hover:bg-sage hover:text-white disabled:opacity-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-latte">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
        </section>

        {/* Testimonials Section (Social Proof Marquee) */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 overflow-hidden"
        >
          <div className="text-center mb-10 px-6">
            <div className="inline-flex items-center gap-2 bg-sage/10 px-4 py-1.5 rounded-full text-xs text-sage font-medium mb-3 border border-sage/20">
              <Star className="w-3.5 h-3.5 fill-sage text-sage" />
              <span>Ulasan Sahabat Tenang Jiwa</span>
            </div>
            <h3 className="font-serif text-3xl md:text-4xl text-charcoal mb-3">Apa Kata Mereka?</h3>
            <p className="text-stone text-sm max-w-md mx-auto">
              ⭐ <strong>4.9 / 5.0</strong> dari 500+ pecinta kopi & pastry di Bandung.
            </p>
          </div>

          {/* Marquee Wrapper with fading side overlays */}
          <div className="relative w-full overflow-hidden py-4">
            {/* Side gradient overlays */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-bone to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-bone to-transparent z-10" />

            {/* Marquee Track */}
            <div className="animate-marquee flex gap-6">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((testi, i) => (
                <div
                  key={`${testi.id}-${i}`}
                  className="w-[300px] md:w-[360px] flex-shrink-0 bg-white rounded-3xl p-6 border border-latte shadow-elegant flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1 text-sage">
                        {[...Array(testi.rating)].map((_, r) => (
                          <Star key={r} className="w-4 h-4 fill-sage text-sage" />
                        ))}
                      </div>
                      <span className="text-[10px] text-stone bg-bone px-2.5 py-1 rounded-full border border-latte">{testi.date}</span>
                    </div>
                    <p className="text-sm text-charcoal/80 font-light italic leading-relaxed mb-6">
                      &ldquo;{testi.text}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-latte/50">
                    <img src={testi.avatar} alt={testi.name} className="w-10 h-10 rounded-full object-cover border border-latte" />
                    <div>
                      <h5 className="font-serif text-sm font-medium text-charcoal">{testi.name}</h5>
                      <p className="text-[11px] text-stone">{testi.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      {/* Floating Bottom Cart Bar */}
      <AnimatePresence>
        {cartItemCount > 0 && !isCartOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none"
          >
            <div className="pointer-events-auto bg-charcoal/95 backdrop-blur-md text-bone px-4 sm:px-6 py-3 rounded-2xl sm:rounded-full shadow-2xl border border-latte/20 flex items-center justify-between gap-3 sm:gap-6 max-w-lg w-full">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative bg-sage text-white p-2.5 rounded-full flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="absolute -top-1 -right-1 bg-bone text-charcoal font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-latte">
                    {cartItemCount}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs text-stone leading-tight truncate">{cartItemCount} Item di Keranjang</p>
                  <p className="text-sm sm:text-base font-medium text-bone leading-tight mt-0.5">{formatRupiah(total)}</p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-sage hover:bg-sage/90 text-white text-xs sm:text-sm font-medium px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-full flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0"
              >
                <span>Lihat Pesanan</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-charcoal text-bone/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal to-black/30 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="font-serif text-2xl text-bone mb-4">Kopi Tenang Jiwa.</h3>
              <p className="text-bone/60 text-sm leading-relaxed mb-6">{BRAND_TAGLINE}</p>
              <div className="flex gap-3">
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-bone/10 border border-bone/20 flex items-center justify-center text-bone/60 hover:bg-sage hover:text-white hover:border-sage transition-all duration-300">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-bone/10 border border-bone/20 flex items-center justify-center text-bone/60 hover:bg-sage hover:text-white hover:border-sage transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Info */}
            <div>
              <h4 className="text-bone font-medium text-sm uppercase tracking-widest mb-4">Informasi</h4>
              <ul className="space-y-3 text-sm text-bone/60">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-sage" />
                  <span>{BRAND_ADDRESS}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-sage" />
                  <span>Buka 24 Jam — Setiap Hari</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-sage" />
                  <span>+62 896-5522-3792</span>
                </li>
              </ul>
            </div>

            {/* Menu Cepat */}
            <div>
              <h4 className="text-bone font-medium text-sm uppercase tracking-widest mb-4">Menu Populer</h4>
              <ul className="space-y-3 text-sm text-bone/60">
                <li className="flex items-center gap-2 hover:text-sage transition-colors cursor-default"><Coffee className="w-3 h-3 text-sage" /> Kopi Susu Tenang Jiwa</li>
                <li className="flex items-center gap-2 hover:text-sage transition-colors cursor-default"><Coffee className="w-3 h-3 text-sage" /> Caramel Macchiato</li>
                <li className="flex items-center gap-2 hover:text-sage transition-colors cursor-default"><Leaf className="w-3 h-3 text-sage" /> Matcha Cream Latte</li>
                <li className="flex items-center gap-2 hover:text-sage transition-colors cursor-default"><Package className="w-3 h-3 text-sage" /> Butter Croissant</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-bone/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-bone/40">&copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
            <p className="text-xs text-bone/40">Powered by <a href="https://gerobaklink.com" target="_blank" rel="noopener noreferrer" className="text-sage hover:text-sage/80 transition-colors font-medium">GerobakLink</a></p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer Overlay */}
      <AnimatePresence>
        {isCartOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm z-50" />}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-bone z-50 shadow-2xl flex flex-col rounded-l-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-latte flex items-center justify-between bg-white">
              <h2 className="text-lg font-serif">Pesanan Anda</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-stone hover:text-charcoal transition-colors bg-bone rounded-full"><X className="w-4 h-4" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center pt-32">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-latte" />
                  <p className="text-stone font-light">Keranjang masih kosong.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-latte shadow-sm">
                      <div className="flex gap-4 mb-3">
                        <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-charcoal truncate">{item.name}</h4>
                          {item.variant && <span className="text-[10px] text-sage font-medium">{item.variant}</span>}
                          <p className="text-charcoal font-medium text-sm mt-1">{formatRupiah(item.price * item.quantity)}</p>
                        </div>
                      </div>
                      {/* Cart Variant Selector */}
                      {getVariantOptions(item).length > 0 && (
                        <div className="flex gap-1.5 flex-wrap mb-3">
                          {getVariantOptions(item).map((opt) => (
                            <button key={opt} onClick={() => updateVariant(item.id, opt)}
                              className={`text-[10px] px-2.5 py-1 rounded-full border transition-all duration-300 ${item.variant === opt ? "border-sage bg-sage text-white" : "border-latte text-stone hover:border-sage/50"}`}
                            >{opt}</button>
                          ))}
                        </div>
                      )}
                      {/* Notes Input */}
                      <input
                        type="text"
                        placeholder="Tambah catatan... (opsional)"
                        value={item.notes || ""}
                        onChange={(e) => updateNotes(item.id, e.target.value)}
                        className="w-full text-xs bg-bone border border-latte/50 rounded-xl px-3 py-2 mb-3 focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/10 transition-all placeholder:text-stone/50"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-bone rounded-full border border-latte px-1 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-stone hover:text-charcoal"><Minus className="w-3 h-3" /></button>
                          <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white text-stone hover:text-charcoal"><Plus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => setCart((c) => c.filter((i) => i.id !== item.id))} className="text-xs text-stone hover:text-red-500 transition-colors">Hapus</button>
                      </div>
                    </div>
                  ))}

                  <div className="pt-8 space-y-6">
                    {/* Dine-In / Take Away */}
                    <div>
                      <label className="text-xs font-medium text-stone block mb-3 pl-1">METODE PESANAN</label>
                      <div className="flex bg-white rounded-full p-1 border border-latte mb-4">
                        {["Dine In", "Take Away / Pick-Up"].map((m) => (
                          <button key={m} onClick={() => setDeliveryMethod(m)}
                            className={`flex-1 py-2 text-xs rounded-full transition-all duration-300 ${deliveryMethod === m ? "bg-charcoal text-white" : "text-stone hover:bg-bone"}`}
                          >{m}</button>
                        ))}
                      </div>
                      <AnimatePresence mode="popLayout">
                        {deliveryMethod === "Dine In" && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 bg-white p-4 rounded-2xl border border-latte">
                            <label className="text-xs text-stone flex items-center gap-2">Pilih Opsi Dine-In</label>
                            <div className="flex gap-2">
                              {["Scan Barcode Meja", "Bayar Langsung di Kasir"].map((opt) => (
                                <button key={opt} onClick={() => setDineInOption(opt)}
                                  className={`flex-1 py-2 text-[10px] rounded-xl border transition-all duration-300 ${dineInOption === opt ? "border-sage bg-sage/5 text-sage" : "border-latte bg-white text-stone"}`}
                                >{opt}</button>
                              ))}
                            </div>
                            {dineInOption === "Scan Barcode Meja" && (
                              <div className="mt-3">
                                <label className="text-xs text-stone flex items-center gap-2 mb-2">Nomor Meja</label>
                                <input type="number" placeholder="Contoh: 12" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="input-elegant w-full text-sm py-2" />
                              </div>
                            )}
                          </motion.div>
                        )}
                        {deliveryMethod === "Take Away / Pick-Up" && (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 bg-white p-4 rounded-2xl border border-latte">
                            <label className="text-xs text-stone flex items-center gap-2"><Clock className="w-3 h-3" /> Jadwalkan Jam Ambil (Opsional)</label>
                            <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="input-elegant w-full text-sm py-2" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Aesthetic Gift Note Toggle */}
                    <div className="bg-white p-4 rounded-2xl border border-latte">
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsGift(!isGift)}>
                        <div className="flex items-center gap-2 text-sage"><Gift className="w-4 h-4" /><p className="text-sm font-medium text-charcoal">Kirim sebagai Hadiah?</p></div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${isGift ? "bg-sage" : "bg-latte"}`}>
                          <motion.div animate={{ x: isGift ? 20 : 2 }} className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                      <AnimatePresence>
                        {isGift && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <textarea value={giftNote} onChange={(e) => setGiftNote(e.target.value)} placeholder="Tulis pesan cantik untuknya..." className="input-elegant w-full text-sm mt-3 h-20 resize-none" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-stone block mb-3 pl-1">PEMBAYARAN</label>
                      <div className="flex gap-2">
                        {["Transfer", "QRIS", "Cash"].map((p) => (
                          <button key={p} onClick={() => setPaymentMethod(p)}
                            className={`flex-1 py-2.5 text-xs rounded-xl border transition-all duration-300 ${paymentMethod === p ? "border-sage bg-sage/5 text-sage" : "border-latte bg-white text-stone"}`}
                          >{p}</button>
                        ))}
                      </div>
                    </div>

                    {/* Remote Voucher System */}
                    {voucherConfig.voucherActive && (
                      <div className="bg-white p-5 rounded-2xl border border-latte relative overflow-hidden group">
                        <div className={`absolute inset-0 bg-sage/5 transition-opacity duration-700 ${voucherApplied ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-3 text-sage"><Ticket className="w-4 h-4" /><p className="text-xs font-medium">Voucher Diskon</p></div>
                          <div className="flex gap-2">
                            <input type="text" value={voucherInput} onChange={(e) => { setVoucherInput(e.target.value); setVoucherError(""); }} placeholder="Masukkan kode..." className="input-elegant flex-1 py-2 px-4 text-sm bg-transparent" />
                            <button onClick={applyVoucher} className="btn-outline px-4 py-2 text-xs bg-white">Gunakan</button>
                          </div>
                          {voucherError && <p className="text-red-400 text-xs mt-2 pl-1">{voucherError}</p>}
                          {voucherApplied && <p className="text-sage text-xs mt-2 pl-1">Diskon {voucherConfig.voucherDiscount}% berhasil digunakan.</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-latte pb-10">
                <div className="space-y-2 mb-6 text-sm text-stone font-light">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div>
                  {voucherApplied && <div className="flex justify-between text-sage"><span>Voucher Diskon</span><span>-{formatRupiah(voucherDiscountAmount)}</span></div>}
                  <div className="flex justify-between text-lg font-medium text-charcoal pt-4 border-t border-latte mt-2">
                    <span>Total Keseluruhan</span><span>{formatRupiah(total)}</span>
                  </div>
                </div>
                <button onClick={openConfirmModal} className="btn-primary w-full flex justify-center py-4">Konfirmasi Pesanan</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-charcoal text-white px-6 py-3 rounded-full shadow-elegant text-sm flex items-center gap-2"
          ><Check className="w-4 h-4 text-sage" /> {toast.message}</motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Modal */}
      <AnimatePresence>
        {isConfirmOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ duration: 0.4 }}
              className="bg-bone w-full max-w-md rounded-3xl shadow-elegant overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-latte bg-white relative">
                <button onClick={() => setIsConfirmOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-stone hover:bg-bone rounded-full"><X className="w-4 h-4" /></button>
                <h3 className="font-serif text-xl text-charcoal text-center mb-1">Ringkasan Pesanan</h3>
                <p className="text-center text-xs font-mono text-sage tracking-wider">INV: {invoiceCode}</p>
              </div>
              <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div className="text-charcoal"><span className="text-stone mr-2">{item.quantity}x</span>{item.name} {item.variant && <span className="text-sage text-xs ml-1">({item.variant})</span>}</div>
                      <span className="font-medium text-stone">{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-latte pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-stone"><span>Metode</span><span className="text-charcoal">{deliveryMethod}</span></div>
                  {deliveryMethod === "Dine In" && <div className="flex justify-between text-stone"><span>Opsi</span><span className="text-charcoal">{dineInOption}</span></div>}
                  {deliveryMethod === "Dine In" && dineInOption === "Scan Barcode Meja" && <div className="flex justify-between text-stone"><span>Nomor Meja</span><span className="text-charcoal font-bold">{tableNumber}</span></div>}
                  {deliveryMethod === "Take Away / Pick-Up" && pickupTime && <div className="flex justify-between text-stone"><span>Jam Ambil</span><span className="text-charcoal">{pickupTime}</span></div>}
                  <div className="flex justify-between text-stone"><span>Pembayaran</span><span className="text-charcoal">{paymentMethod}</span></div>
                  {isGift && <div className="flex justify-between text-stone items-start mt-2 pt-2 border-t border-latte border-dashed"><span className="flex items-center gap-1"><Gift className="w-3 h-3 text-sage" /> Pesan Hadiah</span><span className="text-charcoal text-right italic max-w-[60%]">"{giftNote}"</span></div>}
                </div>
                {paymentMethod === "Transfer" && (
                  <div className="bg-white p-4 rounded-2xl border border-latte space-y-3">
                    <p className="text-xs text-stone font-medium mb-1">Transfer ke rekening berikut:</p>
                    {BANK_ACCOUNTS.map((acc) => (
                      <div key={acc.bank} className="flex justify-between items-center bg-bone px-3 py-2 rounded-xl">
                        <div><p className="text-xs text-stone">{acc.bank}</p><p className="text-sm font-medium text-charcoal">{acc.number}</p></div>
                        <CopyButton text={acc.number} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-6 bg-white border-t border-latte">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-stone text-sm">Total Akhir</span>
                  <span className="text-xl font-medium text-charcoal">{formatRupiah(total)}</span>
                </div>
                <button onClick={handleFinalCheckout} className="btn-primary w-full py-4 text-sm flex justify-center items-center gap-2">Konfirmasi & Kirim WA</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-bone/90 backdrop-blur-md flex items-center justify-center">
            <div className="text-center">
              <AnimatePresence mode="wait">
                {successStep === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-2 border-latte border-t-sage rounded-full mb-4" />
                    <p className="text-stone font-light tracking-wide">Merekam Pesanan...</p>
                  </motion.div>
                )}
                {successStep === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center">
                    <MessageSquare className="w-10 h-10 text-sage animate-pulse mb-4" />
                    <p className="text-stone font-light tracking-wide">Menghubungkan ke WhatsApp...</p>
                  </motion.div>
                )}
                {successStep === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mb-6 shadow-soft-glow">
                      <Check className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-charcoal mb-1">Terima Kasih</h3>
                    <p className="text-stone font-light mb-4">Pesanan Anda segera diproses.</p>

                    {/* Unique Code & Table Detail Display */}
                    <div className="bg-white border border-latte px-6 py-4 rounded-2xl shadow-sm flex flex-col gap-3 min-w-[200px]">
                      <div>
                        <p className="text-[10px] text-stone uppercase tracking-widest mb-0.5">Kode Pesanan</p>
                        <p className="font-mono text-charcoal font-bold text-lg">{invoiceCode}</p>
                      </div>
                      {deliveryMethod === "Dine In" && dineInOption === "Scan Barcode Meja" && (
                        <div className="border-t border-latte pt-3">
                          <p className="text-[10px] text-stone uppercase tracking-widest mb-0.5">Nomor Meja</p>
                          <p className="text-charcoal font-medium text-lg">{tableNumber}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <button onClick={sendWhatsAppMessage} className="text-sage text-sm font-medium hover:underline">Buka WhatsApp Sekarang →</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Floating Button */}
      <motion.a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Kopi Tenang Jiwa, saya ingin bertanya...")}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow group"
        aria-label="Chat WhatsApp"
      >
        <Send className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-sage rounded-full animate-ping" />
      </motion.a>
    </div>
  );
}
