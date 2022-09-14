import React from 'react';
import Button from '../system/Button';

interface Props {
  description?: string;
  children: React.ReactNode;
  buttonText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function WriteFormTemplate({
  description,
  children,
  buttonText,
  onSubmit,
}: Props) {
  return (
    <form
      className="flex flex-1 flex-col  pt-4 pl-4 pr-4 pb-6"
      onSubmit={onSubmit}
    >
      {description && (
        <h3 className="mt-0 mb-4 text-lg leading-normal text-gray-800 ">
          {description}
        </h3>
      )}

      <section className="flex flex-1 flex-col ">{children}</section>

      <Button type="submit" layoutMode="fullWidth">
        {buttonText}
      </Button>
    </form>
  );
}
