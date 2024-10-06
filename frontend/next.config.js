/** @type {import('next').NextConfig} */
const BACKEND_HOST = process.env.BACKEND_HOST
const BACKEND_PORT = process.env.BACKEND_PORT
const nextConfig = {
    reactStrictMode: true,
    rewrites(){
        return [
            {
                source: "/api/:path*",
                destination: `http://${BACKEND_HOST}:${BACKEND_PORT}/:path*`
            }
        ]
    }
}

module.exports = nextConfig
