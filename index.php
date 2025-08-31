<?php
// Определение корневой директории
$documentRoot = __DIR__;

// Получение запрошенного URL
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Убираем слеш в начале и в конце
$requestPath = trim($requestUri, '/');

// Устанавливаем пути для файлов
$filePath = $documentRoot . '/' . $requestPath;
$fileExtension = pathinfo($filePath, PATHINFO_EXTENSION);

// Если запрошенный URL — это просто корень сайта, отдаём index.html
if (empty($requestPath)) {
    $filePath = $documentRoot . '/index.html';
} elseif ($fileExtension === '') {
    // Если запрос без расширения (например, /about), ищем файл .html
    // Это нужно для работы с роутами Next.js
    if (file_exists($filePath . '.html')) {
        $filePath .= '.html';
    } elseif (file_exists($filePath . '/index.html')) {
        $filePath .= '/index.html';
    }
}

// Проверяем, существует ли файл
if (file_exists($filePath)) {
    // Определяем MIME-тип файла для правильной отдачи
    $mimeType = mime_content_type($filePath);
    header("Content-type: " . $mimeType);
    
    // Отдаём содержимое файла
    readfile($filePath);
} else {
    // Если файл не найден, возвращаем 404 ошибку
    http_response_code(404);
    echo "404 - File Not Found";
}
?>