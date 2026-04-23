# 프로젝트 구조

이 프로젝트는 비유하면 **작은 Fastify 건물**에 가깝습니다. `src/app.ts`가 로비처럼 전체를 조립하고, `src/plugins`는 공용 설비, `src/routes`는 실제 출입문 역할을 합니다.

```text
npm run dev / npm start
        ↓
fastify-cli
        ↓
dist/app.js  ← src/app.ts 빌드 결과
        ↓
src/app.ts
  ├─ plugins 자동 등록
  └─ routes 자동 등록
        ↓
/          → src/routes/root.ts
/example   → src/routes/example/index.ts
```

## 한눈에 보기

- 이 저장소는 **Fastify CLI로 시작한 TypeScript 프로젝트**입니다.
- 앱은 `src/app.ts`에서 `@fastify/autoload`를 사용해 플러그인과 라우트를 자동 등록합니다.
- 실행은 `package.json`의 스크립트로 시작하며, 현재 개발/실행 포트는 `4000`입니다.
- 테스트 파일은 `test/` 아래에 모여 있고, 라우트와 플러그인 단위로 나뉘어 있습니다.

## 주요 파일과 역할

### `package.json`

프로젝트 실행 방식이 가장 먼저 드러나는 파일입니다.

- `npm run dev`: TypeScript 감시와 Fastify 실행을 함께 돌립니다.
- `npm start`: TypeScript를 빌드한 뒤 Fastify CLI로 앱을 실행합니다.
- `npm run test`: TypeScript 빌드 후 테스트를 실행합니다.

이 프로젝트를 처음 볼 때는 `package.json`을 보면 “어떻게 실행되는지”를 가장 빨리 이해할 수 있습니다.

### `src/app.ts`

이 파일은 서버를 직접 띄우는 곳이라기보다 **앱 조립 지점**입니다.

- `plugins` 폴더를 자동 등록합니다.
- `routes` 폴더를 자동 등록합니다.
- `AppOptions` 타입으로 Fastify 서버 옵션과 Autoload 옵션을 함께 받을 수 있게 열어 둡니다.

즉, 새 기능을 추가할 때는 보통 `app.ts`를 크게 건드리기보다 `plugins` 또는 `routes` 아래에 파일을 추가하는 흐름이 자연스럽습니다.

### `src/plugins/support.ts`

공용 기능을 Fastify 인스턴스에 붙이는 예제 플러그인입니다.

- `fastify-plugin`으로 플러그인을 감쌉니다.
- `someSupport()` 데코레이터를 등록합니다.
- TypeScript에서 데코레이터 타입을 알 수 있도록 `FastifyInstance` 모듈 확장을 함께 선언합니다.

이 파일은 “공통 기능은 플러그인으로 분리하고, 타입까지 같이 확장한다”는 현재 프로젝트의 방향을 보여줍니다.

### `src/routes/root.ts`

루트 경로(`/`)를 처리하는 가장 단순한 라우트입니다.

- `GET /` 요청에 `{ root: true }`를 반환합니다.

### `src/routes/example/index.ts`

예시 라우트입니다.

- `GET /example` 요청에 `'this is an example'` 문자열을 반환합니다.

이 두 파일을 같이 보면, 이 프로젝트에서 라우트 하나가 어떤 형태로 추가되는지 감이 빠르게 잡힙니다.

## 폴더 구조

```text
.
├─ docs/
│  ├─ index.md
│  └─ structure.md
├─ src/
│  ├─ app.ts
│  ├─ plugins/
│  │  ├─ sensible.ts
│  │  └─ support.ts
│  └─ routes/
│     ├─ root.ts
│     └─ example/
│        └─ index.ts
├─ test/
│  ├─ helper.ts
│  ├─ plugins/
│  │  └─ support.test.ts
│  └─ routes/
│     ├─ example.test.ts
│     └─ root.test.ts
├─ README.md
└─ package.json
```

## 요청이 처리되는 흐름

1. `npm run dev` 또는 `npm start`로 Fastify 앱을 실행합니다.
2. Fastify CLI가 빌드된 앱 진입점(`dist/app.js`)을 읽습니다.
3. 원본 기준으로는 `src/app.ts`가 `plugins`와 `routes`를 자동 등록합니다.
4. 요청이 들어오면 등록된 라우트가 경로에 맞는 핸들러를 실행합니다.
5. 필요한 공통 기능은 플러그인에서 제공하고, 라우트는 그 기능을 사용합니다.

## 처음 읽을 때 추천 순서

1. `README.md`
2. `package.json`
3. `src/app.ts`
4. `src/routes/root.ts`
5. `src/routes/example/index.ts`
6. `src/plugins/support.ts`

## 헷갈리기 쉬운 점

가장 흔한 오해는 `src/app.ts`가 직접 `listen()`을 호출하는 서버 파일이라고 보는 것입니다. 이 프로젝트에서는 그보다 **라우트와 플러그인을 묶는 조립 파일**에 더 가깝고, 실제 실행은 Fastify CLI 스크립트가 맡습니다.
