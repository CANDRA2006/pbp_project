import { COLORS } from './Colors';

export type Post = {
  id: string;
  username: string;
  category: 'WebSec' | 'Forensics' | 'Crypto' | 'OSINT';
  color: string;
  title: string;
  code: string;
  excerpt: string;
  votes: number;
  comments: number;
  time: string;
};

export type RoadmapTopic = { id: string; title: string; isCompleted: boolean };
export type RoadmapModule = { id: string; title: string; description: string; topics: RoadmapTopic[] };
export type ChatMessage = { id: string; role: 'user' | 'bot'; text: string; time: string };
export type UserProfile = {
  name: string;
  username: string;
  bio: string;
  avatarInitials: string;
  totalWriteups: number;
  totalLikes: number;
  learningProgress: number;
  specializations: string[];
};

export const DUMMY_POSTS: Post[] = [
  { id: '1', username: 'nullbyte', category: 'WebSec', color: COLORS.cyan, title: 'SQL Injection pada Endpoint /api/v1/users', excerpt: 'Menemukan celah pada parameter id dan menguji dampaknya dengan payload terkontrol.', code: "GET /api/v1/users?id=1' UNION SELECT\n  username, password FROM admin--\n\nHTTP/1.1 200 OK", votes: 42, comments: 8, time: '2 jam yang lalu' },
  { id: '2', username: 'd1g1t4l_forensic', category: 'Forensics', color: COLORS.emerald, title: 'Memory Forensics dengan Volatility 3', excerpt: 'Alur ringkas untuk menemukan proses mencurigakan dari sebuah RAM dump.', code: '$ vol -f memory.dmp windows.pstree\nPID   PPID  Name\n4     0     System\n384   4     smss.exe', votes: 37, comments: 12, time: '5 jam yang lalu' },
  { id: '3', username: 'cr4ckm3', category: 'Crypto', color: '#F59E0B', title: 'Breaking RSA: Ketika p dan q Terlalu Dekat', excerpt: 'Eksperimen faktorisasi Fermat pada modulus RSA untuk lab CTF lokal.', code: 'import gmpy2\ndef fermat_factor(n):\n    a = gmpy2.isqrt(n) + 1\n    return factor(n, a)', votes: 56, comments: 15, time: '1 hari yang lalu' },
  { id: '4', username: 'os1nt_hunter', category: 'OSINT', color: '#A78BFA', title: 'Recon Otomatis: Pipeline Enumerasi Subdomain', excerpt: 'Menggabungkan beberapa tool untuk pemetaan aset yang sudah diizinkan.', code: '$ subfinder -d example.test | httpx -sc\n[200] app.example.test\n[403] admin.example.test', votes: 29, comments: 6, time: '12 jam yang lalu' },
];

export const DUMMY_ROADMAP: RoadmapModule[] = [
  { id: 'fundamentals', title: 'Fundamental Keamanan', description: 'Fondasi jaringan, Linux, dan web.', topics: [{ id: 'net', title: 'Dasar jaringan dan TCP/IP', isCompleted: true }, { id: 'linux', title: 'Terminal Linux', isCompleted: true }, { id: 'http', title: 'HTTP, DNS, dan browser', isCompleted: false }] },
  { id: 'web', title: 'Web Security', description: 'Pahami kerentanan web dalam lab aman.', topics: [{ id: 'owasp', title: 'OWASP Top 10', isCompleted: true }, { id: 'sqli', title: 'SQL Injection di lab', isCompleted: false }, { id: 'xss', title: 'Cross-site scripting', isCompleted: false }] },
  { id: 'forensics', title: 'Forensics & Incident Response', description: 'Analisis artefak dan investigasi insiden.', topics: [{ id: 'logs', title: 'Analisis log', isCompleted: false }, { id: 'memory', title: 'Dasar memory forensics', isCompleted: false }] },
];

export const DUMMY_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', role: 'bot', text: 'Halo! Saya CyberBot. Mau belajar topik keamanan siber apa hari ini?', time: '09:40' },
  { id: 'm2', role: 'user', text: 'Apa perbedaan hashing dan enkripsi?', time: '09:41' },
  { id: 'm3', role: 'bot', text: 'Enkripsi dapat dibalik dengan kunci yang tepat. Hashing dirancang satu arah dan biasanya dipakai untuk verifikasi integritas atau penyimpanan kata sandi.', time: '09:41' },
  { id: 'm4', role: 'user', text: 'Bisa beri contoh penggunaan hash?', time: '09:42' },
  { id: 'm5', role: 'bot', text: 'Di lab, bandingkan hash SHA-256 sebuah file sebelum dan sesudah perubahan. Untuk kata sandi, gunakan algoritma khusus seperti Argon2 dengan salt.', time: '09:42' },
];

export const DUMMY_PROFILE: UserProfile = {
  name: 'CyberHacker', username: '@cyberhacker', bio: 'Belajar, berbagi, dan membangun internet yang lebih aman.', avatarInitials: 'CH',
  totalWriteups: 12, totalLikes: 142, learningProgress: 38, specializations: ['WebSec', 'OSINT', 'Forensics'],
};
