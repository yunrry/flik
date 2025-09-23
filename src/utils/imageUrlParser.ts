export const parseImageUrls = (
    imageUrlsInput: string | string[] | null | undefined
  ): string[] => {
    try {
      // 1. 값이 없으면 빈 배열
      if (!imageUrlsInput) return [];
  
      // 2. 이미 배열일 경우
      if (Array.isArray(imageUrlsInput)) {
        const allUrls: string[] = [];
        
        imageUrlsInput.forEach(item => {
          if (!item || typeof item !== 'string') return;
          
          const trimmed = item.trim();
          if (!trimmed) return;
          
          // 각 배열 요소가 JSON 문자열일 가능성 체크
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              allUrls.push(...parsed.filter(url => url && url.trim()));
            } else if (typeof parsed === 'string' && parsed.trim()) {
              allUrls.push(parsed.trim());
            }
          } catch {
            // JSON이 아닌 경우 - 부분적 JSON이나 일반 문자열 처리
            if (trimmed.startsWith('["') || trimmed.startsWith('[\'')) {
              // 부분적 JSON 배열 시작
              let combined = trimmed;
              
              // 다음 요소들과 결합하여 완전한 JSON 만들기
              for (let i = imageUrlsInput.indexOf(item) + 1; i < imageUrlsInput.length; i++) {
                const nextItem = imageUrlsInput[i];
                if (typeof nextItem === 'string') {
                  combined += ',' + nextItem.trim();
                  if (nextItem.trim().endsWith('"]') || nextItem.trim().endsWith('\']')) {
                    break;
                  }
                }
              }
              
              try {
                const parsed = JSON.parse(combined);
                if (Array.isArray(parsed)) {
                  allUrls.push(...parsed.filter(url => url && url.trim()));
                }
              } catch {
                // 여전히 실패하면 콤마로 분할해서 처리
                allUrls.push(...trimmed.split(',').map(url => 
                  url.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, '')
                ).filter(url => url && url.startsWith('http')));
              }
            } else if (trimmed.includes(',')) {
              // 콤마로 구분된 URL들
              allUrls.push(...trimmed.split(',').map(url => url.trim()).filter(url => url));
            } else {
              // 단일 URL
              allUrls.push(trimmed);
            }
          }
        });
        
        return allUrls.filter(url => url && url.trim() !== '');
      }
  
      // 3. 문자열인 경우
      if (typeof imageUrlsInput === 'string') {
        const trimmed = imageUrlsInput.trim();
        
        // JSON 배열 문자열 시도
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return parsed.filter(url => url && url.trim() !== '');
          }
        } catch {
          // JSON 파싱 실패 시 다른 방법들 시도
          
          // 콤마로 구분된 URL들
          if (trimmed.includes(',')) {
            return trimmed
              .split(',')
              .map(url => url.trim().replace(/^["'\[\]]+|["'\[\]]+$/g, ''))
              .filter(url => url && url.startsWith('http'));
          }
          
          // 단일 URL
          if (trimmed.startsWith('http')) {
            return [trimmed];
          }
        }
      }
  
      return [];
    } catch (error) {
      console.warn('이미지 URL 파싱 실패:', error, imageUrlsInput);
      return [];
    }
  };
  