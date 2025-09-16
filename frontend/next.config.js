/** @type {import('next').NextConfig} */
const nextConfig = {
  // Главная настройка для статического экспорта
  output: 'export',

  // Отключает оптимизацию изображений. Необходимо для статического экспорта
  images: {
    unoptimized: true,
  },
  
  // Добавляет слеш в конце URL-ов. Например, `/about` станет `/about/`
  trailingSlash: true,
  
  // Меняет папку для экспорта с 'out' на 'build'
  distDir: 'build',
  
  // Отключает автоматическое перенаправление на URL со слешем
  skipTrailingSlashRedirect: true,
  
  // Отключает проверку ESLint во время сборки
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Отключает проверку TypeScript во время сборки
  typescript: {
    ignoreBuildErrors: true,
  },

  // Дополнительные настройки из вашего примера
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  productionBrowserSourceMaps: false,
  
  logging: {
    level: 'verbose'
  }
}

export default nextConfig
