import Link from "next/link";
import { Atom } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-900/50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Atom className="h-6 w-6 text-cyan-400" />
              <span className="text-lg font-bold text-gradient tracking-tight">
                MatInformatics
              </span>
            </Link>
            <p className="text-white/60 mb-6 max-w-sm">
              Discover, analyze, compare, and predict the best materials using our advanced Artificial Intelligence platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/40 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="text-white/40 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
              </a>
              <a href="#" className="text-white/40 hover:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link href="/materials" className="text-white/60 hover:text-cyan-400 text-sm transition-colors">Materials Database</Link></li>
              <li><Link href="/chat" className="text-white/60 hover:text-cyan-400 text-sm transition-colors">AI Assistant</Link></li>
              <li><Link href="/upload" className="text-white/60 hover:text-cyan-400 text-sm transition-colors">PDF Extraction</Link></li>
              <li><Link href="/dashboard" className="text-white/60 hover:text-cyan-400 text-sm transition-colors">Comparison Tool</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} MatInformatics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
