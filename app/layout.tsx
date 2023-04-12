import {Nunito} from "next/font/google"

import './globals.scss'

export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb Fullstack Project',
}

const font = Nunito({
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}
