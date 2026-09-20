# Base on Hope

https://fpsbaseonhope.github.io/Base-on-Hope/

## 사진 넣기
- **파운더 사진**: `images/founders/` 에 `suhyun.jpg`, `gyumin.jpg`, `minseo.jpg` 이름으로 올리면 자동 적용 (정사각형 추천). 사진이 없으면 이니셜 원이 대신 보임.
- **갤러리**: `images/gallery/` 에 사진 올리고 `gallery.html` 의 `<figure>` 블록 하나 복사해서 `src`, 설명만 바꾸기.
- **프로젝트 사진**: `images/projects/` 에 올리고 `projects.html` 에서 해당 프로젝트의 `.project-photos` 안에 `<img src="...">` 추가.
- 사진은 올리기 전에 2000px 이하로 줄이기 (폰 원본은 5~10MB라 사이트가 느려짐).

## 영상 넣기
`index.html` / `gallery.html` 에서 `video-embed` 찾아서:
- 유튜브: `data-youtube="https://youtu.be/XXXX"` (쇼츠 링크도 됨)
- mp4: `videos/` 폴더에 올리고 `data-mp4="videos/파일이름.mp4"` (50MB 이하 권장, GitHub 한 파일 최대 100MB)

## 메뉴 수정
상단 메뉴·하단 푸터는 `script.js` 맨 위 `NAV_LINKS` 한 곳만 고치면 모든 페이지에 적용됨.

## 번역
글자가 들어간 태그에 `data-en`, `data-ko`, `data-lo` 속성으로 3개 언어. 라오어가 비어 있으면 영어로 표시됨.
