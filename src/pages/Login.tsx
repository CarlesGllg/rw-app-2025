
import { Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-ios-gray">
      <header className="py-8 px-6">
        <div className="max-w-sm mx-auto">
          <img
            src="/logo_txt_transp.png"
            alt="Right Way English School"
            className="mx-auto"
          />
          <p className="text-center text-gray-500 mt-1">Portal para Padres</p>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-ios-darkText">{t('auth.welcome')}</h2>
            <p className="text-gray-500 mt-1">
              {t('auth.loginSubtitle')}
            </p>
          </div>
          
          <LoginForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {t('auth.noAccount')}
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>{t('footer.copyright')}</p>
      </footer> 
    </div> 
  ); 
};

export default Login;
