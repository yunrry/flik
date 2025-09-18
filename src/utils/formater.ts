export const formatAddress = (address: string) => {

    if (!address) return '';
    
    // 공백으로 분리
    const parts = address.split(' ');
    if (parts.length < 2) return address;
    
    const sido = parts[0]; // 서울특별시, 부산광역시 등
    const gu = parts[1];   // 구/군/시
    
    // 특별시/광역시/도에서 간단한 이름 추출
    let simpleSido = sido;
    
    // 특별자치도/특별자치시 처리
    if (sido.includes('제주특별자치도')) {
        simpleSido = '제주';
    } else if (sido.includes('전북특별자치도')) {
        simpleSido = '전북';
    } else if (sido.includes('세종특별자치시') || sido.includes('세종시')) {
        simpleSido = '세종';
    }
    // 일반 도 처리
    else if (sido.includes('경상남도')) {
        simpleSido = '경남';
    } else if (sido.includes('경상북도')) {
        simpleSido = '경북';
    } else if (sido.includes('전라북도')) {
        simpleSido = '전북';
    } else if (sido.includes('전라남도')) {
        simpleSido = '전남';
    } else if (sido.includes('충청남도')) {
        simpleSido = '충남';
    } else if (sido.includes('충청북도')) {
        simpleSido = '충북';
    } else if (sido.includes('강원특별자치도')) {
        simpleSido = '강원';
    } else if (sido.includes('강원도')) {
        simpleSido = '강원';
    }
    // 특별시/광역시 처리
    else if (sido.includes('특별시')) {
        simpleSido = sido.replace('특별시', '').trim();
    } else if (sido.includes('광역시')) {
        simpleSido = sido.replace('광역시', '').trim();
    } else if (sido.includes('도')) {
        simpleSido = sido.replace('도', '').trim();
    } else if (sido.includes('시')) {
        simpleSido = sido.replace('시', '').trim();
    }
    
    return `${simpleSido} ${gu}`;
};