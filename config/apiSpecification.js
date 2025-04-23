import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'TextPal API',
      version: '1.0.0',
      description: 'LLM Text Pal 서비스를 위한 API 명세서. 나만의 변칙 존재(Pet)를 만들고 상호작용합니다.',
    },
    servers: [
      {
        url: `http://${process.env.HOST || 'localhost'}:${process.env.SERVER_PORT || 3000}`,
        description: '개발 서버',
      },
    ],

  },

  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;