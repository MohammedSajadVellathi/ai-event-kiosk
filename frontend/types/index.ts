export type SessionStep =
  | "attract"
  | "language"
  | "template"
  | "camera"
  | "processing"
  | "result"
  | "payment"
  | "delivery";

export type Language = "en" | "hi";
export type PaymentStatus = "idle" | "pending" | "success" | "failed" | "timeout";
export type DeliveryMethod = "download" | "whatsapp" | "email" | "print";
export type TierId = "digital" | "print";

export interface Template {
  id: string;
  title: string;
  premium: boolean;
  colors: [string, string];
  accentColor: string;
  imageUrl?: string;
}

export interface Tier {
  id: TierId;
  name: string;
  nameHi: string;
  price: number;
  features: string[];
  badge?: string;
}

export interface GenerateResponse {
  success: boolean;
  imageUrl: string;
  error?: string;
}

export interface PaymentStatusResponse {
  status: PaymentStatus;
}

export const LABELS: Record<Language, Record<string, string>> = {
  en: {
    tapToStart: "TAP TO START",
    magicAvatar: "MAGIC AVATAR",
    aiKiosk: "AI KIOSK",
    instantDelivery: "Instant Delivery",
    printAvailable: "Print Available",
    chooseLanguage: "Select Language",
    chooseTemplate: "Choose Your Style",
    confirmProceed: "CONFIRM & PROCEED",
    positionYourself: "Position Yourself",
    faceCenter: "Face centered · Upper body visible",
    consent: "I consent to my photo being processed by AI",
    processingTitle: "Creating Your Avatar",
    processingSubtitle: "The magic is happening…",
    uploadingStage: "Uploading",
    faceProcessingStage: "Face Processing",
    applyingTemplateStage: "Applying Template",
    finalizingStage: "Finalizing",
    resultTitle: "Your AI Avatar",
    retake: "RETAKE",
    continueBtn: "CONTINUE",
    download: "DOWNLOAD",
    paymentTitle: "Choose Your Package",
    deliveryTitle: "Your Avatar Is Ready!",
    scanDownload: "Scan to Download",
    done: "DONE",
    back: "Back",
    live: "LIVE",
    changeTemplate: "Change Template",
    tapCapture: "Tap to capture",
    original: "Original",
    aiAvatar: "AI Avatar",
    scanUPI: "Scan with any UPI app",
    waitingPayment: "Waiting for payment",
    paymentSuccess: "Payment received!",
    paymentTimeout: "Payment timed out",
    markPaid: "Mark as Paid",
    autoReset: "Auto reset in",
    shareWhatsApp: "WhatsApp",
    shareEmail: "Email",
    sharePrint: "Print",
    tryAgain: "Try Again",
    retryError: "Something went wrong",
    retryErrorSub: "Please try again",
    emailPlaceholder: "Enter your email",
    sendEmail: "SEND",
  },
  hi: {
    tapToStart: "शुरू करने के लिए छुएं",
    magicAvatar: "मैजिक अवतार",
    aiKiosk: "AI कियोस्क",
    instantDelivery: "तुरंत डिलीवरी",
    printAvailable: "प्रिंट उपलब्ध",
    chooseLanguage: "भाषा चुनें",
    chooseTemplate: "अपनी स्टाइल चुनें",
    confirmProceed: "आगे बढ़ें",
    positionYourself: "खुद को रखें",
    faceCenter: "चेहरा बीच में · ऊपरी शरीर दिखाएं",
    consent: "मैं AI द्वारा अपनी फ़ोटो प्रोसेस करने की अनुमति देता/देती हूं",
    processingTitle: "आपका अवतार बन रहा है",
    processingSubtitle: "जादू हो रहा है…",
    uploadingStage: "अपलोड हो रहा है",
    faceProcessingStage: "चेहरा विश्लेषण",
    applyingTemplateStage: "टेम्पलेट लागू हो रहा है",
    finalizingStage: "अंतिम चरण",
    resultTitle: "आपका AI अवतार",
    retake: "फिर से लें",
    continueBtn: "आगे बढ़ें",
    download: "डाउनलोड",
    paymentTitle: "अपना पैकेज चुनें",
    deliveryTitle: "आपका अवतार तैयार है!",
    scanDownload: "डाउनलोड करने के लिए स्कैन करें",
    done: "पूर्ण",
    back: "वापस",
    live: "लाइव",
    changeTemplate: "टेम्पलेट बदलें",
    tapCapture: "कैप्चर करने के लिए टैप करें",
    original: "मूल",
    aiAvatar: "AI अवतार",
    scanUPI: "किसी भी UPI ऐप से स्कैन करें",
    waitingPayment: "भुगतान की प्रतीक्षा",
    paymentSuccess: "भुगतान प्राप्त!",
    paymentTimeout: "भुगतान समय समाप्त",
    markPaid: "भुगतान चिह्नित करें",
    autoReset: "स्वतः रीसेट",
    shareWhatsApp: "व्हाट्सएप",
    shareEmail: "ईमेल",
    sharePrint: "प्रिंट",
    tryAgain: "पुनः प्रयास",
    retryError: "कुछ गलत हुआ",
    retryErrorSub: "कृपया पुनः प्रयास करें",
    emailPlaceholder: "ईमेल दर्ज करें",
    sendEmail: "भेजें",
  },
};
