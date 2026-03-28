export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-oliveGray/20 bg-white/40 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-display text-lg font-bold text-chocolate">The Little Sweetery</p>
            <p className="text-sm text-chocolate/80">Kid-owned treats for sweet celebrations.</p>
          </div>
          
          <div className="flex flex-col items-center gap-2 text-center md:items-end md:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-oliveGray/60">
              Made with joy by
            </p>
            <a 
              href="https://next-gen-sites.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative flex flex-col items-center md:items-end"
            >
              <span className="text-sm font-bold text-lavender transition-colors group-hover:text-accentTeal">
                NextGen Sites
              </span>
              <span className="mt-1 max-w-[200px] text-[10px] leading-tight text-chocolate/60 transition-opacity group-hover:opacity-100 md:opacity-0">
                Go to next-gen-sites.vercel.app to get your FREE site today!
              </span>
              <div className="absolute -bottom-1 h-[2px] w-0 bg-accentTeal transition-all group-hover:w-full" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-oliveGray/10 pt-4 text-center text-[10px] text-oliveGray/40">
          © {new Date().getFullYear()} The Little Sweetery. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
