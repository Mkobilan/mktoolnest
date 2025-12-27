import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://mktoolnest.vercel.app'

    // Static routes
    const staticRoutes = [
        '',
        '/blog',
        '/baybolt',
        '/hugloom',
        '/daylabor',
        '/raidmemegen',
        '/admin/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '/blog' ? 'daily' as const : 'daily' as const,
        priority: route === '' ? 1 : (route === '/blog' ? 0.9 : 0.8),
    }))

    // Dynamic blog posts
    const supabase = await createClient()
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, created_at')
        .eq('published', true)

    const blogRoutes = (posts || []).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.created_at),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }))

    return [...staticRoutes, ...blogRoutes]
}
