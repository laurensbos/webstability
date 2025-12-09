import { useState } from 'react'
import Logo from './Logo'
import SignupModal from './SignupModal'
import smoothScrollTo from '../lib/smoothScroll'
import { Menu } from 'lucide-react'

export default function Header(){
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)

  function navTo(hash: string){
    const el = document.querySelector(hash)
    if(el){
      smoothScrollTo(el)
    } else {
      // fallback
      window.location.hash = hash
    }
  }

  return (
    <header className="w-full bg-transparent sticky top-0 z-50">
      {/* darker translucent header so gold pops on the page */}
      <div className="backdrop-blur-md bg-black/30 border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden lg:flex items-center gap-6 text-sm">
              <button onClick={()=>navTo('#features')} className="nav-link">Producten</button>
              <button onClick={()=>navTo('#pricing')} className="nav-link">Prijzen</button>
              <button onClick={()=>navTo('#domains')} className="nav-link">Domeinchecker</button>
              <a href="/case-studies" className="nav-link">Succesverhalen</a>
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <a href="#login" className="text-sm text-[var(--muted)] hover:text-[#ffd98a]">Login</a>
            <a href="/deal" className="text-sm px-3 py-1 rounded-md bg-gradient-to-r from-[#fff7e6] to-[#ffd98a] text-black font-semibold">Nieuwjaarsdeal</a>
            <button onClick={()=>setOpen(true)} className="btn-primary">Start nu</button>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            <button onClick={()=>setMenu(!menu)} aria-label="Open menu" className="p-2 rounded-md bg-white/6 text-[var(--brand-dark)]">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>

      {menu && (
        <div className="lg:hidden border-t bg-black/90">
          <div className="px-6 py-4 flex flex-col gap-3">
            <a className="text-[var(--brand-dark)]" href="#features">Producten</a>
            <a className="text-[var(--brand-dark)]" href="#pricing">Prijzen</a>
            <a className="text-[var(--brand-dark)]" href="#domains">Domeinchecker</a>
            <a className="text-[var(--brand-dark)]" href="/case-studies">Succesverhalen</a>
            <button onClick={()=>setOpen(true)} className="btn-primary mt-2">Start nu</button>
          </div>
        </div>
      )}

      <SignupModal open={open} onClose={()=>setOpen(false)} />
    </header>
  )
}
