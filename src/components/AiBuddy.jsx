import React, { useRef, useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';
import { callGeminiWithRotation } from '../config/apiKeys';
import { useWindowSize } from 'react-use';
import { useIsMobileDevice } from '../hooks/useIsMobileDevice';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AiBuddy({ pendingTasks, assignmentsData = [], currentUserId = null, userName = '', announcementsCount = 0, notesCount = 0, notesData = [], overdueCount = 0 }) {
    const splineRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [message, setMessage] = useState('');
    const [emotion, setEmotion] = useState('Happy');

    const [messagesQueue, setMessagesQueue] = useState([]);
    const [messageIndex, setMessageIndex] = useState(0);
    // Action button state (for pomodoro, notes, etc.)
    const [actionButton, setActionButton] = useState(null);

    const { userProfile } = useAuth();
    const navigate = useNavigate();
    const aiLanguage = userProfile?.settings?.preferences?.aiLanguage || 'en';

    const prevTasksRef = useRef(() => {
        const stored = localStorage.getItem(`ag_pending_tasks_${currentUserId}`);
        return stored !== null ? parseInt(stored, 10) : pendingTasks;
    });
    const [lastKnown, setLastKnown] = useState(prevTasksRef.current);

    const { width, height } = useWindowSize();
    const isMobileDevice = useIsMobileDevice();

    // Mobile guard moved below all hooks to comply with rules-of-hooks

    // ============================================================
    // 🌙 TIME AWARENESS — Detect time of day (NO API CALL)
    // ============================================================
    const currentHour = new Date().getHours();
    const getTimeOfDay = () => {
        if (currentHour >= 0 && currentHour < 5) return 'nightOwl';
        if (currentHour >= 5 && currentHour < 8) return 'earlyMorning';
        if (currentHour >= 8 && currentHour < 12) return 'morning';
        if (currentHour >= 12 && currentHour < 17) return 'afternoon';
        if (currentHour >= 17 && currentHour < 21) return 'evening';
        return 'lateNight'; // 9pm-12am
    };
    const timeOfDay = getTimeOfDay();
    const isNightOwl = timeOfDay === 'nightOwl';
    const isLateNight = timeOfDay === 'lateNight';

    // ============================================================
    // 🔥 ROAST/TOAST — Behavior detection (NO API CALL)
    // ============================================================
    const getBehaviorMode = () => {
        if (overdueCount >= 3) return 'fullRoast';
        if (overdueCount >= 1) return 'mildRoast';
        if (pendingTasks === 0) return 'toast';
        return 'normal';
    };
    const behaviorMode = getBehaviorMode();

    // ============================================================
    // 🧠 NOTE QUIZ — Pick random note for quiz (NO API CALL)
    // ============================================================
    const getRandomNote = () => {
        if (!notesData || notesData.length === 0) return null;
        const idx = Math.floor(Math.random() * Math.min(notesData.length, 5));
        return notesData[idx];
    };

    // ============================================================
    // 📝 BUILT-IN MESSAGES — All categories (NO API CALL)
    // ============================================================
    const firstName = userName?.split(' ')[0] || '';

    const hinglishMessages = {
        // ─── Existing categories ─────────────────────────────
        celebrationAllClear: [
            `Wah ${firstName || 'bhai'} aag laga di! Sab clear kar diya tune! 🎉`,
            `Party time ${firstName || 'yaar'}! Ekdum zero pending tasks! 🎊`,
            `Man of the match ${firstName || 'bhai'}! Saare tasks khatam! 🔥`,
            `${firstName || 'Bhai'} tu toh legend nikla! Sab tasks clear! 🥳`,
            `Kya baat hai ${firstName || 'yaar'}! Ek bhi task nahi bacha! 💯`,
            `Oye hoye ${firstName || 'bhai'}! Zero pending! Treat de! 🍕`,
            `${firstName || 'Bhai'} topper hai tu! Sabse pehle kaam kiya! 🏆`,
            `Wah ji wah ${firstName || 'yaar'}! Clean dashboard! Maze kar! 🎊`,
        ],
        celebrationOneTask: [
            `Wah ${firstName || 'bhai'}, ek task khatam! Baaki ${pendingTasks} nipta le! 🚀`,
            `Ek number kaam! Ek task gaya, baaki ${pendingTasks} pe lag ja! 💪`,
            `Badhiya! Ek burden kam, baaki ${pendingTasks} bhi jaldi kar! 👏`,
            `Shabash ${firstName || 'bhai'}! Ek aur done! Bas ${pendingTasks} baaki! 🔥`,
            `Chal ${firstName || 'yaar'}, momentum mat tod! ${pendingTasks} aur hain! 🚀`,
        ],
        zeroTasks: [
            `Tera toh saara kaam clear hai ${firstName || 'bhai'}, aaram kar! 😎`,
            `Wah ${firstName || 'yaar'}, zero tasks! Party kab hai? 🎉`,
            `Sab khatam! Ab series-veries dekh le thodi der. 📺`,
            `${firstName || 'Bhai'} chill mode ON! Koi task nahi! 🏖️`,
            `Boss ${firstName || 'yaar'}, dashboard saaf hai! Relax kar! 😌`,
            `Zero pending! Tu toh discipline ka raja hai! 👑`,
        ],
        zeroTasksWithAnnouncements: [
            `${firstName || 'Bhai'}, tasks zero hain but ${announcementsCount} announcement aaye hain, dekh le! 📢`,
            `Kaam nahi hai ${firstName || 'yaar'}, par ${announcementsCount} naye announcements hain — check kar! 🔔`,
            `Tasks clear! Par announcements check kar ${firstName || 'yaar'}, kuch naya aaya hai! 📣`,
            `Assignment nahi hai, par announcements padh le ${firstName || 'bhai'}, important ho sakte hain! 🔥`,
        ],
        zeroTasksWithNotes: [
            `Tasks zero, par ${notesCount} notes hain tere paas ${firstName || 'yaar'}, revise kar le! 📝`,
            `${firstName || 'Bhai'} kaam nahi hai par notes pade hain, revision time! 📚`,
            `Free hai toh notes revise kar le, ${notesCount} hain tere paas! 🧠`,
        ],
        zeroTasksWithBoth: [
            `${firstName || 'Bhai'}, tasks zero hain but announcements aur notes hain — check kar! 🔔📚`,
            `Kaam clear hai! Par announcements aur notes dekhna mat bhoolna! 📢`,
        ],
        genericPending: [
            `Bhai ${firstName || ''}, ${pendingTasks} kaam bache hain, dekh le! 📋`,
            `Dhyan de ${firstName || 'yaar'}, ${pendingTasks} task pending hain! ⚠️`,
            `${firstName || 'Bhai'}, ${pendingTasks} tasks pending, procrastinate mat kar! 🕰️`,
            `${firstName || 'Yaar'} ${pendingTasks} kaam pade hain, chal shuru karte hain! 💪`,
            `${firstName || 'Bhai'} focus kar, ${pendingTasks} tasks baaki hain! 🎯`,
            `Kab karega ${firstName || 'yaar'} ye ${pendingTasks} kaam? Deadline miss mat karna! ⏰`,
            `${firstName || 'Bhai'} utho aur lage raho, ${pendingTasks} tasks apne aap nahi honge! 🚀`,
        ],

        // ─── 🌙 TIME-BASED MESSAGES ─────────────────────────
        nightOwl: [
            `${firstName || 'Bhai'} raat ke ${currentHour > 0 ? currentHour : 12} baj gaye! Soja ab! 🦉`,
            `Oye ${firstName || 'yaar'}, itni raat ko jaag raha hai? Kal class hai teri! 😴`,
            `Bhai ${firstName || ''}, neend puri nahi hogi toh kal dimag nahi chalega! So ja! 🛏️`,
            `Raat ke ${currentHour > 0 ? currentHour : 12} baje padhai? ${firstName || 'Bhai'} health pe dhyan de! 🌙`,
            `${firstName || 'Yaar'} so ja, main kal subah tujhe sab yaad dilwa dunga! 💤`,
            `Night owl mode ON? ${firstName || 'Bhai'} ye roz mat karna, unhealthy hai! ⚠️`,
        ],
        lateNight: [
            `Raat ho gayi ${firstName || 'bhai'}, jaldi kaam khatam kar aur so ja! 🌙`,
            `${firstName || 'Yaar'} 9 baj gaye, ab zyada mat jag — kal fresh rehna! 😴`,
            `Late night session ${firstName || 'bhai'}? Bas thodi der aur, phir sona! 🌃`,
        ],
        earlyMorning: [
            `Early bird ${firstName || 'bhai'}! Subah subah padhai, kya baat hai! 🌅`,
            `${firstName || 'Yaar'} itni subah? Respect! Aaj productive din hoga! 💪`,
            `Good morning ${firstName || 'bhai'}! Fresh mind = best study time! ☀️`,
        ],
        afternoon: [
            `Post-lunch slump ${firstName || 'yaar'}? Ek coffee le aur focus kar! ☕`,
            `Dopahar ho gayi ${firstName || 'bhai'}, kaam nipta le ab! 🔥`,
            `${firstName || 'Yaar'} lunch ke baad padhai mushkil hai par tu kar sakta hai! 💪`,
        ],
        evening: [
            `Evening study session ${firstName || 'bhai'}! Smart time to focus! 🎯`,
            `Sham ho gayi ${firstName || 'yaar'}, kal ke liye kaam aaj hi nipta le! 📋`,
            `${firstName || 'Bhai'} evening mein padho, raat ko soko — best routine! 🌆`,
        ],

        // ─── 🔥 ROAST MESSAGES ──────────────────────────────
        roastMild: [
            `${firstName || 'Bhai'}, ${overdueCount} assignment${overdueCount > 1 ? 's' : ''} overdue ho chuki hai. Kya scene hai? 😤`,
            `Arey ${firstName || 'yaar'}, deadline nikal gayi! ${overdueCount} kaam late hain! Kab karega? 📛`,
            `${firstName || 'Bhai'} teacher tujhse puch legi toh kya bolega? ${overdueCount} overdue hain! 🥶`,
            `Bhai deadline ke baad kaam karne ka kya faayda? Jaldi kar! ${overdueCount} overdue! ⏰`,
            `${firstName || 'Yaar'} ${overdueCount} assignment overdue... mazaak chal raha hai kya? 🤨`,
        ],
        roastFull: [
            `${firstName || 'Bhai'} ${overdueCount} assignments overdue! Kya kar raha hai zindagi mein? 🔥`,
            `Arey ${firstName || 'yaar'}, ${overdueCount} deadlines miss ki! Phone rakh aur kaam shuru kar! 📵`,
            `${firstName || 'Bhai'} itna procrastinate karta hai tu? ${overdueCount} overdue pade hain! 😡`,
            `Legend hai tu ${firstName || 'yaar'}! ${overdueCount} assignments overdue karke bhi chill hai! 💀`,
            `${firstName || 'Bhai'} tera result aayega tab royega — ${overdueCount} overdue hain abhi! 😤`,
            `Bro tera ${overdueCount} assignment overdue hai, Netflix band kar aur kaam kar! 📵🔥`,
        ],
        toastProud: [
            `Kya baat hai ${firstName || 'bhai'}! Sab time pe complete! Teacher ka favourite hai tu! 🌟`,
            `${firstName || 'Yaar'} tu toh example set kar raha hai class mein! All on time! 🏆`,
            `Respect ${firstName || 'bhai'}! Zero overdue, zero stress! Aise hi chalta reh! 💯`,
            `${firstName || 'Bhai'} discipline ka king hai tu! Sab kaam time pe kiya! 👑`,
            `Full marks for consistency ${firstName || 'yaar'}! Keep it up! ⭐`,
        ],

        // ─── 🧠 NOTE QUIZ MESSAGES ─────────────────────────
        noteQuiz: (noteTitle) => [
            `${firstName || 'Yaar'}, tune '${noteTitle}' ke notes save kiye the — yaad hai kya usme? 🤔`,
            `Quick revision ${firstName || 'bhai'}: '${noteTitle}' padha tha? Ek baar check kar le! 📖`,
            `Pop quiz ${firstName || 'yaar'}! '${noteTitle}' ke baare mein kuch yaad hai? 🧠`,
            `${firstName || 'Bhai'} '${noteTitle}' revise kar le, exam mein kaam aayega! 📝`,
        ],

        // ─── 📊 PEER PRESSURE MESSAGES ──────────────────────
        peerPressure: [
            `${firstName || 'Bhai'}, teri class ke bache submit kar rahe hain! Tu kab karega? 👀`,
            `Arey ${firstName || 'yaar'}, sab aage nikal rahe hain! Piche mat reh ja! 🏃`,
            `${firstName || 'Bhai'} tera competition submit kar chuka hai, tu bhi lag ja! 🔥`,
            `Class mein sab kaam kar rahe hain ${firstName || 'yaar'}, tu bhi shuru kar! 💪`,
        ],

        // ─── 🍅 STUDY SESSION MESSAGES ──────────────────────
        studySession: [
            `${firstName || 'Bhai'}, ${pendingTasks} tasks hain! Pomodoro start karun? 25 min focus! 🍅`,
            `Bhai tension mat le, ek ek karke niptayenge! Study session shuru karun? 🎯`,
            `${firstName || 'Yaar'} agar 25 min focus de toh ek task khatam ho sakta hai! 🍅`,
        ],
    };

    const englishMessages = {
        celebrationAllClear: [
            `Amazing work${firstName ? ', ' + firstName : ''}! All tasks cleared! 🎉`,
            `Outstanding${firstName ? ', ' + firstName : ''}! Zero pending tasks! 🏆`,
            `All caught up${firstName ? ', ' + firstName : ''}! Dashboard is clean! ✨`,
            `${firstName || 'Hey'}, you crushed it! Nothing left! 💯`,
            `Perfect${firstName ? ', ' + firstName : ''}! All tasks done. Relax! 😎`,
        ],
        celebrationOneTask: [
            `Nice one${firstName ? ', ' + firstName : ''}! One task done. ${pendingTasks} to go! 🚀`,
            `Good progress! ${pendingTasks} remaining. Keep it up! 💪`,
            `Well done${firstName ? ', ' + firstName : ''}! ${pendingTasks} left! 👏`,
        ],
        zeroTasks: [
            `All caught up${firstName ? ', ' + firstName : ''}! No tasks pending. 😎`,
            `Clean dashboard${firstName ? ', ' + firstName : ''}! Nothing to worry about. 🎉`,
            `All clear! Take some time to relax. 📺`,
            `No pending tasks${firstName ? ', ' + firstName : ''}! Enjoy! 🏖️`,
            `Zero pending! Great discipline${firstName ? ', ' + firstName : ''}! 👑`,
        ],
        zeroTasksWithAnnouncements: [
            `No tasks${firstName ? ', ' + firstName : ''}! But ${announcementsCount} announcement${announcementsCount > 1 ? 's' : ''} to check! 📢`,
            `Tasks clear${firstName ? ', ' + firstName : ''}! Don't miss ${announcementsCount} announcement${announcementsCount > 1 ? 's' : ''}! 🔔`,
        ],
        zeroTasksWithNotes: [
            `No tasks pending${firstName ? ', ' + firstName : ''}! Review your ${notesCount} notes! 📝`,
            `All free${firstName ? ', ' + firstName : ''}! Great time to revise notes! 📚`,
        ],
        zeroTasksWithBoth: [
            `No tasks${firstName ? ', ' + firstName : ''}! Check ${announcementsCount} announcement${announcementsCount > 1 ? 's' : ''} and review notes! 🔔📚`,
        ],
        genericPending: [
            `${firstName ? firstName + ', you' : 'You'} have ${pendingTasks} pending tasks! 📋`,
            `${pendingTasks} tasks waiting${firstName ? ', ' + firstName : ''}! 📖`,
            `Heads up${firstName ? ', ' + firstName : ''}! ${pendingTasks} tasks pending. ⚠️`,
            `${pendingTasks} tasks to complete${firstName ? ', ' + firstName : ''}! 💪`,
            `Stay focused${firstName ? ', ' + firstName : ''}! ${pendingTasks} tasks waiting. 🎯`,
        ],
        nightOwl: [
            `${firstName ? firstName + ', it' : 'It'}'s ${currentHour > 0 ? currentHour : 12} AM! Go to sleep! 🦉`,
            `Late night study${firstName ? ', ' + firstName : ''}? Please get some rest! 😴`,
            `${firstName ? firstName + ', sleep' : 'Sleep'} is important! I'll remind you tomorrow! 💤`,
            `It's past midnight${firstName ? ', ' + firstName : ''}. Your health matters more! 🌙`,
        ],
        lateNight: [
            `Getting late${firstName ? ', ' + firstName : ''}! Finish up and rest! 🌙`,
            `Late night session${firstName ? ', ' + firstName : ''}? Don't forget to sleep! 😴`,
        ],
        earlyMorning: [
            `Early bird${firstName ? ', ' + firstName : ''}! Great start to the day! 🌅`,
            `Good morning${firstName ? ', ' + firstName : ''}! Fresh mind, best study time! ☀️`,
        ],
        afternoon: [
            `Post-lunch slump${firstName ? ', ' + firstName : ''}? Grab a coffee and focus! ☕`,
            `Afternoon study${firstName ? ', ' + firstName : ''}! Stay focused! 🔥`,
        ],
        evening: [
            `Evening study${firstName ? ', ' + firstName : ''}! Smart choice! 🎯`,
            `Good evening${firstName ? ', ' + firstName : ''}! Finish today's work now! 📋`,
        ],
        roastMild: [
            `${firstName ? firstName + ', ' : ''}${overdueCount} assignment${overdueCount > 1 ? 's are' : ' is'} overdue! Time to catch up! 😤`,
            `Heads up${firstName ? ', ' + firstName : ''}! ${overdueCount} past deadline. Don't delay more! 📛`,
            `${overdueCount} overdue task${overdueCount > 1 ? 's' : ''}${firstName ? ', ' + firstName : ''}! Better get on it! ⏰`,
        ],
        roastFull: [
            `${firstName ? firstName + ', ' : ''}${overdueCount} assignments overdue! This is critical! 🔥`,
            `${overdueCount} deadlines missed${firstName ? ', ' + firstName : ''}! Stop procrastinating! 📵`,
            `Seriously${firstName ? ', ' + firstName : ''}? ${overdueCount} overdue! Your grades are at risk! 😡`,
            `${overdueCount} assignments past deadline${firstName ? ', ' + firstName : ''}. Act now! ⚠️`,
        ],
        toastProud: [
            `Excellent discipline${firstName ? ', ' + firstName : ''}! Everything on time! 🌟`,
            `${firstName ? firstName + ', you' : 'You'}'re setting the standard! All on time! 🏆`,
            `Zero overdue! Great consistency${firstName ? ', ' + firstName : ''}! 💯`,
            `Impressive${firstName ? ', ' + firstName : ''}! All assignments submitted on time! 👑`,
        ],
        noteQuiz: (noteTitle) => [
            `${firstName ? firstName + ', you' : 'You'} saved notes on '${noteTitle}'. Time to review! 🤔`,
            `Quick check${firstName ? ', ' + firstName : ''}: Do you remember '${noteTitle}'? 📖`,
            `Pop quiz! What do you remember about '${noteTitle}'? 🧠`,
        ],
        peerPressure: [
            `${firstName ? firstName + ', your' : 'Your'} classmates are submitting! Don't fall behind! 👀`,
            `Others in your class are ahead${firstName ? ', ' + firstName : ''}! Time to catch up! 🏃`,
            `Your peers are making progress${firstName ? ', ' + firstName : ''}! Join them! 🔥`,
        ],
        studySession: [
            `${pendingTasks} tasks pending${firstName ? ', ' + firstName : ''}! Start a Pomodoro session? 🍅`,
            `Focus for 25 minutes${firstName ? ', ' + firstName : ''}! One task at a time! 🎯`,
        ],
    };

    const builtInMessages = aiLanguage === 'hin' ? hinglishMessages : englishMessages;

    const pickRandom = (arr, count = 5) => {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    };

    const extractJSON = (text) => {
        try {
            let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
            let parsed = JSON.parse(clean);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch { /* ignored */ }
        try {
            const match = text.match(/\[[\s\S]*\]/);
            if (match) {
                let parsed = JSON.parse(match[0]);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch { /* ignored */ }
        return null;
    };

    // ============================================================
    // 🎯 SMART MESSAGE BUILDER — Combines all sources intelligently
    // ============================================================
    const buildSmartMessageQueue = (baseMsgs) => {
        let finalQueue = [...baseMsgs];

        // 1. Mix in time-based messages (1-2 messages)
        if (isNightOwl && builtInMessages.nightOwl?.length) {
            // Night owl gets PRIORITY — insert at the beginning
            const nightMsgs = pickRandom(builtInMessages.nightOwl, 2);
            finalQueue = [...nightMsgs, ...finalQueue];
        } else if (isLateNight && builtInMessages.lateNight?.length) {
            finalQueue.push(...pickRandom(builtInMessages.lateNight, 1));
        } else if (builtInMessages[timeOfDay]?.length) {
            finalQueue.push(...pickRandom(builtInMessages[timeOfDay], 1));
        }

        // 2. Mix in roast/toast messages (1-2 messages)
        if (behaviorMode === 'fullRoast' && builtInMessages.roastFull?.length) {
            const roasts = pickRandom(builtInMessages.roastFull, 2);
            finalQueue = [...roasts, ...finalQueue]; // Roasts get priority
        } else if (behaviorMode === 'mildRoast' && builtInMessages.roastMild?.length) {
            finalQueue.push(...pickRandom(builtInMessages.roastMild, 1));
        } else if (behaviorMode === 'toast' && pendingTasks === 0 && builtInMessages.toastProud?.length) {
            finalQueue.push(...pickRandom(builtInMessages.toastProud, 1));
        }

        // 3. Mix in peer pressure (1 message, only when tasks > 0)
        if (pendingTasks > 0 && builtInMessages.peerPressure?.length) {
            finalQueue.push(...pickRandom(builtInMessages.peerPressure, 1));
        }

        // 4. Mix in note quiz (1 message, only when notes exist)
        const randomNote = getRandomNote();
        if (randomNote && builtInMessages.noteQuiz) {
            const quizMsgs = builtInMessages.noteQuiz(randomNote.title || randomNote.subject || 'your notes');
            finalQueue.push(pickRandom(quizMsgs, 1)[0]);
        }

        // 5. Mix in study session suggestion (1 message, only when 3+ tasks)
        if (pendingTasks >= 3 && builtInMessages.studySession?.length) {
            finalQueue.push(...pickRandom(builtInMessages.studySession, 1));
        }

        // Shuffle the final queue so it doesn't feel predictable
        return finalQueue.sort(() => Math.random() - 0.5);
    };

    const fetchGeminiMessages = async (tasksCount, contextStr, nameStr, isCelebration = false, justClearedAll = false) => {

        // 1. Celebrations → Built-in messages
        if (isCelebration) {
            if (justClearedAll) return pickRandom(builtInMessages.celebrationAllClear, 3);
            return pickRandom(builtInMessages.celebrationOneTask, 3);
        }

        // 2. Zero tasks → Smart messages based on announcements/notes
        if (tasksCount === 0) {
            let baseMsgs;
            if (announcementsCount > 0 && notesCount > 0) {
                baseMsgs = pickRandom(builtInMessages.zeroTasksWithBoth, 3);
            } else if (announcementsCount > 0) {
                baseMsgs = pickRandom(builtInMessages.zeroTasksWithAnnouncements, 3);
            } else if (notesCount > 0) {
                baseMsgs = pickRandom(builtInMessages.zeroTasksWithNotes, 3);
            } else {
                baseMsgs = pickRandom(builtInMessages.zeroTasks, 3);
            }
            return buildSmartMessageQueue(baseMsgs);
        }

        // 3. No context → Generic pending messages
        if (!contextStr || contextStr.trim() === '') {
            return buildSmartMessageQueue(pickRandom(builtInMessages.genericPending, 3));
        }

        // 4. Smart template matcher (no API)
        const safeContext = encodeURIComponent(contextStr || 'none').substring(0, 30);
        const cacheKey = `ag_ai_msgs_${currentUserId}_${tasksCount}_${aiLanguage}_${safeContext}`;
        const cacheString = localStorage.getItem(cacheKey);
        if (cacheString) {
            try {
                const parsedCache = JSON.parse(cacheString);
                if (Array.isArray(parsedCache) && parsedCache.length > 0) {
                    return buildSmartMessageQueue(parsedCache);
                }
            } catch { /* ignored */ }
        }

        try {
            const titleMatch = contextStr.match(/- Title: "([^"]+)"/);
            const assignerMatch = contextStr.match(/Assigned By: "([^"]+)"/);

            if (titleMatch && titleMatch[1]) {
                const title = titleMatch[1];
                let assigner = assignerMatch ? assignerMatch[1] : 'someone';
                if (assigner === 'Self (User uploaded this)') assigner = 'you';

                let templates = aiLanguage === 'hin' ?
                    [
                        `Abey ${firstName || 'yaar'}, '${title}' abhi tak pending hai! ⏰`,
                        `${assigner === 'you' ? 'Tune' : assigner + ' ne'} '${title}' diya tha, nipat le! 🚀`,
                        `'${title}' pending pada hai ${firstName || 'yaar'}. Kaise chalega? 🎯`,
                        `Oye ${firstName || 'yaar'}, '${title}' tera wait kar raha hai! 💪`,
                        `'${title}' pending hai, abhi karke khatam kar de! 📋`,
                    ] :
                    [
                        `'${title}' is still pending${firstName ? ', ' + firstName : ''}! ⏰`,
                        `Task '${title}' from ${assigner} needs attention! 📚`,
                        `Don't forget about '${title}'! 🎯`,
                        `'${title}' is waiting for you! Let's finish it! 💪`,
                    ];

                const picked = pickRandom(templates, 3);
                localStorage.setItem(cacheKey, JSON.stringify(picked));
                return buildSmartMessageQueue(picked);
            }
        } catch (e) {
            console.error("Template error, falling back:", e);
        }

        // 5. Last resort: API call
        let prompt;
        if (aiLanguage === 'hin') {
            prompt = `You are a close friend and study buddy inside an academic dashboard.
The student's name is ${nameStr || 'Dost'}. They have ${tasksCount} pending tasks.
${contextStr ? `Context:\n${contextStr}\n` : ''}
Generate 5 short Hinglish sentences (under 20 words each). Be casual, motivating, and include the name.
Return EXACTLY a JSON array: ["msg1", "msg2", ...]`;
        } else {
            prompt = `You are a study assistant inside an academic dashboard.
Student: ${nameStr || 'there'}. ${tasksCount} pending tasks.
${contextStr ? `Context:\n${contextStr}\n` : ''}
Generate 5 short English sentences (under 20 words each). Be encouraging and professional.
Return EXACTLY a JSON array: ["msg1", "msg2", ...]`;
        }

        try {
            const data = await callGeminiWithRotation(prompt);
            if (data) {
                const text = data.candidates[0].content.parts[0].text;
                const parsed = extractJSON(text);
                if (parsed) {
                    localStorage.setItem(cacheKey, JSON.stringify(parsed));
                    return buildSmartMessageQueue(parsed);
                }
            }
            throw new Error('API failed');
        } catch (error) {
            console.warn("API failed, using built-in messages.", error.message);
            return buildSmartMessageQueue(pickRandom(builtInMessages.genericPending, 3));
        }
    };

    // ============================================================
    // 🎭 EMOTION ENGINE — Determines 3D buddy face
    // ============================================================
    useEffect(() => {
        let newEmotion = 'Happy';

        // Night owl always gets Sad face
        if (isNightOwl) {
            newEmotion = 'Sad';
        } else if (behaviorMode === 'fullRoast') {
            newEmotion = 'Sad'; // Angry/disappointed
        } else if (behaviorMode === 'mildRoast') {
            newEmotion = 'Focus'; // Concerned
        } else if (pendingTasks === 0) {
            newEmotion = 'Happy';
        } else if (pendingTasks > 0 && pendingTasks <= 3) {
            newEmotion = 'Focus';
        } else {
            newEmotion = 'Sad';
        }

        setEmotion(newEmotion);
        setMessage(aiLanguage === 'hin' ? "Ruk dekh raha hu... 🤔" : "Checking your dashboard... 🤔");

        // Trigger Spline emotion
        if (isLoaded && splineRef.current) {
            try {
                splineRef.current.emitEvent('mouseDown', newEmotion);
            } catch { /* ignored */ }
        }

        // Determine action button
        if (pendingTasks >= 3) {
            setActionButton({ type: 'pomodoro', label: aiLanguage === 'hin' ? '🍅 Study Session' : '🍅 Focus Mode' });
        } else if (notesData.length > 0 && pendingTasks === 0) {
            setActionButton({ type: 'notes', label: aiLanguage === 'hin' ? '📚 Notes Revise' : '📚 Review Notes' });
        } else if (announcementsCount > 0 && pendingTasks === 0) {
            setActionButton({ type: 'announcements', label: aiLanguage === 'hin' ? '📢 Announcements' : '📢 View Announcements' });
        } else {
            setActionButton(null);
        }

        // Build messages
        if (isLoaded) {
            let contextStr = '';
            if (assignmentsData && assignmentsData.length > 0 && currentUserId) {
                const pendings = assignmentsData.filter(a => {
                    if (a.userStatuses && a.userStatuses[currentUserId]) return a.userStatuses[currentUserId] === 'Pending';
                    if (a.userId === currentUserId) return (a.status || 'Pending') === 'Pending';
                    return true;
                }).slice(0, 3);

                if (pendings.length > 0) {
                    contextStr = pendings.map(p => {
                        const isSelf = p.userId === currentUserId;
                        const assignerName = isSelf ? 'Self (User uploaded this)' : (p.createdBy || p.userName || 'Teacher/Peer');
                        return `- Title: "${p.title}", Assigned By: "${assignerName}", Due: "${p.deadline}"`;
                    }).join('\n');
                }
            }

            fetchGeminiMessages(pendingTasks, contextStr, userName).then(genMsgs => {
                if (genMsgs && genMsgs.length > 0) {
                    setMessagesQueue(genMsgs);
                    setMessageIndex(0);
                    setMessage(genMsgs[0]);
                }
            });
        }

    }, [pendingTasks, isLoaded, assignmentsData, currentUserId, aiLanguage, announcementsCount, notesCount, overdueCount]);

    // Cycle messages every 15 seconds (faster for variety)
    useEffect(() => {
        if (messagesQueue.length <= 1) return;
        const interval = setInterval(() => {
            setMessageIndex(prev => {
                const next = (prev + 1) % messagesQueue.length;
                setMessage(messagesQueue[next]);
                return next;
            });
        }, 15000);
        return () => clearInterval(interval);
    }, [messagesQueue]);

    // Track task completions for celebrations
    useEffect(() => {
        if (!isLoaded || currentUserId === null) return;
        let prev = lastKnown;

        if (pendingTasks < prev && pendingTasks >= 0) {
            const justClearedAll = pendingTasks === 0;
            setMessage(aiLanguage === 'hin' ? "Ohoooo... 🎉" : "Great news! 🎉");
            fetchGeminiMessages(pendingTasks, '', userName, true, justClearedAll).then(genMsgs => {
                if (genMsgs && genMsgs[0]) {
                    setMessagesQueue(genMsgs);
                    setMessageIndex(0);
                    setMessage(genMsgs[0]);
                }
            });
            if (splineRef.current) splineRef.current.emitEvent('mouseDown', 'Happy');
        }

        setLastKnown(pendingTasks);
        localStorage.setItem(`ag_pending_tasks_${currentUserId}`, pendingTasks.toString());
    }, [pendingTasks, isLoaded, currentUserId, userName]); // eslint-disable-line react-hooks/exhaustive-deps

    // Don't render on mobile devices
    if (isMobileDevice) return null;

    // ─── Action Button Handler ──────────────────────────────
    const handleActionClick = () => {
        if (!actionButton) return;

        switch (actionButton.type) {
            case 'pomodoro':
                window.dispatchEvent(new Event('start-pomodoro'));
                break;
            case 'notes':
                navigate('/notes');
                break;
            case 'announcements':
                navigate('/announcements');
                break;
        }
    };

    const onLoad = (splineApp) => {
        splineRef.current = splineApp;
        setIsLoaded(true);
    };

    // ═══════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════
    return (
        <div className="relative w-full h-full pointer-events-none flex items-center justify-center -right-4 md:-right-8">
            {/* 3D Canvas */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center scale-75 md:scale-[0.80] origin-bottom md:origin-center">
                <Spline
                    scene="https://prod.spline.design/35aLT1F6pB6JrjyK/scene.splinecode"
                    onLoad={onLoad}
                    className="w-full h-full !bg-transparent object-cover"
                />
            </div>

            {/* Speech Bubble + Action Button */}
            <AnimatePresence>
                {isLoaded && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            y: [0, -10, 0]
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                            opacity: { duration: 0.5 },
                            scale: { type: 'spring', bounce: 0.5 }
                        }}
                        className="absolute top-[10%] md:top-[25%] right-[5%] md:right-[15%] max-w-[160px] md:max-w-[200px] z-10 pointer-events-auto"
                    >
                        {/* Main speech bubble */}
                        <div className={`relative text-xs md:text-sm font-medium p-3 md:p-4 rounded-2xl shadow-xl backdrop-blur-sm ${
                            isNightOwl ? 'bg-purple-900/90 text-purple-100 border border-purple-500/30' :
                            behaviorMode === 'fullRoast' ? 'bg-red-50/95 text-red-900 border border-red-200/50' :
                            behaviorMode === 'mildRoast' ? 'bg-amber-50/95 text-amber-900 border border-amber-200/50' :
                            behaviorMode === 'toast' && pendingTasks === 0 ? 'bg-emerald-50/95 text-emerald-900 border border-emerald-200/50' :
                            'bg-white/90 text-indigo-900 border border-indigo-100/50'
                        }`}>
                            {message}

                            {/* Bubble tail */}
                            <div className={`absolute -bottom-1.5 left-6 w-3 h-3 transform -rotate-45 ${
                                isNightOwl ? 'bg-purple-900 border-b border-l border-purple-500/30' :
                                behaviorMode === 'fullRoast' ? 'bg-red-50 border-b border-l border-red-200/50' :
                                behaviorMode === 'mildRoast' ? 'bg-amber-50 border-b border-l border-amber-200/50' :
                                behaviorMode === 'toast' && pendingTasks === 0 ? 'bg-emerald-50 border-b border-l border-emerald-200/50' :
                                'bg-white border-b border-l border-indigo-100/50'
                            }`}></div>
                        </div>

                        {/* 🍅 Action Button */}
                        {actionButton && (
                            <motion.button
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                onClick={handleActionClick}
                                className="mt-2 w-full text-xs font-bold py-1.5 px-3 rounded-xl cursor-pointer border-none transition-all duration-200 hover:-translate-y-0.5"
                                style={{
                                    background: actionButton.type === 'pomodoro' 
                                        ? 'linear-gradient(135deg, #ef4444, #f97316)' 
                                        : actionButton.type === 'notes'
                                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                        : 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                                }}
                            >
                                {actionButton.label}
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading Spinner */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-10 h-10 border-4 border-indigo-300 border-t-white rounded-full animate-spin opacity-50"></div>
                </div>
            )}
        </div>
    );
}
