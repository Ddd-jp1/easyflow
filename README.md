<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>EasyFlow — Главная</title>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            background: #f4f7fb;
            color: #111827;
            min-height: 100vh;
        }

        /* ШАПКА */

        header {
            background: white;
            border-bottom: 1px solid #e5e7eb;
            padding: 18px 6%;
        }

        .header {
            max-width: 900px;
            margin: auto;

            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            color: #2563eb;
            font-size: 27px;
            font-weight: bold;
            text-decoration: none;
        }

        .nav-link {
            color: #2563eb;
            text-decoration: none;
            font-weight: bold;
        }

        .nav-link:hover {
            color: #1d4ed8;
        }

        /* ПРИВЕТСТВИЕ */

        .welcome {
            max-width: 900px;
            margin: 50px auto;
            padding: 20px;
        }

        .welcome-content {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 22px;
            padding: 55px 25px;
            text-align: center;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.07);
        }

        .welcome h1 {
            color: #2563eb;
            font-size: 40px;
            margin-bottom: 18px;
        }

        .welcome p {
            color: #64748b;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 8px;
        }

        .welcome-button {
            display: inline-block;
            margin-top: 28px;
            padding: 14px 28px;

            background: #2563eb;
            color: white;

            text-decoration: none;
            border-radius: 12px;

            font-weight: bold;
            font-size: 16px;

            transition: 0.2s;
        }

        .welcome-button:hover {
            background: #1d4ed8;
            transform: translateY(-2px);
        }

        /* КАРТОЧКИ */

        .features {
            max-width: 900px;
            margin: 0 auto 40px;
            padding: 0 20px;

            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }

        .feature {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            padding: 25px 15px;
            text-align: center;
        }

        .feature-icon {
            font-size: 35px;
            margin-bottom: 10px;
        }

        .feature h2 {
            font-size: 20px;
            margin-bottom: 8px;
        }

        .feature p {
            color: #64748b;
            font-size: 14px;
            line-height: 1.5;
        }

        /* FOOTER */

        footer {
            margin-top: 50px;
            background: #111827;
            color: #9ca3af;
            text-align: center;
            padding: 25px;
        }

        /* МОБИЛЬНАЯ ВЕРСИЯ */

        @media (max-width: 600px) {

            .header {
                padding: 0;
            }

            .welcome {
                margin: 25px auto;
                padding: 12px;
            }

            .welcome-content {
                padding: 40px 18px;
            }

            .welcome h1 {
                font-size: 29px;
            }

            .welcome p {
                font-size: 16px;
            }

            .features {
                grid-template-columns: 1fr;
                padding: 0 12px;
            }

            .welcome-button {
                width: 100%;
                max-width: 300px;
            }
        }
    </style>
</head>

<body>

    <!-- ШАПКА -->

    <header>
        <div class="header">

            <a href="index.html" class="logo">
                EasyFlow
            </a>

            <a href="games.html" class="nav-link">
                🎮 Игры
            </a>

        </div>
    </header>


    <!-- ПРИВЕТСТВИЕ -->

    <section class="welcome">

        <div class="welcome-content">

            <h1>
                👋 Добро пожаловать в EasyFlow!
            </h1>

            <p>
                Твой удобный сайт для игр,
                развлечений и хорошего настроения.
            </p>

            <p>
                Выбирай игру, устанавливай рекорды
                и наслаждайся временем в EasyFlow 🎮
            </p>

            <a href="games.html" class="welcome-button">
                🎮 Перейти к играм
            </a>

        </div>

    </section>


    <!-- ВОЗМОЖНОСТИ -->

    <section class="features">

        <div class="feature">

            <div class="feature-icon">
                🎮
            </div>

            <h2>
                Игры
            </h2>

            <p>
                Играй в интересные игры
                прямо на сайте.
            </p>

        </div>


        <div class="feature">

            <div class="feature-icon">
                🏆
            </div>

            <h2>
                Рекорды
            </h2>

            <p>
                Устанавливай личные рекорды
                и улучшай свои результаты.
            </p>

        </div>


        <div class="feature">

            <div class="feature-icon">
                📱
            </div>

            <h2>
                На любом устройстве
            </h2>

            <p>
                EasyFlow удобно использовать
                на компьютере и телефоне.
            </p>

        </div>

    </section>


    <!-- FOOTER -->

    <footer>

        © 2026 EasyFlow

    </footer>

</body>
</html>
