import { MfaFactor } from '@logto/schemas';
import { useCallback, useMemo, useState } from 'react';

import { type ErrorHandlers } from '@/hooks/use-error-handler';
import useSendMfaPayload from '@/hooks/use-send-mfa-payload';
import { type UserMfaFlow } from '@/types';

const useTotpCodeVerification = (errorCallback?: () => void) => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const sendMfaPayload = useSendMfaPayload();

  const invalidCodeErrorHandlers: ErrorHandlers = useMemo(
    () => ({
      'session.mfa.invalid_totp_code': (error) => {
        setErrorMessage(error.message);
      },
    }),
    []
  );

  const onSubmit = useCallback(
    async (
      code: string,
      payload:
        | { flow: UserMfaFlow.MfaBinding; verificationId: string }
        | { flow: UserMfaFlow.MfaVerification }
    ) => {
      await sendMfaPayload(
        { payload: { type: MfaFactor.TOTP, code }, ...payload },
        invalidCodeErrorHandlers,
        errorCallback
      );
    },
    [errorCallback, invalidCodeErrorHandlers, sendMfaPayload]
  );

  return {
    errorMessage,
    onSubmit,
  };
};

export default useTotpCodeVerification;
