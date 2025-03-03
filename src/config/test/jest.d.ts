import 'jest-extended';

declare global {
  namespace NodeJS {
    interface Global {
      mockFn: jest.Mock;
      mockResolvedValue: (value: any) => jest.Mock;
      mockRejectedValue: (value: any) => jest.Mock;
      mockImplementation: (fn: any) => jest.Mock;
    }
  }
}

// 빈 export 구문을 추가하여 모듈로 인식되도록 합니다.
export {};
