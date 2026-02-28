import emailjs from '@emailjs/browser';

// REPLACE THESE WITH YOUR ACTUAL EMAILJS KEYS
const SERVICE_ID = "service_zmw1i5u";
const TEMPLATE_ID = "template_66vccuh";
const PUBLIC_KEY = "uVo11pLn69oC3RUI7";

/**
 * Sends individual emails to each recipient.
 * Each recipient sees only their own email in "To".
 * 
 * @param {Array} recipients - Array of user objects { email, ... }
 * @param {Object} noteData - { title, ... }
 * @param {Object} senderProfile - { name, email, ... }
 * @param {string} itemType - 'note' | 'assignment' | 'announcement'
 * @returns {Promise<Object>} - { success: true, count: number }
 */
export async function sendEmailBatch(recipients, noteData, senderProfile, itemType = 'note') {
    if (!recipients || recipients.length === 0) return { success: true, count: 0 };

    // Initialize EmailJS
    emailjs.init(PUBLIC_KEY);

    // Extract valid emails
    const validEmails = recipients
        .map(u => u.email)
        .filter(email => email && email.includes('@'));

    if (validEmails.length === 0) return { success: true, count: 0 };

    const actionTexts = {
        note: 'has uploaded new notes',
        assignment: 'has added a new assignment',
        announcement: 'has posted a new announcement',
    };
    const itemLabels = {
        note: 'Notes',
        assignment: 'Assignments',
        announcement: 'Announcements',
    };

    let sentCount = 0;
    let errors = [];

    // Send individual email to each recipient
    const sendPromises = validEmails.map(async (recipientEmail) => {
        try {
            const templateParams = {
                to_email: recipientEmail,
                bcc: '',
                name: `${senderProfile.name || 'LearnGrid'} via LearnGrid`,
                email: senderProfile.email || "",
                sender_name: senderProfile.name || "LearnGrid Admin",
                sender_email: senderProfile.email || "",
                institution_name: senderProfile.institutionName || "",
                department: senderProfile.department || senderProfile.standard || "",
                year: senderProfile.year || "",
                section: senderProfile.section || senderProfile.sector || "",
                note_title: noteData.title,
                action_text: actionTexts[itemType] || actionTexts.note,
                item_label: itemLabels[itemType] || itemLabels.note,
                website_link: `https://www.learngrid.online/#/${itemType === 'note' ? 'notes' : itemType === 'assignment' ? 'assignments' : 'announcements'}`,
            };

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
            sentCount++;
        } catch (error) {
            console.error(`Email to ${recipientEmail} failed`, error);
            errors.push(error);
        }
    });

    await Promise.all(sendPromises);

    if (errors.length > 0 && sentCount === 0) {
        throw new Error("Failed to send emails");
    }

    return { success: true, count: sentCount };
}
