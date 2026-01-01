import type { Metadata } from 'next';
import { OpsHeader } from '@/components/ops/OpsHeader';

export const metadata: Metadata = {
  title: 'Ops Console | キッズお出かけ情報',
  description: '運用管理画面',
  robots: 'noindex, nofollow',
};

export default function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <OpsHeader />
      <div className="flex">
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
