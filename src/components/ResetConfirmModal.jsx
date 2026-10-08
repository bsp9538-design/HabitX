import React, { useState } from 'react';
import { AlertTriangle, X, Trash2, RotateCcw } from 'lucide-react';

export default function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmWord, // if provided, user must type this to confirm
  confirmButtonText = 'Confirm Reset',
  isDestructive = true,
}) {
  const [typedInput, setTypedInput] = useState('');

  if (!isOpen) return null;

  const requiresTyping = Boolean(confirmWord);
  const isMatch = !requiresTyping || typedInput.trim().toUpperCase() === confirmWord.toUpperCase();

  const handleConfirm = () => {
    if (isMatch) {
      onConfirm();
      setTypedInput('');
      onClose();
    }
  };

  const handleClose = () => {
    setTypedInput('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <div style={{ display: 'flex', alignItem: 'center', gap: '8px' }}>
            <AlertTriangle size={24} color={isDestructive ? 'var(--coral)' : 'var(--yellow)'} />
            <h3 className="modal-title">{title}</h3>
          </div>
          <button
            type="button"
            className="btn-icon btn-secondary"
            onClick={handleClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
          {message}
        </p>

        {requiresTyping && (
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-typed-input">
              Type <strong style={{ color: 'var(--coral)' }}>{confirmWord}</strong> to confirm:
            </label>
            <input
              id="confirm-typed-input"
              type="text"
              className="form-input"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={confirmWord}
              autoFocus
            />
          </div>
        )}

        <div className="modal-footer-actions">
          <button type="button" className="btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="button"
            className={isDestructive ? 'btn-destructive' : 'btn-primary'}
            disabled={!isMatch}
            onClick={handleConfirm}
          >
            {isDestructive ? <Trash2 size={16} /> : <RotateCcw size={16} />}
            <span>{confirmButtonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
