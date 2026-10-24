import React, { useState } from 'react';
import { 
  Rocket, 
  Download, 
  Copy, 
  Check, 
  HelpCircle, 
  GitBranch, 
  FileCode, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { generateSingleFileHtml } from '../utils/singleFileHtmlGenerator';
import { DayItinerary, LootItem, ChecklistItem, CardPromotion } from '../types/travel';

interface DeployAndExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: DayItinerary[];
  lootItems: LootItem[];
  checklist: ChecklistItem[];
  cards: CardPromotion[];
  exchangeRate: number;
}

export const DeployAndExportModal: React.FC<DeployAndExportModalProps> = ({
  isOpen,
  onClose,
  itinerary,
  lootItems,
  checklist,
  cards,
  exchangeRate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'nojekyll' | 'netlify'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const githubWorkflowCode = `name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # 直接部署儲存庫根目錄 (包含 index.html 與 .nojekyll)
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const netlifyTomlCode = `[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer"
`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadSingleFile = () => {
    const htmlContent = generateSingleFileHtml(
      itinerary,
      lootItems,
      checklist,
      cards,
      exchangeRate
    );
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadNoJekyll = () => {
    const blob = new Blob([''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.nojekyll';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWorkflow = () => {
    const blob = new Blob([githubWorkflowCode], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deploy.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadNetlifyToml = () => {
    const blob = new Blob([netlifyTomlCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'netlify.toml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-[#E8E2D9] overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-6 bg-[#FAF7F2] border-b border-[#E8E2D9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#231F1E] text-white">
              <Rocket className="w-5 h-5 text-[#FDE68A]" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#231F1E]">
                自動化部署 (CI/CD) 與單檔手冊匯出中心
              </h2>
              <p className="text-xs text-[#6E655F]">
                一鍵匯出最新資料之獨立 index.html、解決 Jekyll 報錯並配置 GitHub Actions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-[#9CA3AF] hover:text-[#231F1E] font-bold text-sm cursor-pointer shadow-xs"
          >
            ✕
          </button>
        </div>

        {/* Quick Download Buttons Strip */}
        <div className="p-6 bg-gradient-to-r from-[#FEF3C7]/40 via-white to-[#FAF7F2] border-b border-[#E8E2D9]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider">
                📦 即刻下載部署套件
              </span>
              <p className="text-xs text-[#4B5563] mt-0.5">
                包含當前所有已編輯的行程、最新 15kg 行李計算數值與已勾選狀態。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadSingleFile}
                className="flex items-center gap-1.5 bg-[#D97706] hover:bg-[#B45309] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>下載 index.html (單檔手冊)</span>
              </button>

              <button
                onClick={handleDownloadNoJekyll}
                className="flex items-center gap-1.5 bg-white border border-[#E8E2D9] hover:bg-[#FAF7F2] text-[#231F1E] px-3 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#6E655F]" />
                <span>下載 .nojekyll</span>
              </button>

              <button
                onClick={handleDownloadWorkflow}
                className="flex items-center gap-1.5 bg-white border border-[#E8E2D9] hover:bg-[#FAF7F2] text-[#231F1E] px-3 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#6E655F]" />
                <span>下載 deploy.yml</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-[#E8E2D9] bg-white overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#D97706] text-[#D97706]'
                : 'border-transparent text-[#6E655F] hover:text-[#231F1E]'
            }`}
          >
            📋 Jekyll 報錯原因與修復教學
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'actions'
                ? 'border-[#D97706] text-[#D97706]'
                : 'border-transparent text-[#6E655F] hover:text-[#231F1E]'
            }`}
          >
            ⚡ GitHub Actions (.github/workflows/deploy.yml)
          </button>

          <button
            onClick={() => setActiveTab('nojekyll')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'nojekyll'
                ? 'border-[#D97706] text-[#D97706]'
                : 'border-transparent text-[#6E655F] hover:text-[#231F1E]'
            }`}
          >
            🛡️ 根目錄 .nojekyll 防護
          </button>

          <button
            onClick={() => setActiveTab('netlify')}
            className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'netlify'
                ? 'border-[#D97706] text-[#D97706]'
                : 'border-transparent text-[#6E655F] hover:text-[#231F1E]'
            }`}
          >
            🌐 Netlify 自動發布方案
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto text-xs space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D9]">
                <h4 className="font-bold text-sm text-[#231F1E] flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>先前 Jekyll 發生錯誤的核心原因</span>
                </h4>
                <p className="text-[#4B5563] leading-relaxed">
                  GitHub Pages 預設會啟動 Ruby 驅動的 <strong>Jekyll 編譯器</strong>。當專案設定讀取 <code className="bg-[#EBE5DB] px-1 rounded font-mono">/docs</code> 資料夾，但裡面缺少 Jekyll 設定、或含有底線檔名、或使用了單一 HTML 檔案時，Jekyll 會誤將內容當成範本解析，造成 <span className="text-rose-600 font-mono font-bold">Build Failed / Jekyll error</span>。
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E8E2D9] space-y-3">
                <h4 className="font-bold text-sm text-[#231F1E] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>推薦的三種解決與自動化方案：</span>
                </h4>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#F0EAE1]">
                    <strong className="block text-[#231F1E] mb-1">
                      方案 A（最推薦 · GitHub Actions 自動化）
                    </strong>
                    <p className="text-[#4B5563]">
                      在 GitHub 儲存庫建立 <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8E2D9] font-mono">.github/workflows/deploy.yml</code>。在儲存庫的 <strong>Settings ➔ Pages ➔ Source</strong> 選擇 <strong>「GitHub Actions」</strong>。每次推送 main 分支時，GitHub 會直接上傳靜態檔並發布，完全跳過 Jekyll！
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#F0EAE1]">
                    <strong className="block text-[#231F1E] mb-1">
                      方案 B（最純粹 · 根目錄 + .nojekyll）
                    </strong>
                    <p className="text-[#4B5563]">
                      將 <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8E2D9] font-mono">index.html</code> 與一個空的 <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8E2D9] font-mono">.nojekyll</code> 檔案直接放在儲存庫最外層根目錄 <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8E2D9] font-mono">/</code>。在 Pages 設定選擇 <strong>Deploy from a branch ➔ / (root)</strong>，.nojekyll 會強制關閉 Jekyll 引擎。
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#F0EAE1]">
                    <strong className="block text-[#231F1E] mb-1">
                      方案 C（零配置 · Netlify 連動）
                    </strong>
                    <p className="text-[#4B5563]">
                      登入 Netlify 點選「Import from Git」，選取您的 GitHub 儲存庫。Publish directory 設定為 <code className="bg-white px-1.5 py-0.5 rounded border border-[#E8E2D9] font-mono">.</code>，Netlify 會在每次 Git Push 時自動秒速部署，還提供免費自訂網域與 SSL。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#6E655F]">
                  將以下內容儲存於儲存庫的 <code className="font-mono text-[#D97706]">.github/workflows/deploy.yml</code>
                </span>
                <button
                  onClick={() => handleCopy(githubWorkflowCode, 'workflow')}
                  className="flex items-center gap-1 text-[#231F1E] hover:text-[#D97706] font-semibold cursor-pointer"
                >
                  {copiedKey === 'workflow' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">已複製！</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>複製 YAML</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-[#1E293B] text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed">
                {githubWorkflowCode}
              </pre>

              <div className="p-3 bg-[#FEF3C7] text-[#92400E] rounded-xl border border-[#FDE68A]">
                💡 <strong>重要設定步驟</strong>：請至 GitHub 儲存庫 ➔ 點擊上方 <strong>Settings</strong> ➔ 點擊左側 <strong>Pages</strong> ➔ 將 <strong>Build and deployment Source</strong> 由原本的「Deploy from a branch」改選為 <strong>「GitHub Actions」</strong> 即可！
              </div>
            </div>
          )}

          {activeTab === 'nojekyll' && (
            <div className="space-y-3">
              <p className="text-[#4B5563]">
                <code className="font-mono text-[#D97706]">.nojekyll</code> 是一個空檔案，它的作用是明確告訴 GitHub Pages 的構建伺服器：「請完全停用 Jekyll 編譯器，直接將目錄下的靜態檔案原樣發布」。
              </p>

              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E2D9]">
                <strong className="block text-[#231F1E] mb-2 font-bold">
                  終端機指令（若習慣使用 Git 命令列）：
                </strong>
                <pre className="bg-[#1E293B] text-slate-200 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                  {`# 在儲存庫根目錄建立 .nojekyll 並提交
touch .nojekyll
git add .nojekyll
git commit -m "chore: bypass jekyll build on github pages"
git push origin main`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'netlify' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#6E655F]">
                  若使用 Netlify，可在根目錄放置 <code className="font-mono text-[#D97706]">netlify.toml</code> 設定安全標頭：
                </span>
                <button
                  onClick={() => handleCopy(netlifyTomlCode, 'netlify')}
                  className="flex items-center gap-1 text-[#231F1E] hover:text-[#D97706] font-semibold cursor-pointer"
                >
                  {copiedKey === 'netlify' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">已複製！</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>複製 TOML</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-[#1E293B] text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed">
                {netlifyTomlCode}
              </pre>

              <p className="text-[#4B5563]">
                Netlify 免費方案支援全球 CDN 加速、即時預覽分支 (Deploy Previews) 與自訂網域，是 GitHub Pages 的絕佳平替方案。
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E8E2D9] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#231F1E] text-white text-xs font-semibold hover:bg-[#3D3734] cursor-pointer"
          >
            關閉面板
          </button>
        </div>
      </div>
    </div>
  );
};
