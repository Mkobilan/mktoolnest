import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://mktoolnest.vercel.app'

    // Static routes
    const staticRoutes = [
        '',
        '/baybolt',
        '/hugloom',
        '/daylabor',
        '/raidmemegen',
        '/admin/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
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
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    return [...staticRoutes, ...blogRoutes]
}
