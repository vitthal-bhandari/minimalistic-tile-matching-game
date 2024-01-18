'use client'
import Image from 'next/image'
import TileGrid from '../components/tile';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <TileGrid/>
    </main>
  )
}
