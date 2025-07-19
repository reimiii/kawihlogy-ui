import React from "react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: React.ReactNode;
  confirmButtonText?: string;
  onConfirm?: () => void;
  isPending?: boolean;
  hideConfirm?: boolean;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmButtonText = "Confirm",
  onConfirm,
  isPending = false,
  hideConfirm = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d2021]/80 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl bg-[#d5c4a1] border-4 border-[#3c3836] shadow-[12px_12px_0_0_#282828] max-h-[80vh] flex flex-col">
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <h2 className="text-2xl font-black uppercase text-[#cc241d] tracking-wide">
            {title}
          </h2>
          <div className="text-sm text-[#3c3836] font-mono space-y-2">
            {message}
          </div>
        </div>

        <div className="flex border-t-4 border-[#3c3836]">
          <button
            onClick={onClose}
            disabled={isPending}
            className={`w-full p-4 text-[#3c3836] font-bold uppercase tracking-wider ${
              hideConfirm ? "" : "border-r-4"
            } border-[#3c3836] bg-[#fbf1c7] hover:bg-[#ebdbb2] disabled:opacity-50`}
          >
            Close
          </button>
          {!hideConfirm && (
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="w-full p-4 text-[#fbf1c7] font-bold uppercase tracking-wider bg-[#cc241d] hover:bg-[#9d0006] disabled:opacity-50"
            >
              {isPending ? "Processing..." : confirmButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
