import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '한류봇 - K-Culture AI Assistant',
  description: 'K-팝, K-드라마, 한국 음식, 여행 등 한류 문화 전문 AI 챗봇',
  keywords: '한류, K-팝, K-드라마, 한국문화, AI챗봇, 한국여행, K-뷰티',
  openGraph: {
    title: '한류봇 - K-Culture AI Assistant',
    description: 'K-팝, K-드라마, 한국 음식, 여행 등 한류 문화 전문 AI 챗봇',
    images: '/og-image.jpg',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}