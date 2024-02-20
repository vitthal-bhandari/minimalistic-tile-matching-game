import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import ReduxProvider from "@/redux/provider";
import './globals.css'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Minimalistic Tile Matching Game',
  description: 'A minimalistic 30-second tile matching game made for fun',
  metadataBase: new URL('https://minimalistic-tile-matching-game.vercel.app'),
  openGraph: {
    title: 'Minimalistic Tile Matching Game',
    description: 'A minimalistic 30-second tile matching game made for fun',
    url: 'https://minimalistic-tile-matching-game.vercel.app/',
    images: '/opengraph-image.jpg',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minimalistic Tile Matching Game',
    description: 'A minimalistic 30-second tile matching game made for fun',
    siteId: '1411180751966543876',
    creator: '@Vit_Bhandari',
    creatorId: '1411180751966543876',
    images: ['https://minimalistic-tile-matching-game.vercel.app/opengraph-image.jpg'], // Must be an absolute URL
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
