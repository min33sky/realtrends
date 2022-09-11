import React from 'react';
import Button from './Button';
import Modal from './Modal';

interface Props {
  visible: boolean;
  title: string;
  description: string;
  confirmText?: string;
  onClose: () => void;
  onConfirm: () => void;
  mode?: 'OK' | 'YESNO';
}

export default function Dialog({
  visible,
  title,
  description,
  confirmText,
  onClose,
  onConfirm,
  mode = 'OK',
}: Props) {
  return (
    <Modal visible={visible}>
      <h3 className="mb-2 text-lg font-semibold leading-normal text-gray-800">
        {title}
      </h3>
      <p className="mb-6 whitespace-pre-wrap text-base text-gray-600">
        {description}
      </p>
      <footer className="flex justify-end gap-2">
        {mode === 'YESNO' && (
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        )}
        <Button onClick={onConfirm}>{confirmText ?? '확인'}</Button>
      </footer>
    </Modal>
  );
}
