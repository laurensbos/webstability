import { useEffect, useState } from 'react'
import { MessageSquare } from 'lucide-react'

export default function StickyCTA({ text = 'Vraag demo aan' }:{ text?: string }){
  const [visible, setVisible] = useState(false)
  useEffect(()=>{
    const onScroll = ()=> setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  return (
    <div aria-hidden={!visible} className={`fixed right-6 bottom-6 z-50 transition-all ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <a href="#contact" className="inline-flex items-center gap-3 shadow-2xl px-4 py-3 rounded-full bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-400)] text-white font-semibold"><MessageSquare size={16} /> {text}</a>
    </div>
  )
}
