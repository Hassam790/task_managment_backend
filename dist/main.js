"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    var _a, _b;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const corsOrigin = (_b = (_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(',').map((o) => o.trim())) !== null && _b !== void 0 ? _b : ['http://localhost:3000'];
    app.enableCors({ origin: corsOrigin, credentials: true });
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.PORT || 4000;
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Task Management API')
        .setDescription('Real-Time Collaborative Task Management System API')
        .setVersion('1.0')
        .addCookieAuth('access_token', {
        type: 'apiKey',
        in: 'cookie',
    })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map