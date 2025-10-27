// src/utils/cloudinary.ts

import { getCloudinaryCloudName, getCloudinaryUploadPreset } from './env';

export const uploadToCloudinary = async (files: File[]): Promise<string[]> => {
  const uploadPreset = getCloudinaryUploadPreset();
  const cloudName = getCloudinaryCloudName();

  if (!uploadPreset || !cloudName) {
    throw new Error('Cloudinary 환경 변수가 설정되지 않았습니다.');
  }

  const compressedFiles = await Promise.all(
    files.map(file => compressImage(file))
  );

  // 병렬 업로드 - Promise.all 사용
  const uploadPromises = compressedFiles.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary 업로드 실패: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  });

  return await Promise.all(uploadPromises);
};

// 압축 유틸 함수 추가
const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

