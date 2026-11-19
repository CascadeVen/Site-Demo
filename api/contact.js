
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    const { form, fields, elapsed } = req.body || {};

    if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
      return res.status(400).json({ ok: false });
    }

    // Spam protection: silently accept honeypot submissions.
    if (fields.hp) {
      return res.status(200).json({ ok: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !to || !from) {
      console.error("Missing email environment variables");
      return res.status(500).json({ ok: false });
    }

    const formName = String(form || "Website")
      .replace(/[<>]/g, "")
      .slice(0, 60);

    const entries = Object.entries(fields)
      .filter(([key, value]) =>
        key !== "hp" && typeof value === "string"
      )
      .map(([key, value]) => `${key}: ${value}`);

    const emailField = Object.entries(fields).find(
      ([key, value]) =>
        key.toLowerCase() === "email" &&
        typeof value === "string"
    );

    const replyTo = emailField?.[1].trim();

    const validEmail = replyTo &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New ${formName} request — Cascade Ventures`,
        text: [
          `New website form submission: ${formName}`,
          "",
          ...entries,
          "",
          `Time to complete: ${Number(elapsed) || 0} ms`
        ].join("\n"),
        ...(validEmail ? { reply_to: replyTo } : {})
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend error:", error);
      return res.status(502).json({ ok: false });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Contact API error:", error);
    return res.status(500).json({ ok: false });
  }
}
