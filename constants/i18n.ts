import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const resources = {
  id: { translation: {
    login_title: 'Masuk ke CyberHub', email_placeholder: 'Alamat email', password_placeholder: 'Kata sandi', password_required: 'Masukkan kata sandi.', btn_login: 'Masuk', btn_register: 'Buat akun', select_specialization: 'Pilih spesialisasi', error_login: 'Email atau kata sandi tidak valid.', register_title: 'Buat akun CyberHub', username_placeholder: 'Nama pengguna', error_register: 'Pendaftaran gagal. Periksa kembali data Anda.', registration_check_email: 'Akun dibuat. Periksa email untuk verifikasi sebelum masuk.', resend_verification: 'Kirim ulang email verifikasi', verification_sent: 'Email verifikasi dikirim ulang. Periksa kotak masuk Anda.',
    email_rate_limit: 'Terlalu banyak permintaan email verifikasi. Tunggu beberapa menit sebelum mencoba lagi. Jika akun sudah terdaftar, periksa kotak masuk dan folder spam.',
    password_rule_length: 'Minimal 8 karakter', password_rule_lowercase: 'Satu huruf kecil', password_rule_uppercase: 'Satu huruf besar', password_rule_number: 'Satu angka', password_rule_symbol: 'Satu simbol (contoh: !@#$)', password_strength_error: 'Lengkapi semua syarat kekuatan kata sandi.', theme_dark: 'Mode gelap', theme_light: 'Mode terang', lang_id: 'Bahasa Indonesia', lang_en: 'English', lang_zh: '中文', settings_title: 'Pengaturan', logout: 'Keluar', auth_subtitle: 'Akses ruang belajar keamanan siber Anda.', confirm_password: 'Konfirmasi kata sandi', password_mismatch: 'Kata sandi tidak cocok.', email_invalid: 'Masukkan alamat email yang valid.', password_short: 'Kata sandi minimal 8 karakter.', username_short: 'Nama pengguna minimal 3 karakter.', profile_error: 'Akun dibuat, tetapi profil belum tersimpan.', back_to_login: 'Sudah punya akun? Masuk', no_account: 'Belum punya akun? Daftar', language: 'Bahasa', appearance: 'Tampilan', save_preferences: 'Preferensi tersimpan di perangkat ini.'
  } },
  en: { translation: {
    login_title: 'Sign in to CyberHub', email_placeholder: 'Email address', password_placeholder: 'Password', password_required: 'Enter your password.', btn_login: 'Sign in', btn_register: 'Create account', select_specialization: 'Choose a specialization', error_login: 'The email or password is incorrect.', register_title: 'Create your CyberHub account', username_placeholder: 'Username', error_register: 'Registration failed. Check your details and try again.', registration_check_email: 'Account created. Check your email to verify it before signing in.', resend_verification: 'Resend verification email', verification_sent: 'Verification email sent again. Check your inbox.',
    email_rate_limit: 'Too many verification email requests. Wait a few minutes before trying again. If you already registered, check your inbox and spam folder.',
    password_rule_length: 'At least 8 characters', password_rule_lowercase: 'One lowercase letter', password_rule_uppercase: 'One uppercase letter', password_rule_number: 'One number', password_rule_symbol: 'One symbol (for example: !@#$)', password_strength_error: 'Meet all password strength requirements.', theme_dark: 'Dark mode', theme_light: 'Light mode', lang_id: 'Bahasa Indonesia', lang_en: 'English', lang_zh: '中文', settings_title: 'Settings', logout: 'Sign out', confirm_password: 'Confirm password', password_mismatch: 'Passwords do not match.', email_invalid: 'Enter a valid email address.', password_short: 'Password must be at least 8 characters.', username_short: 'Username must be at least 3 characters.', profile_error: 'Account created, but the profile could not be saved.', back_to_login: 'Already have an account? Sign in', no_account: 'New to CyberHub? Create an account', language: 'Language', appearance: 'Appearance', save_preferences: 'Preferences are saved on this device.', auth_subtitle: 'Your space to learn cybersecurity.'
  } },
  zh: { translation: {
    login_title: '登录 CyberHub', email_placeholder: '电子邮箱', password_placeholder: '密码', password_required: '请输入密码。', btn_login: '登录', btn_register: '创建账户', select_specialization: '选择专业方向', error_login: '邮箱或密码不正确。', register_title: '创建 CyberHub 账户', username_placeholder: '用户名', error_register: '注册失败，请检查信息后重试。', registration_check_email: '账户已创建。请查收验证邮件后再登录。', resend_verification: '重新发送验证邮件', verification_sent: '验证邮件已重新发送，请检查收件箱。',
    email_rate_limit: '验证邮件请求过多。请等待几分钟后再试。如果账户已注册，请检查收件箱和垃圾邮件文件夹。',
    password_rule_length: '至少 8 个字符', password_rule_lowercase: '至少一个小写字母', password_rule_uppercase: '至少一个大写字母', password_rule_number: '至少一个数字', password_rule_symbol: '至少一个符号（例如：!@#$）', password_strength_error: '请满足所有密码强度要求。', theme_dark: '深色模式', theme_light: '浅色模式', lang_id: '印度尼西亚语', lang_en: '英语', lang_zh: '中文', settings_title: '设置', logout: '退出登录', confirm_password: '确认密码', password_mismatch: '两次输入的密码不一致。', email_invalid: '请输入有效的邮箱地址。', password_short: '密码至少需要 8 个字符。', username_short: '用户名至少需要 3 个字符。', profile_error: '账户已创建，但个人资料保存失败。', back_to_login: '已有账户？登录', no_account: '还没有账户？注册', language: '语言', appearance: '外观', save_preferences: '偏好设置已保存在此设备。', auth_subtitle: '您的网络安全学习空间。'
  } },
} as const;

export type AppLanguage = keyof typeof resources;

void i18n.use(initReactI18next).init({
  resources,
  lng: 'id',
  fallbackLng: 'id',
  supportedLngs: ['id', 'en', 'zh'],
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (language) => {
  if (language in resources) void AsyncStorage.setItem('cyberhub.language', language).catch(() => {});
});

void (async () => {
  try {
    const saved = await AsyncStorage.getItem('cyberhub.language');
    const legacyMap: Record<string, AppLanguage> = { ID: 'id', EN: 'en', ZH: 'zh' };
    const preferred = saved?.toLowerCase() ?? legacyMap[saved ?? ''] ?? getLocales()[0]?.languageCode;
    if (preferred && preferred in resources) await i18n.changeLanguage(preferred);
  } catch { /* Keep Indonesian when local preferences are unavailable. */ }
})();

export default i18n;
