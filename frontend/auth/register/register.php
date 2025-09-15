<?php
header('Content-Type: application/json');

function send_sms($phone, $code) {
    // Здесь должен быть ваш код интеграции с SMS API
    // Например, SMS.ru, Twilio и т.д.
    // return true если успешно, иначе false
    return true;
}

function send_telegram($phone, $code) {
    // Здесь должен быть ваш код интеграции с Telegram Bot API
    // return true если успешно, иначе false
    return true;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['action'] === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);
    $phone = trim($data['phone'] ?? '');
    $password = $data['password'] ?? '';
    $confirmPassword = $data['confirmPassword'] ?? '';
    $smsMethod = $data['smsMethod'] ?? 'sms'; // sms или telegram

    // Валидация
    if (!preg_match('/^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/', $phone)) {
        echo json_encode(['success' => false, 'message' => 'Некорректный номер телефона']);
        exit;
    }
    if (strlen($password) < 6) {
        echo json_encode(['success' => false, 'message' => 'Пароль слишком короткий']);
        exit;
    }
    if ($password !== $confirmPassword) {
        echo json_encode(['success' => false, 'message' => 'Пароли не совпадают']);
        exit;
    }

    // Генерация кода подтверждения
    $code = rand(100000, 999999);

    // Сохраняем пользователя и код (пример, без БД)
    file_put_contents(__DIR__ . '/users.txt', "$phone|$password|$code\n", FILE_APPEND);

    // Отправка кода
    $sent = false;
    if ($smsMethod === 'sms') {
        $sent = send_sms($phone, $code);
    } else {
        $sent = send_telegram($phone, $code);
    }

    if ($sent) {
        echo json_encode(['success' => true, 'message' => 'Код отправлен!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Ошибка отправки кода']);
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Неверный запрос']);