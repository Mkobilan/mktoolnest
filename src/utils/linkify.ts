/**
 * Utility to convert raw URLs in a string to clickable HTML links.
 */
export function linkify(text: string): string {
    // URL regex that handles http, https, and www
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    
    return text.replace(urlRegex, (url) => {
        let href = url;
        if (!url.startsWith('http')) {
            href = `https://${url}`;
        }
        
        // Remove trailing punctuation from the URL but keep it in the text
        const lastChar = url[url.length - 1];
        if (['.', ',', '!', '?', ')'].includes(lastChar)) {
            const cleanUrl = url.slice(0, -1);
            const cleanHref = href.slice(0, -1);
            return `<a href="${cleanHref}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${cleanUrl}</a>${lastChar}`;
        }
        
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${url}</a>`;
    });
}
