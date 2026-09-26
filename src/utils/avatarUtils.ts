/**
 * Utility functions for user avatars: Google Account initials, Emoji Persons, and Custom Image Upload.
 * Eliminates all generic stock photos.
 */

export interface EmojiPersonOption {
  id: string;
  emoji: string;
  label: string;
  bg: string;
}

export const EMOJI_PERSONS: EmojiPersonOption[] = [
  { id: 'man_biz', emoji: '👨‍💼', label: 'Businessman', bg: '#0F2942' },
  { id: 'woman_biz', emoji: '👩‍💼', label: 'Businesswoman', bg: '#2D1B4E' },
  { id: 'dev', emoji: '🧑‍💻', label: 'Engineer / Tech', bg: '#0A3A40' },
  { id: 'grad', emoji: '👩‍🎓', label: 'Student / Graduate', bg: '#3B1A28' },
  { id: 'sci', emoji: '👨‍🔬', label: 'Scientist', bg: '#133529' },
  { id: 'hijab', emoji: '🧕', label: 'Woman in Hijab', bg: '#2A1C3E' },
  { id: 'beard', emoji: '🧔', label: 'Bearded', bg: '#362A14' },
  { id: 'woman', emoji: '👩', label: 'Woman', bg: '#3D1D30' },
  { id: 'man', emoji: '👨', label: 'Man', bg: '#1E293B' },
  { id: 'person', emoji: '🧑', label: 'Person', bg: '#1A2E35' },
  { id: 'vip', emoji: '👑', label: 'Executive', bg: '#3B2F08' },
  { id: 'star', emoji: '✨', label: 'Star', bg: '#1E1B4B' },
];

/**
 * Generates an authentic Google-styled material avatar with the user's initial.
 */
export function generateGoogleAvatar(name: string = 'User', email: string = ''): string {
  const cleanName = name.trim() || email.split('@')[0] || 'U';
  const initial = cleanName.charAt(0).toUpperCase();
  
  // Google signature palette
  const colors = ['#1A73E8', '#EA4335', '#FBBC04', '#34A853', '#8430CE', '#FA7B17'];
  const charCode = (cleanName.charCodeAt(0) + (cleanName.charCodeAt(1) || 0)) % colors.length;
  const bg = colors[charCode];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <circle cx="60" cy="60" r="60" fill="${bg}"/>
    <text x="60" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="52" font-weight="600" fill="#FFFFFF" text-anchor="middle">${initial}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Generates an SVG data URL for a person emoji on a modern dark container.
 */
export function generateEmojiAvatar(emoji: string, bg: string = '#1E293B'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <circle cx="60" cy="60" r="60" fill="${bg}"/>
    <text x="60" y="76" font-size="58" font-family="'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif" text-anchor="middle">${emoji}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Resize and compress uploaded user image to a compact base64 data URL.
 */
export function processUploadedImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const size = 160;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          // Center crop to square
          const minDim = Math.min(img.width, img.height);
          const sx = (img.width - minDim) / 2;
          const sy = (img.height - minDim) / 2;
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } catch {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
