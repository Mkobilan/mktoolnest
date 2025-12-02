import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://mktoolnest.com' // Replace with actual domain if different

    // Static routes
    const routes = [
        '',
        '/baybolt',
        '/hugloom',
        '/daylabor',
        '/admin/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return routes
}
