const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');

dotenv.config();

console.log('TOKEN_BASIC:', process.env.TOKEN_BASIC);

// middleware
const addAuthorizationHeader = (req, res, next) => {
    req.headers['Authorization'] = `Basic ${process.env.TOKEN_BASIC}`;
    next();
};

module.exports = function(app) {

    // Middleware geral para todas as rotas
    app.use(addAuthorizationHeader);

    // auth pegar dados do usuário
    app.use(
        '/api/auth/get-data',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: {
            '^/api/auth/get-data': '/auth/get-data',
            },
        })
    );

    // auth registro de usuário
    app.use(
        '/api/auth/register',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: {
            '^/api/auth/register': '/auth/register',
            },
        })
    );

    // vagas
    app.use(
        '/api/vacancies',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: {
            '^/api/vacancies': '/vacancies',
            },
        })
    );

    // cursos
    app.use(
        '/api/courses',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: {
            '^/api/courses': '/courses',
            },
        })
    );

    // curriculos
    app.use(
        '/api/resumes',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: {
            '^/api/resumes': '/resumes',
            },
        })
    );

    // app.use((req, res, next) => {
    // console.log('Recebida requisição:', req.url);
    // next();
    // });

};