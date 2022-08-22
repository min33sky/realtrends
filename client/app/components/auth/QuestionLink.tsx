import { Link } from '@remix-run/react';

interface Props {
  question: string;
  name: string;
  to: string;
}

export default function QuestionLink({ name, question, to }: Props) {
  return (
    <p>
      {question}{' '}
      <Link to={to} className="font-bold underline underline-offset-4">
        {name}
      </Link>
    </p>
  );
}
