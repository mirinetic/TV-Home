# TV Home

TV 홈 화면 UI 프로토타입(웹)을 구글 TV · 안드로이드 TV에서 실제로 돌려 보는 테스트베드 앱.

- 일반 앱으로 설치되어 TV 앱 목록에 **TV Home**으로 표시돼요 (홈 런처를 바꾸지 않음).
- 화면은 `web/`의 React 프로토타입을 그대로 써요. 리모컨 방향키 · OK는 그대로, **뒤로**는 Esc로 전달돼요.
- 앱 줄의 타일(넷플릭스, 유튜브, 프라임 비디오, 디즈니+, 애플 TV, HBO Max, Hulu 등)은 TV에 그 앱이 있으면 **실제 앱을 열고**, 없으면 프로토타입의 앱 상세 화면을 보여 줘요.
- 개인 테스트용 사이드로드 앱이에요. 스토어 배포용이 아니에요.

## 받기

`main`에 푸시할 때마다 GitHub Actions가 빌드해서 Releases에 `v1.0.N`으로 올려요. 최신 릴리스의 `TVHome.apk`를 TV에 설치하면 돼요. 같은 개인 키로 서명해서 새 버전을 덮어 설치할 수 있어요.

## 구성

```
web/   React 19 + Vite + Tailwind 프로토타입 (npm run dev 로 브라우저에서 확인)
app/   Kotlin WebView 껍데기 (assets/www 에 web/dist 를 넣어 실행)
```

- 웹 → 앱 연결: `web/src/native.ts` (`TVHomeNative.launchApp(name)`, `hasApp(name)`)
- 타일 이름 → 패키지 매핑: `app/src/main/java/com/mirinetic/tvhome/Apps.kt`
- 이미지는 PNG를 품질 90 WebP로 바꿔 넣었어요 (106.6MB → 14.2MB).

## 로컬에서 보기

```bash
cd web && npm install && npm run dev
```
