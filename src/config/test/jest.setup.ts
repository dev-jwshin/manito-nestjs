import 'jest-extended';

// 테스트 타임아웃 설정
jest.setTimeout(30000);

// 전역 클린업
afterAll(async () => {
  // 테스트 후 정리 작업이 필요한 경우 여기에 추가
});

// 모킹 유틸리티
global.mockFn = jest.fn;
global.mockResolvedValue = (value: any) => jest.fn().mockResolvedValue(value);
global.mockRejectedValue = (value: any) => jest.fn().mockRejectedValue(value);
global.mockImplementation = (fn: any) => jest.fn().mockImplementation(fn);

// 콘솔 에러 및 경고 감지
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // 테스트 중 발생하는 콘솔 에러와 경고를 실패로 처리
  console.error = (...args: any[]) => {
    originalConsoleError(...args);
    throw new Error(`Console error detected: ${args.join(' ')}`);
  };

  console.warn = (...args: any[]) => {
    originalConsoleWarn(...args);
    throw new Error(`Console warning detected: ${args.join(' ')}`);
  };
});

afterAll(() => {
  // 원래 콘솔 함수 복원
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
