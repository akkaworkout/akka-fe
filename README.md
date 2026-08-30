# 🏋️‍♀️ AKKAWORKOUT

> "아까워" + "Workout"을 결합한 운동 이용권 및 지출 관리 서비스

사용하지 못한 운동 이용권과 운동 관련 지출이 아깝게 느껴지는 문제에서 출발한 프로젝트입니다.  
운동 이용권, 출석 기록, 지출 데이터를 한곳에서 관리하고 분석할 수 있는 웹 서비스를 목표로 개발했습니다.

사용자는 자신의 운동 패턴과 지출 현황을 한눈에 확인하고, 남은 이용권과 운동 소비를 더 효율적으로 관리할 수 있습니다.

---

## Links

- 🌐 **Service**: https://akkaworkout.store
<img width="1918" height="1031" alt="image" src="https://github.com/user-attachments/assets/fb9b675e-a81a-4440-b894-c0ddb7c1496a" />

📖 **Swagger API**: https://api.akkaworkout.store/api-docs
<img width="1918" height="947" alt="image" src="https://github.com/user-attachments/assets/ea10ef47-5e58-4144-9d2d-eadc693b5c1f" />

💻 **Frontend Repository**

https://github.com/akkaworkout/akka-fe

🛠️ **Backend Repository**

https://github.com/akkaworkout/akka-be

🎨 **Figma Design**

https://www.figma.com/design/f63s7HXAd3yt2Bfl02IAhT/AKKA-WORKOUT?node-id=16-1487&t=2wx48f81o1SdkvtI-1

---

## Test Account

서비스 확인을 위한 테스트 계정입니다.

```txt
이메일: akka@naver.com
비밀번호: password123!
```

회원가입 기능도 사용 가능하지만, 빠른 확인을 위해 테스트 계정을 함께 제공합니다.

---

## Service Architecture

<img width="1536" height="1024" alt="image (7)" src="https://github.com/user-attachments/assets/795de138-b855-40ca-ac55-27d47f32dd50" />

AKKA는 React + Vite 기반 프론트엔드와 Node.js Express 기반 백엔드, MySQL 데이터베이스로 구성되어 있습니다.

- 사용자는 Gabia 도메인을 통해 서비스에 접근합니다.
- 프론트엔드는 Vercel에 배포되어 있습니다.
- 백엔드는 Cloudtype에 배포되어 있습니다.
- 데이터베이스는 Railway MySQL을 사용합니다.
- Swagger 문서를 통해 프론트엔드와 백엔드 API 명세를 공유했습니다.
- GitHub Actions를 활용해 빌드 및 배포 흐름을 관리했습니다.

---

## ERD

<img width="1091" height="781" alt="image (8)" src="https://github.com/user-attachments/assets/3f7cb70a-334c-4349-b75f-f111d0c79239" />

주요 테이블은 다음과 같습니다.

- `users`: 사용자 정보, 목표 예산, 목표 운동 횟수 관리
- `tickets`: 운동 이용권 정보, 남은 횟수, 환불/만료 상태 관리
- `exercise_records`: 운동 기록, 성공/실패 여부, 메모, 첨부 이미지 관리
- `expenses`: 운동 관련 지출 기록 관리
- `calendar_goals`: 월별 목표 관리

---

## API 명세

### Auth

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| POST   | `/auth/register`       | 회원가입         |
| POST   | `/auth/login`          | 로그인           |
| POST   | `/auth/refresh`        | 액세스 토큰 갱신 |
| GET    | `/auth/check-email`    | 이메일 중복 확인 |
| GET    | `/auth/check-nickname` | 닉네임 중복 확인 |

### Users

| Method | Endpoint    | Description  |
| ------ | ----------- | ------------ |
| GET    | `/users/me` | 내 정보 조회 |
| PATCH  | `/users/me` | 내 정보 수정 |

### ExerciseRecord

| Method | Endpoint                       | Description         |
| ------ | ------------------------------ | ------------------- |
| GET    | `/exercise-record`             | 운동 기록 전체 조회 |
| POST   | `/exercise-record`             | 운동 기록 등록      |
| GET    | `/exercise-record/{record_id}` | 특정 운동 기록 조회 |
| PATCH  | `/exercise-record/{record_id}` | 운동 기록 수정      |
| DELETE | `/exercise-record/{record_id}` | 운동 기록 삭제      |

### Ticket

| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| POST   | `/tickets`                    | 이용권 등록           |
| GET    | `/tickets`                    | 내 이용권 전체 조회   |
| GET    | `/tickets/active`             | 진행 중인 이용권 조회 |
| GET    | `/tickets/{ticketId}/summary` | 이용권 요약 정보 조회 |
| GET    | `/tickets/{ticketId}`         | 특정 이용권 조회      |
| DELETE | `/tickets/{ticketId}`         | 이용권 삭제           |
| PATCH  | `/tickets/{ticketId}/end`     | 이용권 종료           |

### Calendar

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | `/calendar`         | 월 전체 운동 기록 조회 |
| GET    | `/calendar/goal`    | 월 목표 조회           |
| PATCH  | `/calendar/goal`    | 월 목표 수정           |
| GET    | `/calendar/summary` | 월 요약 정보 조회      |
| GET    | `/calendar/{date}`  | 특정 날짜 기록 조회    |

### Expense

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/expense`       | 기타비용 지출 등록    |
| GET    | `/expense/stats` | 이번달 지출 통계 조회 |

### Reports

| Method | Endpoint   | Description      |
| ------ | ---------- | ---------------- |
| GET    | `/reports` | 월간 리포트 조회 |

---

## Tech Stack

### Planning / Design

- Figma
- Notion
- Discord

### Frontend

- React
- TypeScript
- Vite
- CSS Module
- React Router
- TanStack Query
- Zustand
- Chart.js
- React Helmet Async

### Backend

- Node.js
- Express
- REST API
- JWT 기반 인증
- Swagger API 문서화

### Database

- MySQL
- MySQL Workbench
- ERD CLOUD
- Railway

### Infra / Deploy

- Vercel
- Cloudtype
- Gabia
- GitHub Actions

### Collaboration / Tools

- Git
- GitHub
- VS Code
- Swagger

---

## 역할 분담

### 공통 참여

| 구분         | 담당 내용                                                |
| ------------ | -------------------------------------------------------- |
| 기획         | 서비스 아이디어 구체화, 주요 기능 정의, 사용자 흐름 설계 |
| 디자인       | Figma 기반 화면 설계 및 UI 디자인                        |
| 프론트엔드   | React + TypeScript 기반 화면 구현 및 API 연동            |
| 백엔드       | Node.js + Express 기반 REST API 구현                     |
| 데이터베이스 | MySQL 기반 테이블 구조 및 관계 설계                      |
| API 문서화   | Swagger 기반 API 명세 작성 및 프론트엔드 연동 기준 공유  |
| QA / 디버깅  | 배포 환경에서 API 응답 구조 확인 및 기능 테스트          |

### 담당자별 역할

| 담당자         | 담당 영역               | 세부 내용                                                                        |
| -------------- | ----------------------- | -------------------------------------------------------------------------------- |
| 선혜민         | Auth                    | 로그인, 회원가입, 이메일/닉네임 중복 확인, 인증 API 연동 구현                    |
| 선혜민         | My Page                 | 사용자 정보 조회/수정, 프로필 이미지 관리, 목표 예산/운동 횟수 설정 기능 구현    |
| 선혜민         | Report                  | 월간 리포트, 운동/지출/노쇼 분석 지표, Chart.js 기반 시각화 화면 구현            |
| 선혜민         | Common UI               | 공통 모달, 상세 모달, 입력 폼 등 재사용 UI 컴포넌트 구현                         |
| 선혜민         | Frontend Deploy         | Vercel 기반 프론트엔드 배포                                                      |
| 선혜민, 이민주 | SideNav                 | 사이드바 UI, 메뉴 이동, 접힘 상태, 로그인 상태 표시 구현                         |
| 이민주         | Calendar                | 월별 캘린더, 목표, 날짜별 기록 조회 화면 구현                                    |
| 이민주         | Records                 | 운동기록, 운동지출기록, 이용권 관리 화면 구현                                    |
| 이민주         | App Configuration       | HelmetProvider, ErrorBoundary를 적용해 React 애플리케이션 실행 및 전역 환경 구성 |
| 이민주         | Domain / Backend Deploy | Gabia 도메인 연결, Cloudtype 백엔드 배포                                         |
| 이민주         | Database / CI/CD        | Railway MySQL 배포, GitHub Actions 배포 파이프라인 구성                          |

### 페이지별 담당

| 페이지                 | 담당자         | 담당 범위                            |
| ---------------------- | -------------- | ------------------------------------ |
| Login                  | 선혜민         | 디자인, 프론트엔드, 백엔드, API 연동 |
| Sign Up                | 선혜민         | 디자인, 프론트엔드, 백엔드, API 연동 |
| My Page                | 선혜민         | 디자인, 프론트엔드, 백엔드, API 연동 |
| Report                 | 선혜민         | 디자인, 프론트엔드, 백엔드, API 연동 |
| SideNav                | 선혜민, 이민주 | 디자인, 프론트엔드, 상태 관리        |
| Calendar               | 이민주         | 디자인, 프론트엔드, 백엔드, API 연동 |
| Records - 운동기록     | 이민주         | 디자인, 프론트엔드, 백엔드, API 연동 |
| Records - 운동지출기록 | 이민주         | 디자인, 프론트엔드, 백엔드, API 연동 |
| Records - 이용권       | 이민주         | 디자인, 프론트엔드, 백엔드, API 연동 |

---

## 화면

### Main

<img width="1917" height="1028" alt="image" src="https://github.com/user-attachments/assets/d471659b-c1ff-4078-8770-6823dbe04e6c" />

- 서비스 소개 및 주요 기능 진입 화면 구현
- 로그인 여부에 따른 화면 이동 흐름 처리
- 반응형 레이아웃을 고려한 메인 UI 구성

### Auth - 로그인 / 회원가입

<img width="1918" height="1027" alt="image" src="https://github.com/user-attachments/assets/fe9a7121-c270-434a-a69a-e7982aeb0f3f" />
<img width="1918" height="1030" alt="image" src="https://github.com/user-attachments/assets/9aa2f4a9-d6b9-479c-93ff-4a58ff84f8e5" />

- 회원가입 / 로그인 페이지 구현
- 입력값 검증 및 에러 메시지 처리
- 로그인 성공 시 JWT accessToken 저장
- 인증 상태에 따른 라우팅 흐름 처리

### Records - 운동기록 / 기타지출 / 이용권관리

<img width="1918" height="1028" alt="image" src="https://github.com/user-attachments/assets/ec3b8c4d-1c80-43ad-8853-4a46fe811821" />
<img width="1918" height="1026" alt="image" src="https://github.com/user-attachments/assets/3795366e-39e7-4770-a1dd-d598c60eac2e" />
<img width="1918" height="1031" alt="image" src="https://github.com/user-attachments/assets/a22c94c3-a87f-4c6d-8f08-192b5091ecc4" />

- 운동기록, 운동지출기록, 이용권 관리를 탭 구조로 구성
- 운동 날짜, 운동 종류, 성공/실패 여부, 실패 사유, 메모, 이미지 기록 기능 구현
- 기존 운동 기록 조회 후 수정 및 삭제 기능 구현
- 운동복, 운동용품, 교통비 등 운동 관련 지출 등록 기능 구현
- 지출 날짜, 지출 항목, 금액, 카테고리 입력 흐름 구성
- 헬스, 필라테스 등 운동 이용권 등록 및 관리 기능 구현
- 이용권 잔여 횟수, 이용 기간, 상태 정보 표시
- 이용권 상세 조회, 삭제, 만료/환불/완료 처리 기능 구현
- 기록된 운동, 지출, 이용권 데이터를 캘린더 및 리포트 화면과 연동

### Report: 수정 예정

<img width="1918" height="1028" alt="image" src="https://github.com/user-attachments/assets/d18246fd-5ec8-40ef-9dce-22b3e15607f8" />

- 운동 횟수와 지출 데이터를 기반으로 한 분석 화면 구현
- Chart.js 기반 차트 UI 구성
- 운동 기록, 지출 기록, 노쇼 관련 지표 표시
- 상세 모달을 통한 기록 확인 흐름 구현

### Calendar: 수정 예정

<img width="1918" height="1028" alt="image" src="https://github.com/user-attachments/assets/0e8a1232-58c3-4412-8ea9-a486e56106cd" />

- 월별 운동 기록, 지출 기록, 이용권 일정 조회
- 날짜 선택 시 해당 날짜의 기록 목록 표시
- 월별 목표 조회 및 수정 기능 구현
- React Query 기반 캘린더 데이터 조회 hook 분리

### MyPage: 수정 예정

<img width="1918" height="1031" alt="image" src="https://github.com/user-attachments/assets/d349bea7-28c2-42ab-8a19-8ee69570844c" />

- 사용자 정보 조회 및 수정 화면 구현
- 프로필 이미지, 닉네임, 이메일 등 사용자 정보 관리
- 목표 예산 및 목표 운동 횟수 입력 흐름 구성

### Common

- Axios 공통 인스턴스를 구성해 API 요청 흐름 통일
- 공통 모달, 사이드바, 버튼, 카드, 스피너 컴포넌트 구현
- CSS Module을 활용한 컴포넌트 단위 스타일링
- `StrictMode` 기반으로 React 앱 실행 환경 구성
- `ErrorBoundary`를 앱 전역에 적용해 렌더링 예외 발생 시 fallback 화면 표시
- `HelmetProvider`를 적용해 페이지별 title, meta description 관리
- `QueryClientProvider`를 적용해 React Query 기반 서버 상태 관리 환경 구성
- `BrowserRouter`를 적용해 클라이언트 라우팅 구조 구성
- Zustand를 활용해 사이드바 접힘 상태 전역 관리
- Zustand를 활용해 로그인 여부와 accessToken 상태 관리

---

## Lighthouse

### Main

<img width="503" height="165" alt="image" src="https://github.com/user-attachments/assets/f2731d36-00ed-49a7-a645-5b435939250d" />

### Auth - 로그인

<img width="506" height="163" alt="image" src="https://github.com/user-attachments/assets/125ce5ea-a801-41b4-a283-8975df9fae5a" />

### Auth - 회원가입

<img width="506" height="163" alt="image" src="https://github.com/user-attachments/assets/73c1aa7b-d3c5-4d2b-bf24-81482511d23a" />

### Records - 운동기록 / 기타지출 / 이용권관리

<img width="505" height="167" alt="image" src="https://github.com/user-attachments/assets/356d6f16-8cb8-4eb9-9384-df2ea814cd08" />
<img width="497" height="162" alt="image" src="https://github.com/user-attachments/assets/a1891924-b9f8-4634-a3e3-494428fe488d" />
<img width="497" height="162" alt="image" src="https://github.com/user-attachments/assets/2d3b261b-fbaf-4e0a-a3e9-f6d6066b1a2d" />

### Report

<img width="506" height="165" alt="image" src="https://github.com/user-attachments/assets/8047a4fe-17a8-466c-8eff-f9527ff8d44a" />

### Calendar

<img width="510" height="171" alt="image" src="https://github.com/user-attachments/assets/a99974c9-2421-41d3-ae38-c20abb4cf095" />

### MyPage

<img width="502" height="166" alt="image" src="https://github.com/user-attachments/assets/fcefce9f-706a-4c26-bbd1-7c28f4b1aa2f" />

---

## CI 검증

<img width="1030" height="562" alt="image" src="https://github.com/user-attachments/assets/24be4af8-e919-4ff4-a1fa-37b5b9f3eba3" />

- npm ci
- Prettier
- ESLint
- TypeScript
- Dead code
- Build

---

## Project Structure

### Frontend

```txt
📦 akka-fe
├─ .env
├─ .gitignore
├─ README.md
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ akka-logo-svg.png
│  └─ og-image.png
├─ src
│  ├─ App.module.css
│  ├─ App.tsx
│  ├─ api
│  │  ├─ api.ts
│  │  ├─ calendarApi.ts
│  │  ├─ expenseApi.ts
│  │  ├─ ticketApi.ts
│  │  └─ workoutApi.ts
│  ├─ assets
│  │  ├─ brand
│  │  │  ├─ akka-logo-symbol.png
│  │  │  ├─ akka-logo.png
│  │  │  ├─ main-akka.png
│  │  │  ├─ main-hero.webp
│  │  │  └─ main-workout.png
│  │  ├─ icons
│  │  │  ├─ auth
│  │  │  │  ├─ edit-avatar.png
│  │  │  │  ├─ eye-off.png
│  │  │  │  ├─ eye-on.png
│  │  │  │  └─ profile-default.png
│  │  │  ├─ common
│  │  │  │  ├─ arrow-down.png
│  │  │  │  ├─ calendar.png
│  │  │  │  ├─ check.png
│  │  │  │  ├─ chevron-left.png
│  │  │  │  ├─ delete.png
│  │  │  │  ├─ edit.png
│  │  │  │  ├─ goal.png
│  │  │  │  ├─ moreButton.png
│  │  │  │  └─ upload.png
│  │  │  └─ sidebar
│  │  │     ├─ calendar-active.png
│  │  │     ├─ calendar.png
│  │  │     ├─ default-profile.png
│  │  │     ├─ logout.png
│  │  │     ├─ menu-active.png
│  │  │     ├─ menu.png
│  │  │     ├─ record-active.png
│  │  │     ├─ record.png
│  │  │     ├─ report-active.png
│  │  │     ├─ report.png
│  │  │     ├─ setting-active.png
│  │  │     ├─ setting.png
│  │  │     └─ toggle.png
│  │  └─ images
│  │     ├─ money-bag.png
│  │     ├─ premium-card.png
│  │     └─ ticket.png
│  ├─ components
│  │  ├─ button
│  │  │  ├─ Button.module.css
│  │  │  └─ Button.tsx
│  │  ├─ card
│  │  │  ├─ Card.module.css
│  │  │  └─ Card.tsx
│  │  ├─ dateSelect
│  │  │  ├─ DateSelect.module.css
│  │  │  └─ DateSelect.tsx
│  │  ├─ errorBoundary
│  │  │  ├─ ErrorBoundary.module.css
│  │  │  └─ ErrorBoundary.tsx
│  │  ├─ form
│  │  │  ├─ Form.module.css
│  │  │  └─ Form.tsx
│  │  ├─ icons
│  │  │  └─ CheckIcon.tsx
│  │  ├─ modal
│  │  │  ├─ Modal.module.css
│  │  │  └─ Modal.tsx
│  │  ├─ sideNav
│  │  │  ├─ SideNav.module.css
│  │  │  └─ SideNav.tsx
│  │  ├─ spinner
│  │  │  ├─ Spinner.module.css
│  │  │  └─ Spinner.tsx
│  │  └─ summaryCard
│  │     ├─ SummaryCard.module.css
│  │     └─ SummaryCard.tsx
│  ├─ hooks
│  │  ├─ mutations
│  │  │  ├─ useExpenseMutation.ts
│  │  │  ├─ useGoalMutation.ts
│  │  │  ├─ useTicketMutation.ts
│  │  │  └─ useWorkoutMutation.ts
│  │  └─ queries
│  │     ├─ useCalendarQuery.ts
│  │     ├─ useExpenseQuery.ts
│  │     ├─ useTicketQuery.ts
│  │     └─ useWorkoutQuery.ts
│  ├─ index.css
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ auth
│  │  │  ├─ login
│  │  │  │  ├─ LoginPage.module.css
│  │  │  │  └─ LoginPage.tsx
│  │  │  └─ signup
│  │  │     ├─ SignUpPage.module.css
│  │  │     ├─ SignUpPage.tsx
│  │  │     ├─ SignUpSuccessPage.module.css
│  │  │     └─ SignUpSuccessPage.tsx
│  │  ├─ calendar
│  │  │  ├─ Calendar.module.css
│  │  │  ├─ CalendarPage.tsx
│  │  │  ├─ components
│  │  │  │  ├─ Calendar.tsx
│  │  │  │  └─ TodayRecordSection.tsx
│  │  │  ├─ hooks
│  │  │  │  ├─ useCalendar.ts
│  │  │  │  ├─ useGoals.ts
│  │  │  │  ├─ useSummary.ts
│  │  │  │  └─ useTodayItems.ts
│  │  │  └─ modals
│  │  │     ├─ TodayItemModal.module.css
│  │  │     └─ TodayItemModal.tsx
│  │  ├─ main
│  │  │  ├─ MainPage.module.css
│  │  │  └─ MainPage.tsx
│  │  ├─ mypage
│  │  │  ├─ MyPage.module.css
│  │  │  ├─ MyPage.tsx
│  │  │  └─ hooks
│  │  │     ├─ useFormValidation.ts
│  │  │     ├─ useMyPageForm.ts
│  │  │     ├─ useProfileImage.ts
│  │  │     └─ useUserData.ts
│  │  ├─ records
│  │  │  ├─ components
│  │  │  │  ├─ RecordSummaryCard.tsx
│  │  │  │  └─ recordTabs
│  │  │  │     ├─ RecordTabs.module.css
│  │  │  │     └─ RecordTabs.tsx
│  │  │  ├─ expense
│  │  │  │  ├─ ExpensePage.tsx
│  │  │  │  └─ hooks
│  │  │  │     ├─ useExpenseForm.ts
│  │  │  │     └─ useExpenseSummary.ts
│  │  │  ├─ hooks
│  │  │  │  └─ useTickets.ts
│  │  │  ├─ layout
│  │  │  │  ├─ RecordLayout.module.css
│  │  │  │  └─ RecordLayout.tsx
│  │  │  ├─ ticket
│  │  │  │  ├─ Ticket.module.css
│  │  │  │  ├─ TicketPage.tsx
│  │  │  │  ├─ components
│  │  │  │  │  └─ ticketRow
│  │  │  │  │     ├─ TicketRow.module.css
│  │  │  │  │     └─ TicketRow.tsx
│  │  │  │  └─ modals
│  │  │  │     ├─ ConfirmModal.tsx
│  │  │  │     ├─ TicketAddModal.tsx
│  │  │  │     ├─ TicketEndModal.tsx
│  │  │  │     ├─ TicketModal.module.css
│  │  │  │     └─ TicketModal.tsx
│  │  │  └─ workout
│  │  │     ├─ Workout.module.css
│  │  │     ├─ WorkoutPage.tsx
│  │  │     ├─ components
│  │  │     │  ├─ WorkoutDateField.tsx
│  │  │     │  ├─ WorkoutExerciseField.tsx
│  │  │     │  ├─ WorkoutFailReasonField.tsx
│  │  │     │  ├─ WorkoutImageField.tsx
│  │  │     │  ├─ WorkoutMemoField.tsx
│  │  │     │  └─ WorkoutResultField.tsx
│  │  │     ├─ hooks
│  │  │     │  ├─ useImagePreview.ts
│  │  │     │  ├─ useWorkoutActions.ts
│  │  │     │  ├─ useWorkoutForm.ts
│  │  │     │  └─ useWorkoutTickets.ts
│  │  │     └─ types
│  │  │        └─ workoutTypes.ts
│  │  └─ report
│  │     ├─ Report.module.css
│  │     ├─ ReportPage.tsx
│  │     ├─ components
│  │     │  ├─ ReportHeader.tsx
│  │     │  ├─ card
│  │     │  │  ├─ InsightCard.tsx
│  │     │  │  ├─ ListCard.tsx
│  │     │  │  ├─ TotalExerciseCard
│  │     │  │  │  ├─ TotalExerciseCard.css
│  │     │  │  │  └─ TotalExerciseCard.tsx
│  │     │  │  ├─ TotalExpenseCard
│  │     │  │  │  ├─ TotalExpenseCard.css
│  │     │  │  │  └─ TotalExpenseCard.tsx
│  │     │  │  └─ TotalNoShowCard
│  │     │  │     ├─ TotalNoShowCard.css
│  │     │  │     └─ TotalNoShowCard.tsx
│  │     │  └─ charts
│  │     │     ├─ BarChart.tsx
│  │     │     ├─ RingChart.module.css
│  │     │     └─ RingChart.tsx
│  │     ├─ hooks
│  │     │  ├─ useExerciseOptions.ts
│  │     │  ├─ useInsightCalculations.ts
│  │     │  ├─ useReportData.ts
│  │     │  └─ useReportMetrics.ts
│  │     └─ modals
│  │        ├─ DetailModal.module.css
│  │        ├─ DetailModal.tsx
│  │        ├─ ExpenseDetailModal.module.css
│  │        ├─ ExpenseDetailModal.tsx
│  │        ├─ MemoDetailModal.module.css
│  │        ├─ MemoDetailModal.tsx
│  │        ├─ Modal.module.css
│  │        └─ Modal.tsx
│  ├─ routes
│  │  └─ PrivateRoute.tsx
│  └─ stores
│     ├─ useAuthStore.ts
│     └─ useSidebarStore.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vercel.json
└─ vite.config.ts
```

### Backend

```txt
📦 akka-be
.github
│  └─ workflows
│     └─ deploy.yml
.gitignore
README.md
index.js
package-lock.json
package.json
├─ src
│  ├─ app.js
│  ├─ config
│  │  ├─ cors.js
│  │  └─ db.js
│  ├─ controllers
│  │  ├─ auth.controller.js
│  │  ├─ calendar.controller.js
│  │  ├─ exerciseRecord.controller.js
│  │  ├─ expense.controller.js
│  │  ├─ report.controller.js
│  │  ├─ ticket.controller.js
│  │  └─ user.controller.js
│  ├─ middlewares
│  │  ├─ auth.middleware.js
│  │  ├─ errorHandler.js
│  │  ├─ refreshTokenMiddleware.js
│  │  └─ upload.js
│  ├─ models
│  │  ├─ auth.model.js
│  │  ├─ calendar.model.js
│  │  ├─ exerciseRecord.model.js
│  │  ├─ expense.model.js
│  │  ├─ monthlyGoal.model.js
│  │  ├─ report.model.js
│  │  ├─ ticket.model.js
│  │  └─ user.model.js
│  ├─ routes
│  │  ├─ auth.routes.js
│  │  ├─ calendar.routes.js
│  │  ├─ exerciseRecord.routes.js
│  │  ├─ expense.routes.js
│  │  ├─ report.routes.js
│  │  ├─ ticket.routes.js
│  │  └─ user.routes.js
│  ├─ server.js
│  ├─ services
│  │  ├─ auth.service.js
│  │  ├─ calendar.service.js
│  │  ├─ exerciseRecord.service.js
│  │  ├─ expense.service.js
│  │  ├─ report.service.js
│  │  └─ ticket.service.js
│  ├─ swagger.js
│  └─ utils
│     ├─ jwt.js
│     ├─ password.js
│     └─ ticket.util.js
└─ uploads
```

---

## 실행 방법

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## 타입 체크

```bash
npm run typecheck
```
