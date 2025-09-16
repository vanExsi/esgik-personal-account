module.exports = {
  source: 'build', // Папка с собранными файлами
  include: ['/**'],
  exclude: ['/404', '/_error'],
  fixWebpackChunks: true, // Автоматически исправляет пути к chunks
  puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  // Исправляем пути к CSS и JS файлам
  preprocess: (content, route) => {
    return content
      .replace(/\/_next\//g, './_next/')
      .replace(/\/static\//g, './static/');
  }
}