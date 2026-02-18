import emailjs from '@emailjs/browser';

// REPLACE THESE WITH YOUR ACTUAL EMAILJS KEYS
const SERVICE_ID = "service_zmw1i5u";
const TEMPLATE_ID = "template_66vccuh";
const PUBLIC_KEY = "uVo11pLn69oC3RUI7";

/**
 * Sends emails to a list of recipients in batches.
 * Uses BCC to save quota and improve performance (1 email per batch of 50).
 * 
 * @param {Array} recipients - Array of user objects { email, ... }
 * @param {Object} noteData - { title, ... }
 * @param {Object} senderProfile - { name, ... }
 * @returns {Promise<Object>} - { success: true, count: number }
 */
export async function sendEmailBatch(recipients, noteData, senderProfile) {
    if (!recipients || recipients.length === 0) return { success: true, count: 0 };

    // Initialize EmailJS
    emailjs.init(PUBLIC_KEY);

    // Extract emails
    const validEmails = recipients
        .map(u => u.email)
        .filter(email => email && email.includes('@'));

    if (validEmails.length === 0) return { success: true, count: 0 };

    // Batching (Max 50 per batch for safety/BCC limits)
    const BATCH_SIZE = 50;
    const batches = [];

    for (let i = 0; i < validEmails.length; i += BATCH_SIZE) {
        batches.push(validEmails.slice(i, i + BATCH_SIZE));
    }

    let sentCount = 0;
    let errors = [];

    // Process batches
    // We run them sequentially or in small parallel groups to avoid browser blocking
    // Promise.all is fine for small numbers of batches (e.g. 10 batches = 500 users)

    const sendPromises = batches.map(async (batchEmails) => {
        try {
            const templateParams = {
                to_email: senderProfile.email || batchEmails[0], // Must be non-empty; EmailJS requires a primary recipient
                bcc: batchEmails.join(','), // Comma separated list for BCC
                name: senderProfile.name || "LearnGrid", // For EmailJS "From Name" field
                email: senderProfile.email || "", // For EmailJS "Reply To" field
                sender_name: senderProfile.name || "LearnGrid Admin",
                department: senderProfile.department || "General",
                year: senderProfile.year || "",
                note_title: noteData.title,
                website_link: window.location.origin + "/notes", // Link to notes page
            };

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
            sentCount += batchEmails.length;
        } catch (error) {
            console.error("Email batch failed", error);
            errors.push(error);
        }
    });

    await Promise.all(sendPromises);

    if (errors.length > 0 && sentCount === 0) {
        throw new Error("Failed to send emails");
    }

    return { success: true, count: sentCount };
}
