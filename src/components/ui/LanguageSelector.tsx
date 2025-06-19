
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    {
      code: 'es',
      name: 'Español',
      icon: '/esp_icon.png',
    },
    {
      code: 'ca',
      name: 'Català',
      icon: '/cat_icon.png',
    },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <img 
            src={currentLanguage.icon} 
            alt={currentLanguage.name}
            className="w-5 h-5 object-contain"
          />
          <Flag size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img 
              src={language.icon} 
              alt={language.name}
              className="w-5 h-5 object-contain"
            />
            <span>{language.name}</span>
            {i18n.language === language.code && (
              <span className="ml-auto text-ios-blue">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
