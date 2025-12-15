// ===== Popular Services with Brand Icons =====
// Suggested pricing is approximate and may vary. Users should update amounts.

export interface ServiceTemplate {
    name: string;
    icon: string;         // react-icons/si or Lucide icon name
    iconType: 'brand' | 'lucide';
    color: string;
    category: string;
    suggestedAmount?: number;  // Approximate pricing, user should confirm
    suggestedCycle?: { count: number; unit: 'month' | 'year' };
}

export const POPULAR_SERVICES: ServiceTemplate[] = [
    // Streaming
    { name: 'Netflix', icon: 'SiNetflix', iconType: 'brand', color: '#E50914', category: 'Streaming', suggestedAmount: 649, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Amazon Prime', icon: 'SiAmazon', iconType: 'brand', color: '#FF9900', category: 'Streaming', suggestedAmount: 1499, suggestedCycle: { count: 1, unit: 'year' } },
    { name: 'Disney+ Hotstar', icon: 'Tv', iconType: 'lucide', color: '#113CCF', category: 'Streaming', suggestedAmount: 1499, suggestedCycle: { count: 1, unit: 'year' } },
    { name: 'JioCinema', icon: 'Tv', iconType: 'lucide', color: '#0A2540', category: 'Streaming', suggestedAmount: 999, suggestedCycle: { count: 1, unit: 'year' } },
    { name: 'YouTube Premium', icon: 'SiYoutube', iconType: 'brand', color: '#FF0000', category: 'Streaming', suggestedAmount: 129, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Sony LIV', icon: 'Tv', iconType: 'lucide', color: '#000000', category: 'Streaming', suggestedAmount: 999, suggestedCycle: { count: 1, unit: 'year' } },
    { name: 'Zee5', icon: 'Tv', iconType: 'lucide', color: '#8B5CF6', category: 'Streaming', suggestedAmount: 999, suggestedCycle: { count: 1, unit: 'year' } },

    // Music
    { name: 'Spotify', icon: 'SiSpotify', iconType: 'brand', color: '#1DB954', category: 'Music', suggestedAmount: 119, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Apple Music', icon: 'SiApplemusic', iconType: 'brand', color: '#FA243C', category: 'Music', suggestedAmount: 99, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'YouTube Music', icon: 'SiYoutubemusic', iconType: 'brand', color: '#FF0000', category: 'Music', suggestedAmount: 99, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Gaana', icon: 'Music', iconType: 'lucide', color: '#E72C30', category: 'Music', suggestedAmount: 399, suggestedCycle: { count: 1, unit: 'year' } },
    { name: 'Wynk Music', icon: 'Music', iconType: 'lucide', color: '#EE4D5F', category: 'Music', suggestedAmount: 99, suggestedCycle: { count: 1, unit: 'month' } },

    // Cloud Storage
    { name: 'iCloud', icon: 'SiIcloud', iconType: 'brand', color: '#3693F3', category: 'Storage', suggestedAmount: 75, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Google One', icon: 'SiGoogledrive', iconType: 'brand', color: '#4285F4', category: 'Storage', suggestedAmount: 130, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Dropbox', icon: 'SiDropbox', iconType: 'brand', color: '#0061FF', category: 'Storage', suggestedAmount: 978, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'OneDrive', icon: 'SiOnedrive', iconType: 'brand', color: '#0078D4', category: 'Storage', suggestedAmount: 420, suggestedCycle: { count: 1, unit: 'month' } },

    // Gaming
    { name: 'Xbox Game Pass', icon: 'SiXbox', iconType: 'brand', color: '#107C10', category: 'Gaming', suggestedAmount: 489, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'PlayStation Plus', icon: 'SiPlaystation', iconType: 'brand', color: '#003087', category: 'Gaming', suggestedAmount: 499, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Nintendo Online', icon: 'SiNintendoswitch', iconType: 'brand', color: '#E60012', category: 'Gaming', suggestedAmount: 329, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Steam', icon: 'SiSteam', iconType: 'brand', color: '#1B2838', category: 'Gaming' },

    // Productivity
    { name: 'Microsoft 365', icon: 'SiMicrosoft', iconType: 'brand', color: '#05A6F0', category: 'Productivity', suggestedAmount: 489, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Notion', icon: 'SiNotion', iconType: 'brand', color: '#000000', category: 'Productivity', suggestedAmount: 800, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Canva', icon: 'SiCanva', iconType: 'brand', color: '#00C4CC', category: 'Productivity', suggestedAmount: 499, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Adobe Creative Cloud', icon: 'SiAdobe', iconType: 'brand', color: '#FF0000', category: 'Productivity', suggestedAmount: 4834, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Figma', icon: 'SiFigma', iconType: 'brand', color: '#F24E1E', category: 'Productivity' },

    // VPN & Security
    { name: 'NordVPN', icon: 'SiNordvpn', iconType: 'brand', color: '#4687FF', category: 'VPN', suggestedAmount: 459, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'ExpressVPN', icon: 'SiExpressvpn', iconType: 'brand', color: '#DA3940', category: 'VPN', suggestedAmount: 716, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Surfshark', icon: 'SiSurfshark', iconType: 'brand', color: '#178BF4', category: 'VPN', suggestedAmount: 193, suggestedCycle: { count: 1, unit: 'month' } },

    // Communication
    { name: 'Slack', icon: 'SiSlack', iconType: 'brand', color: '#4A154B', category: 'Communication' },
    { name: 'Zoom', icon: 'SiZoom', iconType: 'brand', color: '#2D8CFF', category: 'Communication', suggestedAmount: 1100, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Discord Nitro', icon: 'SiDiscord', iconType: 'brand', color: '#5865F2', category: 'Communication', suggestedAmount: 499, suggestedCycle: { count: 1, unit: 'month' } },

    // News & Reading
    { name: 'Kindle Unlimited', icon: 'SiAmazon', iconType: 'brand', color: '#FF9900', category: 'Reading', suggestedAmount: 169, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Audible', icon: 'SiAudible', iconType: 'brand', color: '#F8991C', category: 'Reading', suggestedAmount: 199, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Medium', icon: 'SiMedium', iconType: 'brand', color: '#000000', category: 'Reading', suggestedAmount: 416, suggestedCycle: { count: 1, unit: 'month' } },

    // Fitness & Health
    { name: 'Gym Membership', icon: 'Dumbbell', iconType: 'lucide', color: '#10B981', category: 'Fitness', suggestedAmount: 2000, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Cult.fit', icon: 'Dumbbell', iconType: 'lucide', color: '#FF0000', category: 'Fitness', suggestedAmount: 1000, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Strava', icon: 'SiStrava', iconType: 'brand', color: '#FC4C02', category: 'Fitness', suggestedAmount: 550, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Headspace', icon: 'Brain', iconType: 'lucide', color: '#F47D31', category: 'Health', suggestedAmount: 399, suggestedCycle: { count: 1, unit: 'month' } },

    // Developer Tools
    { name: 'GitHub Pro', icon: 'SiGithub', iconType: 'brand', color: '#181717', category: 'Developer', suggestedAmount: 340, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Vercel', icon: 'SiVercel', iconType: 'brand', color: '#000000', category: 'Developer', suggestedAmount: 1660, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'ChatGPT Plus', icon: 'SiOpenai', iconType: 'brand', color: '#412991', category: 'AI', suggestedAmount: 1650, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Claude Pro', icon: 'Sparkles', iconType: 'lucide', color: '#D4A574', category: 'AI', suggestedAmount: 1660, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Copilot', icon: 'SiGithub', iconType: 'brand', color: '#181717', category: 'Developer', suggestedAmount: 833, suggestedCycle: { count: 1, unit: 'month' } },

    // Food Delivery
    { name: 'Swiggy One', icon: 'UtensilsCrossed', iconType: 'lucide', color: '#FC8019', category: 'Food', suggestedAmount: 499, suggestedCycle: { count: 3, unit: 'month' } },
    { name: 'Zomato Gold', icon: 'UtensilsCrossed', iconType: 'lucide', color: '#E23744', category: 'Food', suggestedAmount: 500, suggestedCycle: { count: 1, unit: 'year' } },

    // Utilities
    { name: 'Electricity Bill', icon: 'Lightbulb', iconType: 'lucide', color: '#F59E0B', category: 'Utility' },
    { name: 'Water Bill', icon: 'Droplet', iconType: 'lucide', color: '#3B82F6', category: 'Utility' },
    { name: 'Gas Bill', icon: 'Flame', iconType: 'lucide', color: '#EF4444', category: 'Utility' },
    { name: 'Internet Bill', icon: 'Wifi', iconType: 'lucide', color: '#8B5CF6', category: 'Utility' },
    { name: 'Mobile Recharge', icon: 'Smartphone', iconType: 'lucide', color: '#10B981', category: 'Utility' },

    // Insurance
    { name: 'Health Insurance', icon: 'Heart', iconType: 'lucide', color: '#EF4444', category: 'Insurance' },
    { name: 'Car Insurance', icon: 'Car', iconType: 'lucide', color: '#3B82F6', category: 'Insurance' },
    { name: 'Life Insurance', icon: 'Shield', iconType: 'lucide', color: '#10B981', category: 'Insurance' },

    // Others
    { name: 'Rent', icon: 'Home', iconType: 'lucide', color: '#6366F1', category: 'Housing' },
    { name: 'EMI', icon: 'Banknote', iconType: 'lucide', color: '#F59E0B', category: 'Finance' },
    { name: 'SIP', icon: 'TrendingUp', iconType: 'lucide', color: '#10B981', category: 'Investment' },
];

// Get unique categories for filtering
export const SERVICE_CATEGORIES = [...new Set(POPULAR_SERVICES.map(s => s.category))];

// Search function
export const searchServices = (query: string): ServiceTemplate[] => {
    const q = query.toLowerCase().trim();
    if (!q) return POPULAR_SERVICES;

    return POPULAR_SERVICES.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
};
