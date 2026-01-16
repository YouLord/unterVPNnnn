document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const deviceItems = document.querySelectorAll('.device-item');
    const addDeviceBtn = document.getElementById('addDeviceBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const deviceModal = document.getElementById('deviceModal');
    const telegramBtn = document.getElementById('telegramBtn');
    const notification = document.getElementById('notification');
    
    // Определение устройства пользователя
    function detectUserDevice() {
        const userAgent = navigator.userAgent;
        
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'ios';
        } else if (/android/i.test(userAgent)) {
            return 'android';
        } else if (/windows/i.test(userAgent)) {
            return 'windows';
        } else if (/macintosh|mac os x/i.test(userAgent)) {
            return 'macos';
        } else if (/tv|smart-tv|smarttv|appletv|googletv|crkey|dlnadoc|roku|pov_tv|hbbtv|ce-html|boxee|kylo|viera|netcast|smarttv|inettvbrowser|webos|tizen|tv|\sdtv/i.test(userAgent)) {
            return 'tv';
        }
        return null;
    }
    
    // Подсветка текущего устройства
    function highlightCurrentDevice() {
        const currentDevice = detectUserDevice();
        if (currentDevice) {
            const deviceElement = document.querySelector(`.device-item[data-device="${currentDevice}"]`);
            if (deviceElement) {
                deviceElement.classList.add('active');
                
                // Добавляем подсказку
                setTimeout(() => {
                    showNotification('Определено ваше устройство');
                }, 1000);
            }
        }
    }
    
    // Обработчик выбора устройства
    deviceItems.forEach(item => {
        item.addEventListener('click', function() {
            const deviceType = this.dataset.device;
            
            // Убираем выделение у всех
            deviceItems.forEach(i => {
                i.classList.remove('selected', 'active');
                i.querySelector('.device-check').style.opacity = '0';
            });
            
            // Добавляем выделение выбранному
            this.classList.add('selected');
            this.querySelector('.device-check').style.opacity = '1';
            
            // Показываем инструкцию для устройства
            showDeviceInstructions(deviceType);
        });
    });
    
    // Показ инструкции для устройства
    function showDeviceInstructions(deviceType) {
        const deviceNames = {
            ios: 'iPhone/iPad',
            android: 'Android',
            windows: 'Windows',
            macos: 'macOS',
            tv: 'Android TV / Apple TV'
        };
        
        const instructions = {
            ios: 'Для iOS установите v2rayTUN из App Store',
            android: 'Для Android скачайте v2rayTUN из Google Play',
            windows: 'Для Windows используйте официальный клиент V2Ray',
            macos: 'Для macOS скачайте клиент из официального сайта',
            tv: 'Для TV используйте специальную версию приложения'
        };
        
        showNotification(`Выбрано: ${deviceNames[deviceType]} - ${instructions[deviceType]}`);
        
        // Обновляем ссылку для Telegram бота с параметром устройства
        updateTelegramLink(deviceType);
    }
    
    // Обновление ссылки Telegram бота
    function updateTelegramLink(deviceType) {
        const link = `https://t.me/untervpn_bot?key=1&device=${deviceType}`;
        telegramBtn.href = link;
    }
    
    // Показать уведомление
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Открыть модальное окно
    addDeviceBtn.addEventListener('click', function() {
        deviceModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    // Закрыть модальное окно
    closeModalBtn.addEventListener('click', function() {
        deviceModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    // Закрыть модальное окно при клике на фон
    deviceModal.addEventListener('click', function(e) {
        if (e.target === deviceModal) {
            deviceModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Обработка ссылки Telegram
    telegramBtn.addEventListener('click', function(e) {
        const selectedDevice = document.querySelector('.device-item.selected');
        if (!selectedDevice) {
            e.preventDefault();
            showNotification('Пожалуйста, сначала выберите устройство');
            return;
        }
        
        // Добавляем эффект клика
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        showNotification('Открывается Telegram...');
    });
    
    // Обработка нажатия клавиши Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && deviceModal.classList.contains('show')) {
            deviceModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Инициализация
    highlightCurrentDevice();
    
    // Показ приветственного сообщения
    setTimeout(() => {
        showNotification('Добро пожаловать в Unter VPN! Выберите ваше устройство.');
    }, 500);
    
    // Добавляем CSS для анимации появления
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .device-item, .add-device-btn, .app-info, .install-btn {
            animation: fadeIn 0.5s ease forwards;
        }
        
        .device-item:nth-child(1) { animation-delay: 0.1s; }
        .device-item:nth-child(2) { animation-delay: 0.2s; }
        .device-item:nth-child(3) { animation-delay: 0.3s; }
        .device-item:nth-child(4) { animation-delay: 0.4s; }
        .device-item:nth-child(5) { animation-delay: 0.5s; }
        .add-device-btn { animation-delay: 0.6s; }
        .app-info { animation-delay: 0.7s; }
        .install-btn { animation-delay: 0.8s; }
    `;
    document.head.appendChild(style);
    
    // Добавляем информацию о количестве устройств
    function updateDeviceCount() {
        const count = localStorage.getItem('unter_vpn_devices') || 0;
        if (count > 0) {
            const subtitle = document.querySelector('.subtitle');
            subtitle.innerHTML += ` <span style="color: var(--accent-color); font-weight: 600;">Уже подключено: ${count} устройств</span>`;
        }
    }
    
    // Симуляция подключения устройства (для демонстрации)
    deviceItems.forEach(item => {
        item.addEventListener('click', function() {
            setTimeout(() => {
                const currentCount = parseInt(localStorage.getItem('unter_vpn_devices') || 0);
                localStorage.setItem('unter_vpn_devices', currentCount + 1);
                updateDeviceCount();
            }, 2000);
        });
    });
    
    updateDeviceCount();
});