import './globals.css';

export const metadata = { title: 'Panel Blumy' };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
