import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { StoreCmsSettings } from '../../types';
import { 
  Sliders, 
  Save, 
  Download, 
  Upload, 
  History, 
  CheckCircle, 
  AlertCircle, 
  FileJson, 
  ShieldCheck, 
  Globe,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const StoreCmsTab: React.FC = () => {
  const { 
    cmsSettings, 
    updateCmsSettings, 
    exportStoreData, 
    restoreStoreData, 
    auditLogs 
  } = useAdmin();

  const [formData, setFormData] = useState<StoreCmsSettings>(cmsSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: keyof StoreCmsSettings, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCmsSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportStoreData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kbyk_store_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = restoreStoreData(content);
        if (result.success) {
          setRestoreMessage({ type: 'success', text: result.message });
          // refresh local state if cms was updated
          try {
            const parsed = JSON.parse(content);
            if (parsed.cmsSettings) setFormData(parsed.cmsSettings);
          } catch {}
        } else {
          setRestoreMessage({ type: 'error', text: result.message });
        }
        setTimeout(() => setRestoreMessage(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-200">
      {/* Header */}
      <div className="bg-[#161B19] p-6 rounded-2xl border border-[#2C3532]">
        <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
          <Sliders className="w-6 h-6 text-emerald-400" />
          Store CMS & Data Continuity
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Customize active storefront copy, thresholds, and manage full-state JSON snapshots.
        </p>
      </div>

      {/* Main CMS Form */}
      <form onSubmit={handleSave} className="bg-[#161B19] p-6 rounded-2xl border border-[#2C3532] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#2C3532]">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-300" />
            Live Customer Storefront Banners & Policies
          </h3>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#145C45] hover:bg-[#196B51] text-white rounded-xl text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4" />
            Save Live Changes
          </button>
        </div>

        {saveSuccess && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Storefront configuration updated successfully and broadcasted to active visitors!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Announcement Bar */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Top Announcement Bar Text
            </label>
            <input
              type="text"
              value={formData.announcementText}
              onChange={(e) => handleInputChange('announcementText', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1D2522] border border-[#2C3532] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Handmade with love • Complimentary bespoke calligraphy on orders over ₹1,499"
            />
            <p className="text-[11px] text-gray-500">Rendered at the very top of all customer-facing pages.</p>
          </div>

          {/* Hero Headline */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Homepage Hero Headline
            </label>
            <input
              type="text"
              value={formData.heroHeadline}
              onChange={(e) => handleInputChange('heroHeadline', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1D2522] border border-[#2C3532] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              placeholder="Gifts that feel like they were made just for them."
            />
          </div>

          {/* Hero Tagline */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Brand Motto / Subtitle
            </label>
            <input
              type="text"
              value={formData.heroTagline}
              onChange={(e) => handleInputChange('heroTagline', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1D2522] border border-[#2C3532] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              placeholder="For moments that deserve to last."
            />
          </div>

          {/* Free Shipping Minimum */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-400" /> Free Shipping Threshold (₹)
            </label>
            <input
              type="number"
              value={formData.freeShippingMinimum}
              onChange={(e) => handleInputChange('freeShippingMinimum', Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#1D2522] border border-[#2C3532] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Standard Lead Time */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Standard Crafting Lead Time (Days)
            </label>
            <input
              type="number"
              value={formData.standardLeadTimeDays}
              onChange={(e) => handleInputChange('standardLeadTimeDays', Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-[#1D2522] border border-[#2C3532] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Return Policy Snippet */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-pink-300" /> Personalised Gifting Return & Damage Policy
            </label>
            <textarea
              rows={3}
              value={formData.returnPolicySnippet}
              onChange={(e) => handleInputChange('returnPolicySnippet', e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1D2522] border border-[#2C3532] rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
            <p className="text-[11px] text-gray-500">Displayed in product specifications, cart drawer, and checkout terms.</p>
          </div>
        </div>
      </form>

      {/* Snapshot Backup & Restore */}
      <div className="bg-[#161B19] p-6 rounded-2xl border border-[#2C3532] space-y-6">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <FileJson className="w-5 h-5 text-emerald-400" />
          Storefront Database Snapshots & Portability
        </h3>
        <p className="text-xs text-gray-400">
          Export your complete studio catalogue, customer enquiries, production queue, and configuration into an offline JSON snapshot.
        </p>

        {restoreMessage && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
              restoreMessage.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-800 text-rose-300'
            }`}
          >
            {restoreMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
            <span>{restoreMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Download Backup */}
          <div className="p-5 rounded-xl bg-[#1D2522] border border-[#2C3532] flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-serif font-bold text-white text-base">Export Full Database</h4>
              <p className="text-xs text-gray-400 mt-1">
                Packages enquiries, live products, artisan QC records, and configuration into a single downloadable .json file.
              </p>
            </div>
            <button
              onClick={handleDownloadBackup}
              className="w-full py-2.5 px-4 bg-[#24302C] hover:bg-[#2C3A35] border border-[#374842] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Download Store JSON Backup
            </button>
          </div>

          {/* Restore Backup */}
          <div className="p-5 rounded-xl bg-[#1D2522] border border-[#2C3532] flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-serif font-bold text-white text-base">Restore From Snapshot</h4>
              <p className="text-xs text-gray-400 mt-1">
                Upload a previous .json backup to rehydrate the entire studio workspace and product catalogue.
              </p>
            </div>
            <label className="w-full py-2.5 px-4 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all">
              <Upload className="w-4 h-4" />
              Upload & Restore Snapshot
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Administrative Audit Log */}
      <div className="bg-[#161B19] p-6 rounded-2xl border border-[#2C3532] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-gray-400" />
            Security & Administrative Audit Trail
          </h3>
          <span className="text-xs text-gray-400 font-mono">{auditLogs.length} events logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#1D2522] text-gray-400 border-b border-[#2C3532]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                <th className="py-2.5 px-3 font-semibold">Actor</th>
                <th className="py-2.5 px-3 font-semibold">Action</th>
                <th className="py-2.5 px-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2C3532]/60">
              {auditLogs.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-[#1D2522]/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-300 whitespace-nowrap">{log.actor}</td>
                  <td className="py-2.5 px-3 font-medium text-white whitespace-nowrap">{log.action}</td>
                  <td className="py-2.5 px-3 text-gray-400 truncate max-w-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
