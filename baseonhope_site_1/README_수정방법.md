# Base on Hope 웹사이트 – 적용 방법 (v2)

## 1. GitHub에 올리기
1. 저장소에서 백업 브랜치를 먼저 만드세요.
2. **CNAME 파일과 기존 images 폴더(stadium, founders, laos 등)는 지우지 마세요.**
3. 이 zip의 파일을 저장소 맨 위(root)에 덮어쓰기:
   - index.html, .nojekyll
   - projects/, about/, support/ (예전 주소를 새 섹션으로 연결)
   - images/ 안의 새 폴더들 (projects, gallery, founders, partners, video, logo-interim.jpg)
     → 기존 images 폴더에 "합치기"로 올리세요.
4. 예전 Jekyll/Astro 파일(_config.yml 등)은 지우세요.
5. Commit 후 1~2분 뒤 baseonhope.org 확인.

## 2. 아직 넣어야 할 파일
| 파일 | 위치 | 없을 때 |
|---|---|---|
| 메인 로고 (배경 없는 PNG) | images/logo.png | 드림컵 이미지에서 잘라낸 임시 로고가 대신 보임 |
| 엠블럼 (인스타 프로필 로고) | images/logo-2.png | 파일 이름만 표시됨 |
| 초등 야구 교실 사진 | images/projects/elementary-class.jpg → index.html의 해당 카드 img에 경로 입력 | 남색 기본 카드 |

## 3. 내용 고치기
index.html 안의 `SITE_DATA`(데이터)와 `I18N`(고정 문구)만 고치면 됩니다.
- 모든 문구는 영어/한국어를 함께 적어요.
- 기획서 문서: SITE_DATA.documents의 url에 보기 전용 링크를 넣으면 Documents 섹션이 자동으로 나타나요.
- 농심 후원이 확정되면: projects의 농심 카드 status를 "done"으로, partners에 농심 추가.

## 4. 공개 전 체크
- 장부 원본(구글 시트) 공유 설정을 "제한됨"으로 되돌리기 (학생 이름·이메일 포함)
- 야구장 투어 날짜(2026)와 양키 스타디움 방문 시기 확인
