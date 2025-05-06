CREATE USER 'hyvinvointi'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON `HealthDiary` TO 'hyvinvointi'@'localhost';
FLUSH PRIVILEGES;
