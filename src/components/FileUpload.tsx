import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FILE_UPLOAD_CONFIG } from '../utils/constants';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  currentFile?: File | string;
  accept?: readonly string[];
  maxSize?: number;
  label: string;
  required?: boolean;
  showCamera?: boolean;
}

export function FileUpload({
  onFileSelect,
  currentFile,
  accept = FILE_UPLOAD_CONFIG.acceptedTypes.image,
  maxSize = FILE_UPLOAD_CONFIG.maxSize,
  label,
  required = false,
  showCamera = true,
}: FileUploadProps) {
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string>('');

  // 파일 드롭 처리
  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`파일 크기는 ${maxSize / (1024 * 1024)}MB 이하여야 합니다.`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('지원되지 않는 파일 형식입니다.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileSelect(file);
      
      // 이미지 미리보기 생성
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    maxFiles: 1,
  });

  // 카메라 촬영 처리
  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // 후면 카메라 사용
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onFileSelect(file);
        
        // 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  // 파일 삭제
  const handleRemoveFile = () => {
    setPreview('');
    setError('');
    // 빈 파일 객체 전달 (실제로는 null을 전달하고 싶지만 타입 때문에 임시)
  };

  // 현재 파일이 있는지 확인
  const hasFile = currentFile || preview;

  return (
    <div className="file-upload">
      <label className="file-upload-label">
        {label}
        {required && <span className="required">*</span>}
      </label>

      {!hasFile ? (
        <div className="upload-area">
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="upload-content">
              <div className="upload-icon">📁</div>
              <div className="upload-text">
                {isDragActive ? (
                  <p>파일을 여기에 놓으세요</p>
                ) : (
                  <>
                    <p>파일을 드래그하거나 클릭하여 선택하세요</p>
                    <p className="upload-hint">
                      JPG, PNG, PDF 파일 (최대 {maxSize / (1024 * 1024)}MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {showCamera && (
            <div className="camera-section">
              <button
                type="button"
                onClick={handleCameraCapture}
                className="camera-button"
              >
                📷 사진 촬영
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="file-preview">
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="미리보기" />
            </div>
          )}
          
          {typeof currentFile === 'string' && !preview && (
            <div className="file-info">
              <span>📎 파일이 첨부되었습니다</span>
            </div>
          )}

          <div className="file-actions">
            <button
              type="button"
              onClick={handleRemoveFile}
              className="remove-button"
            >
              삭제
            </button>
            <button
              type="button"
              onClick={() => {
                const element = document.querySelector('.dropzone') as HTMLElement;
                element?.click();
              }}
              className="change-button"
            >
              변경
            </button>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
