import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Shield, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import ApiService from '../services/api.js'

function PasswordProtection({ onAuthenticated }) {
  const [password, setPassword] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeLeft, setBlockTimeLeft] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isBlocked) {
      setError(`تم حظر الوصول لمدة ${Math.ceil(blockTimeLeft / 60)} دقائق`)
      return
    }

    try {
      const response = await ApiService.authenticate(password);
      if (response.success) {
        setError('');
        setAttempts(0);
        onAuthenticated();
      } else {
        // كلمة مرور خاطئة
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          // حظر لمدة 5 دقائق
          setIsBlocked(true);
          setBlockTimeLeft(300); // 5 دقائق بالثواني
          setError('تم تجاوز الحد الأقصى للمحاولات. تم حظر الوصول لمدة 5 دقائق');
          
          // عداد تنازلي للحظر
          const blockTimer = setInterval(() => {
            setBlockTimeLeft(prev => {
              if (prev <= 1) {
                clearInterval(blockTimer);
                setIsBlocked(false);
                setAttempts(0);
                setError('');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setError(`كلمة مرور خاطئة. المحاولات المتبقية: ${3 - newAttempts}`);
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('حدث خطأ أثناء التحقق من كلمة المرور. يرجى المحاولة مرة أخرى.');
    }
    
    setPassword('');
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* الرأس */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
            منطقة محظورة
          </h1>
          <p className="text-gray-300">يتطلب تصريح أمني للدخول</p>
        </div>

        {/* نموذج كلمة المرور */}
        <Card className="bg-gray-900/90 border-red-600/50 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 justify-center">
              <Lock className="w-5 h-5 text-red-400" />
              لوحة التحكم الآمنة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-400 pr-12"
                  disabled={isBlocked}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  disabled={isBlocked}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-600 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className={`w-full font-bold py-3 text-lg rounded-xl shadow-lg transition-all ${
                  isBlocked 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700'
                }`}
                disabled={isBlocked}
              >
                {isBlocked ? 'محظور' : 'دخول آمن'}
              </Button>
            </form>

            {/* معلومات الأمان */}
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-semibold">تحذير أمني</span>
              </div>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• الوصول مقيد للمصرح لهم فقط</li>
                <li>• يتم تسجيل جميع محاولات الدخول</li>
                <li>• الحد الأقصى: 3 محاولات خاطئة</li>
                <li>• الحظر التلقائي: 5 دقائق</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* معلومات إضافية */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            نظام حماية متقدم • مشفر بتقنية AES-256
          </p>
        </div>
      </div>
    </div>
  )
}

export default PasswordProtection


