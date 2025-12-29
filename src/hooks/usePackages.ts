import { useTranslation } from 'react-i18next'
import type { Package } from '../data/packages'

// Hook that returns translated packages
export function usePackages() {
  const { t } = useTranslation()

  const packages: Package[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 119,
      priceExcl: 98,
      setupFee: 149,
      tagline: t('packages.starter.tagline'),
      description: t('packages.starter.description'),
      features: [
        t('packages.starter.features.0'),
        t('packages.starter.features.1'),
        t('packages.starter.features.2'),
        t('packages.starter.features.3'),
        t('packages.starter.features.4'),
        t('packages.starter.features.5'),
      ],
      featuresDetailed: [
        {
          category: t('packages.categories.website'),
          items: [
            t('packages.starter.detailed.website.0'),
            t('packages.starter.detailed.website.1'),
            t('packages.starter.detailed.website.2'),
            t('packages.starter.detailed.website.3'),
          ]
        },
        {
          category: t('packages.categories.features'),
          items: [
            t('packages.starter.detailed.features.0'),
            t('packages.starter.detailed.features.1'),
            t('packages.starter.detailed.features.2'),
            t('packages.starter.detailed.features.3'),
            t('packages.starter.detailed.features.4'),
          ]
        },
        {
          category: t('packages.categories.seo'),
          items: [
            t('packages.starter.detailed.seo.0'),
            t('packages.starter.detailed.seo.1'),
            t('packages.starter.detailed.seo.2'),
            t('packages.starter.detailed.seo.3'),
          ]
        },
        {
          category: t('packages.categories.support'),
          items: [
            t('packages.starter.detailed.support.0'),
            t('packages.starter.detailed.support.1'),
            t('packages.starter.detailed.support.2'),
            t('packages.starter.detailed.support.3'),
            t('packages.starter.detailed.support.4'),
          ]
        }
      ],
      deliveryDays: 7,
      popular: false,
      maxPages: 5,
      supportResponseTime: t('packages.responseTime.48hours'),
      revisionsPerMonth: 2,
    },
    {
      id: 'professional',
      name: t('packages.professional.name'),
      price: 169,
      priceExcl: 140,
      setupFee: 199,
      tagline: t('packages.professional.tagline'),
      description: t('packages.professional.description'),
      features: [
        t('packages.professional.features.0'),
        t('packages.professional.features.1'),
        t('packages.professional.features.2'),
        t('packages.professional.features.3'),
        t('packages.professional.features.4'),
        t('packages.professional.features.5'),
      ],
      featuresDetailed: [
        {
          category: t('packages.categories.website'),
          items: [
            t('packages.professional.detailed.website.0'),
            t('packages.professional.detailed.website.1'),
            t('packages.professional.detailed.website.2'),
            t('packages.professional.detailed.website.3'),
            t('packages.professional.detailed.website.4'),
          ]
        },
        {
          category: t('packages.categories.features'),
          items: [
            t('packages.professional.detailed.features.0'),
            t('packages.professional.detailed.features.1'),
            t('packages.professional.detailed.features.2'),
            t('packages.professional.detailed.features.3'),
            t('packages.professional.detailed.features.4'),
            t('packages.professional.detailed.features.5'),
          ]
        },
        {
          category: t('packages.categories.seoAnalytics'),
          items: [
            t('packages.professional.detailed.seoAnalytics.0'),
            t('packages.professional.detailed.seoAnalytics.1'),
            t('packages.professional.detailed.seoAnalytics.2'),
            t('packages.professional.detailed.seoAnalytics.3'),
            t('packages.professional.detailed.seoAnalytics.4'),
            t('packages.professional.detailed.seoAnalytics.5'),
          ]
        },
        {
          category: t('packages.categories.support'),
          items: [
            t('packages.professional.detailed.support.0'),
            t('packages.professional.detailed.support.1'),
            t('packages.professional.detailed.support.2'),
            t('packages.professional.detailed.support.3'),
            t('packages.professional.detailed.support.4'),
          ]
        }
      ],
      deliveryDays: 10,
      popular: true,
      maxPages: 10,
      supportResponseTime: t('packages.responseTime.24hours'),
      revisionsPerMonth: 'unlimited',
    },
    {
      id: 'business',
      name: 'Business',
      price: 249,
      priceExcl: 206,
      setupFee: 299,
      tagline: t('packages.business.tagline'),
      description: t('packages.business.description'),
      features: [
        t('packages.business.features.0'),
        t('packages.business.features.1'),
        t('packages.business.features.2'),
        t('packages.business.features.3'),
        t('packages.business.features.4'),
        t('packages.business.features.5'),
      ],
      featuresDetailed: [
        {
          category: t('packages.categories.website'),
          items: [
            t('packages.business.detailed.website.0'),
            t('packages.business.detailed.website.1'),
            t('packages.business.detailed.website.2'),
            t('packages.business.detailed.website.3'),
            t('packages.business.detailed.website.4'),
          ]
        },
        {
          category: t('packages.categories.features'),
          items: [
            t('packages.business.detailed.features.0'),
            t('packages.business.detailed.features.1'),
            t('packages.business.detailed.features.2'),
            t('packages.business.detailed.features.3'),
            t('packages.business.detailed.features.4'),
            t('packages.business.detailed.features.5'),
            t('packages.business.detailed.features.6'),
          ]
        },
        {
          category: t('packages.categories.integrations'),
          items: [
            t('packages.business.detailed.integrations.0'),
            t('packages.business.detailed.integrations.1'),
            t('packages.business.detailed.integrations.2'),
            t('packages.business.detailed.integrations.3'),
            t('packages.business.detailed.integrations.4'),
            t('packages.business.detailed.integrations.5'),
          ]
        },
        {
          category: t('packages.categories.support'),
          items: [
            t('packages.business.detailed.support.0'),
            t('packages.business.detailed.support.1'),
            t('packages.business.detailed.support.2'),
            t('packages.business.detailed.support.3'),
            t('packages.business.detailed.support.4'),
            t('packages.business.detailed.support.5'),
          ]
        }
      ],
      deliveryDays: 14,
      popular: false,
      maxPages: 20,
      supportResponseTime: t('packages.responseTime.4hours'),
      revisionsPerMonth: 'unlimited',
    },
  ]

  const webshopPackages: Package[] = [
    {
      id: 'webshop-starter',
      name: 'Starter',
      price: 399,
      priceExcl: 330,
      setupFee: 299,
      tagline: t('webshopPackages.starter.tagline'),
      description: t('webshopPackages.starter.description'),
      features: [
        t('webshopPackages.starter.features.0'),
        t('webshopPackages.starter.features.1'),
        t('webshopPackages.starter.features.2'),
        t('webshopPackages.starter.features.3'),
        t('webshopPackages.starter.features.4'),
        t('webshopPackages.starter.features.5'),
      ],
      featuresDetailed: [
        {
          category: t('webshopPackages.categories.webshop'),
          items: [
            t('webshopPackages.starter.detailed.webshop.0'),
            t('webshopPackages.starter.detailed.webshop.1'),
            t('webshopPackages.starter.detailed.webshop.2'),
            t('webshopPackages.starter.detailed.webshop.3'),
            t('webshopPackages.starter.detailed.webshop.4'),
          ]
        },
        {
          category: t('webshopPackages.categories.payments'),
          items: [
            t('webshopPackages.starter.detailed.payments.0'),
            t('webshopPackages.starter.detailed.payments.1'),
            t('webshopPackages.starter.detailed.payments.2'),
            t('webshopPackages.starter.detailed.payments.3'),
            t('webshopPackages.starter.detailed.payments.4'),
            t('webshopPackages.starter.detailed.payments.5'),
          ]
        },
        {
          category: t('webshopPackages.categories.shipping'),
          items: [
            t('webshopPackages.starter.detailed.shipping.0'),
            t('webshopPackages.starter.detailed.shipping.1'),
            t('webshopPackages.starter.detailed.shipping.2'),
            t('webshopPackages.starter.detailed.shipping.3'),
          ]
        },
        {
          category: t('webshopPackages.categories.management'),
          items: [
            t('webshopPackages.starter.detailed.management.0'),
            t('webshopPackages.starter.detailed.management.1'),
            t('webshopPackages.starter.detailed.management.2'),
            t('webshopPackages.starter.detailed.management.3'),
            t('webshopPackages.starter.detailed.management.4'),
          ]
        }
      ],
      deliveryDays: 14,
      popular: false,
      maxPages: 'unlimited',
      supportResponseTime: t('packages.responseTime.48hours'),
      revisionsPerMonth: 2,
    },
    {
      id: 'webshop-professional',
      name: t('packages.professional.name'),
      price: 499,
      priceExcl: 413,
      setupFee: 399,
      tagline: t('webshopPackages.professional.tagline'),
      description: t('webshopPackages.professional.description'),
      features: [
        t('webshopPackages.professional.features.0'),
        t('webshopPackages.professional.features.1'),
        t('webshopPackages.professional.features.2'),
        t('webshopPackages.professional.features.3'),
        t('webshopPackages.professional.features.4'),
        t('webshopPackages.professional.features.5'),
      ],
      featuresDetailed: [
        {
          category: t('webshopPackages.categories.webshop'),
          items: [
            t('webshopPackages.professional.detailed.webshop.0'),
            t('webshopPackages.professional.detailed.webshop.1'),
            t('webshopPackages.professional.detailed.webshop.2'),
            t('webshopPackages.professional.detailed.webshop.3'),
            t('webshopPackages.professional.detailed.webshop.4'),
            t('webshopPackages.professional.detailed.webshop.5'),
          ]
        },
        {
          category: t('webshopPackages.categories.payments'),
          items: [
            t('webshopPackages.professional.detailed.payments.0'),
            t('webshopPackages.professional.detailed.payments.1'),
            t('webshopPackages.professional.detailed.payments.2'),
            t('webshopPackages.professional.detailed.payments.3'),
            t('webshopPackages.professional.detailed.payments.4'),
            t('webshopPackages.professional.detailed.payments.5'),
          ]
        },
        {
          category: t('webshopPackages.categories.shippingLogistics'),
          items: [
            t('webshopPackages.professional.detailed.shippingLogistics.0'),
            t('webshopPackages.professional.detailed.shippingLogistics.1'),
            t('webshopPackages.professional.detailed.shippingLogistics.2'),
            t('webshopPackages.professional.detailed.shippingLogistics.3'),
            t('webshopPackages.professional.detailed.shippingLogistics.4'),
            t('webshopPackages.professional.detailed.shippingLogistics.5'),
          ]
        },
        {
          category: t('webshopPackages.categories.marketing'),
          items: [
            t('webshopPackages.professional.detailed.marketing.0'),
            t('webshopPackages.professional.detailed.marketing.1'),
            t('webshopPackages.professional.detailed.marketing.2'),
            t('webshopPackages.professional.detailed.marketing.3'),
            t('webshopPackages.professional.detailed.marketing.4'),
            t('webshopPackages.professional.detailed.marketing.5'),
          ]
        },
        {
          category: t('webshopPackages.categories.managementIntegrations'),
          items: [
            t('webshopPackages.professional.detailed.managementIntegrations.0'),
            t('webshopPackages.professional.detailed.managementIntegrations.1'),
            t('webshopPackages.professional.detailed.managementIntegrations.2'),
            t('webshopPackages.professional.detailed.managementIntegrations.3'),
            t('webshopPackages.professional.detailed.managementIntegrations.4'),
          ]
        }
      ],
      deliveryDays: 21,
      popular: true,
      maxPages: 'unlimited',
      supportResponseTime: t('packages.responseTime.24hours'),
      revisionsPerMonth: 'unlimited',
    },
    {
      id: 'webshop-business',
      name: 'Business',
      price: 699,
      priceExcl: 578,
      setupFee: 549,
      tagline: t('webshopPackages.business.tagline'),
      description: t('webshopPackages.business.description'),
      features: [
        t('webshopPackages.business.features.0'),
        t('webshopPackages.business.features.1'),
        t('webshopPackages.business.features.2'),
        t('webshopPackages.business.features.3'),
        t('webshopPackages.business.features.4'),
        t('webshopPackages.business.features.5'),
      ],
      featuresDetailed: [
        {
          category: t('webshopPackages.categories.webshop'),
          items: [
            t('webshopPackages.business.detailed.webshop.0'),
            t('webshopPackages.business.detailed.webshop.1'),
            t('webshopPackages.business.detailed.webshop.2'),
            t('webshopPackages.business.detailed.webshop.3'),
            t('webshopPackages.business.detailed.webshop.4'),
            t('webshopPackages.business.detailed.webshop.5'),
          ]
        },
        {
          category: t('webshopPackages.categories.b2b'),
          items: [
            t('webshopPackages.business.detailed.b2b.0'),
            t('webshopPackages.business.detailed.b2b.1'),
            t('webshopPackages.business.detailed.b2b.2'),
            t('webshopPackages.business.detailed.b2b.3'),
            t('webshopPackages.business.detailed.b2b.4'),
            t('webshopPackages.business.detailed.b2b.5'),
          ]
        },
        {
          category: t('webshopPackages.categories.shippingFulfilment'),
          items: [
            t('webshopPackages.business.detailed.shippingFulfilment.0'),
            t('webshopPackages.business.detailed.shippingFulfilment.1'),
            t('webshopPackages.business.detailed.shippingFulfilment.2'),
            t('webshopPackages.business.detailed.shippingFulfilment.3'),
            t('webshopPackages.business.detailed.shippingFulfilment.4'),
            t('webshopPackages.business.detailed.shippingFulfilment.5'),
          ]
        },
        {
          category: t('webshopPackages.categories.analytics'),
          items: [
            t('webshopPackages.business.detailed.analytics.0'),
            t('webshopPackages.business.detailed.analytics.1'),
            t('webshopPackages.business.detailed.analytics.2'),
            t('webshopPackages.business.detailed.analytics.3'),
            t('webshopPackages.business.detailed.analytics.4'),
          ]
        },
        {
          category: t('webshopPackages.categories.integrationsApi'),
          items: [
            t('webshopPackages.business.detailed.integrationsApi.0'),
            t('webshopPackages.business.detailed.integrationsApi.1'),
            t('webshopPackages.business.detailed.integrationsApi.2'),
            t('webshopPackages.business.detailed.integrationsApi.3'),
            t('webshopPackages.business.detailed.integrationsApi.4'),
            t('webshopPackages.business.detailed.integrationsApi.5'),
          ]
        },
        {
          category: t('packages.categories.support'),
          items: [
            t('webshopPackages.business.detailed.support.0'),
            t('webshopPackages.business.detailed.support.1'),
            t('webshopPackages.business.detailed.support.2'),
            t('webshopPackages.business.detailed.support.3'),
            t('webshopPackages.business.detailed.support.4'),
            t('webshopPackages.business.detailed.support.5'),
          ]
        }
      ],
      deliveryDays: 28,
      popular: false,
      maxPages: 'unlimited',
      supportResponseTime: t('packages.responseTime.4hours'),
      revisionsPerMonth: 'unlimited',
    },
  ]

  const includedFeatures = [
    t('packages.included.hosting'),
    t('packages.included.domain'),
    t('packages.included.maintenance'),
    t('packages.included.support'),
    t('packages.included.monthlyChanges'),
    t('packages.included.seo'),
  ]

  const trustBadges = [
    t('packages.trust.noHiddenCosts'),
    t('packages.trust.monthlyCancellable'),
    t('packages.trust.moneyBack'),
  ]

  const getDeliveryText = (days: number): string => {
    if (days <= 7) return t('packages.delivery.withinDays', { days })
    return t('packages.delivery.withinWeeks', { weeks: Math.ceil(days / 7) })
  }

  return {
    packages,
    webshopPackages,
    includedFeatures,
    trustBadges,
    getDeliveryText,
  }
}
