# ttokssaem_nodejs_admin
admin server

## 개발 환경

서버와 같은 Node.js 18을 사용합니다. 개발용 패치 버전은 18.20.8로 고정합니다.
서버의 정확한 패치 버전이 다르면 `.nvmrc`, `.node-version` 및 런타임 경로도 함께 맞춰주세요.

Windows PowerShell에서 프로젝트 전용 런타임을 활성화합니다(현재 터미널에 적용).

```powershell
. ./scripts/use-node18.ps1
npm.cmd ci
npm.cmd run dev
```

새 터미널을 열 때마다 활성화 명령을 실행하세요. `node --version`은 `v18.20.8`이어야 합니다.
`npm.cmd`를 사용하면 PowerShell의 npm.ps1 실행 정책 영향을 피할 수 있습니다.

다른 PC에서는 nvm 등으로 `.nvmrc`의 버전을 설치하거나, Windows x64 공식 배포 파일을
https://nodejs.org/download/release/v18.20.8/node-v18.20.8-win-x64.zip 에서 받아
프로젝트의 `.tools` 폴더에 압축을 풀면 위 스크립트를 사용할 수 있습니다.
`.tools`는 Git에 포함하지 않습니다.
