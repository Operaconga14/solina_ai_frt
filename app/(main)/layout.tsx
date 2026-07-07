import Footer from '../components/Footer';
import Header from '../components/Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screenflex flex-col">
      {/* Header */}
      <Header />
      <main className="flex-grow">
        <div className="mx-auto">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
