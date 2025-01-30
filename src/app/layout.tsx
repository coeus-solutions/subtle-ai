import { Toaster } from "react-hot-toast"
import "@/styles/globals.css"

export const metadata = {
  title: 'SubtleAI - AI-Powered Video Subtitles',
  description: 'Generate accurate subtitles for your videos using advanced AI technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: {
              style: {
                border: '1px solid #10B981',
                background: '#ECFDF5',
              },
            },
            error: {
              style: {
                border: '1px solid #EF4444',
                background: '#FEF2F2',
              },
            },
          }}
        />
      </body>
    </html>
  )
} 