import Link from 'next/link'
import { BriefcaseIcon} from "lucide-react"
import { Button } from './ui/button'
import { useTranslation } from '../hooks/useTranslation';

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        <BriefcaseIcon className="w-8 h-8 text-primary" />
        <span className="text-2xl font-bold text-primary">JobPostPro</span>
      </div>
      <nav className="hidden md:flex space-x-4">
        <Link href="/" className="text-gray-600 hover:text-primary">{t('home')}</Link>
        <Link href="/jobs" className="text-gray-600 hover:text-primary">{t('Offres')}</Link>
        <Link href="#features" className="text-gray-600 hover:text-primary">{t('features')}</Link>
        <Link href="/pricing" className="text-gray-600 hover:text-primary">{t('pricing')}</Link>
        <Link href="#contact" className="text-gray-600 hover:text-primary">{t('contact')}</Link>
      </nav>
      <div className="flex items-center space-x-4">
        <Button asChild>
          <Link href="/sign-up">{t('signUp')}</Link>
        </Button>
      </div>
    </header>
  )
}