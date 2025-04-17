
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type VerifyCodeProps = {
  email: string;
};

const VerifyCode = ({ email }: VerifyCodeProps) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft === 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast.error("El código debe tener 6 dígitos");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate verification process
    // In a real app, this would call an API to verify the code
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, any 6-digit code will work
      if (code.length === 6) {
        // Store some mock user data - in a real app this would come from backend
        localStorage.setItem("user", JSON.stringify({
          id: "1",
          name: "María González",
          email: email,
          role: "parent",
          children: [
            { name: "Ana González", grade: "4º Primaria" },
          ]
        }));
        toast.success("Acceso exitoso");
        navigate("/dashboard");
      } else {
        toast.error("Código inválido. Inténtalo de nuevo.");
      }
    }, 1500);
  };

  const resendCode = () => {
    setTimeLeft(60);
    toast.success("Nuevo código enviado a " + email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="text-sm text-center mb-4">
          Hemos enviado un código de verificación a 
          <span className="font-medium"> {email}</span>
        </div>
        
        <Input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
          className="ios-input text-center text-2xl tracking-widest h-16"
          placeholder="······"
          maxLength={6}
          inputMode="numeric"
          required
        />
        
        <div className="text-center mt-2">
          <span className="text-sm text-gray-500">
            {timeLeft > 0 ? (
              <>Reenviar en {timeLeft}s</>
            ) : (
              <button
                type="button" 
                onClick={resendCode}
                className="text-ios-blue hover:underline"
              >
                Reenviar código
              </button>
            )}
          </span>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="ios-button w-full"
        disabled={isLoading || code.length !== 6}
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          "Verificar"
        )}
      </Button>
    </form>
  );
};

export default VerifyCode;
