# Graph Report - .  (2026-04-21)

## Corpus Check
- 63 files · ~72,696 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 195 nodes · 223 edges · 29 communities detected
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 23 edges
2. `AIBuddy()` - 5 edges
3. `sendMessage()` - 5 edges
4. `executeTool()` - 5 edges
5. `addItem()` - 5 edges
6. `getItems()` - 5 edges
7. `subscribeToCollection()` - 5 edges
8. `getSyncedMap()` - 5 edges
9. `saveSyncedMap()` - 5 edges
10. `syncCalendar()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `NotificationHistory()` --calls--> `useAuth()`  [INFERRED]
  src\components\NotificationHistory.jsx → src\context\AuthContext.jsx
- `AgenticBuddy()` --calls--> `useAuth()`  [INFERRED]
  src\components\AgenticBuddy.jsx → src\context\AuthContext.jsx
- `AIBuddy()` --calls--> `useAuth()`  [INFERRED]
  src\pages\AIBuddy\AIBuddy.jsx → src\context\AuthContext.jsx
- `GlobalCalendarSync()` --calls--> `useAuth()`  [INFERRED]
  src\components\GlobalCalendarSync.jsx → src\context\AuthContext.jsx
- `NotificationDropdown()` --calls--> `useAuth()`  [INFERRED]
  src\components\NotificationDropdown.jsx → src\context\AuthContext.jsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (26): addAssignment(), addItem(), addNote(), buildClassFilters(), buildClassQuery(), buildDynamicConstraints(), buildRecipientConstraints(), createNotification() (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (18): Announcements(), Assignments(), useAuth(), Calendar(), DashboardLayout(), DashboardHome(), Login(), Navbar() (+10 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (6): changePassword(), hasEmailProvider(), isGoogleLinked(), reauthenticateWithEmail(), unlinkGoogle(), Settings()

### Community 3 - "Community 3"
Cohesion: 0.26
Nodes (10): GlobalCalendarSync(), addEventToCalendar(), deleteEventFromCalendar(), getStorageKey(), getSyncedMap(), isCalendarConnected(), removeCalendarEvent(), saveEventToSyncMap() (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (5): AgenticBuddy(), getSmartSuggestions(), AIBuddy(), LandingPage(), useIsMobileDevice()

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (1): ErrorBoundary

### Community 6 - "Community 6"
Cohesion: 0.36
Nodes (7): buildSystemPrompt(), callGeminiFallback(), callGroq(), parseToolCall(), sendMessage(), callGeminiWithRotation(), getNextGeminiKey()

### Community 7 - "Community 7"
Cohesion: 0.43
Nodes (7): draftAnnouncement(), executeAnnouncement(), executeTool(), getPendingAssignments(), navigateTo(), summarizeDashboard(), addAnnouncement()

### Community 8 - "Community 8"
Cohesion: 0.4
Nodes (0): 

### Community 9 - "Community 9"
Cohesion: 0.5
Nodes (1): NotificationHistory()

### Community 10 - "Community 10"
Cohesion: 0.5
Nodes (0): 

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (2): formatErrorMessage(), getFriendlyMessage()

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 12`** (2 nodes): `PageTransition()`, `PageTransition.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (2 nodes): `PomodoroTimer()`, `PomodoroTimer.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (2 nodes): `StaticLayout.jsx`, `StaticLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (2 nodes): `sendEmailBatch()`, `email.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (2 nodes): `storage.js`, `uploadUserAvatar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (2 nodes): `About()`, `About.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `Community()`, `Community.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `CookiePolicy()`, `CookiePolicy.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `Features()`, `Features.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `Help()`, `Help.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `Integrations()`, `Integrations.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `PrivacyPolicy()`, `PrivacyPolicy.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (2 nodes): `TermsOfService.jsx`, `TermsOfService()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `eslint.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `firebase.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (1 nodes): `main.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Community 1` to `Community 9`, `Community 2`, `Community 3`, `Community 4`?**
  _High betweenness centrality (0.207) - this node is a cross-community bridge._
- **Why does `Settings()` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `AIBuddy()` connect `Community 4` to `Community 1`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Are the 22 inferred relationships involving `useAuth()` (e.g. with `AgenticBuddy()` and `AIBuddy()`) actually correct?**
  _`useAuth()` has 22 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `AIBuddy()` (e.g. with `useAuth()` and `useIsMobileDevice()`) actually correct?**
  _`AIBuddy()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._