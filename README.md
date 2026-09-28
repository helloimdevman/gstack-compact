# gstack-compact

**[gstack](https://github.com/garrytan/gstack)에서 실제로 자주 쓸 흐름을 골라, 가볍게 다듬어 저장해 둔 개인용 최적화 포크입니다.**

원본의 계획 → 구현 → 검증 → 리뷰 → 배포 흐름은 살리고, 기본 설치에서 보이는 명령과 처음 읽는 지침을 줄였습니다. 필요한 전문 기능은 `compat` 프로필로 다시 사용할 수 있습니다.

| | 원본 gstack | gstack-compact 기본 구성 |
| --- | --- | --- |
| 명령 | 여러 전문 스킬을 개별 등록 | 일상 작업용 핵심 명령 11개 등록 |
| 지침 | 스킬별 상세 절차 | 공통 규칙을 묶고 필요한 섹션만 읽음 |
| 브라우저 | 자체 브라우저 도구 포함 | 에이전트 호스트가 제공하는 브라우저 사용 |
| 기존 기능 | 기본 제공 | 필요할 때 `compat` 프로필로 설치 |

이름 그대로 **기본 사용 경험을 가볍게 만드는 구성**입니다. 저장소의 모든 기능을 제거한 초소형 재구현은 아닙니다.

## 설치

Git과 [Bun](https://bun.sh/)을 준비하고, 이 저장소를 AI 도구의 스킬 디렉터리 밖에 체크아웃한 뒤 저장소 루트에서 실행합니다.

```bash
# Claude Code: /plan, /build, /verify 등
./setup --host claude --skill-profile core --no-prefix

# Codex: $gstack-plan, $gstack-build, $gstack-verify 등
./setup --host codex --skill-profile core
```

설치 후 새 세션을 시작하세요. 기존 gstack과 설치 이름·상태 경로를 공유하므로 함께 설치할 때는 등록 위치와 이름을 확인해야 합니다. Claude Code에서는 `--no-prefix` 대신 `--prefix`를 쓰면 `/gstack-plan`처럼 구분할 수 있습니다.

전문 명령까지 필요하면 같은 명령에서 `core`를 `compat`로 바꾸면 됩니다. 설치 옵션은 `./setup --help`에 있습니다.

## 핵심 명령

| 명령 | 하는 일 |
| --- | --- |
| `/plan` | 아이디어, 계획, 명세와 계획 검토 |
| `/build` | 변경 구현 |
| `/verify` | 동작 확인 |
| `/review` | 변경 검토 |
| `/ship` | 검증·리뷰 후 승인된 PR 발행 |
| `/investigate` | 결함 재현과 원인 수정 |
| `/design` | 디자인 시스템, 시안, HTML |
| `/context` | 작업 맥락 저장·복원 |
| `/browse` | 호스트 브라우저 탐색 |
| `/gstack` | 설치된 스킬로 요청 연결 |
| `/sprint` | 한 작업을 계획부터 검증·리뷰까지 진행 |

Codex에서는 `$gstack-` 접두사를 사용합니다. 예를 들어 `/plan`은 `$gstack-plan`입니다. 전체 사용법은 [스킬 가이드](docs/skills.md)를 참고하세요.

## 현재 상태

이 포크는 작업 중인 후보입니다. 2026-09-29 기록된 전체 무료 테스트는 **18,008 통과 / 916 실패 / 1 건너뜀**이며, 원본 대비 토큰·속도·성공률 개선은 아직 입증되지 않았습니다. 기본 구성과 집중 검사는 구현되어 있지만, 이 수치를 배포 적합성이나 성능 보증으로 읽지 마세요. 자세한 범위와 검증 계획은 [최적화 계획](docs/superpowers/plans/2026-09-27-gstack-frontier-optimization.md)에 있습니다.

개발 시 `bun run test:quick`으로 빠르게 확인하고, 최종 인수에는 `bun run test`를 사용합니다. 스킬 문서는 템플릿에서 생성되므로 변경할 때 `SKILL.md.tmpl`과 `sections/*.md.tmpl`을 수정하세요. 개발 구조는 [CONTRIBUTING.md](CONTRIBUTING.md)와 [ARCHITECTURE.md](ARCHITECTURE.md)에 있습니다.

원본: [garrytan/gstack](https://github.com/garrytan/gstack) · 라이선스: [MIT](LICENSE)
