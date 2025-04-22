// Define the structure of a resource entry
export type ResourceEntry = {
  id: string;
  title: string;
  category: string; // e.g., 'Counselling', 'Self-Help', 'Crisis Support', 'Wellbeing'
  imageUrl?: string; // Optional image URL (add later if desired)
  snippet: string; // Short preview text
  content: string; // Full content (markdown format)
  keywords?: string[]; // Optional keywords for search/filtering
};

// Mock data - derived from Knowledgebase files
export const mockResourceEntries: ResourceEntry[] = [
  {
    id: 'faq-counselling-what-is',
    title: 'What is Counselling?',
    category: 'Counselling FAQs',
    snippet: 'Learn about counselling as a talking therapy providing a safe space.',
    content: `## What is Counselling?\n\nCounselling is a talking therapy that provides a safe and confidential space for you to talk to a trained professional (Counsellor or Therapist) about any issues and concerns.\n\nSometimes it can be helpful to have someone independent to listen and support, to help you make sense of your situation and find your own answers. Counselling can give you an opportunity to explore, discover and clarify ways of living more resourcefully with a greater sense of fulfilment.\n\nCounselling is a common service that many people will use throughout their lives, not just those with a formally diagnosed mental illness.\n\n**Further Reading:** [BACP – What is Counselling](https://www.bacp.co.uk/about-therapy/what-is-counselling/) (External Link)`,
    keywords: ['counselling', 'therapy', 'talking therapy', 'support']
  },
  {
    id: 'faq-counselling-eligibility',
    title: 'Am I Eligible for Uni Counselling?',
    category: 'Counselling FAQs',
    snippet: 'Find out who can access the free UON Counselling Service.',
    content: `## Am I eligible for Counselling?\n\nWe accept students from any level of studies, from foundation through to PhD. You must be enrolled, have a student ID number and UON student email address.\n\nYou can access counselling if you are taking a study break or suspended from your studies, as long as you continue to remain an enrolled student.\n\n**When am I not eligible?**\n*   If you are not enrolled at the University.\n*   If you are already receiving counselling or therapy elsewhere (you can still use drop-ins).\n*   If you are residing outside the UK (due to legal/ethical reasons).\n\n**Cost:** The UON Counselling Service is **free**.\n\n**Drop-in Alternative:** If ineligible or waiting, consider the [Counselling & Mental Health drop-in](https://www.eventbrite.co.uk/e/counselling-and-mental-health-team-telephone-drop-in-tickets-101727260976?aff=oddtdtcreator).`,
    keywords: ['counselling', 'eligibility', 'cost', 'free', 'enrolled', 'abroad', 'drop-in']
  },
  {
    id: 'selfhelp-anxiety-panic',
    title: 'Managing Anxiety & Panic Attacks',
    category: 'Self-Help',
    snippet: 'Understanding anxiety/panic and practical coping strategies.',
    content: `## Understanding Anxiety & Panic\n\n*   **Anxiety:** A normal feeling in difficult situations, but can become overwhelming.\n*   **Panic Attack:** Intense physical/mental symptoms (sweating, racing heart, fear). Can affect 1 in 3 people.\n\n## Ways to Manage\n\n*   **Address Worries:** Seek advice if something is worrying you.\n*   **Rest:** Avoid getting over-tired; take regular breaks.\n*   **Breathing:** Slow down breathing (in for 4, out for 6). Breathing into cupped hands/paper bag can help restore balance if hyperventilating.\n*   **Acceptance:** Remember anxiety feelings are normal and will pass.\n*   **Learn:** Understand anxiety to reduce fear.\n*   **Exams:** Apply for alternative arrangements via Mental Health Advisers ([mha@northampton.ac.uk](mailto:mha@northampton.ac.uk)) if needed.\n\n## External Resources\n\n*   **NHS:** [Every Mind Matters - Anxiety](https://www.nhs.uk/every-mind-matters/mental-health-issues/anxiety/)\n*   **No Panic:** [Website & Helpline](https://www.nopanic.org.uk/)\n*   **IAPT:** [NHS Talking Therapies](https://www.nhft.nhs.uk/iapt)\n*   **Self-Help Booklets:** [Northumberland Tyne and Wear NHS](https://web.ntw.nhs.uk/selfhelp/)`,
    keywords: ['anxiety', 'panic attack', 'stress', 'breathing exercise', 'coping', 'self-help', 'exams']
  },
  {
    id: 'counsellor-corner-loneliness',
    title: 'Loneliness vs. Being Alone',
    category: 'Counsellors Corner',
    snippet: 'Understanding the difference and finding ways to connect.',
    content: `## Being Alone vs. Feeling Lonely (Nov 2024)\n\n*   **Being Alone:** Physical solitude (can be a choice or circumstance).\n*   **Feeling Lonely:** Subjective emotional experience (emptiness, sadness, longing for connection), can happen even when surrounded by others.\n\n## Ideas for Bridging the Gap\n\n*   **Lean into Loneliness:** Explore what it means to *you*. Practice mindfulness ([Frantic World Meditations](https://franticworld.com/free-meditations-from-mindfulness/)).\n*   **Embrace Aloneness:** Reframe solitude as nourishing, an opportunity for growth.\n*   **Reconnect with Yourself:** Understand your passions, needs, values.\n*   **Practice Self-Compassion:** Be kind to yourself ([Dr. Kristin Neff](https://self-compassion.org/)).\n*   **Validate & Express Feelings:** Name your emotions. Try journaling ([WRITE method](https://journaltherapy.com/)).\n*   **Stay Connected:** Reach out to friends/family. Join clubs/groups. Start small ([Side by Side - Mind](https://sidebyside.mind.org.uk/)).\n*   **Review Social Media Use:** Does it nourish or deplete you? Adjust accordingly.\n\n## Further Support\n\n*   [UON Student Hub Support & Wellbeing](/sites/student/support-and-wellbeing)\n*   [Spectrum Life](https://universityofnorthampton.spectrum.life/login) (Code: UONWELL)\n*   [UON Drop-in Appointments](https://www.eventbrite.co.uk/e/counselling-and-mental-health-team-telephone-drop-in-tickets-101727260976?aff=oddtdtcreator)\n*   [NHS - Loneliness](https://www.nhs.uk/every-mind-matters/lifes-challenges/loneliness/)\n*   [MIND - Loneliness](https://www.mind.org.uk/information-support/tips-for-everyday-living/loneliness/about-loneliness/)\n*   [Podcast: Brené Brown & Dr Vivek Murthy](https://brenebrown.com/podcast/dr-vivek-murthy-and-brene-on-loneliness-and-connection)`,
    keywords: ['loneliness', 'alone', 'connection', 'mindfulness', 'self-compassion', 'journaling', 'social media', 'support']
  },
  {
    id: 'blog-eating-disorder',
    title: 'Eating Disorder Awareness & Support',
    category: 'Mental Health Blog',
    snippet: 'Recognising signs and finding help for eating disorders.',
    content: `## Eating Disorder Awareness (Feb 2025 Blog)\n\nEating Disorders can be hard to spot and impact anyone.\n\n*   **Think you might have one?** Check [Beat - Do I have an eating disorder?](https://www.beateatingdisorders.org.uk/get-information-and-support/about-eating-disorders/do-i-have-an-eating-disorder/)\n*   **Supporting someone?** [Beat - Tips for supporting someone](https://www.beateatingdisorders.org.uk/get-information-and-support/support-someone-else/tips-for-supporting-somebody-with-an-eating-disorder/)\n\n## Beat Helplines (Mon-Fri, 3pm-8pm)\n*   England: 0808 801 0677\n*   Scotland: 0808 801 0432\n*   Wales: 0808 801 0433\n*   Northern Ireland: 080 801 0434\n\nRead Amelie's story: [Beat Helpline Appeal](https://www.beateatingdisorders.org.uk/helplineappeal/)\n\n**UON Self-Help Resources:** [Eating Problems and Eating Disorders](https://mynorthamptonac.sharepoint.com/sites/student/Pages/eating-problems-and-eating-disorders.aspx)`,
    keywords: ['eating disorder', 'beat', 'support', 'helpline', 'awareness', 'body image']
  },
  {
    id: 'resource-umhd',
    title: 'University Mental Health Day',
    category: 'Uni Events & Resources',
    snippet: 'Information about the annual event promoting student mental health.',
    content: `## University Mental Health Day\n\nThis is a national event in Higher Education focusing on raising awareness, challenging stigma, and promoting conversations about student and staff mental health.\n\n**Next Event:** Thursday 13 March 2025 (Learning Hub, 10am-3pm)\n\n**Typical Activities (may vary year to year):**\n*   Information stalls from university teams and external organisations.\n*   Therapy animals (e.g., petting zoo, PAT dogs).\n*   Wellbeing activities (e.g., meditation, crafts, games).\n*   Free refreshments ('Take a Break Café').\n*   Workshops and talks.\n\nKeep an eye on campus screens, event pages, and student newsletters for specific details closer to the date.\n\n**General UON Support:** [Counselling and Mental Health pages](https://mynorthamptonac.sharepoint.com/sites/student/Pages/counselling-and-mental-health.aspx)`,
    keywords: ['university mental health day', 'umhd', 'event', 'awareness', 'stigma', 'wellbeing', 'support']
  },
  {
    id: 'faq-chatbot-crisis',
    title: 'Chatbot & Crisis Support',
    category: 'Chatbot FAQs',
    snippet: 'How the chatbot handles mental health crises and where to get urgent help.',
    content: `## Chatbot Role in Crisis\n\nThis chatbot can provide information and direct you to resources, but **it cannot provide immediate crisis intervention or counselling.**\n\n**If you ask about crisis or self-harm:**\n*   The chatbot will acknowledge your distress.\n*   It will strongly recommend contacting professional crisis services immediately.\n*   It will provide contact information for urgent support (like those listed below).\n\n**Key Phrases for Urgent Help:**\n*   "I feel like I'm going to hurt myself."
*   "I need help right now."
*   "I'm having a mental health crisis."
\n## Urgent Support Contacts\n\n*   **Emergency Services:** Call 999 (UK) if you or someone else is in immediate danger.\n*   **NHS Mental Health Hub (Northants 24/7):** 0800 448 0828\n*   **Samaritans (24/7):** Call 116 123 (free)\n*   **Shout (24/7 Text Service):** Text 'IMATTER' to 85258 (free, confidential)\n*   **Spectrum Life (UON 24/7 Support):** [Login](https://universityofnorthampton.spectrum.life/login) (Code: UONWELL), UK Freephone: 0800 031 8227\n*   **Your GP:** Contact your doctor for an urgent appointment.\n*   **NHS 111:** Call 111 if you need urgent help but it's not a 999 emergency.`,
    keywords: ['chatbot', 'crisis', 'urgent help', 'emergency', 'suicide', 'self-harm', 'support lines', 'nhs', 'samaritans', 'shout', 'spectrum life']
  },
  {
    id: 'blog-spectrum-life',
    title: 'Spectrum Life: 24/7 Student Support',
    category: 'Mental Health Blog',
    snippet: 'Access free, confidential support anytime via phone, WhatsApp, or online.',
    content: `## Spectrum.Life (Introduced Oct 2024)\n\nThis platform provides 24/7 access to a range of health and wellbeing resources, additional to existing University support.\n\n**Services Include:**\n*   **24/7 Mental Health Support:** Access counsellors and mental health professionals via phone or WhatsApp (over 200 languages).\n*   **Physical Health Resources:** Fitness plans, workout guides, nutrition advice.\n*   **Wellbeing Webinars & Workshops:** Sessions on stress management, mindfulness, etc.\n\n**How to Access:**\n*   **Website:** [universityofnorthampton.spectrum.life](https://universityofnorthampton.spectrum.life/login)\n*   **Organisation Code:** UONWELL\n*   **UK Freephone:** 0800 031 8227\n*   **WhatsApp:** Text 'Hi' to 074 1836 0780\n\nUse this while waiting for uni appointments, outside working hours, or for general wellbeing tips.`,
    keywords: ['spectrum life', '24/7 support', 'helpline', 'counselling', 'wellbeing', 'fitness', 'workshops', 'confidential']
  }
]; 