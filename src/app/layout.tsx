import { Toaster } from "@/components/ui/toaster"
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
        <Toaster />
      </body>
    </html>
  )
} 