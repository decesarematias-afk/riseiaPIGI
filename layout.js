export const metadata = {
  title: 'Rise IA — P.I.G.I. | Plataforma Integral de Gestión Inteligente',
  description: 'Automatizá tu negocio con IA. Chatbot WhatsApp, asistente de voz, CRM y NFC. Por Rise IA, una empresa de AION-8 Ventures.',
  openGraph: {
    title: 'Rise IA — Automatización con IA para tu negocio',
    description: 'Chatbot WhatsApp, asistente de voz IA, CRM inteligente y tarjetas NFC. Planes desde USD $97/mes.',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#0a0e1a',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
