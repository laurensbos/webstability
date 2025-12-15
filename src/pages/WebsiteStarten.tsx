import WebsiteOnboarding from '../components/WebsiteOnboarding'
import { useSearchParams } from 'react-router-dom'

export default function WebsiteStarten() {
  const [searchParams] = useSearchParams()
  const pakket = searchParams.get('pakket') as 'starter' | 'professional' | 'business' | null
  
  return <WebsiteOnboarding isStandalone={true} initialPackage={pakket || 'professional'} />
}
