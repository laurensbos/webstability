import { useSearchParams } from 'react-router-dom'
import DroneOnboarding from '../components/DroneOnboarding'

export default function DroneStarten() {
  const [searchParams] = useSearchParams()
  const pakket = searchParams.get('pakket') as 'basis' | 'professional' | 'premium' | null

  return (
    <DroneOnboarding 
      isStandalone={true}
      initialPackage={pakket || 'professional'}
    />
  )
}
