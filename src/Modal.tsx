import React from 'react';
import './Modal.css'; // 确保你有相应的 CSS 文件

interface ModalProps {
  message: string; // 定义 message 的类型为 string
  onClose: () => void; // 定义 onClose 的类型为函数
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Transaction Successful</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;