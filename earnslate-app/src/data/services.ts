// ===== Popular Services with Brand Icons =====
// Uses Iconify for brand icons (simple-icons) and Lucide for general icons
// Templates provide icon and color only - users enter their own pricing

export interface ServiceTemplate {
    name: string;
    icon: string;         // Iconify icon name (e.g., 'simple-icons:netflix') or Lucide name
    iconType: 'brand' | 'lucide';
    color: string;
    category: string;
}

export const POPULAR_SERVICES: ServiceTemplate[] = [
    // Streaming
    { name: 'Netflix', icon: 'simple-icons:netflix', iconType: 'brand', color: '#E50914', category: 'Streaming' },
    { name: 'Amazon Prime', icon: 'simple-icons:primevideo', iconType: 'brand', color: '#00A8E1', category: 'Streaming' },
    { name: 'Disney+ Hotstar', icon: 'simple-icons:hotstar', iconType: 'brand', color: '#113CCF', category: 'Streaming' },
    { name: 'JioCinema', icon: 'simple-icons:jio', iconType: 'brand', color: '#0A2540', category: 'Streaming' },
    { name: 'YouTube Premium', icon: 'simple-icons:youtube', iconType: 'brand', color: '#FF0000', category: 'Streaming' },
    { name: 'Sony LIV', icon: 'simple-icons:sony', iconType: 'brand', color: '#000000', category: 'Streaming' },
    { name: 'Zee5', icon: 'Tv', iconType: 'lucide', color: '#8B5CF6', category: 'Streaming' },
    { name: 'HBO Max', icon: 'simple-icons:hbo', iconType: 'brand', color: '#5822B4', category: 'Streaming' },
    { name: 'Hulu', icon: 'simple-icons:hulu', iconType: 'brand', color: '#1CE783', category: 'Streaming' },
    { name: 'Apple TV+', icon: 'simple-icons:appletv', iconType: 'brand', color: '#000000', category: 'Streaming' },
    { name: 'Crunchyroll', icon: 'simple-icons:crunchyroll', iconType: 'brand', color: '#F47521', category: 'Streaming' },
    { name: 'Paramount+', icon: 'simple-icons:paramount', iconType: 'brand', color: '#0064FF', category: 'Streaming' },
    { name: 'Peacock', icon: 'simple-icons:peacock', iconType: 'brand', color: '#000000', category: 'Streaming' },

    // Music
    { name: 'Spotify', icon: 'simple-icons:spotify', iconType: 'brand', color: '#1DB954', category: 'Music' },
    { name: 'Apple Music', icon: 'simple-icons:applemusic', iconType: 'brand', color: '#FA243C', category: 'Music' },
    { name: 'YouTube Music', icon: 'simple-icons:youtubemusic', iconType: 'brand', color: '#FF0000', category: 'Music' },
    { name: 'Amazon Music', icon: 'simple-icons:amazonmusic', iconType: 'brand', color: '#25D1DA', category: 'Music' },
    { name: 'Tidal', icon: 'simple-icons:tidal', iconType: 'brand', color: '#000000', category: 'Music' },
    { name: 'Deezer', icon: 'simple-icons:deezer', iconType: 'brand', color: '#FEAA2D', category: 'Music' },
    { name: 'SoundCloud', icon: 'simple-icons:soundcloud', iconType: 'brand', color: '#FF5500', category: 'Music' },
    { name: 'Gaana', icon: 'Music', iconType: 'lucide', color: '#E72C30', category: 'Music' },
    { name: 'Wynk Music', icon: 'Music', iconType: 'lucide', color: '#EE4D5F', category: 'Music' },

    // Cloud Storage
    { name: 'iCloud', icon: 'simple-icons:icloud', iconType: 'brand', color: '#3693F3', category: 'Storage' },
    { name: 'Google One', icon: 'simple-icons:googledrive', iconType: 'brand', color: '#4285F4', category: 'Storage' },
    { name: 'Dropbox', icon: 'simple-icons:dropbox', iconType: 'brand', color: '#0061FF', category: 'Storage' },
    { name: 'OneDrive', icon: 'simple-icons:onedrive', iconType: 'brand', color: '#0078D4', category: 'Storage' },
    { name: 'Box', icon: 'simple-icons:box', iconType: 'brand', color: '#0061D5', category: 'Storage' },
    { name: 'pCloud', icon: 'simple-icons:pcloud', iconType: 'brand', color: '#01AFEF', category: 'Storage' },

    // Gaming
    { name: 'Xbox Game Pass', icon: 'simple-icons:xbox', iconType: 'brand', color: '#107C10', category: 'Gaming' },
    { name: 'PlayStation Plus', icon: 'simple-icons:playstation', iconType: 'brand', color: '#003087', category: 'Gaming' },
    { name: 'Nintendo Online', icon: 'simple-icons:nintendoswitch', iconType: 'brand', color: '#E60012', category: 'Gaming' },
    { name: 'Steam', icon: 'simple-icons:steam', iconType: 'brand', color: '#1B2838', category: 'Gaming' },
    { name: 'Epic Games', icon: 'simple-icons:epicgames', iconType: 'brand', color: '#313131', category: 'Gaming' },
    { name: 'EA Play', icon: 'simple-icons:ea', iconType: 'brand', color: '#000000', category: 'Gaming' },
    { name: 'Ubisoft+', icon: 'simple-icons:ubisoft', iconType: 'brand', color: '#000000', category: 'Gaming' },
    { name: 'GeForce NOW', icon: 'simple-icons:nvidia', iconType: 'brand', color: '#76B900', category: 'Gaming' },

    // Productivity
    { name: 'Microsoft 365', icon: 'simple-icons:microsoft365', iconType: 'brand', color: '#05A6F0', category: 'Productivity' },
    { name: 'Notion', icon: 'simple-icons:notion', iconType: 'brand', color: '#000000', category: 'Productivity' },
    { name: 'Canva', icon: 'simple-icons:canva', iconType: 'brand', color: '#00C4CC', category: 'Productivity' },
    { name: 'Adobe Creative Cloud', icon: 'simple-icons:adobe', iconType: 'brand', color: '#FF0000', category: 'Productivity' },
    { name: 'Figma', icon: 'simple-icons:figma', iconType: 'brand', color: '#F24E1E', category: 'Productivity' },
    { name: 'Miro', icon: 'simple-icons:miro', iconType: 'brand', color: '#FFD02F', category: 'Productivity' },
    { name: 'Todoist', icon: 'simple-icons:todoist', iconType: 'brand', color: '#E44332', category: 'Productivity' },
    { name: 'Evernote', icon: 'simple-icons:evernote', iconType: 'brand', color: '#00A82D', category: 'Productivity' },
    { name: 'Grammarly', icon: 'simple-icons:grammarly', iconType: 'brand', color: '#15C39A', category: 'Productivity' },
    { name: 'Linear', icon: 'simple-icons:linear', iconType: 'brand', color: '#5E6AD2', category: 'Productivity' },

    // VPN & Security
    { name: 'NordVPN', icon: 'simple-icons:nordvpn', iconType: 'brand', color: '#4687FF', category: 'VPN' },
    { name: 'ExpressVPN', icon: 'simple-icons:expressvpn', iconType: 'brand', color: '#DA3940', category: 'VPN' },
    { name: 'Surfshark', icon: 'simple-icons:surfshark', iconType: 'brand', color: '#178BF4', category: 'VPN' },
    { name: 'ProtonVPN', icon: 'simple-icons:protonvpn', iconType: 'brand', color: '#6D4AFF', category: 'VPN' },
    { name: '1Password', icon: 'simple-icons:1password', iconType: 'brand', color: '#3B66BC', category: 'Security' },
    { name: 'LastPass', icon: 'simple-icons:lastpass', iconType: 'brand', color: '#D32D27', category: 'Security' },
    { name: 'Bitwarden', icon: 'simple-icons:bitwarden', iconType: 'brand', color: '#175DDC', category: 'Security' },
    { name: 'Dashlane', icon: 'simple-icons:dashlane', iconType: 'brand', color: '#0E353D', category: 'Security' },

    // Communication
    { name: 'Slack', icon: 'simple-icons:slack', iconType: 'brand', color: '#4A154B', category: 'Communication' },
    { name: 'Discord Nitro', icon: 'simple-icons:discord', iconType: 'brand', color: '#5865F2', category: 'Communication' },
    { name: 'Zoom', icon: 'simple-icons:zoom', iconType: 'brand', color: '#0B5CFF', category: 'Communication' },
    { name: 'Microsoft Teams', icon: 'simple-icons:microsoftteams', iconType: 'brand', color: '#6264A7', category: 'Communication' },

    // AI & Tools
    { name: 'ChatGPT Plus', icon: 'simple-icons:openai', iconType: 'brand', color: '#10A37F', category: 'AI' },
    { name: 'Claude Pro', icon: 'simple-icons:anthropic', iconType: 'brand', color: '#D97706', category: 'AI' },
    { name: 'Midjourney', icon: 'simple-icons:midjourney', iconType: 'brand', color: '#000000', category: 'AI' },
    { name: 'GitHub Copilot', icon: 'simple-icons:githubcopilot', iconType: 'brand', color: '#000000', category: 'AI' },
    { name: 'Perplexity', icon: 'simple-icons:perplexity', iconType: 'brand', color: '#1FB8CD', category: 'AI' },
    { name: 'Gemini', icon: 'simple-icons:googlegemini', iconType: 'brand', color: '#4285F4', category: 'AI' },

    // Developer
    { name: 'GitHub Pro', icon: 'simple-icons:github', iconType: 'brand', color: '#181717', category: 'Developer' },
    { name: 'GitLab', icon: 'simple-icons:gitlab', iconType: 'brand', color: '#FC6D26', category: 'Developer' },
    { name: 'Vercel', icon: 'simple-icons:vercel', iconType: 'brand', color: '#000000', category: 'Developer' },
    { name: 'Netlify', icon: 'simple-icons:netlify', iconType: 'brand', color: '#00C7B7', category: 'Developer' },
    { name: 'DigitalOcean', icon: 'simple-icons:digitalocean', iconType: 'brand', color: '#0080FF', category: 'Developer' },
    { name: 'AWS', icon: 'simple-icons:amazonaws', iconType: 'brand', color: '#FF9900', category: 'Developer' },
    { name: 'Google Cloud', icon: 'simple-icons:googlecloud', iconType: 'brand', color: '#4285F4', category: 'Developer' },
    { name: 'Azure', icon: 'simple-icons:microsoftazure', iconType: 'brand', color: '#0078D4', category: 'Developer' },

    // Food & Delivery
    { name: 'Swiggy One', icon: 'simple-icons:swiggy', iconType: 'brand', color: '#FC8019', category: 'Food' },
    { name: 'Zomato Gold', icon: 'simple-icons:zomato', iconType: 'brand', color: '#E23744', category: 'Food' },
    { name: 'DoorDash', icon: 'simple-icons:doordash', iconType: 'brand', color: '#FF3008', category: 'Food' },
    { name: 'Uber Eats', icon: 'simple-icons:ubereats', iconType: 'brand', color: '#06C167', category: 'Food' },

    // Fitness & Health
    { name: 'Strava', icon: 'simple-icons:strava', iconType: 'brand', color: '#FC4C02', category: 'Fitness' },
    { name: 'Headspace', icon: 'simple-icons:headspace', iconType: 'brand', color: '#F47D31', category: 'Fitness' },
    { name: 'Calm', icon: 'simple-icons:calm', iconType: 'brand', color: '#7FCFCF', category: 'Fitness' },
    { name: 'Peloton', icon: 'simple-icons:peloton', iconType: 'brand', color: '#000000', category: 'Fitness' },
    { name: 'Cult.fit', icon: 'Dumbbell', iconType: 'lucide', color: '#FF3366', category: 'Fitness' },
    { name: 'Gym Membership', icon: 'Dumbbell', iconType: 'lucide', color: '#EF4444', category: 'Fitness' },

    // Reading & Learning
    { name: 'Kindle Unlimited', icon: 'simple-icons:amazon', iconType: 'brand', color: '#FF9900', category: 'Reading' },
    { name: 'Audible', icon: 'simple-icons:audible', iconType: 'brand', color: '#F8991C', category: 'Reading' },
    { name: 'Medium', icon: 'simple-icons:medium', iconType: 'brand', color: '#000000', category: 'Reading' },
    { name: 'Coursera', icon: 'simple-icons:coursera', iconType: 'brand', color: '#0056D2', category: 'Learning' },
    { name: 'Udemy', icon: 'simple-icons:udemy', iconType: 'brand', color: '#A435F0', category: 'Learning' },
    { name: 'Skillshare', icon: 'simple-icons:skillshare', iconType: 'brand', color: '#00FF84', category: 'Learning' },
    { name: 'LinkedIn Premium', icon: 'simple-icons:linkedin', iconType: 'brand', color: '#0A66C2', category: 'Learning' },
    { name: 'Duolingo', icon: 'simple-icons:duolingo', iconType: 'brand', color: '#58CC02', category: 'Learning' },

    // Utilities
    { name: 'Electricity Bill', icon: 'Zap', iconType: 'lucide', color: '#F59E0B', category: 'Utility' },
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
