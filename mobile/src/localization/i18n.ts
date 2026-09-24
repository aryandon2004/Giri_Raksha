export type SupportedLanguage = 'en' | 'hi' | 'as' | 'bn';

export interface TranslationDict {
  appName: string;
  tagline: string;
  meaning: string;
  disclaimer: string;
  demoDataBadge: string;
  online: string;
  offline: string;
  offlineModeNotice: string;
  syncWaiting: string;
  syncing: string;
  syncedAll: string;
  syncNow: string;
  currentRiskTitle: string;
  riskLow: string;
  riskModerate: string;
  riskHigh: string;
  riskCritical: string;
  riskContributors: string;
  rainfall: string;
  soilMoisture: string;
  slope: string;
  historicalSusceptibility: string;
  terrain: string;
  weatherCardTitle: string;
  temperature: string;
  humidity: string;
  rainfall24h: string;
  rainfall72h: string;
  forecast: string;
  quickActions: string;
  reportHazard: string;
  viewRiskMap: string;
  alerts: string;
  emergency: string;
  roadStatus: string;
  recentReports: string;
  simulateRainfall: string;
  fieldOfficerMode: string;
  adminDashboard: string;
  citizenMode: string;
  emergencyCall112: string;
  emergencyCall108: string;
  whatToDoDuringLandslide: string;
  evacuationGuide: string;
  sensorsOnline: string;
  blockedRoads: string;
  activeAlerts: string;
  pendingReports: string;
}

export const translations: Record<SupportedLanguage, TranslationDict> = {
  en: {
    appName: 'GIRI RAKSHA',
    tagline: 'Predict. Warn. Protect.',
    meaning: 'Giri = Mountain | Raksha = Protection',
    disclaimer:
      'Giri Raksha is a prototype decision-support system. Risk estimates are model-based and should not replace official disaster-management advisories.',
    demoDataBadge: 'Prototype / Demo Data',
    online: 'ONLINE',
    offline: 'OFFLINE MODE',
    offlineModeNotice:
      'Offline Mode: Reports will save locally and sync automatically when connectivity returns.',
    syncWaiting: 'reports waiting in queue',
    syncing: 'Syncing reports to disaster portal...',
    syncedAll: '✓ All reports synchronized',
    syncNow: 'SYNC NOW',
    currentRiskTitle: 'CURRENT LANDSLIDE RISK',
    riskLow: 'LOW RISK',
    riskModerate: 'MODERATE RISK',
    riskHigh: 'HIGH RISK',
    riskCritical: 'CRITICAL / EVACUATION',
    riskContributors: 'Key Environmental Risk Contributors',
    rainfall: 'Cumulative Rainfall',
    soilMoisture: 'Soil Saturation',
    slope: 'Terrain Slope Gradient',
    historicalSusceptibility: 'Historical Landslide Index',
    terrain: 'Geological Lithology',
    weatherCardTitle: 'IMD Environmental Telemetry',
    temperature: 'Temperature',
    humidity: 'Humidity',
    rainfall24h: '24h Rainfall',
    rainfall72h: '72h Rainfall',
    forecast: 'Precipitation Forecast',
    quickActions: 'Quick Action Center',
    reportHazard: 'REPORT HAZARD',
    viewRiskMap: 'VIEW RISK MAP',
    alerts: 'EARLY WARNINGS',
    emergency: 'EMERGENCY SOS',
    roadStatus: 'NER Road Connectivity',
    recentReports: 'Recent Field & Community Reports',
    simulateRainfall: 'SIMULATE HEAVY RAINFALL',
    fieldOfficerMode: 'Field Officer Operations',
    adminDashboard: 'Disaster Authority Command',
    citizenMode: 'Citizen View',
    emergencyCall112: 'Call National Emergency 112',
    emergencyCall108: 'Call Disaster Ambulance 108',
    whatToDoDuringLandslide: 'Landslide Safety Protocols',
    evacuationGuide: 'Designated Relief Shelters',
    sensorsOnline: 'Sensors Online',
    blockedRoads: 'Blocked Roads',
    activeAlerts: 'Active Warnings',
    pendingReports: 'Pending Sync',
  },
  hi: {
    appName: 'गिरि रक्षा',
    tagline: 'पूर्वानुमान। चेतावनी। सुरक्षा।',
    meaning: 'गिरि = पर्वत | रक्षा = सुरक्षा',
    disclaimer:
      'गिरि रक्षा एक प्रोटोटाइप निर्णय-सहायता प्रणाली है। जोखिम अनुमान मॉडल-आधारित हैं और आधिकारिक आपदा प्रबंधन सलाह का स्थान नहीं लेते हैं।',
    demoDataBadge: 'प्रोटोटाइप / डेमो डेटा',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन मोड',
    offlineModeNotice:
      'ऑफ़लाइन मोड: रिपोर्ट स्थानीय रूप से सहेजी जाएंगी और नेटवर्क आने पर स्वचालित रूप से सिंक होंगी।',
    syncWaiting: 'रिपोर्ट कतार में प्रतीक्षारत हैं',
    syncing: 'आपदा पोर्टल पर रिपोर्ट सिंक हो रही हैं...',
    syncedAll: '✓ सभी रिपोर्ट सफलतापूर्वक सिंक हो गईं',
    syncNow: 'अभी सिंक करें',
    currentRiskTitle: 'वर्तमान भूस्खलन जोखिम',
    riskLow: 'कम जोखिम',
    riskModerate: 'मध्यम जोखिम',
    riskHigh: 'उच्च जोखिम',
    riskCritical: 'गंभीर / निकासी',
    riskContributors: 'प्रमुख पर्यावरणीय जोखिम कारक',
    rainfall: 'संचयी वर्षा',
    soilMoisture: 'मृदा नमी संतृप्ति',
    slope: 'ढलान प्रवणता',
    historicalSusceptibility: 'ऐतिहासिक भूस्खलन सूचकांक',
    terrain: 'भूवैज्ञानिक स्तर',
    weatherCardTitle: 'मौसम व पर्यावरणीय टेलीमेट्री',
    temperature: 'तापमान',
    humidity: 'आर्द्रता',
    rainfall24h: '24 घंटे की वर्षा',
    rainfall72h: '72 घंटे की वर्षा',
    forecast: 'वर्षा पूर्वानुमान',
    quickActions: 'त्वरित कार्रवाई केंद्र',
    reportHazard: 'खतरे की रिपोर्ट करें',
    viewRiskMap: 'जोखिम मानचित्र देखें',
    alerts: 'पूर्व चेतावनियाँ',
    emergency: 'आपातकालीन सहायता',
    roadStatus: 'सड़क संपर्क स्थिति',
    recentReports: 'हालिया सामुदायिक रिपोर्ट',
    simulateRainfall: 'भारी वर्षा का अनुकरण करें (डेमो)',
    fieldOfficerMode: 'क्षेत्र अधिकारी संचालन',
    adminDashboard: 'आपदा प्राधिकरण कमांड',
    citizenMode: 'नागरिक दृश्य',
    emergencyCall112: 'राष्ट्रीय आपातकाल 112 डायल करें',
    emergencyCall108: 'आपदा एम्बुलेंस 108 डायल करें',
    whatToDoDuringLandslide: 'भूस्खलन सुरक्षा निर्देश',
    evacuationGuide: 'निर्धारित राहत आश्रय',
    sensorsOnline: 'सक्रिय सेंसर',
    blockedRoads: 'अवरुद्ध सड़कें',
    activeAlerts: 'सक्रिय चेतावनियाँ',
    pendingReports: 'प्रतीक्षारत रिपोर्ट',
  },
  as: {
    appName: 'গিৰি ৰক্ষা',
    tagline: 'পূৰ্বানুমান। সতৰ্কবাণী। সুৰক্ষা।',
    meaning: 'গিৰি = পৰ্বত | ৰক্ষা = সুৰক্ষা',
    disclaimer:
      'গিৰি ৰক্ষা হৈছে এক প্ৰটোটাইপ সিদ্ধান্ত-সহায় ব্যৱস্থা। বিপদাশংকাৰ তথ্য মডেল-ভিত্তিক আৰু চৰকাৰী দুৰ্যোগ ব্যৱস্থাপনা পৰামৰ্শৰ বিকল্প নহয়।',
    demoDataBadge: 'প্ৰটোটাইপ / ডেমো তথ্য',
    online: 'অনলাইন',
    offline: 'অফলাইন মোড',
    offlineModeNotice:
      'অফলাইন মোড: প্ৰতিবেদনসমূহ স্থানীয়ভাৱে সংৰক্ষিত হ’ব আৰু সংযোগ ঘূৰি অহাৰ লগে লগে ছিংক হ’ব।',
    syncWaiting: 'প্ৰতিবেদন শাৰীত অপেক্ষাৰত',
    syncing: 'দুৰ্যোগ প’ৰ্টেললৈ ছিংক হৈ আছে...',
    syncedAll: '✓ সকলো প্ৰতিবেদন সফলতাৰে ছিংক হ’ল',
    syncNow: 'এতিয়াই ছিংক কৰক',
    currentRiskTitle: 'বৰ্তমান ভূমিস্খলনৰ আশংকা',
    riskLow: 'কম আশংকা',
    riskModerate: 'মধ্যম আশংকা',
    riskHigh: 'উচ্চ আশংকা',
    riskCritical: 'চৰম / স্থান খালী কৰক',
    riskContributors: 'প্ৰধান পৰিৱেশীয় বিপদ কাৰক',
    rainfall: 'সঞ্চিত বৰষুণ',
    soilMoisture: 'মাটিৰ আৰ্দ্ৰতা',
    slope: 'পাহাৰৰ ঢাল',
    historicalSusceptibility: 'ঐতিহাসিক ভূমিস্খলন সূচক',
    terrain: 'ভূতাত্ত্বিক শিলাস্তৰ',
    weatherCardTitle: 'বতৰ আৰু পৰিৱেশ টেলিমেট্ৰি',
    temperature: 'তাপমাত্ৰা',
    humidity: 'আৰ্দ্ৰতা',
    rainfall24h: '২৪ ঘণ্টাৰ বৰষুণ',
    rainfall72h: '৭২ ঘণ্টাৰ বৰষুণ',
    forecast: 'বৰষুণৰ পূৰ্বাভাস',
    quickActions: 'দ্ৰুত কাৰ্য্য কেন্দ্ৰ',
    reportHazard: 'বিপদৰ খবৰ দিয়ক',
    viewRiskMap: 'মানচিত্ৰ চাওক',
    alerts: 'আগতীয়া সতৰ্কবাণী',
    emergency: 'জৰুৰীকালীন সহায়',
    roadStatus: 'পথ সংযোগৰ অৱস্থা',
    recentReports: 'শেহতীয়া প্ৰতিবেদনসমূহ',
    simulateRainfall: 'প্ৰবল বৰষুণ অনুকৰণ কৰক (ডেমো)',
    fieldOfficerMode: 'ক্ষেত্ৰ বিষয়া সঞ্চালন',
    adminDashboard: 'দুৰ্যোগ কৰ্তৃপক্ষ নিৰীক্ষণ',
    citizenMode: 'নাগৰিক দৃশ্য',
    emergencyCall112: 'ৰাষ্ট্ৰীয় জৰুৰীকালীন ১১২ কল কৰক',
    emergencyCall108: 'দুৰ্যোগ এম্বুলেন্স ১০৮ কল কৰক',
    whatToDoDuringLandslide: 'ভূমিস্খলন সুৰক্ষা নিয়ম',
    evacuationGuide: 'নিৰ্ধাৰিত সাহায্য শিবিৰ',
    sensorsOnline: 'সক্ৰিয় চেন্সৰ',
    blockedRoads: 'অৱৰোধ পথ',
    activeAlerts: 'সক্ৰিয় সতৰ্কবাণী',
    pendingReports: 'অপেক্ষমাণ প্ৰতিবেদন',
  },
  bn: {
    appName: 'গিরি রক্ষা',
    tagline: 'পূর্বাভাস। সতর্কতা। সুরক্ষা।',
    meaning: 'গিরি = পর্বত | রক্ষা = সুরক্ষা',
    disclaimer:
      'গিরি রক্ষা একটি প্রোটোটাইপ সিদ্ধান্ত-সহায়তা ব্যবস্থা। ঝুঁকির অনুমান মডেল-ভিত্তিক এবং সরকারি দুর্যোগ ব্যবস্থাপন পরামর্শের বিকল্প নয়।',
    demoDataBadge: 'প্রোটোটাইপ / ডেমো ডেটা',
    online: 'অনলাইন',
    offline: 'অফলাইন মোড',
    offlineModeNotice:
      'অফলাইন মোড: রিপোর্ট স্থানীয়ভাবে সংরক্ষিত হবে এবং নেটওয়ার্ক ফিরলে স্বয়ংক্রিয়ভাবে সিঙ্ক হবে।',
    syncWaiting: 'রিপোর্ট লাইনে অপেক্ষারত',
    syncing: 'দুর্যোগ পোর্টালে সিঙ্ক হচ্ছে...',
    syncedAll: '✓ সমস্ত রিপোর্ট সফলভাবে সিঙ্ক হয়েছে',
    syncNow: 'এখনই সিঙ্ক করুন',
    currentRiskTitle: 'বর্তমান ভূমিধস ঝুঁকি',
    riskLow: 'কম ঝুঁকি',
    riskModerate: 'মাঝারি ঝুঁকি',
    riskHigh: 'উচ্চ ঝুঁকি',
    riskCritical: 'সংকটজনক / উদ্ধার',
    riskContributors: 'প্রধান পরিবেশগত ঝুঁকির কারণ',
    rainfall: 'ক্রমবর্ধমান বৃষ্টিপাত',
    soilMoisture: 'মাটির আর্দ্রতা সম্পৃক্ততা',
    slope: 'পাহাড়ের ঢালু মাত্রা',
    historicalSusceptibility: 'ঐতিহাসিক ভূমিধস সূচক',
    terrain: 'ভূতাত্ত্বিক শিলাস্তর',
    weatherCardTitle: 'আবহাওয়া ও পরিবেশ টেলিমেট্রি',
    temperature: 'তাপমাত্রা',
    humidity: 'আর্দ্রতা',
    rainfall24h: '২৪ ঘণ্টার বৃষ্টিপাত',
    rainfall72h: '৭২ ঘণ্টার বৃষ্টিপাত',
    forecast: 'বৃষ্টিপাতের পূর্বাভাস',
    quickActions: 'দ্রুত পদক্ষেপ কেন্দ্র',
    reportHazard: 'বিপদের রিপোর্ট করুন',
    viewRiskMap: 'ঝুঁকির মানচিত্র দেখুন',
    alerts: 'পূর্ব সতর্কতা',
    emergency: 'জরুরি সহায়তা',
    roadStatus: 'রাস্তা সংযোগের অবস্থা',
    recentReports: 'সাম্প্রতিক ফিল্ড রিপোর্ট',
    simulateRainfall: 'ভারী বৃষ্টিপাত অনুকরণ করুন (ডেমো)',
    fieldOfficerMode: 'ফিল্ড অফিসার অপারেশন',
    adminDashboard: 'দুর্যোগ কর্তৃপক্ষ কমান্ড',
    citizenMode: 'নাগরিক ভিউ',
    emergencyCall112: 'জাতীয় জরুরি ১১২ কল করুন',
    emergencyCall108: 'দুর্যোগ অ্যাম্বুলেন্স ১০৮ কল করুন',
    whatToDoDuringLandslide: 'ভূমিধস নিরাপত্তা নির্দেশিকা',
    evacuationGuide: 'ত্রাণ শিবিরসমূহ',
    sensorsOnline: 'সক্রিয় সেন্সর',
    blockedRoads: 'অবরুদ্ধ রাস্তা',
    activeAlerts: 'সক্রিয় সতর্কতা',
    pendingReports: 'অপেক্ষমান রিপোর্ট',
  },
};

let currentLanguage: SupportedLanguage = 'en';

export const setLanguage = (lang: SupportedLanguage) => {
  currentLanguage = lang;
};

export const getLanguage = (): SupportedLanguage => currentLanguage;

export const t = (key: keyof TranslationDict): string => {
  const dict = translations[currentLanguage] || translations.en;
  return dict[key] || translations.en[key] || key;
};
