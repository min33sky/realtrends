import Button from './Button';
import Modal from './Modal';

interface Props {
  visible: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
  mode?: 'OK' | 'YESNO';
}

/**
 * Main Dialog
 * @description 화면 중앙에 Modal을 띄워주는 컴포넌트
 */
export default function Dialog({
  visible,
  title,
  description,
  confirmText,
  cancelText,
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
            {cancelText ?? '닫기'}
          </Button>
        )}
        <Button onClick={onConfirm}>{confirmText ?? '확인'}</Button>
      </footer>
    </Modal>
  );
}
