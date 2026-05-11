# AKKA Frontend

운동 이용권, 출석, 소비 데이터를 관리하고 분석할 수 있는 웹 서비스입니다.  
프론트엔드와 백엔드 흐름을 함께 이해하기 위해 시작한 개인 프로젝트이며, 사용자가 자신의 운동 패턴과 지출 현황을 한눈에 확인할 수 있도록 하는 것을 목표로 개발했습니다.

배포 링크: https://akka-fe.vercel.app

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

- API 명세와 실제 응답 구조를 비교하며 프론트엔드 타입을 맞추는 과정
- JWT 인증 흐름과 요청 헤더 처리 방식
- 데이터를 사용자가 이해하기 쉬운 차트와 화면으로 구성하는 방법
- 백엔드 구조를 이해하면 프론트엔드 API 연동과 디버깅이 더 수월해진다는 점
- 완벽한 구현보다 먼저 동작 가능한 화면을 만들고 빠르게 개선하는 개발 방식

---

## 실행 방법

```bash
npm install
npm run dev
