import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://mktoolnest.vercel.app'

    // Topic routes
    const topics = ['baybolt', 'hugloom', 'daylabor', 'raidmemegen', 'hubplate']
    const topicRoutes = topics.map(topic => ({
        url: `${baseUrl}/${topic}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // Static routes
    const staticRoutes = [
        '',
        '/blog',
        '/admin/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '/blog' ? 'daily' as const : 'weekly' as const,
        priority: route === '' ? 1 : (route === '/blog' ? 0.9 : 0.6),
    }))

    // Dynamic blog posts
    const supabase = await createClient()
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, created_at, updated_at')
        .eq('published', true)

    const blogRoutes = (posts || []).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(post.created_at),
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }))

    return [...staticRoutes, ...topicRoutes, ...blogRoutes]
}

