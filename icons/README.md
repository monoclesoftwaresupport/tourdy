# 투어디 아이콘 (M8 더블 링) — 포인트 색 14종

설정의 포인트 색마다 폴더가 하나씩 있습니다.

각 폴더 구성
- toury-icon-<색>.svg : 원본 벡터
- icon-1024.png : 스토어·고해상도용
- icon-512.png / icon-192.png : PWA manifest용 (maskable로도 사용 가능)
- apple-touch-icon.png (180) : iOS 홈 화면용
- icon-32.png / icon-16.png / favicon.ico : 브라우저 탭용

## 색 규칙
- 바깥 링 = 포인트 색
- 안쪽 링 = 포인트 색에 흰색을 45% 섞은 밝은 색 (코드에서 자동 계산 가능)
- 배경 = #0E1526, 비행기 = 흰색

| 포인트 색 | 폴더 | 바깥 링 | 안쪽 링 |
|---|---|---|---|
| 파랑 | blue/ | #3B86FC | #93BCFD |
| 주황 | orange/ | #F4682A | #F9AC8A |
| 빨강 | red/ | #F2393B | #F89293 |
| 코랄 | coral/ | #FF6954 | #FFACA1 |
| 노랑 | yellow/ | #F3B800 | #F8D873 |
| 라임 | lime/ | #8CC825 | #C0E187 |
| 초록 | green/ | #0FB85C | #7BD8A5 |
| 청록 | teal/ | #19B4A6 | #80D6CE |
| 하늘 | sky/ | #17A7F0 | #7FCFF7 |
| 남색 | navy/ | #4C45EC | #9D99F5 |
| 보라 | purple/ | #8E5DFF | #C1A6FF |
| 마젠타 | magenta/ | #E726BA | #F288D9 |
| 분홍 | pink/ | #FE7FBD | #FEB9DB |
| 갈색 | brown/ | #B8732F | #D8B28D |

같은 값이 colors.json에도 들어 있습니다.

## manifest.json 예시 (기본 파랑)
```json
"icons": [
  { "src": "/icons/blue/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
  { "src": "/icons/blue/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
],
"background_color": "#0E1526",
"theme_color": "#0E1526"
```

홈 화면 아이콘은 manifest에 고정되므로 기본 파랑을 쓰고,
앱 안의 로고와 favicon만 포인트 색에 맞춰 바꾸는 방식을 권장합니다.
favicon은 JS로 `<link rel="icon">`의 href를 해당 색 폴더 경로로 바꾸면 됩니다.
