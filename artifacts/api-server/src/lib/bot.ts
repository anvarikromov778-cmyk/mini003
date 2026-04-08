import { db } from "@workspace/db";
import { authCodes } from "@workspace/db/schema";
import { eq, and, gt, isNull, desc } from "drizzle-orm";
import { logger } from "./logger";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function setupWebhook() {
  if (!BOT_TOKEN) {
    logger.warn("TELEGRAM_BOT_TOKEN not set, skipping webhook setup");
    return;
  }
  const appUrl = process.env.APP_URL;
  if (!appUrl) {
    logger.warn("APP_URL not set, skipping webhook setup");
    return;
  }
  try {
    const webhookUrl = `${appUrl}/api/bot/webhook`;
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl, drop_pending_updates: true }),
    });
    const data = await res.json() as { ok: boolean; [key: string]: unknown };
    if (data.ok) {
      logger.info({ webhookUrl }, "Telegram webhook set successfully");
    } else {
      logger.error({ data }, "Failed to set Telegram webhook");
    }
  } catch (err) {
    logger.error(err, "Error setting Telegram webhook");
  }
}

async function sendMessage(chatId: number | string, text: string) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

export async function handleBotUpdate(update: any) {
  try {
    const message = update?.message;
    if (!message || !message.text) return;

    const chatId = message.chat.id;
    const from = message.from;
    const text = message.text.trim();
    const telegramUsername = (from?.username || "").toLowerCase().replace(/^@/, "");

    if (text.startsWith("/start") || text.startsWith("/code")) {
      // FIX: извлекаем username из параметра /start USERNAME
      // Ссылка с сайта: t.me/bot?start=USERNAME
      const param = text.split(" ")[1]?.toLowerCase().replace(/^@/, "") || "";

      // Целевой username: из параметра (если есть), иначе свой
      const targetUsername = param || telegramUsername;

      if (!targetUsername) {
        await sendMessage(chatId, "❌ Не удалось определить пользователя.\n\nВернитесь на сайт и нажмите кнопку <b>«Получить код»</b> — она откроет бота автоматически.");
        return;
      }

      const now = Math.floor(Date.now() / 1000);

      // Ищем свежий неиспользованный код
      const [authCode] = await db
        .select()
        .from(authCodes)
        .where(
          and(
            eq(authCodes.telegramUsername, targetUsername),
            gt(authCodes.expiresAt, now),
            isNull(authCodes.usedAt)
          )
        )
        .orderBy(desc(authCodes.createdAt))
        .limit(1);

      if (!authCode) {
        const appUrl = process.env.APP_URL || "сайт";
        await sendMessage(
          chatId,
          `❌ Код не найден или истёк.\n\n` +
          `Вернитесь на <a href="${appUrl}">${appUrl}</a>, введите @${targetUsername} и нажмите «Получить код», затем снова откройте бота.`
        );
        return;
      }

      // Сохраняем telegramId чтобы привязать аккаунт
      await db
        .update(authCodes)
        .set({ telegramId: String(from.id) })
        .where(eq(authCodes.id, authCode.id));

      const minutesLeft = Math.ceil((authCode.expiresAt - now) / 60);

      await sendMessage(
        chatId,
        `✅ Ваш код для регистрации на Minions Market:\n\n` +
        `<b>${authCode.code}</b>\n\n` +
        `Введите его на сайте в поле «Код». Действует ещё ${minutesLeft} мин.\n\n` +
        `⚠️ Никому не сообщайте этот код.`
      );
      return;
    }

    // 2FA code request
    if (text.startsWith("/2fa")) {
      const { users } = await import("@workspace/db/schema");
      const [user] = await db.select().from(users).where(and(eq(users.telegramId, String(from.id)), eq(users.twoFAEnabled, true))).limit(1);
      if (user) {
        const code = Math.random().toString().slice(2, 8);
        const expiresAt = Math.floor(Date.now() / 1000) + 300; // 5 minutes
        await db.update(users).set({ twoFACode: code, twoFAExpires: expiresAt }).where(eq(users.id, user.id));
        await sendMessage(chatId, `🔐 Ваш код подтверждения:\n\n<b>${code}</b>\n\nДействует 5 минут.`);
      } else {
        await sendMessage(chatId, "❌ 2FA не активирована. Включите её в настройках профиля.");
      }
      return;
    }

    // Admin commands
    if (text.startsWith("/")) {
      await handleAdminCommand(chatId, text, String(from.id));
      return;
    }

    // Любое другое сообщение
    const appUrl = process.env.APP_URL || "сайт";
    await sendMessage(
      chatId,
      `👋 Привет! Я бот для регистрации на Minions Market.\n\n` +
      `Чтобы получить код:\n` +
      `1. Перейдите на <a href="${appUrl}">${appUrl}</a>\n` +
      `2. Введите ваш Telegram @username\n` +
      `3. Нажмите кнопку <b>«Получить код»</b> — она откроет меня автоматически`
    );
  } catch (err) {
    logger.error(err, "Bot update error");
  }
}

async function handleAdminCommand(chatId: number | string, text: string, telegramId: string) {
  try {
    // Check if user is admin
    const [user] = await db.select().from(users).where(and(eq(users.telegramId, telegramId), eq(users.isAdmin, true))).limit(1);
    if (!user) {
      await sendMessage(chatId, "❌ У вас нет прав администратора.");
      return;
    }

    const command = text.toLowerCase().trim();
    if (command === "/stats") {
      const { sql: sqlFn } = await import("drizzle-orm");
      const [{ totalUsers }] = await db.select({ totalUsers: sql<number>`count(*)::int` }).from(users);
      const [{ totalProducts }] = await db.select({ totalProducts: sql<number>`count(*)::int` }).from(products).where(eq(products.status, "active"));
      const { deals } = await import("@workspace/db/schema");
      const [{ totalDeals }] = await db.select({ totalDeals: sql<number>`count(*)::int` }).from(deals).where(eq(deals.status, "completed"));
      await sendMessage(chatId, `📊 Статистика:\n👥 Пользователей: ${totalUsers}\n📦 Товаров: ${totalProducts}\n🤝 Сделок: ${totalDeals}`);
    } else if (command.startsWith("/ban ")) {
      const username = command.split(" ")[1]?.replace(/^@/, "");
      if (!username) {
        await sendMessage(chatId, "❌ Укажите username: /ban @username");
        return;
      }
      const [targetUser] = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (!targetUser) {
        await sendMessage(chatId, "❌ Пользователь не найден.");
        return;
      }
      await db.update(users).set({ isBanned: true }).where(eq(users.id, targetUser.id));
      await sendMessage(chatId, `✅ Пользователь @${username} забанен.`);
    } else if (command.startsWith("/unban ")) {
      const username = command.split(" ")[1]?.replace(/^@/, "");
      if (!username) {
        await sendMessage(chatId, "❌ Укажите username: /unban @username");
        return;
      }
      const [targetUser] = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (!targetUser) {
        await sendMessage(chatId, "❌ Пользователь не найден.");
        return;
      }
      await db.update(users).set({ isBanned: false }).where(eq(users.id, targetUser.id));
      await sendMessage(chatId, `✅ Пользователь @${username} разбанен.`);
    } else {
      await sendMessage(chatId, "📋 Доступные команды:\n/stats - статистика\n/ban @username - забанить\n/unban @username - разбанить");
    }
  } catch (err) {
    logger.error(err, "Admin command error");
    await sendMessage(chatId, "❌ Ошибка выполнения команды.");
  }
}
