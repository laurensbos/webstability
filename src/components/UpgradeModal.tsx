/**
 * Upgrade Modal Component
 * 
 * Shows package upgrade options with features and pricing
 * Used when user clicks on locked features in onboarding
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  X,
  Check,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { PACKAGES, type PackageType } from '../config/packages'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentPackage: PackageType
  projectId: string
  onUpgradeSuccess?: (newPackage: PackageType) => void
}

export default function UpgradeModal({
  isOpen,
  onClose,
  currentPackage,
  projectId,
  onUpgradeSuccess
}: UpgradeModalProps) {
  const { t } = useTranslation()
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get available upgrades (packages above current)
  const packageOrder: PackageType[] = ['starter', 'professional', 'business', 'webshop']
  const currentIndex = packageOrder.indexOf(currentPackage)
  const availableUpgrades = packageOrder
    .slice(currentIndex + 1)
    .filter(pkg => pkg !== 'webshop') // Webshop is a separate product
    .map(pkg => PACKAGES[pkg])

  const currentPkg = PACKAGES[currentPackage]

  const handleSelectPackage = (pkg: PackageType) => {
    setSelectedPackage(pkg)
    setIsConfirming(true)
    setError(null)
  }

  const handleConfirmUpgrade = async () => {
    if (!selectedPackage) return

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch('/api/project-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          newPackage: selectedPackage
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upgrade failed')
      }

      onUpgradeSuccess?.(selectedPackage)
      onClose()
      
      // Reload to apply new package settings
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBack = () => {
    setIsConfirming(false)
    setSelectedPackage(null)
    setError(null)
  }

  if (!isOpen) return null

  const selectedPkgInfo = selectedPackage ? PACKAGES[selectedPackage] : null

  // Calculate price difference
  const priceDiff = selectedPkgInfo 
    ? selectedPkgInfo.price - currentPkg.price 
    : 0
  const setupDiff = selectedPkgInfo 
    ? selectedPkgInfo.setupFee - currentPkg.setupFee 
    : 0

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-gray-800 rounded-2xl shadow-2xl"
        >
          {/* Gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-t-xl" />
          
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isConfirming 
                    ? t('upgrade.confirmTitle', { defaultValue: 'Bevestig je upgrade' })
                    : t('upgrade.title', { defaultValue: 'Upgrade je pakket' })
                  }
                </h2>
                <p className="text-sm text-gray-400">
                  {isConfirming
                    ? t('upgrade.confirmSubtitle', { defaultValue: 'Controleer de details hieronder' })
                    : t('upgrade.subtitle', { defaultValue: 'Krijg toegang tot meer functies' })
                  }
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl border-2 border-gray-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="p-6">
            {!isConfirming ? (
              /* Package Selection */
              <div className="space-y-5">
                {/* Current Package */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-400 font-medium">{t('upgrade.currentPackage', { defaultValue: 'Huidig pakket' })}</span>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-1">
                        <span>{currentPkg.icon}</span>
                        {currentPkg.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">€{currentPkg.price}</span>
                      <span className="text-gray-400">/maand</span>
                    </div>
                  </div>
                </div>

                {/* Available Upgrades */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    {t('upgrade.availableUpgrades', { defaultValue: 'Beschikbare upgrades' })}
                  </h3>
                  
                  {availableUpgrades.map((pkg) => (
                    <motion.button
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg.id)}
                      className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                        pkg.id === 'professional'
                          ? 'bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/50 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20'
                          : 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/50 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{pkg.icon}</span>
                            <h4 className="text-xl font-bold text-white">{pkg.name}</h4>
                            {pkg.id === 'professional' && (
                              <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg shadow-purple-500/30">
                                {t('upgrade.popular', { defaultValue: 'Populair' })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">€{pkg.price}</div>
                          <div className="text-sm text-gray-400">/maand</div>
                          <div className="text-xs text-green-400 mt-1">
                            +€{pkg.price - currentPkg.price}/maand
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2">
                        {pkg.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Check className={`w-4 h-4 flex-shrink-0 ${
                              pkg.id === 'professional' ? 'text-purple-400' : 'text-amber-400'
                            }`} />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center justify-end gap-2 text-sm font-semibold text-white">
                        {t('upgrade.selectPackage', { defaultValue: 'Selecteer pakket' })}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.button>
                  ))}
                </div>

                {availableUpgrades.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {t('upgrade.maxPackage', { defaultValue: 'Je hebt al het hoogste pakket!' })}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {t('upgrade.maxPackageDesc', { defaultValue: 'Je hebt toegang tot alle functies.' })}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Confirmation View */
              <div className="space-y-6">
                {error && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/30 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm text-red-400 font-medium">{error}</p>
                  </div>
                )}

                {/* Upgrade Summary */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{currentPkg.icon}</span>
                      <span className="font-medium text-gray-400">{currentPkg.name}</span>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{selectedPkgInfo?.icon}</span>
                      <span className="font-bold text-white">{selectedPkgInfo?.name}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-white mb-4">
                    {t('upgrade.whatYouGet', { defaultValue: 'Dit krijg je erbij:' })}
                  </h3>
                  
                  <div className="space-y-3">
                    {selectedPkgInfo?.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-gray-700">
                  <h3 className="font-bold text-white mb-4">
                    {t('upgrade.pricingSummary', { defaultValue: 'Prijsoverzicht' })}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-medium">{t('upgrade.monthlyDiff', { defaultValue: 'Maandelijks verschil' })}</span>
                      <span className="font-bold text-white">+€{priceDiff}/maand</span>
                    </div>
                    {setupDiff > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 font-medium">{t('upgrade.oneTimeUpgrade', { defaultValue: 'Eenmalige upgrade kosten' })}</span>
                        <span className="font-bold text-white">€{setupDiff}</span>
                      </div>
                    )}
                    <div className="pt-4 mt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{t('upgrade.newMonthly', { defaultValue: 'Nieuw maandbedrag' })}</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">€{selectedPkgInfo?.price}/maand</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirmation Notice */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">💡</span>
                  </div>
                  <p className="text-sm text-amber-300">
                    <strong>{t('upgrade.note', { defaultValue: 'Let op:' })}</strong>{' '}
                    {t('upgrade.noteText', { 
                      defaultValue: 'Het nieuwe maandbedrag gaat in vanaf je volgende factureringsperiode. Je hebt direct toegang tot alle nieuwe functies.'
                    })}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleBack}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3.5 rounded-xl font-semibold border-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all disabled:opacity-50"
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  >
                    {t('common.back', { defaultValue: 'Terug' })}
                  </motion.button>
                  <motion.button
                    onClick={handleConfirmUpgrade}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('upgrade.processing', { defaultValue: 'Bezig...' })}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        {t('upgrade.confirm', { defaultValue: 'Ja, upgrade mijn pakket' })}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
