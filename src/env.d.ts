/// <reference types="astro/client" />

/** tracer.py를 문자열로 가져오기 위한 선언. 빌드 타임 생성기와 같은 파일을 쓴다. */
declare module "*.py?raw" {
  const content: string;
  export default content;
}
