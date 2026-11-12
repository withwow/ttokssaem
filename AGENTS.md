# 똑쌤 통합 프로젝트 개발 지침 (AGENTS.md)

이 저장소(`https://github.com/withwow/ttokssaem.git`)는 똑쌤의 Flutter, Node.js(admin/api/pushserver/www), C# 프로젝트를 하나로 관리하는 통합 Git 저장소입니다.
Codex, Claude 등 모든 코딩 에이전트와 개발자는 아래 브랜치 운영 정책을 따릅니다.

## 1. 브랜치 구성

| 브랜치 | 용도 |
| --- | --- |
| `main` | 운영 서버 배포용 안정 버전. 검증이 완료된 코드만 유지합니다. |
| `dev` | 신규 기능 개발, UI 수정, 버그 수정 및 테스트용 기본 작업 브랜치입니다. |

- Flutter, Node.js, C# 프로젝트 전체를 동일한 `dev` 브랜치에서 관리합니다.
- 기존 프로젝트 폴더 구조와 Git 이력은 변경하지 않습니다.

## 2. 작업 원칙

1. 일반 개발 작업은 `dev`에서 진행합니다.
2. 작업 시작 전 현재 브랜치를 확인합니다. (`git branch --show-current`)
3. `main`에서 일반 개발 작업을 시작하지 않습니다. `main`이면 `git checkout dev && git pull origin dev` 후 작업합니다.
4. 개발 완료 후 `dev`에 Commit 및 Push합니다.
5. 사용자 승인 전 `dev` → `main` 병합을 금지합니다.
6. `main`에 직접 Push하는 작업은 사용자 승인 또는 명시적인 긴급 수정 요청이 있을 때만 허용합니다.
   - 긴급 수정을 `main`에 직접 반영한 경우, 같은 변경을 즉시 `dev`에도 반영(병합 또는 cherry-pick)하여 두 브랜치가 어긋나지 않게 합니다.
7. 프로젝트 간 연동 기능(예: admin ↔ api ↔ pushserver ↔ Flutter 앱)은 통합 저장소 전체를 기준으로 검토합니다.
8. 기존 개별 Git 저장소는 사용하지 않습니다.
9. 검증되지 않은 코드는 `main`에 반영하지 않습니다.

## 3. 개발 및 배포 흐름

```
개발 (Codex 등)
    ↓
dev 에서 기능 구현 및 테스트
    ↓
Commit / Push (dev)
    ↓
사용자 검토 및 승인
    ↓
dev → main 병합 (사용자 승인 후에만)
    ↓
Push (main)
    ↓
운영 서버 수동 배포
```

## 4. 운영 서버 배포 정책

운영 Ubuntu 서버의 배포 스크립트는 모두 통합 Git의 `main`을 기준으로 배포합니다.

- `/data/deploy-www.sh`
- `/data/deploy-admin.sh`
- `/data/deploy-api.sh`
- `/data/deploy-pushserver.sh`

지켜야 할 사항:

- `dev` 브랜치를 운영 서버에 배포하지 않습니다.
- 기존 증분 배포 방식을 유지합니다.
- 기존 PM2 프로세스 및 실행 경로를 유지합니다.
- 서버 자동 배포(CI/CD 등)를 도입하지 않습니다.
- 운영 서버 스크립트를 변경하지 않습니다.
- 운영 서버 배포는 사용자가 수동으로 진행합니다. 에이전트는 배포를 실행하지 않습니다.
