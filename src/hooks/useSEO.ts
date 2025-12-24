import { useEffect } from 'react'

interface SEOOptions {
  title: string
  description?: string
  noindex?: boolean
}

/**
 * Custom hook for setting SEO meta tags
 * @param options - SEO options including title and description
 */
export function useSEO({ title, description, noindex = false }: SEOOptions) {
  useEffect(() => {
    // Set document title
    const fullTitle = title.includes('Webstability') 
      ? title 
      : `${title} | Webstability`
    document.title = fullTitle

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', description)

      // Update OG description
      let ogDescription = document.querySelector('meta[property="og:description"]')
      if (!ogDescription) {
        ogDescription = document.createElement('meta')
        ogDescription.setAttribute('property', 'og:description')
        document.head.appendChild(ogDescription)
      }
      ogDescription.setAttribute('content', description)
    }

    // Update OG title
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', fullTitle)

    // Handle noindex
    let robotsMeta = document.querySelector('meta[name="robots"]')
    if (noindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta')
        robotsMeta.setAttribute('name', 'robots')
        document.head.appendChild(robotsMeta)
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow')
    } else if (robotsMeta) {
      // Remove noindex if it was set and we want to index now
      robotsMeta.setAttribute('content', 'index, follow')
    }

    // Cleanup
    return () => {
      // Reset to default title on unmount if needed
    }
  }, [title, description, noindex])
}

export default useSEO
