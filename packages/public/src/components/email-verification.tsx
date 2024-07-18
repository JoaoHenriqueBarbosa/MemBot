import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleVerifyEmail } from '@/utils/auth';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const EmailVerification: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      if (token) {
        const result = await handleVerifyEmail(token);
        setVerificationStatus(result.message);
      } else {
        setVerificationStatus('invalidVerificationLink');
      }
      setIsVerifying(false);
    };

    verifyEmail();
  }, [location, t]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">{t('emailVerification')}</h2>
        {isVerifying ? (
          <p>{t('verifyingEmail')}</p>
        ) : (
          <>
            <p className="mb-4">{t(verificationStatus)}</p>
            <Button onClick={() => navigate('/auth')}>{t('backToLogin')}</Button>
          </>
        )}
      </Card>
    </div>
  );
};
