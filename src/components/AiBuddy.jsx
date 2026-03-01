import React, { useRef, useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, AnimatePresence } from 'framer-motion';
import { callGeminiWithRotation, OPENAI_API_KEY } from '../config/apiKeys';
import { useWindowSize } from 'react-use';

export function AiBuddy({ pendingTasks, assignmentsData = [], currentUserId = null, userName = '' }) {
    const splineRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [message, setMessage] = useState('');
    const [emotion, setEmotion] = useState('Happy'); // Default/Initial emotion

    const [messagesQueue, setMessagesQueue] = useState([]);
    const [messageIndex, setMessageIndex] = useState(0);

    // We try to read previous count from localStorage so it persists across page navigation if AiBuddy unmounts
    const prevTasksRef = useRef(() => {
        const stored = localStorage.getItem(`ag_pending_tasks_${currentUserId}`);
        return stored !== null ? parseInt(stored, 10) : pendingTasks;
    });
    // For immediate tracking in this render cycle
    const [lastKnown, setLastKnown] = useState(prevTasksRef.current);

    const { width, height } = useWindowSize();

    // 🌟 COST & SPACE SAVER: Completely disable AiBuddy on Mobile Screens (< 768px)
    if (width !== 0 && width < 768) {
        return null;
    }

    // ============================================================
    // 📝 BUILT-IN HINGLISH MESSAGES (NO API CALL NEEDED)
    // ============================================================
    // These are used for celebrations, empty dashboards, and generic states.
    // API is ONLY called when there's specific assignment context.

    const builtInMessages = {
        celebrationAllClear: [
            `Wah ${userName || 'bhai'} aag laga di! Sab clear kar diya tune! 🎉`,
            `Party time ${userName || 'yaar'}! Ekdum zero pending tasks! 🎊`,
            `Man of the match ${userName || 'bhai'}! Saare tasks khatam kar diye tune! 🔥`,
            `${userName || 'Bhai'} tu toh legend nikla! Sab tasks clear! Chal party! 🥳`,
            `Kya baat hai ${userName || 'yaar'}! Ek bhi task nahi bacha! Full respect! 💯`,
            `Oye hoye ${userName || 'bhai'}! Zero pending! Aaj toh treat de! 🍕`,
            `${userName || 'Bhai'} topper hai tu! Sabse pehle kaam khatam kiya! 🏆`,
            `Wah ji wah ${userName || 'yaar'}! Clean dashboard! Ab maze kar! 🎊`,
        ],
        celebrationOneTask: [
            `Wah ${userName || 'bhai'}, ek task khatam! Aise hi baaki ${pendingTasks} bhi nipta le! 🚀`,
            `Ek number kaam! Ek task aur gaya, baaki ${pendingTasks} pe lag ja ab! 💪`,
            `Badhiya yaar! Ek burden kam hua, baaki ${pendingTasks} bhi jaldi khatam kar! 👏`,
            `Shabash ${userName || 'bhai'}! Ek aur task done! Bas ${pendingTasks} aur baaki! 🔥`,
            `Chal ${userName || 'yaar'}, momentum mat tod! ${pendingTasks} aur hain sirf! 🚀`,
            `Ek aur patakha phoda ${userName || 'bhai'}! Ab ${pendingTasks} aur baaki! 💥`,
            `${userName || 'Bhai'} dheere dheere sab hoga! Ek done, ${pendingTasks} toh go! 🎯`,
            `Bohot khoob ${userName || 'yaar'}! Aise hi ek ek karke nipata de! 💪`,
        ],
        zeroTasks: [
            `Tera toh saara kaam clear hai ${userName || 'bhai'}, aaram kar ab! 😎`,
            `Wah ${userName || 'yaar'}, zero tasks pe aake kaisa lag raha hai? Party kab hai? 🎉`,
            `Sab khatam! Ab jaake kuch series-veries dekh le thodi der. 📺`,
            `${userName || 'Bhai'} chill mode ON! Koi task nahi hai abhi! 🏖️`,
            `Boss ${userName || 'yaar'}, dashboard ekdum saaf hai tera! Relax kar! 😌`,
            `Kya baat hai! Zero pending! Tu toh discipline ka raja hai ${userName || 'bhai'}! 👑`,
            `${userName || 'Yaar'} tujhe koi kuch nahi bol sakta aaj, sab done! ✅`,
            `Free bird ${userName || 'bhai'}! Koi kaam nahi! Enjoy the moment! 🦅`,
        ],
        genericPending: [
            `Bhai ${userName || ''}, tere paas abhi ${pendingTasks} kaam bache hue hain, dekh le zara! 📋`,
            `Lagta hai tera padhai ka mood nahi hai aaj? Chal thoda waqt nikal ke kaam nipta le. 📖`,
            `Dhyan de ${userName || 'yaar'}, ${pendingTasks} task pending hain, baadme load aayega! ⚠️`,
            `${userName || 'Bhai'}, ${pendingTasks} tasks pending hain, procrastinate mat kar! 🕰️`,
            `Arey ${userName || 'yaar'} ${pendingTasks} kaam pade hain, chal shuru karte hain! 💪`,
            `${userName || 'Bhai'} thoda focus kar, ${pendingTasks} tasks baaki hain abhi! 🎯`,
            `Kab karega ${userName || 'yaar'} ye ${pendingTasks} kaam? Deadline miss mat karna! ⏰`,
            `${userName || 'Bhai'} utho aur lage raho, ${pendingTasks} tasks apne aap nahi honge! 🚀`,
            `Padhai likhai chal nahi rahi ${userName || 'yaar'}? ${pendingTasks} pending hain! 📚`,
            `${userName || 'Bhai'} Netflix band kar, ${pendingTasks} assignments bache hain! 📵`,
        ]
    };

    // Helper to pick random subset from an array (for variety without API)
    const pickRandom = (arr, count = 5) => {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    };

    // Helper to extract JSON array from AI response text
    const extractJSON = (text) => {
        try {
            let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
            let parsed = JSON.parse(clean);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) { }
        try {
            const match = text.match(/\[[\s\S]*\]/);
            if (match) {
                let parsed = JSON.parse(match[0]);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) { }
        return null;
    };

    const fetchGeminiMessages = async (tasksCount, contextStr, nameStr, isCelebration = false, justClearedAll = false) => {

        // ============================================================
        // 🚫 NO API CALL ZONES - Use built-in messages directly
        // ============================================================

        // 1. Celebrations → Always use built-in messages (no API needed)
        if (isCelebration) {
            if (justClearedAll) return pickRandom(builtInMessages.celebrationAllClear, 3);
            return pickRandom(builtInMessages.celebrationOneTask, 3);
        }

        // 2. Zero tasks with no context → Always use built-in messages
        if (tasksCount === 0) {
            return pickRandom(builtInMessages.zeroTasks, 5);
        }

        // 3. No meaningful context (no assignment details) → Use built-in generic messages
        if (!contextStr || contextStr.trim() === '') {
            return pickRandom(builtInMessages.genericPending, 5);
        }

        // ============================================================
        // ✅ API CALL ZONE - Only when there's REAL assignment context
        // ============================================================
        // We reach here ONLY when there are pending tasks WITH specific 
        // details (title, assigner, deadline) worth talking about.

        // Check cache first to avoid unnecessary API calls
        const safeContext = encodeURIComponent(contextStr || 'none').substring(0, 30);
        const cacheKey = `ag_ai_msgs_${currentUserId}_${tasksCount}_${safeContext}`;
        const cacheString = localStorage.getItem(cacheKey);
        if (cacheString) {
            try {
                const parsedCache = JSON.parse(cacheString);
                if (Array.isArray(parsedCache) && parsedCache.length > 0) {
                    return parsedCache; // 🎯 Cache hit! No API call needed.
                }
            } catch (e) { /* Ignore and re-fetch */ }
        }

        // Build the prompt (only reaches here on cache miss with real context)
        const prompt = `You are a close friend and study buddy (AI Mascot) inside an academic dashboard. 
The student's name is ${nameStr || 'Dost'}. They have ${tasksCount} pending tasks.
${contextStr ? `Here is context on their pending tasks:\n${contextStr}\n` : ''}
Generate 5 short sentences in casual 'Hinglish' (Hindi spoken in English letters). Keep them under 20 words each.
CRITICAL INSTRUCTIONS:
1. DO NOT WRITE IN PROPER ENGLISH. ALWAYS USE HINGLISH EXCLUSIVELY (like WhatsApp chat).
2. DO NOT REPEAT phrases. Make each of the 5 sentences completely different in tone and style. 
3. Include the student's name (${nameStr || 'Dost'}) randomly in some of the sentences.
4. If tasks > 0: Motivate them or make funny remarks. YOU MUST use the specific context provided! 
   - If 'Assigned By' is 'Self (User uploaded this)', tell them: "Abey ${nameStr || 'yaar'}, tune jo '[Title]' upload kiya tha wo abhi tak pending hai, jaldi nikal usko!"
   - If 'Assigned By' is someone else: "Bhai ${nameStr || ''}, [Name] ne '[Title]' bheja tha, due date kal hai, nipat le fatfat!"
Return EXACTLY a pure JSON array of 5 strings. No markdown, no blockquotes, just the JSON array like ["msg1", "msg2"]`;

        try {
            // 1. Try Gemini API with automatic key rotation (tries all keys)
            const data = await callGeminiWithRotation(prompt);

            if (data) {
                const text = data.candidates[0].content.parts[0].text;
                const parsed = extractJSON(text);
                if (parsed) {
                    localStorage.setItem(cacheKey, JSON.stringify(parsed));
                    return parsed;
                }
            }

            throw new Error('All Gemini keys failed or invalid response');

        } catch (error) {
            console.warn("All Gemini keys failed, attempting OpenAI Fallback...", error.message);

            try {
                // 2. OpenAI Fallback (last resort API call)
                const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.9,
                    })
                });

                const openAiData = await openAiResponse.json();
                if (!openAiData.choices || !openAiData.choices[0]) throw new Error('Invalid OpenAI Response');
                const oaText = openAiData.choices[0].message.content;
                const oaParsed = extractJSON(oaText);

                if (oaParsed) {
                    localStorage.setItem(cacheKey, JSON.stringify(oaParsed));
                    return oaParsed;
                }
            } catch (oaError) {
                console.error("OpenAI Fallback also failed:", oaError.message);
            }

            // 3. Absolute Fallback → Built-in messages (user never sees an error)
            return pickRandom(builtInMessages.genericPending, 5);
        }
    };

    // Smart logic to determine emotion based purely on counts
    useEffect(() => {
        let newEmotion = 'Happy';

        if (pendingTasks === 0) {
            newEmotion = 'Happy';
        } else if (pendingTasks > 0 && pendingTasks <= 3) {
            newEmotion = 'Focus';
        } else {
            newEmotion = 'Sad';
        }

        setEmotion(newEmotion);

        // Show loading state while waiting for Gemini
        setMessage("Let me check your tasks... 🤔");

        // Trigger Spline animation state if loaded
        if (isLoaded && splineRef.current) {
            try {
                if (newEmotion === 'Happy') splineRef.current.emitEvent('mouseDown', 'Happy');
                else if (newEmotion === 'Sad') splineRef.current.emitEvent('mouseDown', 'Sad');
                else splineRef.current.emitEvent('mouseDown', 'Focus');
            } catch (e) {
                console.log("Spline event trigger error:", e);
            }
        }

        // Call Gemini API in background and overwrite messages if successful
        if (isLoaded) {
            // Build context string from passed assignmentsData
            let contextStr = '';
            if (assignmentsData && assignmentsData.length > 0 && currentUserId) {
                const pendings = assignmentsData.filter(a => {
                    if (a.userStatuses && a.userStatuses[currentUserId]) return a.userStatuses[currentUserId] === 'Pending';
                    if (a.userId === currentUserId) return (a.status || 'Pending') === 'Pending';
                    return true;
                }).slice(0, 3); // Take up to 3 to keep prompt short

                if (pendings.length > 0) {
                    contextStr = pendings.map(p => {
                        // Distinguish if current user created it themselves
                        const isSelf = p.userId === currentUserId;
                        const assignerName = isSelf ? 'Self (User uploaded this)' : (p.createdBy || p.userName || 'Teacher/Peer');
                        return `- Title: "${p.title}", Assigned By: "${assignerName}", Due: "${p.deadline}"`;
                    }).join('\n');
                }
            }

            // Trigger Gemini API to fetch dynamic varied messages
            fetchGeminiMessages(pendingTasks, contextStr, userName).then(genMsgs => {
                if (genMsgs) {
                    setMessagesQueue(genMsgs);
                    setMessageIndex(0);
                    setMessage(genMsgs[0]);
                }
            });
        }

    }, [pendingTasks, isLoaded, assignmentsData, currentUserId]);

    // Cycle messages every 20 seconds
    useEffect(() => {
        if (messagesQueue.length <= 1) return;
        const interval = setInterval(() => {
            setMessageIndex(prev => {
                const next = (prev + 1) % messagesQueue.length;
                setMessage(messagesQueue[next]);
                return next;
            });
        }, 20000);
        return () => clearInterval(interval);
    }, [messagesQueue]);

    // Track Task Completions for Celebrations across pages
    useEffect(() => {
        if (!isLoaded || currentUserId === null) return;

        let prev = lastKnown;

        // If task count dropped, it means a task was completed!
        if (pendingTasks < prev && pendingTasks >= 0) {
            const justClearedAll = pendingTasks === 0;

            // Fetch special instant celebration message
            setMessage("Ohoooo... ruk bata raha hu! 🎉");
            fetchGeminiMessages(pendingTasks, '', userName, true, justClearedAll).then(genMsgs => {
                if (genMsgs && genMsgs[0]) {
                    setMessagesQueue(genMsgs); // Overwrite queue with the 1 celebration msg
                    setMessageIndex(0);
                    setMessage(genMsgs[0]);
                }
            });

            // Re-trigger face expression
            if (splineRef.current) splineRef.current.emitEvent('mouseDown', 'Happy');
        }

        // Update both local ref and localStorage so next time user hits dashboard it remembers 
        // that they had e.g. 5 tasks instead of triggering celebration incorrectly.
        setLastKnown(pendingTasks);
        localStorage.setItem(`ag_pending_tasks_${currentUserId}`, pendingTasks.toString());

    }, [pendingTasks, isLoaded, currentUserId, userName]); // eslint-disable-line react-hooks/exhaustive-deps

    const onLoad = (splineApp) => {
        splineRef.current = splineApp;
        setIsLoaded(true);
    };

    return (
        <div className="relative w-full h-full pointer-events-none flex items-center justify-center -right-4 md:-right-8">
            {/* 3D Canvas - Disabled pointer events to prevent rotation/interaction */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center scale-75 md:scale-[0.80] origin-bottom md:origin-center">
                <Spline
                    scene="https://prod.spline.design/35aLT1F6pB6JrjyK/scene.splinecode"
                    onLoad={onLoad}
                    className="w-full h-full !bg-transparent object-cover"
                />
            </div>

            {/* Speech Bubble */}
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
                        <div className="relative bg-white text-indigo-900 text-xs md:text-sm font-medium p-3 md:p-4 rounded-2xl shadow-xl border border-indigo-100/50 backdrop-blur-sm bg-white/90">
                            {message}

                            {/* Bubble pointer (tail) - Moved to bottom-left to point at character on the left */}
                            <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white border-b border-l border-indigo-100/50 transform -rotate-45"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading Skeleton/Spinner before character loads */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-10 h-10 border-4 border-indigo-300 border-t-white rounded-full animate-spin opacity-50"></div>
                </div>
            )}

        </div>
    );
}
