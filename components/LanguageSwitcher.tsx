import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      variant="outline"
      size="sm"
    >
      {language === 'en' ? 'FR' : 'EN'}
    </Button>
  );
};