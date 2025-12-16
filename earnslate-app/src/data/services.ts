// ===== Popular Services with Brand Icons =====
// Uses Iconify for brand icons (simple-icons) and Lucide for general icons
// Suggested pricing is approximate and may vary. Users should update amounts.

export interface ServiceTemplate {
    name: string;
    icon: string;         // Iconify icon name (e.g., 'simple-icons:netflix') or Lucide name
    iconType: 'brand' | 'lucide';
    color: string;
    category: string;
    suggestedAmount?: number;  // Approximate pricing, user should confirm
    suggestedCycle?: { count: number; unit: 'month' | 'year' };
}

export const POPULAR_SERVICES: ServiceTemplate[] = [
    // Streaming
    { name: 'Netflix', icon: 'simple-icons:netflix', iconType: 'brand', color: '#E50914', category: 'Streaming', suggestedAmount: 649, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Amazon Prime', icon: 'simple-icons:primevideo', iconType: 'brand', color: '#00A8E1', category: 'Streaming', suggestedAmount: 1499, suggestedCycle: { count: 1, unit: 'year' } },
    { name: 'Disney+ Hotstar', icon: 'simple-icons:hotstar', iconType: 'brand', color: '#113CCF', category: 'Streaming', suggestedAmount: 1499, suggestedCycle: { count: 1, unit: 'year' } },
    { name: 'JioCinema', icon: 'simple-icons:jio', iconType: 'brand', color: '#0A2540', category: 'Streaming', suggestedAmount: 999, suggestedCycle: { count: 1, unit: 'year' } },
    { name: 'YouTube Premium', icon: 'simple-icons:youtube', iconType: 'brand', color: '#FF0000', category: 'Streaming', suggestedAmount: 129, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Sony LIV', icon: 'simple-icons:sony', iconType: 'brand', color: '#000000', category: 'Streaming', suggestedAmount: 999, suggestedCycle: { count: 1, unit: 'year' } },
    { name: 'Zee5', icon: 'Tv', iconType: 'lucide', color: '#8B5CF6', category: 'Streaming', suggestedAmount: 999, suggestedCycle: { count: 1, unit: 'year' } },
    { name: 'HBO Max', icon: 'simple-icons:hbo', iconType: 'brand', color: '#5822B4', category: 'Streaming' },
    { name: 'Hulu', icon: 'simple-icons:hulu', iconType: 'brand', color: '#1CE783', category: 'Streaming' },
    { name: 'Apple TV+', icon: 'simple-icons:appletv', iconType: 'brand', color: '#000000', category: 'Streaming' },
    { name: 'Crunchyroll', icon: 'simple-icons:crunchyroll', iconType: 'brand', color: '#F47521', category: 'Streaming' },

    // Music
    { name: 'Spotify', icon: 'simple-icons:spotify', iconType: 'brand', color: '#1DB954', category: 'Music', suggestedAmount: 119, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Apple Music', icon: 'simple-icons:applemusic', iconType: 'brand', color: '#FA243C', category: 'Music', suggestedAmount: 99, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'YouTube Music', icon: 'simple-icons:youtubemusic', iconType: 'brand', color: '#FF0000', category: 'Music', suggestedAmount: 99, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Amazon Music', icon: 'simple-icons:amazonmusic', iconType: 'brand', color: '#25D1DA', category: 'Music' },
    { name: 'Tidal', icon: 'simple-icons:tidal', iconType: 'brand', color: '#000000', category: 'Music' },
    { name: 'Deezer', icon: 'simple-icons:deezer', iconType: 'brand', color: '#FEAA2D', category: 'Music' },
    { name: 'SoundCloud', icon: 'simple-icons:soundcloud', iconType: 'brand', color: '#FF5500', category: 'Music' },
    { name: 'Gaana', icon: 'Music', iconType: 'lucide', color: '#E72C30', category: 'Music', suggestedAmount: 399, suggestedCycle: { count: 1, unit: 'year' } },
    { name: 'Wynk Music', icon: 'Music', iconType: 'lucide', color: '#EE4D5F', category: 'Music', suggestedAmount: 99, suggestedCycle: { count: 1, unit: 'month' } },

    // Cloud Storage
    { name: 'iCloud', icon: 'simple-icons:icloud', iconType: 'brand', color: '#3693F3', category: 'Storage', suggestedAmount: 75, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Google One', icon: 'simple-icons:googledrive', iconType: 'brand', color: '#4285F4', category: 'Storage', suggestedAmount: 130, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Dropbox', icon: 'simple-icons:dropbox', iconType: 'brand', color: '#0061FF', category: 'Storage', suggestedAmount: 978, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'OneDrive', icon: 'simple-icons:onedrive', iconType: 'brand', color: '#0078D4', category: 'Storage', suggestedAmount: 420, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Box', icon: 'simple-icons:box', iconType: 'brand', color: '#0061D5', category: 'Storage' },
    { name: 'pCloud', icon: 'simple-icons:pcloud', iconType: 'brand', color: '#01AFEF', category: 'Storage' },

    // Gaming
    { name: 'Xbox Game Pass', icon: 'simple-icons:xbox', iconType: 'brand', color: '#107C10', category: 'Gaming', suggestedAmount: 489, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'PlayStation Plus', icon: 'simple-icons:playstation', iconType: 'brand', color: '#003087', category: 'Gaming', suggestedAmount: 499, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Nintendo Online', icon: 'simple-icons:nintendoswitch', iconType: 'brand', color: '#E60012', category: 'Gaming', suggestedAmount: 329, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Steam', icon: 'simple-icons:steam', iconType: 'brand', color: '#1B2838', category: 'Gaming' },
    { name: 'Epic Games', icon: 'simple-icons:epicgames', iconType: 'brand', color: '#313131', category: 'Gaming' },
    { name: 'EA Play', icon: 'simple-icons:ea', iconType: 'brand', color: '#000000', category: 'Gaming' },
    { name: 'Ubisoft+', icon: 'simple-icons:ubisoft', iconType: 'brand', color: '#000000', category: 'Gaming' },
    { name: 'GeForce NOW', icon: 'simple-icons:nvidia', iconType: 'brand', color: '#76B900', category: 'Gaming' },

    // Productivity
    { name: 'Microsoft 365', icon: 'simple-icons:microsoft365', iconType: 'brand', color: '#05A6F0', category: 'Productivity', suggestedAmount: 489, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Notion', icon: 'simple-icons:notion', iconType: 'brand', color: '#000000', category: 'Productivity', suggestedAmount: 800, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Canva', icon: 'simple-icons:canva', iconType: 'brand', color: '#00C4CC', category: 'Productivity', suggestedAmount: 499, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Adobe Creative Cloud', icon: 'simple-icons:adobe', iconType: 'brand', color: '#FF0000', category: 'Productivity', suggestedAmount: 4834, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Figma', icon: 'simple-icons:figma', iconType: 'brand', color: '#F24E1E', category: 'Productivity' },
    { name: 'Miro', icon: 'simple-icons:miro', iconType: 'brand', color: '#FFD02F', category: 'Productivity' },
    { name: 'Todoist', icon: 'simple-icons:todoist', iconType: 'brand', color: '#E44332', category: 'Productivity' },
    { name: 'Evernote', icon: 'simple-icons:evernote', iconType: 'brand', color: '#00A82D', category: 'Productivity' },
    { name: 'Grammarly', icon: 'simple-icons:grammarly', iconType: 'brand', color: '#15C39A', category: 'Productivity' },

    // VPN & Security
    { name: 'NordVPN', icon: 'simple-icons:nordvpn', iconType: 'brand', color: '#4687FF', category: 'VPN', suggestedAmount: 459, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'ExpressVPN', icon: 'simple-icons:expressvpn', iconType: 'brand', color: '#DA3940', category: 'VPN', suggestedAmount: 716, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Surfshark', icon: 'simple-icons:surfshark', iconType: 'brand', color: '#178BF4', category: 'VPN', suggestedAmount: 193, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'ProtonVPN', icon: 'simple-icons:protonvpn', iconType: 'brand', color: '#6D4AFF', category: 'VPN' },
    { name: '1Password', icon: 'simple-icons:1password', iconType: 'brand', color: '#3B66BC', category: 'Security' },
    { name: 'LastPass', icon: 'simple-icons:lastpass', iconType: 'brand', color: '#D32D27', category: 'Security' },
    { name: 'Bitwarden', icon: 'simple-icons:bitwarden', iconType: 'brand', color: '#175DDC', category: 'Security' },
    { name: 'Dashlane', icon: 'simple-icons:dashlane', iconType: 'brand', color: '#0E353D', category: 'Security' },

    // Communication
    { name: 'Slack', icon: 'simple-icons:slack', iconType: 'brand', color: '#4A154B', category: 'Communication' },
    { name: 'Zoom', icon: 'simple-icons:zoom', iconType: 'brand', color: '#2D8CFF', category: 'Communication', suggestedAmount: 1100, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Discord Nitro', icon: 'simple-icons:discord', iconType: 'brand', color: '#5865F2', category: 'Communication', suggestedAmount: 499, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Microsoft Teams', icon: 'simple-icons:microsoftteams', iconType: 'brand', color: '#6264A7', category: 'Communication' },
    { name: 'Google Meet', icon: 'simple-icons:googlemeet', iconType: 'brand', color: '#00897B', category: 'Communication' },

    // News & Reading
    { name: 'Kindle Unlimited', icon: 'simple-icons:kindle', iconType: 'brand', color: '#FF9900', category: 'Reading', suggestedAmount: 169, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Audible', icon: 'simple-icons:audible', iconType: 'brand', color: '#F8991C', category: 'Reading', suggestedAmount: 199, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Medium', icon: 'simple-icons:medium', iconType: 'brand', color: '#000000', category: 'Reading', suggestedAmount: 416, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Pocket', icon: 'simple-icons:pocket', iconType: 'brand', color: '#EF4154', category: 'Reading' },
    { name: 'Blinkist', icon: 'simple-icons:blinkist', iconType: 'brand', color: '#27D86E', category: 'Reading' },

    // Fitness & Health
    { name: 'Gym Membership', icon: 'Dumbbell', iconType: 'lucide', color: '#10B981', category: 'Fitness', suggestedAmount: 2000, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Cult.fit', icon: 'Dumbbell', iconType: 'lucide', color: '#FF0000', category: 'Fitness', suggestedAmount: 1000, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Strava', icon: 'simple-icons:strava', iconType: 'brand', color: '#FC4C02', category: 'Fitness', suggestedAmount: 550, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Peloton', icon: 'simple-icons:peloton', iconType: 'brand', color: '#000000', category: 'Fitness' },
    { name: 'Headspace', icon: 'simple-icons:headspace', iconType: 'brand', color: '#F47D31', category: 'Health', suggestedAmount: 399, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Calm', icon: 'simple-icons:calm', iconType: 'brand', color: '#7ECFE9', category: 'Health' },
    { name: 'Nike Training', icon: 'simple-icons:nike', iconType: 'brand', color: '#111111', category: 'Fitness' },

    // Developer Tools
    { name: 'GitHub Pro', icon: 'simple-icons:github', iconType: 'brand', color: '#181717', category: 'Developer', suggestedAmount: 340, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'GitLab', icon: 'simple-icons:gitlab', iconType: 'brand', color: '#FC6D26', category: 'Developer' },
    { name: 'Vercel', icon: 'simple-icons:vercel', iconType: 'brand', color: '#000000', category: 'Developer', suggestedAmount: 1660, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Netlify', icon: 'simple-icons:netlify', iconType: 'brand', color: '#00C7B7', category: 'Developer' },
    { name: 'Heroku', icon: 'simple-icons:heroku', iconType: 'brand', color: '#430098', category: 'Developer' },
    { name: 'DigitalOcean', icon: 'simple-icons:digitalocean', iconType: 'brand', color: '#0080FF', category: 'Developer' },
    { name: 'AWS', icon: 'simple-icons:amazonwebservices', iconType: 'brand', color: '#FF9900', category: 'Developer' },
    { name: 'JetBrains', icon: 'simple-icons:jetbrains', iconType: 'brand', color: '#000000', category: 'Developer' },

    // AI Tools
    { name: 'ChatGPT Plus', icon: 'simple-icons:openai', iconType: 'brand', color: '#412991', category: 'AI', suggestedAmount: 1650, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Claude Pro', icon: 'simple-icons:anthropic', iconType: 'brand', color: '#D4A574', category: 'AI', suggestedAmount: 1660, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Midjourney', icon: 'simple-icons:midjourney', iconType: 'brand', color: '#000000', category: 'AI' },
    { name: 'GitHub Copilot', icon: 'simple-icons:githubcopilot', iconType: 'brand', color: '#000000', category: 'AI', suggestedAmount: 833, suggestedCycle: { count: 1, unit: 'month' } },
    { name: 'Perplexity', icon: 'simple-icons:perplexity', iconType: 'brand', color: '#20808D', category: 'AI' },
    { name: 'Gemini', icon: 'simple-icons:googlegemini', iconType: 'brand', color: '#4285F4', category: 'AI' },

    // Food Delivery
    { name: 'Swiggy One', icon: 'simple-icons:swiggy', iconType: 'brand', color: '#FC8019', category: 'Food', suggestedAmount: 499, suggestedCycle: { count: 3, unit: 'month' } },
    { name: 'Zomato Gold', icon: 'simple-icons:zomato', iconType: 'brand', color: '#E23744', category: 'Food', suggestedAmount: 500, suggestedCycle: { count: 1, unit: 'year' } },
    { name: 'DoorDash', icon: 'simple-icons:doordash', iconType: 'brand', color: '#FF3008', category: 'Food' },
    { name: 'Uber Eats', icon: 'simple-icons:ubereats', iconType: 'brand', color: '#06C167', category: 'Food' },

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
