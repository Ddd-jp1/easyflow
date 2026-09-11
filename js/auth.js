/* =====================================================
   EASYFLOW AUTH
   Регистрация / вход / выход / Admin
   ===================================================== */

const EasyFlowAuth = {

    USERS_KEY: "easyflow_users",
    CURRENT_KEY: "easyflow_current_user",

    /*
       Данные администратора.

       Имя:
       Admin

       Пароль:
       080810
    */

    ADMIN_NAME: "Admin",
    ADMIN_PASSWORD: "080810",


    /* =================================================
       Получить всех пользователей
       ================================================= */

    getUsers() {

        const saved =
            localStorage.getItem(this.USERS_KEY);

        if (!saved) {
            return [];
        }

        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Ошибка загрузки пользователей:",
                error
            );

            return [];
        }
    },


    /* =================================================
       Сохранить пользователей
       ================================================= */

    saveUsers(users) {

        localStorage.setItem(
            this.USERS_KEY,
            JSON.stringify(users)
        );

    },


    /* =================================================
       Регистрация
       ================================================= */

    register(name, password) {

        name = String(name).trim();

        if (!name) {

            return {
                success: false,
                message: "Введите имя."
            };

        }

        if (password.length < 4) {

            return {
                success: false,
                message:
                    "Пароль должен содержать минимум 4 символа."
            };

        }


        /*
           Admin нельзя зарегистрировать обычной
           регистрацией.
        */

        if (
            name.toLowerCase() ===
            this.ADMIN_NAME.toLowerCase()
        ) {

            return {
                success: false,
                message:
                    "Это имя зарезервировано."
            };

        }


        const users = this.getUsers();

        const exists =
            users.some(
                user =>
                    user.name.toLowerCase() ===
                    name.toLowerCase()
            );


        if (exists) {

            return {
                success: false,
                message:
                    "Пользователь с таким именем уже существует."
            };

        }


        const user = {

            id:
                Date.now().toString(),

            name: name,

            password: password,

            isAdmin: false,

            avatar: "👤",

            stars: 0,

            totalGames: 0,

            totalWins: 0,

            totalScore: 0,

            achievements: [],

            records: {},

            inventory: [],

            equipped: {},

            createdAt:
                new Date().toISOString()

        };


        users.push(user);

        this.saveUsers(users);


        return {
            success: true,
            user: user
        };

    },


    /* =================================================
       Вход
       ================================================= */

    login(name, password) {

        name = String(name).trim();

        /*
           Специальный Admin
        */

        if (
            name === this.ADMIN_NAME &&
            password === this.ADMIN_PASSWORD
        ) {

            const admin = {

                id: "admin",

                name: "Admin",

                isAdmin: true,

                avatar: "🛡️",

                stars: 999999,

                totalGames: 0,

                totalWins: 0,

                totalScore: 0,

                achievements: [],

                records: {},

                inventory: [],

                equipped: {}

            };


            localStorage.setItem(
                this.CURRENT_KEY,
                JSON.stringify(admin)
            );


            return {
                success: true,
                user: admin
            };

        }


        /*
           Обычный пользователь
        */

        const users = this.getUsers();

        const user =
            users.find(
                u =>
                    u.name.toLowerCase() ===
                    name.toLowerCase() &&
                    u.password === password
            );


        if (!user) {

            return {
                success: false,
                message:
                    "Неверное имя или пароль."
            };

        }


        localStorage.setItem(
            this.CURRENT_KEY,
            JSON.stringify(user)
        );


        return {
            success: true,
            user: user
        };

    },


    /* =================================================
       Текущий пользователь
       ================================================= */

    getCurrentUser() {

        const saved =
            localStorage.getItem(
                this.CURRENT_KEY
            );

        if (!saved) {
            return null;
        }

        try {

            return JSON.parse(saved);

        } catch {

            return null;

        }

    },


    /* =================================================
       Проверка входа
       ================================================= */

    isLoggedIn() {

        return this.getCurrentUser() !== null;

    },


    /* =================================================
       Проверка Admin
       ================================================= */

    isAdmin() {

        const user =
            this.getCurrentUser();

        return !!(
            user &&
            user.isAdmin === true &&
            user.name === "Admin"
        );

    },


    /* =================================================
       Выход
       ================================================= */

    logout() {

        localStorage.removeItem(
            this.CURRENT_KEY
        );

        window.location.href =
            "login.html";

    },


    /* =================================================
       Обновить текущего пользователя
       ================================================= */

    updateCurrentUser(changes) {

        const current =
            this.getCurrentUser();

        if (!current) {
            return false;
        }


        /*
           Admin хранится отдельно
        */

        if (current.isAdmin) {

            const updated = {
                ...current,
                ...changes
            };

            localStorage.setItem(
                this.CURRENT_KEY,
                JSON.stringify(updated)
            );

            return true;
        }


        const users =
            this.getUsers();

        const index =
            users.findIndex(
                u => u.id === current.id
            );


        if (index === -1) {
            return false;
        }


        users[index] = {
            ...users[index],
            ...changes
        };


        this.saveUsers(users);


        localStorage.setItem(
            this.CURRENT_KEY,
            JSON.stringify(
                users[index]
            )
        );


        return true;

    },


    /* =================================================
       Удаление пользователя
       ================================================= */

    deleteUser(id) {

        if (!this.isAdmin()) {
            return false;
        }

        const users =
            this.getUsers();

        const filtered =
            users.filter(
                user => user.id !== id
            );

        this.saveUsers(filtered);

        return true;

    },


    /* =================================================
       Получить статистику пользователей
       ================================================= */

    getSiteStats() {

        const users =
            this.getUsers();

        let totalGames = 0;
        let totalWins = 0;
        let totalScore = 0;
        let totalStars = 0;


        users.forEach(user => {

            totalGames +=
                Number(user.totalGames) || 0;

            totalWins +=
                Number(user.totalWins) || 0;

            totalScore +=
                Number(user.totalScore) || 0;

            totalStars +=
                Number(user.stars) || 0;

        });


        return {

            users: users.length,

            totalGames,

            totalWins,

            totalScore,

            totalStars

        };

    }

};
