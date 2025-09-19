// src/utils/cloudinary.ts

import { getCloudinaryCloudName, getCloudinaryUploadPreset } from './env';

export const uploadToCloudinary = async (files: File[]): Promise<string[]> => {
    const uploadPreset = getCloudinaryUploadPreset(); // Cloudinary 설정
    const cloudName = getCloudinaryCloudName();
  
    if (!uploadPreset || !cloudName) {
      throw new Error('Cloudinary 환경 변수가 설정되지 않았습니다.');
    }
  
    const uploadedUrls: string[] = [];
  
    for (const file of files) {
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
      uploadedUrls.push(data.secure_url); // Cloudinary가 반환하는 public URL
    }
  
    return uploadedUrls;
  };
  