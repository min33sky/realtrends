import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useState } from 'react';
import WriteIntroForm from '~/components/write/WriteIntroForm';
import WriteLinkForm from '~/components/write/WriteLinkForm';
import { checkIsLoggedIn } from '~/lib/protectRoute';

export const loader: LoaderFunction = async ({ request }) => {
  ///? 클라이언트에서 대신 서버에서 인증 관련 리다이렉트 처리하기
  const isLoggedIn = await checkIsLoggedIn(request);
  if (!isLoggedIn) return redirect('/login?next=/write');
  return null;
};

type Step = 'link' | 'intro';

export default function Write() {
  const [step, setStep] = useState<Step>('link');

  const stepRenderers = {
    link: () => <WriteLinkForm onProceed={() => setStep('intro')} />,
    intro: () => <WriteIntroForm />,
  };

  return stepRenderers[step]();
}
