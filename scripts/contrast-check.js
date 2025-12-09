// Simple WCAG contrast checker and token adjuster
// Usage: node contrast-check.js

function hexToRgb(hex){
  hex=hex.replace('#','')
  if(hex.length===3) hex=hex.split('').map(c=>c+c).join('')
  const bigint = parseInt(hex,16)
  return [(bigint>>16)&255,(bigint>>8)&255, bigint&255]
}
function srgbToLin(c){c/=255; return c<=0.03928? c/12.92 : Math.pow((c+0.055)/1.055,2.4)}
function luminance(hex){const [r,g,b]=hexToRgb(hex); return 0.2126*srgbToLin(r)+0.7152*srgbToLin(g)+0.0722*srgbToLin(b)}
function contrast(hex1,hex2){const L1=luminance(hex1); const L2=luminance(hex2); const lighter=Math.max(L1,L2); const darker=Math.min(L1,L2); return +( (lighter+0.05)/(darker+0.05) ).toFixed(2) }

function rgbToHex([r,g,b]){return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('')}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

function lightenHex(hex,percent){ // percent 0..1
  const [r,g,b]=hexToRgb(hex)
  const nr=Math.round(r + (255-r)*percent)
  const ng=Math.round(g + (255-g)*percent)
  const nb=Math.round(b + (255-b)*percent)
  return rgbToHex([nr,ng,nb])
}
function darkenHex(hex,percent){
  const [r,g,b]=hexToRgb(hex)
  const nr=Math.round(r*(1-percent))
  const ng=Math.round(g*(1-percent))
  const nb=Math.round(b*(1-percent))
  return rgbToHex([nr,ng,nb])
}

const tokens = {
  '--text':'#0b1220',
  '--surface':'#ffffff',
  '--muted':'#64748b',
  '--brand-500':'#6d28d9',
  '--accent-blue':'#2e93f3',
  '--accent-gold':'#ffd98a',
  '--campaign-text':'#fff7ea'
}

const checks = [
  {name:'text on surface','fg':tokens['--text'],'bg':tokens['--surface'], 'min':7},
  {name:'muted on surface','fg':tokens['--muted'],'bg':tokens['--surface'], 'min':4.5},
  {name:'brand on white (button background)','fg':'#ffffff','bg':tokens['--brand-500'], 'min':4.5},
  {name:'accent-blue on white','fg':'#ffffff','bg':tokens['--accent-blue'], 'min':4.5},
  {name:'gold on dark campaign (approx)','fg':tokens['--campaign-text'],'bg':'#0b0a0f','min':4.5}
]

console.log('Running contrast checks for selected token pairs...\n')

function findAdjustment(fg,bg,minRatio){
  let current = contrast(fg,bg)
  if(current>=minRatio) return {ok:true,ratio:current}
  // try darkening fg (if fg is dark text on light bg) or lightening fg if fg is light on dark bg
  const fgLum = luminance(fg)
  const bgLum = luminance(bg)
  const fgIsLighter = fgLum>bgLum
  // try 20 steps
  for(let i=1;i<=20;i++){
    const pct = i*0.05
    const candidate = fgIsLighter ? darkenHex(fg,pct) : lightenHex(fg,pct)
    const r = contrast(candidate,bg)
    if(r>=minRatio) return {ok:true,ratio:r, candidate, pct}
  }
  // try the opposite direction as fallback
  for(let i=1;i<=20;i++){
    const pct = i*0.05
    const candidate = fgIsLighter ? lightenHex(fg,pct) : darkenHex(fg,pct)
    const r = contrast(candidate,bg)
    if(r>=minRatio) return {ok:true,ratio:r, candidate, pct}
  }
  return {ok:false,ratio:current}
}

checks.forEach(c=>{
  const r = contrast(c.fg,c.bg)
  process.stdout.write(`${c.name}: ${c.fg} on ${c.bg} — contrast ${r}:1 `)
  if(r >= c.min) console.log('(✓ meets target ' + c.min + ')')
  else {
    console.log(`(✗ target ${c.min})`)
    const adj = findAdjustment(c.fg,c.bg,c.min)
    if(adj.ok){
      console.log(`  Proposed adjustment -> ${adj.candidate} achieves ${adj.ratio}:1 (step ${Math.round(adj.pct*100)}%)`)
    } else {
      console.log('  Could not find simple adjustment within 100% shift. Consider changing both foreground and background tokens.')
    }
  }
})

console.log('\nSuggested token updates (conservative):')
// Based on quick heuristics, propose new --muted darker and ensure brand-500 darker for white text
const mutedAdj = findAdjustment(tokens['--muted'], tokens['--surface'], 4.5)
if(mutedAdj.ok && mutedAdj.candidate) console.log(`--muted: ${tokens['--muted']} -> ${mutedAdj.candidate}  // improves contrast to ${mutedAdj.ratio}:1`)
else console.log('--muted: keep or adjust manually')
const brandAdj = findAdjustment('#ffffff', tokens['--brand-500'], 4.5)
if(!brandAdj.ok && brandAdj.candidate) console.log(`--brand-500: ${tokens['--brand-500']} -> ${brandAdj.candidate}  // darker to reach ${brandAdj.ratio}:1 with white text`)
else if(brandAdj.ok) console.log('--brand-500: OK for white text')
else console.log('--brand-500: review')

// Extra: test several candidate replacements for --accent-blue to reach contrast >=4.5 with white text
const accentCandidates = ['#1b6fb3','#1760a0','#155fa8','#0f4a83','#0e4f86']
console.log('\nTesting candidate replacements for --accent-blue (white text on bg):')
accentCandidates.forEach(c=>{
  const r = contrast('#ffffff', c)
  console.log(`${c} -> contrast with white: ${r}:1 ${r>=4.5 ? '(✓)' : '(✗)'}`)
})

console.log('\nDone.')
