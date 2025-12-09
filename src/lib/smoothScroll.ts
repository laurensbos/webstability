export function easeInOutCubic(t:number){
  return t<0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2
}

export default function smoothScrollTo(selectorOrEl: string | Element, duration = 650, offset = 0){
  const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl
  if(!el) return
  const header = document.querySelector('header')
  const headerHeight = header ? (header.clientHeight || 0) : 0
  const startY = window.scrollY
  const targetRect = (el as Element).getBoundingClientRect()
  const targetY = startY + targetRect.top - (offset || headerHeight + 12)
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
  const destination = Math.min(targetY, maxScroll)
  const startTime = performance.now()

  function step(now:number){
    const elapsed = Math.min(1, (now - startTime) / duration)
    const eased = easeInOutCubic(elapsed)
    window.scrollTo(0, Math.round(startY + (destination - startY) * eased))
    if(elapsed < 1){
      requestAnimationFrame(step)
    } else {
      // focus for accessibility
      try{ (el as Element).setAttribute('tabindex','-1'); (el as HTMLElement).focus(); }catch(e){}
    }
  }

  requestAnimationFrame(step)
}

export function smoothScroll(selectorOrEl: string | Element, duration = 650, offset = 0){
  return smoothScrollTo(selectorOrEl, duration, offset)
}
