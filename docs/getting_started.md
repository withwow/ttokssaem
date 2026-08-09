# 시작하기 & 배포 가이드 (Getting Started & Deployment)

이 문서는 똑쌤 Node.js 관리자 시스템의 로컬 개발 환경 실행 방법 및 서버 배포 환경 설정에 대해 설명합니다.

---

## 1. 개발 환경 요구 사항
* **Node.js**: LTS 버전 권장 (v14 ~ v18)
* **npm**: Node.js와 함께 설치되는 기본 버전을 사용
* **Database**: MySQL 5.7 또는 8.0 이상
* **In-Memory DB**: Redis Server (세션 및 캐시 저장용)

---

## 2. 로컬 실행 방법 (Local Setup)

### Step 1: 의존성 패키지 설치
프로젝트 루트 디렉토리에서 아래 명령어를 실행하여 필요한 npm 모듈들을 설치합니다.
```bash
npm install
```

### Step 2: 환경 설정 파일 (.env) 구성
프로젝트 루트에 `.env` 파일을 생성하고 아래 형식을 참고하여 접속 정보를 입력합니다. (예시는 `doc/init.txt` 및 기본 `.env` 설정을 기반으로 함)
```ini
# NODE_ENV: 실행 환경 설정 (development / production)
NODE_ENV=development

# PORT: Express 웹 서버 포트
PORT=9503

# MYSQL 설정
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=ttokssaemdb
MYSQL_PASSWORD=Ssaemttok2022!@
MYSQL_DATABASE=ttokssaemdb

# REDIS 설정
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=1@3$
REDIS_DB=1

# CPU 코어 개수 설정 (클러스터링 등에 쓰임)
CPU_NUM=1

# 외부 연동 똑쌤 API 서버 호스트
API_HOST=https://api.ttokssaem.com
```

### Step 3: 개발 모드 실행 (Nodemon)
코드 수정 시 자동으로 서버가 재부팅되는 nodemon 모드로 로컬 서버를 기동합니다.
```bash
npm run dev
```
서버 실행 후 브라우저에서 `http://localhost:9503`으로 접속할 수 있습니다.

### Step 4: 운영 모드 실행 (Node.js 기본)
```bash
npm start
```

---

## 3. 리눅스 서버 배포 환경 설정 (Ubuntu 기반)

운영 서버 환경 구성 시 필요한 소프트웨어 설치 명령 가이드입니다. (`doc/system.txt` 참고)

### 3.1 Node.js & npm 설치
```bash
sudo apt-get update
sudo apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -   # (필요한 노드 버전에 맞게 수정 가능)
sudo apt install -y nodejs
```

### 3.2 Git 설치
```bash
sudo apt install git
```

### 3.3 PM2 프로세스 매니저 설치 (운영 무중단 배포 및 백그라운드 관리)
```bash
sudo npm install pm2 -g
```

### 3.4 Nginx 설치 (리버스 프록시 구성용)
```bash
sudo apt-get update
sudo apt-get install nginx
```

---

## 4. 로컬 및 서버 환경 정보
개발을 위해 공유되는 서버 IP 또는 환경 정보는 `doc/system.txt`에 기록되어 있습니다. 필요에 따라 해당 파일을 참고하여 방화벽(AWS Security Group 등) 허용 IP를 세팅해야 합니다.
