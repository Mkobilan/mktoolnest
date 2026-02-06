"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

type HeroSetting = {
    key: string;
    label: string;
    value: string;
};

const heroSettings: { key: string; label: string }[] = [
    { key: 'hero_home', label: 'Home Page' },
    { key: 'hero_hubplate', label: 'HubPlate' },
    { key: 'hero_hangroom', label: 'Hangroom' },
    { key: 'hero_baybolt', label: 'Baybolt' },
    { key: 'hero_hugloom', label: 'HugLoom' },
    { key: 'hero_daylabor', label: 'Day Labor' },
    { key: 'hero_raidmemegen', label: 'Raid Generator' },
];

export default function HeroSettings() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        checkAuth();
        loadSettings();
    }, []);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/admin/login");
        } else {
            setUser(user);
        }
    };

    const loadSettings = async () => {
        const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .in("setting_key", heroSettings.map(s => s.key));

        if (data) {
            const settingsMap: Record<string, string> = {};
            data.forEach((row: any) => {
                settingsMap[row.setting_key] = row.setting_value || '';
            });
            setSettings(settingsMap);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);

        for (const [key, value] of Object.entries(settings)) {
            await supabase
                .from("site_settings")
                .upsert({
                    setting_key: key,
                    setting_value: value,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'setting_key'
                });
        }

        setSaving(false);
        alert("Settings saved successfully!");
    };

    const updateSetting = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4">
            <div className="container max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/admin/dashboard")}
                            className="p-2 rounded-lg hover:bg-slate-800 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">Hero Image Settings</h1>
                            <p className="text-gray-400">Configure hero images for each app section</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save All"}
                    </button>
                </div>

                {/* Settings Grid */}
                <div className="space-y-6">
                    {heroSettings.map((setting) => (
                        <div key={setting.key} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <div className="flex items-start gap-6">
                                {/* Preview */}
                                <div className="w-48 h-28 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                                    {settings[setting.key] ? (
                                        <img
                                            src={settings[setting.key]}
                                            alt={setting.label}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                </div>

                                {/* Input */}
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-white mb-2">
                                        {setting.label} Hero Image
                                    </label>
                                    <input
                                        type="url"
                                        value={settings[setting.key] || ''}
                                        onChange={(e) => updateSetting(setting.key, e.target.value)}
                                        placeholder="https://example.com/hero-image.jpg"
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Recommended size: 1920x600px or similar wide aspect ratio
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-900/20 border border-blue-800/50 rounded-xl p-6">
                    <h3 className="text-blue-400 font-semibold mb-2">💡 Note</h3>
                    <p className="text-gray-400 text-sm">
                        Hero images appear at the top of each app's blog section. For best results, use high-quality
                        images with a wide aspect ratio. You can use Unsplash, Pexels, or your own hosted images.
                    </p>
                </div>
            </div>
        </div>
    );
}
