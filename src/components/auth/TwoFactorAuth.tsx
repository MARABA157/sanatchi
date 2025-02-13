import { useState, useEffect } from 'react';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

export function TwoFactorAuth() {
  const { t } = useTranslation();
  const [secret] = useState(authenticator.generateSecret());
  const [qrCode, setQrCode] = useState('');
  const [code, setCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const otpauth = authenticator.keyuri('user@sanatgalerisi.com', 'Sanat Galerisi', secret);
        const qr = await QRCode.toDataURL(otpauth);
        setQrCode(qr);
      } catch (err) {
        setError('QR kod oluşturulamadı');
      }
    };

    if (!isEnabled) {
      generateQR();
    }
  }, [secret, isEnabled]);

  const verifyCode = () => {
    try {
      const isValid = authenticator.verify({ token: code, secret });
      if (isValid) {
        setIsEnabled(true);
        setError('');
      } else {
        setError(t('auth.invalidCode'));
      }
    } catch (err) {
      setError(t('auth.verificationError'));
    }
  };

  const disable2FA = () => {
    setIsEnabled(false);
    setCode('');
    setError('');
  };

  if (isEnabled) {
    return (
      <div className="space-y-4">
        <div className="text-green-500 font-medium">
          {t('auth.2faEnabled')}
        </div>
        <Button onClick={disable2FA} variant="destructive">
          {t('auth.disable2fa')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">{t('auth.setup2fa')}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {t('auth.scan2faQR')}
        </p>
      </div>

      {qrCode && (
        <div className="flex justify-center">
          <img src={qrCode} alt="2FA QR Code" className="border p-4 rounded-lg" />
        </div>
      )}

      <div className="space-y-4">
        <Input
          type="text"
          placeholder={t('auth.2faCode')}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="text-center text-2xl tracking-wide"
          maxLength={6}
        />

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <Button onClick={verifyCode} className="w-full">
          {t('auth.verify')}
        </Button>
      </div>

      <div className="text-xs text-gray-500">
        <p>{t('auth.backupCode')}: {secret}</p>
        <p className="mt-1">{t('auth.saveBackupCode')}</p>
      </div>
    </div>
  );
}
