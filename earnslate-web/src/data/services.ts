// ===== Popular Services with Brand Icons =====
// Uses Iconify for brand icons (simple-icons) and Lucide for general icons
// Templates provide icon and color only - users enter their own pricing

export interface ServiceTemplate {
    name: string;
    icon: string;         // Iconify icon name (e.g., 'simple-icons:netflix') or Lucide name
    color: string;
    category: string;
}

export const POPULAR_SERVICES: ServiceTemplate[] = [
    // Streaming
    { name: 'Netflix', icon: 'simple-icons:netflix', color: '#E50914', category: 'Streaming' },
    { name: 'Amazon Prime', icon: 'simple-icons:primevideo', color: '#00A8E1', category: 'Streaming' },
    { name: 'Disney+ Hotstar', icon: 'simple-icons:hotstar', color: '#113CCF', category: 'Streaming' },
    { name: 'JioCinema', icon: 'simple-icons:jio', color: '#0A2540', category: 'Streaming' },
    { name: 'YouTube Premium', icon: 'simple-icons:youtube', color: '#FF0000', category: 'Streaming' },
    { name: 'Sony LIV', icon: 'simple-icons:sony', color: '#000000', category: 'Streaming' },
    { name: 'Zee5', icon: 'Tv', color: '#8B5CF6', category: 'Streaming' },
    { name: 'HBO Max', icon: 'simple-icons:hbo', color: '#5822B4', category: 'Streaming' },
    { name: 'Hulu', icon: 'simple-icons:hulu', color: '#1CE783', category: 'Streaming' },
    { name: 'Apple TV+', icon: 'simple-icons:appletv', color: '#000000', category: 'Streaming' },
    { name: 'Crunchyroll', icon: 'simple-icons:crunchyroll', color: '#F47521', category: 'Streaming' },
    { name: 'Paramount+', icon: 'simple-icons:paramount', color: '#0064FF', category: 'Streaming' },
    { name: 'Peacock', icon: 'simple-icons:peacock', color: '#000000', category: 'Streaming' },

    // Music
    { name: 'Spotify', icon: 'simple-icons:spotify', color: '#1DB954', category: 'Music' },
    { name: 'Apple Music', icon: 'simple-icons:applemusic', color: '#FA243C', category: 'Music' },
    { name: 'YouTube Music', icon: 'simple-icons:youtubemusic', color: '#FF0000', category: 'Music' },
    { name: 'Amazon Music', icon: 'simple-icons:amazonmusic', color: '#25D1DA', category: 'Music' },
    { name: 'Tidal', icon: 'simple-icons:tidal', color: '#000000', category: 'Music' },
    { name: 'Deezer', icon: 'simple-icons:deezer', color: '#FEAA2D', category: 'Music' },
    { name: 'SoundCloud', icon: 'simple-icons:soundcloud', color: '#FF5500', category: 'Music' },
    { name: 'Gaana', icon: 'Music', color: '#E72C30', category: 'Music' },
    { name: 'Wynk Music', icon: 'Music', color: '#EE4D5F', category: 'Music' },

    // Cloud Storage
    { name: 'iCloud', icon: 'simple-icons:icloud', color: '#3693F3', category: 'Storage' },
    { name: 'Google One', icon: 'simple-icons:googledrive', color: '#4285F4', category: 'Storage' },
    { name: 'Dropbox', icon: 'simple-icons:dropbox', color: '#0061FF', category: 'Storage' },
    { name: 'OneDrive', icon: 'simple-icons:onedrive', color: '#0078D4', category: 'Storage' },
    { name: 'Box', icon: 'simple-icons:box', color: '#0061D5', category: 'Storage' },
    { name: 'pCloud', icon: 'simple-icons:pcloud', color: '#01AFEF', category: 'Storage' },

    // Gaming
    { name: 'Xbox Game Pass', icon: 'simple-icons:xbox', color: '#107C10', category: 'Gaming' },
    { name: 'PlayStation Plus', icon: 'simple-icons:playstation', color: '#003087', category: 'Gaming' },
    { name: 'Nintendo Online', icon: 'simple-icons:nintendoswitch', color: '#E60012', category: 'Gaming' },
    { name: 'Steam', icon: 'simple-icons:steam', color: '#1B2838', category: 'Gaming' },
    { name: 'Epic Games', icon: 'simple-icons:epicgames', color: '#313131', category: 'Gaming' },
    { name: 'EA Play', icon: 'simple-icons:ea', color: '#000000', category: 'Gaming' },
    { name: 'Ubisoft+', icon: 'simple-icons:ubisoft', color: '#000000', category: 'Gaming' },
    { name: 'GeForce NOW', icon: 'simple-icons:nvidia', color: '#76B900', category: 'Gaming' },

    // Productivity
    { name: 'Microsoft 365', icon: 'simple-icons:microsoft365', color: '#05A6F0', category: 'Productivity' },
    { name: 'Notion', icon: 'simple-icons:notion', color: '#000000', category: 'Productivity' },
    { name: 'Canva', icon: 'simple-icons:canva', color: '#00C4CC', category: 'Productivity' },
    { name: 'Adobe Creative Cloud', icon: 'simple-icons:adobe', color: '#FF0000', category: 'Productivity' },
    { name: 'Figma', icon: 'simple-icons:figma', color: '#F24E1E', category: 'Productivity' },
    { name: 'Miro', icon: 'simple-icons:miro', color: '#FFD02F', category: 'Productivity' },
    { name: 'Todoist', icon: 'simple-icons:todoist', color: '#E44332', category: 'Productivity' },
    { name: 'Evernote', icon: 'simple-icons:evernote', color: '#00A82D', category: 'Productivity' },
    { name: 'Grammarly', icon: 'simple-icons:grammarly', color: '#15C39A', category: 'Productivity' },
    { name: 'Linear', icon: 'simple-icons:linear', color: '#5E6AD2', category: 'Productivity' },

    // VPN & Security
    { name: 'NordVPN', icon: 'simple-icons:nordvpn', color: '#4687FF', category: 'VPN' },
    { name: 'ExpressVPN', icon: 'simple-icons:expressvpn', color: '#DA3940', category: 'VPN' },
    { name: 'Surfshark', icon: 'simple-icons:surfshark', color: '#178BF4', category: 'VPN' },
    { name: 'ProtonVPN', icon: 'simple-icons:protonvpn', color: '#6D4AFF', category: 'VPN' },
    { name: '1Password', icon: 'simple-icons:1password', color: '#3B66BC', category: 'Security' },
    { name: 'LastPass', icon: 'simple-icons:lastpass', color: '#D32D27', category: 'Security' },
    { name: 'Bitwarden', icon: 'simple-icons:bitwarden', color: '#175DDC', category: 'Security' },
    { name: 'Dashlane', icon: 'simple-icons:dashlane', color: '#0E353D', category: 'Security' },

    // Communication
    { name: 'Slack', icon: 'simple-icons:slack', color: '#4A154B', category: 'Communication' },
    { name: 'Discord Nitro', icon: 'simple-icons:discord', color: '#5865F2', category: 'Communication' },
    { name: 'Zoom', icon: 'simple-icons:zoom', color: '#0B5CFF', category: 'Communication' },
    { name: 'Microsoft Teams', icon: 'simple-icons:microsoftteams', color: '#6264A7', category: 'Communication' },

    // AI & Tools
    { name: 'ChatGPT Plus', icon: 'simple-icons:openai', color: '#10A37F', category: 'AI' },
    { name: 'Claude Pro', icon: 'simple-icons:anthropic', color: '#D97706', category: 'AI' },
    { name: 'Midjourney', icon: 'simple-icons:midjourney', color: '#000000', category: 'AI' },
    { name: 'GitHub Copilot', icon: 'simple-icons:githubcopilot', color: '#000000', category: 'AI' },
    { name: 'Perplexity', icon: 'simple-icons:perplexity', color: '#1FB8CD', category: 'AI' },
    { name: 'Gemini', icon: 'simple-icons:googlegemini', color: '#4285F4', category: 'AI' },

    // Developer
    { name: 'GitHub Pro', icon: 'simple-icons:github', color: '#181717', category: 'Developer' },
    { name: 'GitLab', icon: 'simple-icons:gitlab', color: '#FC6D26', category: 'Developer' },
    { name: 'Vercel', icon: 'simple-icons:vercel', color: '#000000', category: 'Developer' },
    { name: 'Netlify', icon: 'simple-icons:netlify', color: '#00C7B7', category: 'Developer' },
    { name: 'DigitalOcean', icon: 'simple-icons:digitalocean', color: '#0080FF', category: 'Developer' },
    { name: 'AWS', icon: 'simple-icons:amazonaws', color: '#FF9900', category: 'Developer' },
    { name: 'Google Cloud', icon: 'simple-icons:googlecloud', color: '#4285F4', category: 'Developer' },
    { name: 'Azure', icon: 'simple-icons:microsoftazure', color: '#0078D4', category: 'Developer' },

    // Food & Delivery
    { name: 'Swiggy One', icon: 'simple-icons:swiggy', color: '#FC8019', category: 'Food' },
    { name: 'Zomato Gold', icon: 'simple-icons:zomato', color: '#E23744', category: 'Food' },
    { name: 'DoorDash', icon: 'simple-icons:doordash', color: '#FF3008', category: 'Food' },
    { name: 'Uber Eats', icon: 'simple-icons:ubereats', color: '#06C167', category: 'Food' },

    // Fitness & Health
    { name: 'Strava', icon: 'simple-icons:strava', color: '#FC4C02', category: 'Fitness' },
    { name: 'Headspace', icon: 'simple-icons:headspace', color: '#F47D31', category: 'Fitness' },
    { name: 'Calm', icon: 'simple-icons:calm', color: '#7FCFCF', category: 'Fitness' },
    { name: 'Peloton', icon: 'simple-icons:peloton', color: '#000000', category: 'Fitness' },
    { name: 'Cult.fit', icon: 'Dumbbell', color: '#FF3366', category: 'Fitness' },
    { name: 'Gym Membership', icon: 'Dumbbell', color: '#EF4444', category: 'Fitness' },

    // Reading & Learning
    { name: 'Kindle Unlimited', icon: 'simple-icons:amazon', color: '#FF9900', category: 'Reading' },
    { name: 'Audible', icon: 'simple-icons:audible', color: '#F8991C', category: 'Reading' },
    { name: 'Medium', icon: 'simple-icons:medium', color: '#000000', category: 'Reading' },
    { name: 'Coursera', icon: 'simple-icons:coursera', color: '#0056D2', category: 'Learning' },
    { name: 'Udemy', icon: 'simple-icons:udemy', color: '#A435F0', category: 'Learning' },
    { name: 'Skillshare', icon: 'simple-icons:skillshare', color: '#00FF84', category: 'Learning' },
    { name: 'LinkedIn Premium', icon: 'simple-icons:linkedin', color: '#0A66C2', category: 'Learning' },
    { name: 'Duolingo', icon: 'simple-icons:duolingo', color: '#58CC02', category: 'Learning' },

    // Utilities
    { name: 'Electricity Bill', icon: 'Zap', color: '#F59E0B', category: 'Utility' },
    { name: 'Internet Bill', icon: 'Wifi', color: '#8B5CF6', category: 'Utility' },
    { name: 'Mobile Recharge', icon: 'Smartphone', color: '#10B981', category: 'Utility' },

    // Insurance
    { name: 'Health Insurance', icon: 'Heart', color: '#EF4444', category: 'Insurance' },
    { name: 'Car Insurance', icon: 'Car', color: '#3B82F6', category: 'Insurance' },
    { name: 'Life Insurance', icon: 'Shield', color: '#10B981', category: 'Insurance' },

    // Others
    { name: 'Rent', icon: 'Home', color: '#6366F1', category: 'Housing' },
    { name: 'EMI', icon: 'Banknote', color: '#F59E0B', category: 'Finance' },
    { name: 'SIP', icon: 'TrendingUp', color: '#10B981', category: 'Investment' },
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
