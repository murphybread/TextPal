import { logger } from "#config/logger.js";

/**
 * 비동기 비즈니스 로직 함수를 실행하고 시작/완료/실패 로깅을 처리하는 래핑 함수
 * 이 함수는 여러 서비스, 컨트롤러 등에서 재사용될 수 있습니다.
 *
 * @param {string} functionName - 로깅 메시지에 표시할 함수 이름 (예: "createPet", "getUserById")
 * @param {function(...any): Promise<any>} logicFn - 실제 비즈니스 로직을 담은 비동기 함수. 인자를 받아 Promise를 반환해야 합니다.
 * @param {...any} args - logicFn에 전달할 인자들. logAndExecute 호출 시 세 번째 인자부터 전달하면 됩니다.
 * @returns {Promise<any>} logicFn의 실행 결과를 반환합니다.
 * @throws {Error} logicFn에서 발생한 에러를 다시 던집니다.
 */
export async function logAndExecute(functionName, logicFn, ...args) {
  logger.debug(`${functionName} 비즈니스 로직 시작`);
  try {
    const result = await logicFn(...args);
    logger.debug(`${functionName} 비즈니스 로직 완료`);
    return result;
  } catch (error) {
    logger.error(`${functionName} 비즈니스 로직 실패`, { error });
    throw error;
  }
}

/**
 * Express 컨트롤러 핸들러 함수를 감싸서 시작 로깅, try...catch, 에러 로깅, next(err) 호출 패턴을 적용하는 유틸리티
 * @param {string} handlerName - 로깅 메시지에 표시할 핸들러 이름 (예: "userController.listUsers")
 * @param {function(req, res, next): Promise<void> | void} handlerFn - 실제 컨트롤러 핸들러 로직을 담은 함수. 비동기일 수 있습니다.
 * @returns {function(req, res, next): Promise<void>} Express 라우트 핸들러로 사용할 수 있는 새로운 비동기 함수
 */
export function wrapControllerHandler(handlerName, handlerFn) {
  return async (req, res, next) => {
    // 컨트롤러 시작 로깅
    logger.debug(`${handlerName} 컨트롤러 처리 시작`, { method: req.method, path: req.originalUrl });

    try {
      await handlerFn(req, res, next);
      // try 블록이 에러 없이 종료되었음을 나타내는 로그
      logger.debug(`${handlerName} 컨트롤러 처리 완료 (정상 종료)`);
    } catch (error) {
      // 에러 발생 시 컨트롤러 에러 로깅
      logger.error(`${handlerName} 컨트롤러 처리 실패`, { error, method: req.method, path: req.originalUrl });

      // 다음 에러 핸들링 미들웨어로 에러를 전달
      next(error);
    }
  };
}
