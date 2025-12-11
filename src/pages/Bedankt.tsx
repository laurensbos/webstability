import { motion } from 'framer-motion'
import { CheckCircle, Clock, Mail, MessageCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Bedankt() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Bedankt voor je aanvraag!
            </h1>
            
            <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
              We hebben je projectaanvraag ontvangen en gaan er direct mee aan de slag. 
              Je ontvangt binnen 24 uur een reactie van ons.
            </p>

            {/* What to expect */}
            <div className="bg-gray-50 rounded-2xl p-8 mb-8 text-left">
              <h2 className="font-semibold text-gray-900 mb-6">Wat kun je verwachten?</h2>
              
              <div className="space-y-4">
                {[
                  {
                    icon: Mail,
                    title: 'Bevestigingsmail',
                    description: 'Je ontvangt direct een bevestiging op het opgegeven e-mailadres.',
                    time: 'Nu'
                  },
                  {
                    icon: Clock,
                    title: 'Persoonlijk contact',
                    description: 'We nemen binnen 24 uur contact met je op om je wensen te bespreken.',
                    time: 'Binnen 24 uur'
                  },
                  {
                    icon: CheckCircle,
                    title: 'Eerste ontwerp',
                    description: 'Na akkoord ontvang je binnen 5 werkdagen het eerste ontwerp.',
                    time: 'Binnen 5 dagen'
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100"
                  >
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <step.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{step.title}</h3>
                        <span className="text-xs text-primary-600 font-medium">{step.time}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick contact */}
            <div className="bg-primary-50 rounded-2xl p-6 mb-8">
              <p className="text-primary-900 font-medium mb-3">
                Kan je niet wachten? Neem direct contact op:
              </p>
              <a
                href="https://wa.me/31644712573?text=Hoi!%20Ik%20heb%20zojuist%20een%20aanvraag%20gedaan%20en%20wil%20graag%20meer%20info."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp ons direct
              </a>
            </div>

            {/* Onboarding hint */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
              <p className="text-amber-900 font-medium mb-2">
                📋 Alvast voorbereiden?
              </p>
              <p className="text-amber-700 text-sm mb-4">
                Bekijk onze onboarding checklist zodat je weet welke materialen we van je nodig hebben.
              </p>
              <Link
                to="/klant-onboarding"
                className="inline-flex items-center gap-2 text-amber-700 font-medium hover:text-amber-800 transition-colors"
              >
                Bekijk checklist
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Back to home */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              Terug naar de homepage
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
