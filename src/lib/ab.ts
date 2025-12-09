// Simple client-side A/B testing helper
// - stores assignment in localStorage
// - returns 'default' or 'alt'

export function getVariant(experiment = 'hero_v1'){
  try{
    const key = `ab_${experiment}`
    const existing = localStorage.getItem(key)
    if(existing) return existing
    const pick = Math.random() < 0.5 ? 'default' : 'alt'
    localStorage.setItem(key, pick)
    return pick
  }catch(e){
    return 'default'
  }
}
