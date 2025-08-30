/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'screen-mobile': ['100vh', '100dvh'],
        'nav-dynamic': 'calc(4rem + env(safe-area-inset-bottom))',
        'flik-card': 'calc(100vh - 8rem - env(safe-area-inset-bottom))', // 헤더+위치선택+네비 제외
        'flik-card-full': 'calc(100vh - 5rem - 3rem - 4rem - env(safe-area-inset-bottom))',
      },
      minHeight: {
        'screen-mobile': ['100vh', '100dvh'],
        'nav-min': '5rem',
        'flik-card': '400px',
      },
      maxHeight: {
        'nav-max': '7rem',
          'flik-card': 'calc(100vh - 12rem - env(safe-area-inset-bottom))',
      },
      padding: {
        'safe-bottom': 'max(env(safe-area-inset-bottom), 1.25rem)',
        'nav-dynamic': 'calc(4rem + max(env(safe-area-inset-bottom), 1.25rem))',
      },
      screens: {
        'xs': '375px', // iPhone mini 크기 추가
        'sm': '390px'
      },
      colors: {
        // Main 컬러 팔레트
        'main': {
          1: '#FF6B35',  // Main/1
        },
        'gray': {
          1: '#111111',   // Gray/1 - 가장 진한 회색
          3: '#333333',   // Gray/3
          5: '#555555',   // Gray/5
          6: '#979797',   // Gray/6
          7: '#D9D9D9',   // Gray/7
          8: '#EDEDED',   // Gray/8
          9: '#A2A2A2',   // Gray/9
          10: '#F2F3F5',  // Gray/10 - 가장 연한 회색
        },
      },
      fontSize: {
        // SemiBold styles
        'sb1': ['12px', { lineHeight: '24px', letterSpacing: '-3%' }],
        'sb2': ['14px', { lineHeight: '24px', letterSpacing: '-3%' }],
        'sb3': ['20px', { lineHeight: '24px', letterSpacing: '-3%' }],
        'sb4': ['22px', { lineHeight: '24px', letterSpacing: '-3%' }],
        'sb5': ['14px', { lineHeight: '24px', letterSpacing: '8%' }],
        'sb6': ['16px', { lineHeight: '24px', letterSpacing: '-1%' }],
        
        // Medium styles  
        'm1': ['12px', { lineHeight: '24px', letterSpacing: '-3%' }],
        'm2': ['14px', { lineHeight: '24px', letterSpacing: '-3%' }],
        'm3': ['16px', { lineHeight: '24px', letterSpacing: '-3%' }],
        'm4': ['10px', { lineHeight: '12px', letterSpacing: '0%' }],
        
        // Regular styles
        'r1': ['12px', { lineHeight: '24px', letterSpacing: '-3%' }],
        'r2': ['14px', { lineHeight: '24px', letterSpacing: '0%' }],
        'r3': ['14px', { lineHeight: '24px', letterSpacing: '-3%' }],
        'r4': ['14px', { lineHeight: '20px', letterSpacing: '0%' }],
        'r5': ['10px', { lineHeight: '12px', letterSpacing: '-3%' }],
        'r6': ['10px', { lineHeight: '12px', letterSpacing: '0%' }],
        'r7': ['12px', { lineHeight: '20px', letterSpacing: '0%' }],
      },
      fontWeight: {
        'semibold': 600,
        'medium': 500,
        'regular': 400,
      },
      
    },
  },
  plugins: [],
}
