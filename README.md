# AKKA Frontend

"아까워" + "Workout" 을 결합한 프로젝트입니다.
사용하지 못한 운동 이용권과 지출이 아깝게 느껴지는 문제에서 출발했습니다. 운동 이용권, 출석, 소비 데이터를 한곳에서 관리하고 분석할 수 있는 웹 서비스를 목표로 개발했습니다.
프론트엔드와 백엔드 흐름을 함께 이해하기 위해 시작한 개인 프로젝트이며, 사용자가 자신의 운동 패턴과 지출 현황을 한눈에 확인하고 더 효율적으로 관리할 수 있도록 돕는 것을 핵심 목표로 삼았습니다.

배포 링크: https://akkaworkout.store

---

## 주요 기능

- 회원가입 / 로그인
- JWT 기반 인증 흐름 연동
- 회원가입 완료 후 사용자 닉네임 표시
- 운동 이용권 데이터 조회 및 관리
- 운동 횟수, 지출 데이터 기반 분석 페이지
- Chart.js 기반 차트 UI
- 공통 모달 및 상세 모달 UI
- 반응형을 고려한 화면 구성

 ※ 서비스 확인을 위한 테스트 계정입니다.
-이메일: akka@naver.com
-비밀번호: password123!
-회원가입 기능도 사용 가능하지만, 빠른 확인을 위해 테스트 계정을 함께 제공합니다.


---

## 기술 스택

### Frontend

- React
- TypeScript
- Vite
- CSS Module
- React Router
- Chart.js

### API / Auth

- REST API
- Swagger 기반 API 명세 확인
- JWT
- localStorage 기반 accessToken 관리

### Tools

- Git / GitHub
- VS Code
- Figma
- Vercel

---

## 담당 및 구현 내용

- React + TypeScript 기반 프론트엔드 화면 구현
- 회원가입 / 로그인 페이지 구현
- JWT accessToken을 localStorage에 저장하고 인증 요청에 활용
- Swagger API 명세를 참고하여 백엔드 REST API 연동
- 회원가입 응답 데이터 기반 닉네임 표시 처리
- 분석 페이지 및 리포트 차트 UI 구현
- Chart.js를 활용한 운동 횟수 / 지출 데이터 시각화
- CSS Module을 활용한 컴포넌트 단위 스타일링
- 공통 모달, 상세 모달, 사이드바 등 UI 컴포넌트 구현
- 실제 API 응답 구조에 맞춰 TypeScript 타입 수정 및 통합 디버깅 진행

---

## 프로젝트를 통해 배운 점

**API 명세와 실제 응답의 괴리 해결**
- Swagger 문서와 실제 응답 구조를 비교하며 TypeScript 타입 수정
- 이 과정에서 약 50회 이상 배포/수정을 반복하며 프로덕션 환경 이해

**JWT 인증 흐름 실제 구현**
- accessToken을 localStorage에 저장하고 요청 헤더에 포함시키는 흐름
- 토큰 만료 시 처리 및 보안을 고려한 인증 설계

**데이터 시각화의 중요성**
- 같은 데이터도 어떤 차트와 단위로 보여주느냐에 따라 사용자 이해도가 크게 달라짐
- Chart.js를 활용해 운동 횟수("회")와 지출("원")을 명확하게 구분 표시

**Full-stack 관점의 이해**
- 백엔드 API 구현 경험으로 프론트엔드 디버깅이 훨씬 수월해짐
- 화면은 백엔드 데이터, 상태, 사용자 흐름과 유기적으로 연결되어야 완성됨

---

## 실행 방법

```bash
npm install
npm run dev
