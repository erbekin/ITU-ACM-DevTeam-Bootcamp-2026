import { defineConfig } from "prisma/config";

// npx prisma komutunu Prisma kendi süreci olarak başlatır; ona --env-file
// geçiremeyiz, o yüzden .env'i burada kendimiz okuyoruz.
//
// Dosya henüz yoksa sessizce geçiyoruz — böylece hata "config yüklenemedi"
// diye değil, Prisma'nın kendi "DATABASE_URL gerekli" mesajıyla gelir.

// Eğer TEST değişkeni 1 ya da true ise, .env.test i oku.
// Başka bir şeyse veya yoksa .env oku
let envFileName = () => {
  const re = /^\s*(?:true|1)\s*$/i;
  if (re.test(process.env.TEST) === true) {
    console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║   -> Using test environment.                           ║
  ║        (Variable 'TEST' was set true)                  ║
  ╚════════════════════════════════════════════════════════╝`);
    return ".env.test";
  }
  console.log(`
╔════════════════════════════════════════════════════════╗
║   -> Using production environment.                     ║
║        (Variable 'TEST' was not set true)              ║
╚════════════════════════════════════════════════════════╝`);
  return ".env";
};

try {
  process.loadEnvFile(envFileName());
} catch {
  // .env yok; DATABASE_URL ortamdan gelebilir ya da hiç gelmeyebilir
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL },
});
